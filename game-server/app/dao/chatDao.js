/**
 * Created by chengwei on 15-1-22.
 */
var MongoClient = require('mongodb').MongoClient;

exports.saveChat = function(param) {

    console.info("save chat................");

    MongoClient.connect("mongodb://localhost:27017/wm_main", function(err, db) {
        if (err) {
            console.log(err);
            return console.dir(err);
        }

        db.collection('chat').insert(param, {w: 1}, function (err, result) {
            if (err) {
                console.log(err);
            }
            console.info(result);
            db.close();
        });
    });
};

exports.markReceived = function(uid, id) {

    console.info("mark read...............");

    MongoClient.connect("mongodb://localhost:27017/wm_main", function(err, db) {
        if (err) {
            console.log(err);
            return console.dir(err);
        }

        db.collection('chat').update({id: id},{$set: {isRecieved: true}}, {}, function (err, result) {
            if (err) {
                console.log(err);
            }
            console.info(result);
            db.close();
        });
    });

};

exports.getUnReceivedChats = function(uid, callback) {
    console.info("getUnReceivedChats......");
    MongoClient.connect("mongodb://localhost:27017/wm_main", function(err, db) {
        if (err) {
            console.log(err);
            return console.dir(err);
        }

        db.collection('chat').find({to:uid, isRecieved:{$exists:false}}, {_id:0}, function(err,result) {
            result.toArray(function (err, arr) {
                if (err) {
                    console.log("results toArray error");
                    return;
                }
                callback(arr);
            });
        });
    });
}