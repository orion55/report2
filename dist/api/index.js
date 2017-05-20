'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _package = require('../../package.json');

var _express = require('express');

var _answersRouter = require('./answersRouter');

var _answersRouter2 = _interopRequireDefault(_answersRouter);

var _UserController = require('./UserController');

var _UserController2 = _interopRequireDefault(_UserController);

var _AuthController = require('./AuthController');

var _AuthController2 = _interopRequireDefault(_AuthController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var api = (0, _express.Router)();

api.get('/', function (req, res) {
    res.json({ version: _package.version });
});

api.use('/answers', _answersRouter2.default);
api.use('/users', _UserController2.default);
api.use('/auth', _AuthController2.default);

exports.default = api;
//# sourceMappingURL=index.js.map