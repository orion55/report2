'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _answersModel = require('../models/answersModel');

var _answersModel2 = _interopRequireDefault(_answersModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var anwersRouter = (0, _express.Router)();
var answers = new _answersModel2.default();

anwersRouter.route('/').get(function (req, res) {
    answers.getReport().then(function (result) {
        res.contentType('application/json').status(200);
        res.send(JSON.stringify(result));
    }).catch(function (err) {
        res.set('Content-Type', 'application/json');
        res.status(500).send(JSON.stringify(err, null, "\t"));
    });
});

exports.default = anwersRouter;
//# sourceMappingURL=answersRouter.js.map