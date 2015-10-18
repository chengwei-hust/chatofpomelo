var fs = require('fs');
var pomelo = require('pomelo');
var globalchannelPlugin = require('pomelo-globalchannel-plugin');
var redis = require('./app/util/config').redis;
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
            useProtobuf : true,
            ssl: {
                type: 'wss',
                key: fs.readFileSync('../shared/server.key'),
                cert: fs.readFileSync('../shared/server.crt')
            }
        });
});

app.configure('production|development|betaTest', 'connector', function(){
    app.set('connectorConfig',
        {
            connector : pomelo.connectors.hybridconnector,
            heartbeat : 3,
            useDict : true,
            useProtobuf : true,
            ssl: {
                type: 'wss',
                key: fs.readFileSync('../shared/server.key'),
                cert: fs.readFileSync('../shared/server.crt')
            }
        });
});

app.use(globalchannelPlugin, {
    globalChannel: {
        host: redis.host,
        port: redis.port
    }

});

// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});

