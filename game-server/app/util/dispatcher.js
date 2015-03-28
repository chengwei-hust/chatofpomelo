var crc = require('crc');

module.exports.dispatch = function(uid, connectors) {
//    var index = Math.abs(crc.crc32(uid)) % connectors.length;
    var index = parseInt(uid) % connectors.length;   // 数字型uid
    return connectors[index];
};
