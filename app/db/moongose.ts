import mongoose from 'mongoose';

export /**
 * Connect to the MongoDB using mongoose
 *
 * @param {Models.IConfig} config
 */
const connect = () => {
    let config = global.config.mongodb[process.env.NODE_ENV!];

    mongoose.connect(`${config.host}:${config.port}/${config.databaseName}`,{ useNewUrlParser : true , useCreateIndex : true });
}