module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};

/**
 * New client entry.
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

  session.bind(msg.uid);

  //  (session.id);
  next(null, {code: 200, msg: 'connect to server is ok.'});
};

Handler.prototype.sendChat = function(msg, session, next) {

    console.info("enter sendChat................");
    console.info(msg);
    var channelService = this.app.get('channelService');
    var serverId = this.app.get('serverId');
    if (!msg.from) {
        console.info("FromUserId must exsits");
        return;
    }
    // 单聊
    if(msg.to > 0) {
        channelService.pushMessageByUids('sendChat', msg, [{
            uid: msg.to,
            sid: serverId
        }]);

    // 群聊
    } else if (msg.group > 0) {
        var channelName = msg.group;
        var channel = channelService.getChannel(channelName, true);
        channel.pushMessage('sendChat', msg);
    }

    console.info(session);

    next(null, {code: 200, msg: 'send chat is ok.'});
};

/**
 * Publish route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.publish = function(msg, session, next) {
    console.info("enter publish................");
    console.info(msg);
    console.info(session);
	var result = {
		topic: 'publish',
		payload: JSON.stringify({code: 200, msg: 'publish message is ok.'})
	};
    var channelService = this.app.get('channelService');
    channelService.pushMessageByUids('sendChat', msg, [{
        uid: msg.to,
        sid: this.app.get('serverId')
    }]);

  next(null, result);
};

/**
 * Subscribe route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.subscribe = function(msg, session, next) {
	var result = {
		topic: 'subscribe',
		payload: JSON.stringify({code: 200, msg: 'subscribe message is ok.'})
	};
  next(null, result);
};


