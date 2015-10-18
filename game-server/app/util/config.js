var env = 'development';

var settings = {

    development: {
        mongodb: {
            host: "127.0.0.1",
            port: "27017",
            database: "wm_stock"
        },
        redis:{
            host: "127.0.0.1",
            port: "6379"
        }
    },
    betaTest: {
        mongodb: {
            host: "10.254.160.86",
            port: "27017",
            database: "wm_stock"
        },
        redis:{
            host: "10.254.160.86",
            port: "6379"
        }
    },
    product: {
        mongodb: {
            host: "10.254.190.48",
            port: "27017",
            database: "wm_stock"
        },
        redis:{
            host: "10.254.191.47",
            port: "6379"
        }
    }

}

var c = settings[env], mongo = c.mongodb;
c.mongodb.url = "mongodb://" + mongo.host + ":" + mongo.port + "/" + mongo.database;

module.exports = c;