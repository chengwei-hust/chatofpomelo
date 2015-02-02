var chatRemote = require('../remote/chatRemote');
var chatDao = require('../../../dao/chatDao');
var groupChatDao = require('../../../dao/groupChatDao');
var groupsDao = require('../../../dao/groupsDao');
var idSequenceService = require('../../../service/idSequenceService');

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

        groupsDao.addUser(msg.uid, msg.group);

        if( !!channel) {
            var members = channel.getMembers();
            console.info(members);

            if(!contains(members,msg.uid)) {
                channel.add(msg.uid, session.frontendId);
            }
        }
    }
    next(null, {code: 200, msg: 'create group is ok.'});
};

function contains(a, obj){
    for(var i = 0; i < a.length; i++) {
        if(a[i] === obj){
            return true;
        }
    }
    return false;
}


Handler.prototype.joinGroup = function(msg, session, next) {
    console.info("enter joinGroup................");

    if (!!msg.group) {
        var channelName = msg.group;
        var channelService = this.app.get('channelService');
        var channel = channelService.getChannel(channelName, true);

        groupsDao.addUser(msg.uid, msg.group);

        if( !!channel) {
            var members = channel.getMembers();
            console.info(members);

            if(!contains(members,msg.uid)) {
                channel.add(msg.uid, session.frontendId);
            }
        }
    }
    next(null, {code: 200, msg: 'join group is ok.'});
};


/**
 * Send messages to users
 *
 * @param {Object} msg message from client
 * @param {Object} session
 * @param  {Function} next next stemp callback
 *
 */
Handler.prototype.sendChat = function(msg, session, next) {

    console.info("enter sendChat................");
    console.info(msg);
    var channelService = this.app.get('channelService');

    if (!msg.from) {
        console.info("fromUserId must exsits");
        return;
    }

    // 单聊
    if(!!msg.to && msg.to > 0) {
        idSequenceService.getNext('chat', function(id) {
            msg.id = id;
            channelService.pushMessageByUids('chatMsg', msg, [{
                uid: msg.to,
                sid: session.frontendId
            }]);
            chatDao.saveChat(msg);
        });


        // 群聊
    } else if (!!msg.group && msg.group > 0) {
        idSequenceService.getNext('chat', function(id) {
            msg.id = id;
            var channelName = msg.group;
            var channel = channelService.getChannel(channelName, true);
            channel.pushMessage('chatMsg', msg);
            groupChatDao.saveChat(msg);
        });
    }

    console.info(session);


    next(null, {code: 200, msg: 'send chat is ok.'});
};

Handler.prototype.ack = function(msg, session, next) {
    console.info(msg);

    if(!!msg.chatType && msg.chatType == 1) {
        groupChatDao.markReceived(msg.uid, msg.id);
    } else {
        chatDao.markReceived(msg.uid, msg.id);
    }
    next(null, {code: 200, msg: 'ack is ok.'});
}

Handler.prototype.getUnReceivedChats = function(msg, session, next) {

    var channelService = this.app.get('channelService');
    var uid = msg.uid;
    console.info(msg);

    groupsDao.getGroupsByUid(uid, function(groups) {
        var groupIds = [];
        for (var i in groups) {
           console.info(groups[i]);
            groupIds.push(groups[i].group);
        }
        groupChatDao.getUnReceivedChatsByGroups(groupIds, uid, function(groupChats) {
            var result = {};
            result.unReceivedGroupChats = groupChats;
            chatDao.getUnReceivedChats(uid, function(chats) {
               result.unReceivedChats = chats;
               console.info(result);

               channelService.pushMessageByUids('unReceivedMsg', result, [{
                   uid: uid,
                   sid: session.frontendId
               }]);
            });

        });


    });

    next(null, {code: 200, msg: 'getUnreadChats is ok.'});
}