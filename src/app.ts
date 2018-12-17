import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import requireDir = require('require-dir');
import { handleCommand } from './command';

requireDir("./cmd");

const app = express();

app.set("port", process.env.PORT || 3000);
app.use(bodyParser.text());
app.use(
    express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

app.post("/", handleCommand);

export default app;