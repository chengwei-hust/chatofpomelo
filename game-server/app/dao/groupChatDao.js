/**
 * Created by chengwei on 15-1-30.
 */
var MongoClient = require('mongodb').MongoClient;

exports.saveChat = function(param) {

    console.info("save group chat................");

    MongoClient.connect("mongodb://localhost:27017/wm_main", function(err, db) {
        if (err) {
            console.log(err);
            return console.dir(err);
        }

        db.collection('group_chat').insert(param, {w: 1}, function (err, result) {
            if (err) {
                console.log(err);
            }
            console.info(result);
        });
    });
};

exports.markReceived = function(uid, id) {

    console.info("mark group chat received...............");

    MongoClient.connect("mongodb://localhost:27017/wm_main", function(err, db) {
        if (err) {
            console.log(err);
            return console.dir(err);
        }

        db.collection('group_chat').update({id: id},{$addToSet: {receivedUsers: uid}}, {}, function (err, result) {
            if (err) {
                console.log(err);
            }
            console.info(result);
        });
    });

};

exports.getUnReceivedChatsByGroups = function(groupIds, uid, callback) {
    console.info("getUnreadChatsByGroups......");
    MongoClient.connect("mongodb://localhost:27017/wm_main", function(err, db) {
        if (err) {
            console.log(err);
            return console.dir(err);
        }

        db.collection('group_chat').find({group:{$in:groupIds}, receivedUsers:{$nin:[uid]}}, {_id:0}, function(err,result) {
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