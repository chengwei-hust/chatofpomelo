/**
 * Created by chengwei on 15-10-20.
 */
var groupsDao = require('../dao/groupsDao');
var dispatcher = require('../util/dispatcher');
var redis = require("redis");
var redisConfig = require('../util/config').redis;
var redisClient = redis.createClient(redisConfig.port,redisConfig.host);

module.exports = function(app, opts) {
    return new ChatChannels(app, opts);
};

var ChatChannels = function(app, opts) {
    this.app = app;
};

ChatChannels.name = '__ChatChannels__';

ChatChannels.prototype.start = function(cb) {
    console.log('Init Channels Start');
    var self = this;
    process.nextTick (cb);
}

ChatChannels.prototype.afterStart = function(cb) {
    console.log ('Init Channels afterStart');
    var self = this;
    initChannels(self);
    process.nextTick (cb);
}

ChatChannels.prototype.stop = function(force, cb) {
    console.log ('Init Channels stop');
    var self = this;
    destroyChannels(self);
}

function initChannels(self) {
    var connectors = self.app.getServersByType('connector');
    if(connectors.length == 5) {
        groupsDao.getAllGroups(importGroupToChannels);

        function importGroupToChannels(groups) {
            if (!!groups) {
                console.info("Begin init Channels................................................................");
                var globalChannelService = self.app.get('globalChannelService');
                for (var i = 0; i < groups.length; i++) {
                    var channelName = groups[i].group;
                    var members = groups[i].members;
                    if (!!members)
                        for (var j = 0; j < members.length; j++)
                            globalChannelService.add(channelName, members[j].uid, dispatcher.dispatch(members[j].uid, connectors).id);
                }
                console.info('Init Channels is ok.')
            }
        }
    }
};

function destroyChannels(self) {
    var connectors = self.app.getServersByType('connector');
    if(connectors.length == 5) {
        console.info("Begin remove Channels................................................................");
        redisClient.keys('POMELO:CHANNEL:*', function (err, response) {
            if (err) console.error(err);
            if (!!response)
                for (var i = 0; i < response.length; i++)
                    redisClient.del(response[i], function (err, response) {
                        if (err) console.error(err);
                    });
        });
        console.info('Remove Channels is ok.')
    }
};