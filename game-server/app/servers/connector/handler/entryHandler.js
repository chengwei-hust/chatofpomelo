var ticketService = require('../../../service/ticketService');

module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};

/**
 * 用户进入系统
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.entry = function(msg, session, next) {
    var guest = msg.guest;
    if(!guest) {
        next(null, {
            code: 10000,
            msg:"请传入是否游客身份参数guest"
        });
        return;
    }
    var access_token = msg.access_token;
    if (!access_token) {
        next(null, {
            code: 20000,
            msg:"access_token无效或者已过期，请出重新获取"
        });
        return;
    }
    var uid = ticketService.getUserIdByTicket(access_token, guest);
    if(!uid) {
        next(null, {
            code: 20000,
            msg:"access_token无效或者已过期，请出重新获取"
        });
        return;
    }
    //登录绑定uid到session
    session.bind(uid);
    next(null, {code: 200, msg: 'connect to server is ok.', uid: uid});
};


