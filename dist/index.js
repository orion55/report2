'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _serveFavicon = require('serve-favicon');

var _serveFavicon2 = _interopRequireDefault(_serveFavicon);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _config = require('./config/config.json');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expressValidator = require('express-validator');

var app = (0, _express2.default)();
app.server = _http2.default.createServer(app);

app.use((0, _morgan2.default)('dev'));

app.use(_bodyParser2.default.json({
    limit: _config2.default.bodyLimit
}));

app.use(expressValidator());

var dirName = process.cwd();
if (process.env.NODE_ENV === 'prodaction') {
    dirName = dirName.split('/').slice(0, -1).join('/');
}

app.set('docsPath', _path2.default.join(dirName, 'docs'));

app.use((0, _serveFavicon2.default)(_path2.default.join(dirName, 'docs', 'favicon.ico')));
app.use(_express2.default.static(dirName + '/docs'));

app.use('/api/v1', _api2.default);

app.get('/', function (req, res) {
    res.send('All is Ok!');
});

app.server.listen(process.env.PORT || _config2.default.port);
console.log('Started on port ' + app.server.address().port);

exports.default = app;
//# sourceMappingURL=index.js.map