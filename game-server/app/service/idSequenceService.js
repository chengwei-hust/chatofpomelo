/**
 * Created by chengwei on 15-1-24.
 */

var idsDao = require('../dao/idsDao');

exports.getNext = function(tableName, callback) {
    idsDao.getNextId(tableName, callback);
}