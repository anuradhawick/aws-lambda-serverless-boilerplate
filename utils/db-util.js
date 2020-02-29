const MongoClient = require('mongodb').MongoClient;

let atlas_connection_uri = null;
let cachedDb = null;

connect_db = async () => {
    var uri = process.env['MONGODB_ATLAS_CLUSTER_URI'];

    if (atlas_connection_uri === null) {
        atlas_connection_uri = uri;
    }

    try {
        //testing if the database connection exists and is connected to Atlas so we can try to re-use it
        if (cachedDb && cachedDb.serverConfig.isConnected()) {
            return cachedDb
        }
        else {
            const client = await MongoClient.connect(atlas_connection_uri, { useNewUrlParser: true });
            cachedDb = client.db('vinyl');
            return cachedDb;
        }
    } catch (err) {
        console.error('an error occurred', err);
        throw new Error();
    }
};

module.exports = {
    connect_db
};
