import express from 'express';
import * as Routers from './routers/index';
import * as mongooseDB from './db/moongose';
import * as sendGrid from './emails/account';

const app = express();
mongooseDB.setup();
sendGrid.setup();
app.use(
    express.json(),
    Routers.UserRouter
);

export default app;
