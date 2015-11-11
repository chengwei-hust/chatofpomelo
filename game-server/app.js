var fs = require('fs');
var pomelo = require('pomelo');
var globalchannelPlugin = require('pomelo-globalchannel-plugin');
var initChannels = require ('./app/components/ChatChannels');
var redisConfig = require('./app/util/config').redis;
/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'chatofpomelo');

// app configuration
app.configure('production|development|betaTest', 'gate', function(){
    app.set('connectorConfig',
        {
            connector : pomelo.connectors.hybridconnector,
            heartbeat : 3,
            useDict : true,
            useProtobuf : true
        });
});

app.configure('production|development|betaTest', 'connector', function(){
    app.set('connectorConfig',
        {
            connector : pomelo.connectors.hybridconnector,
            heartbeat : 3,
            useDict : true,
            useProtobuf : true
        });
//    app.load (initChannels, null);
});



app.use(globalchannelPlugin, {
    globalChannel: {
        host: redisConfig.host,
        port: redisConfig.port
    }
});

// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});

