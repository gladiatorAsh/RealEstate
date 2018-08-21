const request= require('request');
const parseString = require('xml2js').parseString;
const UserController= require('../users/user');
const config = require('../config/zillow');

//const rentModel=require('./models/zillow');


exports.getRentEstimate = (req, res) => {
   try{
        UserController.patchAddressById(req);
        const address = req.body.address;
        getRentZestimate(req).then((result) => {
            res.status(200).send(result);
        });;

   }catch (err) {
        res.status(500).send({errors: err});
    }
};

//ToDo: CircuitBreaker pattern
exports.getRentZestimate = (req,res) =>{
try{
    let address=req.body.address;
    let citystatezip=req.body.citystatezip;

    let obj=config.zillowApiEndpoint+'/'+config.zillowGetRentEstimateEndpoint+
    '?zws-id='+config["zws-id"]+'&address='+address+'&citystatezip='+citystatezip+
    '&rentzestimate=true';

    console.log(obj);

    request.get({ url: obj },function(error, response, body) { 
    if (!error && response.statusCode == 200) { 
        parseString(body, function (err, result) {
           let output= getRent(err,result);
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
    
    //var model= rentModel.zillowRentEstimate;
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

    model.zpId=result.zpid[0];
    model.updated=rentzestimate["last-updated"][0];
    model.currency=rentzestimate["amount"][0]["$"]["currency"][0];
    model.amount=rentzestimate["amount"][0]["_"][0];
    model.changeDuration=rentzestimate["valueChange"][0]["$"]["duration"];
    model.valueChange=rentzestimate["valueChange"][0]["_"];
    model.valuationRange={
        low:rentzestimate["valuationRange"][0]["low"][0]["_"],
        high:rentzestimate["valuationRange"][0]["high"][0]["_"]
    };
    model.address=result.address[0];
    console.log("Model:",model);
   
    return model;
    
    }
    else{
       console.log("Error");
       return {'status':500}; 
    }
}

