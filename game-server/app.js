var pomelo = require('pomelo');
var globalchannelPlugin = require('pomelo-globalchannel-plugin');

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'chatofpomelo');

// app configuration
app.configure('production|development', 'gate', function(){
    app.set('connectorConfig',
        {
            connector : pomelo.connectors.sioconnector,
            //websocket, htmlfile, xhr-polling, jsonp-polling, flashsocket
            transports : ['websocket'],
            heartbeats : true,
            closeTimeout : 60,
            heartbeatTimeout : 60,
            heartbeatInterval : 25
        });
});

app.configure('production|development', 'connector', function(){
    app.set('connectorConfig',
        {
            connector : pomelo.connectors.sioconnector,
            //websocket, htmlfile, xhr-polling, jsonp-polling, flashsocket
            transports : ['websocket'],
            heartbeats : true,
            closeTimeout : 60,
            heartbeatTimeout : 60,
            heartbeatInterval : 25
        });
});

app.use(globalchannelPlugin, {
    globalChannel: {
        host: 'a5.womi.cn',
        port: 6379
    }

});

// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});

