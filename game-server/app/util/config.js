var env = 'local';

var settings = {

    local: {
        mongodb: {
            host: "j6.womi.cn",
            port: "27017",
            database: "wm_stock"
        }
    },
    betaTest: {
        mongodb: {
            host: "10.254.160.86",
            port: "27017",
            database: "wm_stock"
        }
    },
    product: {
        mongodb: {
            host: "10.254.190.48",
            port: "27017",
            database: "wm_stock"
        }
    }

}

var c = settings[env], mongo = c.mongodb;
c.mongodb.url = "mongodb://" + mongo.host + ":" + mongo.port + "/" + mongo.database;

module.exports = c;