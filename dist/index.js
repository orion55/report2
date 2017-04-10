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

var app = (0, _express2.default)();
app.server = _http2.default.createServer(app);

app.use((0, _morgan2.default)('dev'));

app.use(_bodyParser2.default.json({
    limit: _config2.default.bodyLimit
}));

__dirname = process.cwd();
app.use((0, _serveFavicon2.default)(_path2.default.join(__dirname, 'docs', 'favicon.ico')));
app.use('/api/v1', _api2.default);

app.get('/', function (req, res) {
    res.send('All is Ok!');
});

app.server.listen(process.env.PORT || _config2.default.port);
console.log('Started on port ' + app.server.address().port);

exports.default = app;
//# sourceMappingURL=index.js.map