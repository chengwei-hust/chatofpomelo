var chatDao = require('../../../dao/chatDao');
var groupChatDao = require('../../../dao/groupChatDao');
var groupsDao = require('../../../dao/groupsDao');

var dispatcher = require('../../../util/dispatcher');

module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
};

var handler = Handler.prototype;


function contains(a, obj){
    for(var i = 0; i < a.length; i++) {
        if(a[i] === obj){
            return true;
        }
    }
    return false;
}

//用户进入聊天室
handler.loginRoom = function(msg, session, next) {
    console.info("enter loginRoom................");
    var connectors = this.app.getServersByType('connector');

    if (!!msg.room_no && !!msg.user_id) {
        var channelName = msg.room_no;
        var member = msg.user_id;
        var globalChannelService = this.app.get('globalChannelService');
        console.info(dispatcher.dispatch(member, connectors));
        globalChannelService.add(channelName, member, dispatcher.dispatch(member, connectors).id);

        next(null, {code: 200, msg: 'login room is ok.'});
    } else {
        next(null, {code: 500});
    }
};

//用户离开聊天室
handler.logoutRoom = function(msg, session, next) {
    console.info("enter logoutRoom................");
    var connectors = this.app.getServersByType('connector');

    if (!!msg.group && !!msg.uid) {
        var channelName = msg.group;
        var creater = msg.uid;
        groupsDao.addUser(creater, channelName);
        var globalChannelService = this.app.get('globalChannelService');
        console.info(dispatcher.dispatch(creater, connectors));
        globalChannelService.add(channelName, creater, dispatcher.dispatch(creater, connectors).id);

        next(null, {code: 200, msg: 'create room is ok.'});
    } else {
        next(null, {code: 500});
    }

};




//用户发送聊天内容
handler.sendChat = function(msg, session, next) {

    console.info("enter sendChat................");
    var channelService = this.app.get('channelService');
    var globalChannelService = this.app.get('globalChannelService');
    var connectors = this.app.getServersByType('connector');
    console.info(connectors);

    if (!msg.from) {
        next(null, {code: 500, msg: 'from must be exsited.'});
        return;
    }
    // 单聊
    if(!!msg.to && msg.to > 0) {
        // 拿session ID
        var res = dispatcher.dispatch(msg.to, connectors);
        console.info(res);
        channelService.pushMessageByUids('womi.stock.msg', msg, [{
            uid: msg.to,
            sid: res.id
        }]);
        // 群聊
    } else if (!!msg.roomno && msg.roomno > 0) {
        var channelName = msg.roomno;
        globalChannelService.pushMessage('connector', 'womi.stock.msg', msg, channelName);
    }
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