var chaoDao = require('../../../../dao/chatDao');
var idSequenceService = require('../../../../service/idSequenceService');

module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};

/**
 * 新创建一个群
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.createGroup = function(msg, session, next) {
    console.info("enter createGroup................");

    if (!!msg.group) {
        var channelName = msg.group;
        var channelService = this.app.get('channelService');
        var channel = channelService.getChannel(channelName, true);
        var serverId = this.app.get('serverId');
        if( !!channel) {

            channel.add(1, serverId);
            channel.add(2, serverId);
            channel.add(3, serverId);
        }

    }

    next(null, {code: 200, msg: 'create group is ok.'});
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

  next(null, {code: 200, msg: 'connect to server is ok.'});
};

Handler.prototype.sendChat = function(msg, session, next) {

    console.info("enter sendChat................");
    console.info(msg);
    var channelService = this.app.get('channelService');
    var serverId = this.app.get('serverId');
    if (!msg.from) {
        console.info("fromUserId must exsits");
        return;
    }

    // 单聊
    if(!!msg.to && msg.to > 0) {
        msg.id = idSequenceService.getNext('chat');
        channelService.pushMessageByUids('sendChat', msg, [{
            uid: msg.to,
            sid: serverId
        }]);

    // 群聊
    } else if (!!msg.group && msg.group > 0) {
        msg.id = idSequenceService.getNext('chat');
        var channelName = msg.group;
        var channel = channelService.getChannel(channelName, true);
        channel.pushMessage('sendChat', msg);
    }

    console.info(session);
    chaoDao.saveChat(msg);

    next(null, {code: 200, msg: 'send chat is ok.'});
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
