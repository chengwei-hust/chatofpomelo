/**
 * Created by chengwei on 15-1-30.
 */
var MongoClient = require('mongodb').MongoClient;
var mongodbUrl = require('../util/config').mongodb.url;

exports.saveChat = function(param, pushMsg) {

    console.info("save group chat................");

    MongoClient.connect(mongodbUrl, function(err, db) {
        if (err) {
            console.log(err);
            return console.dir(err);
        }

        db.collection('group_chat').insert(param, {w: 1}, function (err, result) {
            if (err) {
                console.log(err);
            }
            pushMsg();
            db.close();
        });
    });
};

exports.markReceived = function(uid, id) {

    console.info("mark group chat received...............");

    MongoClient.connect(mongodbUrl, function(err, db) {
        if (err) {
            console.log(err);
            return console.dir(err);
        }

        db.collection('group_chat').update({id: id},{$addToSet: {receivedUsers: uid}}, {}, function (err, result) {
            if (err) {
                console.log(err);
            }
            console.info(result);
            db.close();
        });
    });

};

exports.getUnReceivedChatsByGroups = function(groupIds, uid, callback) {
    console.info("getUnreadChatsByGroups......");
    MongoClient.connect(mongodbUrl, function(err, db) {
        if (err) {
            console.log(err);
            return console.dir(err);
        }

        db.collection('group_chat').find({group:{$in:groupIds}, receivedUsers:{$nin:[uid]}}, {_id:0}, function(err,result) {
            result.toArray(function (err, arr) {
                if (err) {
                    console.info(err);
                    console.log("results toArray error");
//                    db.close();
                    return;
                }
                callback(arr);
                db.close();
            });

        });
    });
}