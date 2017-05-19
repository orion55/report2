import http from 'http';
import express from 'express';
import favicon from 'serve-favicon';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import api from './api';
import path from 'path';
import config from './config/config.json';
let expressValidator = require('express-validator');
let clc = require('cli-color');
let cors = require('cors');
const mongoose = require('mongoose');

let app = express();
app.server = http.createServer(app);

app.use(morgan('dev'));

app.use(bodyParser.json({
    limit: config.bodyLimit
}));

app.use(expressValidator());

let dirName = process.cwd();

let env = process.env.NODE_ENV === undefined ? config.env : process.env.NODE_ENV;
switch (env) {
    case 'home':
        if (dirName.indexOf('docs') > 0)
            dirName = dirName.split('\\').slice(0, -1).join('\\');
        if (dirName.indexOf('dist') > 0)
            dirName = dirName.split('\\').slice(0, -1).join('\\');
        break;
    case 'prodaction':
        dirName = dirName.split('/').slice(0, -1).join('/');
        break;
}

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/users');

app.set('docsPath', path.join(dirName, 'docs'));

app.use(favicon(path.join(dirName, 'docs', 'favicon.ico')));
app.use(express.static(dirName + '/docs'));

app.use(cors());
// app.use(bodyParser.json({ type: '*/*' }));

app.use('/api/v1', api);

app.server.listen(process.env.PORT || config.port);
console.log(clc.cyan(`Started on port ${app.server.address().port}`));

export default app;