var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://MLyne:Rhynieman@cluster0-shard-00-00-f4zum.mongodb.net:27017,cluster0-shard-00-01-f4zum.mongodb.net:27017,cluster0-shard-00-02-f4zum.mongodb.net:27017/MSMOData?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("Database created!");
    db.close();
});

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("msmo");
    dbo.createCollection("users", function(err, res) {
        if (err) throw err;
        console.log("users created!");
        db.close();
    });
});

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("msmo");
    var myobj = {username : "test01", password : "iamgod"};
    dbo.collection("users").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 user inserted");
        db.close();
    });
});
