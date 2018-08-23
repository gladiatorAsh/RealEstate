const request = require('request');
const querystring = require("querystring");
const parseString = require('xml2js').parseString;
const UserModel = require('../users/models/user');
const config = require('../config/zillow');
const math = require('mathjs');

//ToDO: Remove if obsolete
exports.getRentEstimate = (req, res) => {
    try {

        const address = req.body.address;

        console.log('address', address);
        console.log('id', req.body.userId);

        UserModel.patchUser(req.body.userId, {
            "address": address
        }).then((result) => {
            getRentZestimate(req).then((result) => {
                res.status(200).send(result);
            });;
        });

    } catch (err) {
        res.status(500).send({
            errors: err
        });
    }
};

exports.postUserEstimate = (req, res) => {
    try {

        const data = req.body.userEstimate;

        UserModel.patchUser(req.body.userId, {
            "userExpectation": data
        }).then((result) => {
            res.status(200).send('success');
        });

    } catch (err) {
        res.status(500).send({
            errors: err
        });
    }
}


//ToDo: CircuitBreaker pattern
//ToDo: Complexity must be reduced by half. Extract methods
exports.getRentZestimate = (req, res) => {
    try {

        let address = {
            "address": req.body.address
        };
        let citystatezip = {
            "citystatezip": req.body.citystatezip
        };
        let userId = req.body.userId;
        //For updating backend
        let addressDB = {
            "address": req.body.address + " , " + req.body.citystatezip
        };

        UserModel.patchUser(userId, addressDB);

        console.log("Address", address);
        console.log("citystatezip", citystatezip);
        console.log("userId", userId);

        let obj = config.zillowApiEndpoint + '/' + config.zillowGetRentEstimateEndpoint +
            '?zws-id=' + config["zws-id"] + '&' + querystring.stringify(address) + '&' + querystring.stringify(citystatezip) +
            '&rentzestimate=true';

        console.log(obj);

        //ToDo: Extract into separate methods
        request.get({
            url: obj
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                parseString(body, function (err, result) {
                    try {
                        console.dir(result);
                        let output = getRent(err, result);

                        //ToDo:Extract this into a model
                        let model = {
                            rentZestimate: output.amount,
                            monthlyLow: output.valuationRange.low,
                            monthlyHigh: output.valuationRange.high,
                        };

                        UserModel.patchUser(userId, model);

                        console.log("output", output);

                        res.json(output);
                    } catch (err) {
                        res.json(error);
                    }
                });
            } else {
                res.json(error);
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            errors: err
        });
    }
};


//ToDo: Extract into 2 methods
function getRent(err, obj) {

    let inp = obj["SearchResults:searchresults"];
    let code = inp["message"][0]["code"][0];

    if (code == config["zillow-success"]) {

        console.log("Success");

        let result = inp["response"][0]["results"][0]["result"][0];

        let rentzestimate = {};
        let zestimate = {};

        console.dir(result);
        let isCalculated = false;

        if ("rentzestimate" in result) {
            console.log("rentzestimate in prop")
            rentzestimate = result["rentzestimate"][0];
        } else if ("zestimate" in result) {
            isCalculated = true;
            console.log("zestimate in prop")
            zestimate = result["zestimate"][0];
        }

        //ToDo:Extract this into a model
        var model = {
            zpId: '',
            updated: '',
            currency: '',
            amount: '',
            valueChange: '',
            valuationRange: {
                low: '',
                high: ''
            },
            address: {
                street: '',
                city: '',
                state: '',
                zipcode: '',
                latitude: '',
                longitude: ''
            }
        };

        //ToDo: Better way
        model.zpId = result.zpid[0];
        model.address = result.address[0];

        if (!isCalculated) {
            console.log("RentZestimate is present");

            model.updated = rentzestimate["last-updated"][0];
            model.currency = rentzestimate["amount"][0]["$"]["currency"][0];
            model.amount = rentzestimate["amount"][0]["_"];
            model.changeDuration = rentzestimate["valueChange"][0]["$"]["duration"];
            model.valueChange = rentzestimate["valueChange"][0]["_"];
            model.valuationRange = {
                low: rentzestimate["valuationRange"][0]["low"][0]["_"],
                high: rentzestimate["valuationRange"][0]["high"][0]["_"]
            };
        } else {

            let factor = config["monthlyRent-factor"] / 100;

            model.updated = zestimate["last-updated"][0];
            model.currency = zestimate["amount"][0]["$"]["currency"][0];
            model.amount = math.round(math.chain(zestimate["amount"][0]["_"]).multiply(factor).divide(12).done());

            //console.log(zestimate);
            model.changeDuration = zestimate["valueChange"][0] == '' ? 0 : zestimate["valueChange"][0]["$"]["duration"];

            model.valueChange = zestimate["valueChange"][0] == '' ? 0 : rentzestimate["valueChange"][0]["_"];

            model.valuationRange = {
                low: Math.round(model.amount + (model.amount * 10 / 100)),
                high: Math.round(model.amount - (model.amount * 10 / 100))
            };

        }
        //console.log(model);
        return model;
    } else {
        console.log("Error");
        return {
            'status': 500
        };
    }
}