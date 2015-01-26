/**
 * Created by chengwei on 15-1-26.
 */
var MongoClient = require('mongodb').MongoClient;
//var db;

// Initialize connection once
//MongoClient.connect("mongodb://localhost:27017/mydb", function(err, database) {
//    if(err) throw err;
//    db = database;
//});


exports.getNextId = function(tableName, callback) {

    MongoClient.connect("mongodb://localhost:27017/wm_main", function(err, db) {
        if (err) {
            console.log(err);
            return console.dir(err);
        }

        var idsTable = db.collection('ids');
        idsTable.findAndModify({"table_name":tableName}, [['table_name','asc']], {$inc:{'id':1}}, {new:true,upsert:true}, function (err, result) {
                callback(result.id);
        });


    });

};

