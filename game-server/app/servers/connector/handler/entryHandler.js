

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
  console.info("enter entry................");
  console.info(msg);
  console.info(session);

  //登录绑定uid到session
  session.bind(msg.uid);
//  session.set('uid', msg.uid);
//  session.push('uid', function(err) {
//      if (err) {
//          console.error('set rid for session service failed! error is : %j', err.stack);
//      }
//  });

  next(null, {code: 200, msg: 'connect to server is ok.'});

    //put user into channel
//  this.app.rpc.chat.chatRemote.enter(session, msg.uid, this.app.get('serverId'),function(){
//        next(null, {code: 200, msg: 'connect to server is ok.'});
//  });

};



/**
 * Publish route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}

Handler.prototype.publish = function(msg, session, next) {
	var result = {
		topic: 'publish',
		payload: JSON.stringify({code: 200, msg: 'publish message is ok.'})
	};
   next(null, result);
};

*/

/**
 * Subscribe route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}

Handler.prototype.subscribe = function(msg, session, next) {
	var result = {
		topic: 'subscribe',
		payload: JSON.stringify({code: 200, msg: 'subscribe message is ok.'})
	};
  next(null, result);
};

*/
