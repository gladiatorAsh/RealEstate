const request= require('request');
const querystring = require("querystring");
const parseString = require('xml2js').parseString;
const UserModel=require('../users/models/user');
const config = require('../config/zillow');

//ToDO: Remove if obsolete
exports.getRentEstimate = (req, res) => {
   try{
    
    const address = req.body.address;

    console.log('address',address);
    console.log('id',req.body.userId);

    UserModel.patchUser(req.body.userId,{"address":address}).then((result) => {
        getRentZestimate(req).then((result) => {
            res.status(200).send(result);
        });;
    });
        
   }catch (err) {
        res.status(500).send({errors: err});
    }
};

//ToDo: CircuitBreaker pattern
exports.getRentZestimate = (req,res) =>{
try{
    let address={"address":req.body.address};
    let citystatezip={"citystatezip":req.body.citystatezip};
    let userId=req.body.userId;
    //For updating backend
    let addressDB={"address":req.body.address+" , "+req.body.citystatezip};

    UserModel.patchUser(userId,addressDB);

    let obj=config.zillowApiEndpoint+'/'+config.zillowGetRentEstimateEndpoint+
    '?zws-id='+config["zws-id"]+'&'+querystring.stringify(address)+'&'+querystring.stringify(citystatezip)+
    '&rentzestimate=true';

    console.log(obj);

    request.get({ url: obj },function(error, response, body) { 
    if (!error && response.statusCode == 200) { 
        parseString(body, function (err, result) {
            console.dir(result);
           let output= getRent(err,result);

           //ToDo:Extract this into a model
           let model={
                rentZestimate: output.amount,
                monthlyLow: output.valuationRange.low,
                monthlyHigh: output.valuationRange.high,
           };

           UserModel.patchUser(userId,model);

           return res.json(output);
        });
        
       }
       else{
        res.json(error);
       }
   });    
}catch(err){
    console.log(err);
    res.status(500).send({errors: err});
}
};

function getRent(err,obj){
    
    let inp=obj["SearchResults:searchresults"];
    let code=inp["message"][0]["code"][0];

    if(code==config["zillow-success"]){
        
        let result=inp["response"][0]["results"][0]["result"][0];
        let rentzestimate=result["rentzestimate"][0];
        let zestimate=result["zestimate"][0];
        //ToDo:Extract this into a model
        var model={
            zpId:'',
            updated:'',    
            currency:'',
            amount:'',
            valueChange:'',
            valuationRange:{
                low:'',
                high:''
            },
            address:{
                street:'',
                city:'',
                state:'',
                zipcode:'',
                latitude:'',
                longitude:''
            }
        };

        //ToDo: Better way
        model.zpId=result.zpid[0];
        model.address=result.address[0];

        if(rentzestimate!=null){
            model.updated=rentzestimate["last-updated"][0];
            model.currency=rentzestimate["amount"][0]["$"]["currency"][0];
            model.amount=rentzestimate["amount"][0]["_"][0];
            model.changeDuration=rentzestimate["valueChange"][0]["$"]["duration"];
            model.valueChange=rentzestimate["valueChange"][0]["_"];
            model.valuationRange={
                low:rentzestimate["valuationRange"][0]["low"][0]["_"],
                high:rentzestimate["valuationRange"][0]["high"][0]["_"]
            };
         }
         else{
            
            let factor=config["monthlyRent-factor"]/1200;
            
            model.updated=zestimate["last-updated"][0];
            model.currency=zestimate["amount"][0]["$"]["currency"][0];
            model.amount= Math.round(zestimate["amount"][0]["_"][0]*factor);
            model.changeDuration=zestimate["valueChange"][0]["$"]["duration"];
            model.valueChange=zestimate["valueChange"][0]["_"];
            model.valuationRange={
                low: Math.round(model.amount+(model.amount*10/100)),
                high: Math.round(model.amount-(model.amount*10/100))
            };
         }

        return model;
    }
    else{
       console.log("Error");
       return {'status':500}; 
    }
}

