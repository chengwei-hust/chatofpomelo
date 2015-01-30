/**
 * Created by chengwei on 15-1-26.
 */
var MongoClient = require('mongodb').MongoClient;

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

