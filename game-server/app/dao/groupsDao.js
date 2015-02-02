/**
 * Created by chengwei on 15-1-30.
 */

var MongoClient = require('mongodb').MongoClient;


exports.getGroupsByUid = function(uid, callback) {

    MongoClient.connect("mongodb://localhost:27017/wm_main", function(err, db) {
        if (err) {
            console.log(err);
            return console.dir(err);
        }

        var groupsTable = db.collection('groups');
        groupsTable.find({"users":{"$elemMatch":{"uid":uid}}}, {"group":1, "_id":0}, function (err, results) {

            results.toArray(function(err,arr){
                if(err){
                    console.log("results toArray error");
                    return;
                }
                callback(arr);
            });
            db.close();

        });

    });

};


exports.addUser = function(uid, groupId) {

    MongoClient.connect("mongodb://localhost:27017/wm_main", function(err, db) {
        if (err) {
            console.log(err);
            return console.dir(err);
        }

        var groupsTable = db.collection('groups');
        groupsTable.update({group: groupId}, {$addToSet: {users: {uid: uid}}}, {new: true, upsert: true}, function (err, result) {
            if (err) {
                console.log(err);
            }
            console.info(result);
            db.close();
        });

    });
};