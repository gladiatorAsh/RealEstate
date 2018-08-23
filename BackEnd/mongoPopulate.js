const MongoClient = require("mongodb").MongoClient;
var db = require("./config/db");

MongoClient.connect(db.url, (err, database) => {
    if (err) return console.log(err);

    db = database.db("zestimate");

    user = { email: "test@email.com", password: "password" };

    db.collection("users").insert(user, (err, result) => {
        console.log(err, result);
    });
});