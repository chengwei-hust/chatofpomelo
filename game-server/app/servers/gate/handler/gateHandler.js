var dispatcher = require('../../../util/dispatcher');
var ticketService = require('../../../service/ticketService');

module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
};

var handler = Handler.prototype;

/**
 * Gate handler that dispatch user to connectors.
 *
 * @param {Object} msg message from client
 * @param {Object} session
 * @param {Function} next next stemp callback
 *
 */
handler.queryEntry = function(msg, session, next) {

    var guest = msg.guest;
    if(!!guest) {
        next(null, {
            code: 10000,
            msg:"请传入是否游客身份参数guest"
        });
        return;
    }
    var access_token = msg.access_token;
    if (!!access_token) {
        next(null, {
            code: 20000,
            msg:"access_token无效或者已过期，请出重新获取"
        });
        return;
    }
	var uid = ticketService.getUserIdByTicket(access_token, guest);
	if(!!uid) {
        next(null, {
            code: 20000,
            msg:"access_token无效或者已过期，请出重新获取"
        });
		return;
	}
	// get all connectors
	var connectors = this.app.getServersByType('connector');
    console.info(connectors);
	if(!connectors || connectors.length === 0) {
		next(null, {
			code: 500
		});
		return;
	}
	// select connector
	var res = dispatcher.dispatch(uid, connectors);
	next(null, {
		code: 200,
		host: res.host,
		port: res.clientPort,
        uid: uid
	});
};
