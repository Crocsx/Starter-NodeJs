import * as Models from './models/index';
import * as Routers from './routers/index';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as mongooseDB from './db/moongose';
import express from 'express';

const app = express();

try {
    global.config = yaml.safeLoad(fs.readFileSync('config.yaml', 'utf8'));
    const port = Number(process.env.PORT) || global.config.server.local.port;
    
    process.env.NODE_ENV = process.env.NODE_ENV!.trim();

    app.use(
        express.json(),
        Routers.UserRouter
    );

    app.listen(port, () => {
        console.log("Server listening on port " + port);
    });

    mongooseDB.connect();
} catch (e) {
    console.log(e);
}