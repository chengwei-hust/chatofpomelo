

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
  //登录绑定uid到session
  session.bind(msg.uid);

    // put user into channel
//  this.app.rpc.chat.chatRemote.enter(session, msg.uid, this.app.get('serverId'),function(){
//        next(null, {code: 200, msg: 'connect to server is ok.'});
//  });

    next(null, {code: 200, msg: 'connect to server is ok.'});
};


