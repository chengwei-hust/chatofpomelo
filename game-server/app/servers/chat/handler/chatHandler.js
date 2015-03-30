var chatRemote = require('../remote/chatRemote');
var chatDao = require('../../../dao/chatDao');
var groupChatDao = require('../../../dao/groupChatDao');
var groupsDao = require('../../../dao/groupsDao');
var idSequenceService = require('../../../service/idSequenceService');

var dispatcher = require('../../../util/dispatcher');

module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
    initGroups(app);
};

var handler = Handler.prototype;

function initGroups(app) {
    console.info("Begin initGroups................................................................");
    groupsDao.getAllGroups(importGroups);

    function importGroups(groups) {
        var connectors = app.getServersByType('connector');
        for( var i = 0; i < groups.length; i++) {
           var channelName = groups[i].group;
 //          var channelService = app.get('channelService');
           var globalChannelService = app.get('globalChannelService');


 //          var channel = channelService.getChannel(channelName, true);
           var members = groups[i].members;

           for( var j = 0; j < members.length; j++) {
               console.info(dispatcher.dispatch(members[j].uid, connectors));
 //              channel.add(members[j].uid, dispatcher.dispatch(members[j].uid, connectors).id);

               globalChannelService.add(channelName, members[j].uid, dispatcher.dispatch(members[j].uid, connectors).id);
           }
//           console.info(channel);
       }
    }

    console.info('initGroups is ok.');
};



function contains(a, obj){
    for(var i = 0; i < a.length; i++) {
        if(a[i] === obj){
            return true;
        }
    }
    return false;
}

/**
 * 新创建一个群
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
handler.createGroup = function(msg, session, next) {
    console.info("enter createGroup................");
    var connectors = this.app.getServersByType('connector');

    if (!!msg.group) {
        var channelName = msg.group;
//        var channelService = this.app.get('channelService');
        var globalChannelService = this.app.get('globalChannelService');
//        var channel = channelService.getChannel(channelName, true);

        if(!!msg.members) {
            var members = msg.members;
 //           var channelMembers = channel.getMembers();
            for (var j = 0; j < members.length; j++) {
//                if(!contains(channelMembers, members[j].uid)) {
                    console.info(dispatcher.dispatch(members[j].uid, connectors));
//                    channel.add(members[j].uid, dispatcher.dispatch(members[j].uid, connectors).id);
                    globalChannelService.add(channelName, members[j].uid, dispatcher.dispatch(members[j].uid, connectors).id);
//                }
            }
//            console.info(channel);
        }
    }
    next(null, {code: 200, msg: 'create group is ok.'});
};

handler.joinGroup = function(msg, session, next) {
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
handler.sendChat = function(msg, session, next) {

    console.info("enter sendChat................");
    console.info(msg);
    var channelService = this.app.get('channelService');
    var globalChannelService = this.app.get('globalChannelService');
    var connectors = this.app.getServersByType('connector');
    console.info(connectors);

    if (!msg.from) {
        console.info("fromUserId must exsits");
        return;
    }

    // 单聊
    if(!!msg.to && msg.to > 0) {
        idSequenceService.getNext('chat', function(id) {
            msg.id = id;
            console.info(msg.to);
            // 拿session ID
            var res = dispatcher.dispatch(msg.to, connectors);

            console.info("test......................................................................");
            console.info(res);

            channelService.pushMessageByUids('chatMsg', msg, [{
                uid: msg.to,
                sid: res.id
            }]);
            chatDao.saveChat(msg);
        });


        // 群聊
    } else if (!!msg.group && msg.group > 0) {
        idSequenceService.getNext('chat', function(id) {
            msg.id = id;
            var channelName = msg.group;
//            var channel = channelService.getChannel(channelName, true);
//            console.info(channel);
//            channel.pushMessage('chatMsg', msg);
            groupChatDao.saveChat(msg, pushMsg);

            function pushMsg() {
                globalChannelService.pushMessage('connector', 'chatMsg', msg, channelName);
            }

        });
    }

    console.info(session);


    next(null, {code: 200, msg: 'send chat is ok.'});
};

handler.ack = function(msg, session, next) {
    console.info(msg);

    if(!!msg.chatType && msg.chatType == 1) {
        groupChatDao.markReceived(msg.uid, msg.id);
    } else {
        chatDao.markReceived(msg.uid, msg.id);
    }
    next(null, {code: 200, msg: 'ack is ok.'});
}

handler.getUnReceivedChats = function(msg, session, next) {

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