/**
 * Created by chengwei on 15-1-22.
 */
var MongoClient = require('mongodb').MongoClient;
//var db;

// Initialize connection once
//MongoClient.connect("mongodb://localhost:27017/mydb", function(err, database) {
//    if(err) throw err;
//    db = database;
//});


exports.saveChat = function(param) {

    MongoClient.connect("mongodb://localhost:27017/wm_main", function(err, db) {
        if (err) {
            console.log(err);
            return console.dir(err);
        }

        db.collection('chat').insert(param, {w: 1}, function (err, result) {
        });
    });



};
