import http from 'http';
import express from 'express';
import favicon from 'serve-favicon';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import api from './api';
import path from 'path';
import config from './config/config.json';
let expressValidator = require('express-validator');

let app = express();
app.server = http.createServer(app);

app.use(morgan('dev'));

app.use(bodyParser.json({
    limit: config.bodyLimit
}));

app.use(expressValidator());

let dirName = process.cwd();
if (process.env.NODE_ENV === 'prodaction') {
    dirName = dirName.split('/').slice(0, -1).join('/');
}

app.set('docsPath', path.join(dirName, 'docs'));

app.use(favicon(path.join(dirName, 'docs', 'favicon.ico')));
app.use(express.static(dirName + '/docs'));

app.use('/api/v1', api);

app.get('/', function (req, res) {
    res.send('All is Ok!');
});

app.server.listen(process.env.PORT || config.port);
console.log(`Started on port ${app.server.address().port}`);

export default app;