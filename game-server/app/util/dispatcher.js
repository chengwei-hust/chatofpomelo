var crc = require('crc');

//module.exports.dispatch = function(uid, connectors) {
//	var index = Math.abs(crc.crc32(uid)) % connectors.length;
//	return connectors[index];
//};


module.exports.dispatch = function(uid, connectors) {
    console.info(uid);
    console.info(connectors.length);

 //   var index = Math.abs(crc.crc32(uid)) % connectors.length;
    var index = parseInt(uid) % connectors.length;
    console.info(index);
    return connectors[index];
};

