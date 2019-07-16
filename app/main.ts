import * as Models from './models/index';

const mongodb = require('mongodb');
const yaml = require('js-yaml');
const fs = require('fs');
const MongoClient = mongodb.MongoClient;
let config: Models.Config;
try {
    config = yaml.safeLoad(fs.readFileSync('config.yaml', 'utf8'));
    MongoClient.connect(`${config.mongodb.local.host}:${config.mongodb.local.port}`, { useNewUrlParser : true  }, (error, client) => {
        if(error) { return console.log('Failed to connect to MongoDB');  }
        console.log('Connected to MongoDB');

        const db = client.db(config.mongodb.local.databaseName);
        db.collection('users').insertOne({
            id: "1",
            name: "Bobby"
        })
    });
} catch (e) {
    console.log(e);
}