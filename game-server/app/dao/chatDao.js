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
        });
    });
};

exports.markRead = function(uid, id) {

    console.info("mark read...............");

    MongoClient.connect("mongodb://localhost:27017/wm_main", function(err, db) {
        if (err) {
            console.log(err);
            return console.dir(err);
        }

        db.collection('chat').update({id: id},{$set: {isReaded: true}}, {}, function (err, result) {
            if (err) {
                console.log(err);
            }
            console.info(result);
        });
    });

};

exports.getUnreadChatsByGroups = function(groupIds, callback) {
    console.info("getUnreadChatsByGroups......");
    MongoClient.connect("mongodb://localhost:27017/wm_main", function(err, db) {
        if (err) {
            console.log(err);
            return console.dir(err);
        }

        db.collection('chat').find({group:{$in:groupIds}}, {_id:0}, function(err,result) {
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