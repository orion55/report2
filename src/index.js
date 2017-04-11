import http from 'http';
import express from 'express';
import favicon from 'serve-favicon';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import api from './api';
import path from 'path';
import config from './config/config.json';

let app = express();
app.server = http.createServer(app);

app.use(morgan('dev'));

app.use(bodyParser.json({
    limit: config.bodyLimit
}));

__dirname = process.cwd();
app.use(favicon(path.join(__dirname, 'docs', 'favicon.ico')));
app.use('/api/v1', api);

app.get('/', function (req, res) {
    res.send('All is Ok!');
});

app.server.listen(process.env.PORT || config.port);
console.log(`Started on port ${app.server.address().port}`);

export default app;