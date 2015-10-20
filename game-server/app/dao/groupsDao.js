/**
 * Created by chengwei on 15-1-30.
 */

var MongoClient = require('mongodb').MongoClient;
var mongodbUrl = require('../util/config').mongodb.url;


exports.getGroupsByUid = function(uid, callback) {

    console.info(mongodbUrl);
    MongoClient.connect(mongodbUrl, function(err, db) {
        if (err) {
            console.log(err);
            return console.dir(err);
        }

        var groupsTable = db.collection('groups');
        groupsTable.find({"members":{"$elemMatch":{"uid":uid}}}, {"group":1, "_id":0}, function (err, results) {

            results.toArray(function(err,arr){
                if(err){
                    console.log(err);
                    console.log("results toArray error");
    //                db.close();
                    return;
                }
                callback(arr);
                db.close();
            });


        });

    });

};


exports.addUser = function(uid, groupId) {

    MongoClient.connect(mongodbUrl, function(err, db) {
        if (err) {
            console.log(err);
            return console.dir(err);
        }

        var groupsTable = db.collection('groups');
        groupsTable.update({group: groupId}, {$addToSet: {members: {uid: uid}}}, {new: true, upsert: true}, function (err, result) {
            if (err) {
                console.log(err);
            }
            console.info(result);
            db.close();
        });

    });
};

exports.getAllGroups = function(cb) {

    MongoClient.connect(mongodbUrl, function(err, db) {
        if (err) {
            console.log(err);
            return console.dir(err);
        }

        var groupsTable = db.collection('groups');
        groupsTable.find({}, {"group":1, "members":1, "_id":0}, function (err, results) {


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
}