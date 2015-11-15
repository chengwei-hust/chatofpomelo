/**
 * Created by chengwei on 15-1-30.
 */

var MongoClient = require('mongodb').MongoClient;
var mongodbUrl = require('../util/config').mongodb.url;


exports.getAllGroups = function(cb) {

    MongoClient.connect(mongodbUrl, function(err, db) {
        if (err) {
            console.log(err);
            return console.dir(err);
        }

        var groupsTable = db.collection('room_online');
        groupsTable.find({}, {"room_no":1, "_id":0}, function (err, results) {

            results.toArray(function(err,arr){
                if(err){
                    console.log("results toArray error");
//                  db.close();
                    return;
                }
                cb(arr);
                db.close();
            });


        });

    });
};


exports.getGroupUsers = function(room_no, cb) {

    MongoClient.connect(mongodbUrl, function(err, db) {
        if (err) {
            console.log(err);
            return console.dir(err);
        }

        var groupsTable = db.collection('room_online_user');
        groupsTable.find({"room_no":room_no}, {"user_id":1, "guest_id":1, "_id":0}, function (err, results) {

            results.toArray(function(err,arr){
                if(err){
                    console.log("results toArray error");
//                  db.close();
                    return;
                }
                cb(room_no, arr);
                db.close();
            });


        });

    });
}