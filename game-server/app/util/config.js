var env = 'development';

var settings = {

    development: {
        mongodb: {
            host: "127.0.0.1",
            port: "27017",
            database: "wm_main"
        }
    },
    product: {
        mongodb: {
            host: "60.55.37.68",
            port: "27017",
            database: "wm_main"
        }
    }

}

var c = env == 'development' ? settings[env] :settings['product'],
    mongo = c.mongodb;
c.mongodb.url = "mongodb://" + mongo.host + ":" + mongo.port + "/" + mongo.database;

module.exports = c;