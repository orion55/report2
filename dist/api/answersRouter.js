'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _answersModel = require('../models/answersModel');

var _answersModel2 = _interopRequireDefault(_answersModel);

var _util = require('../util');

var _excel = require('../models/excel');

var _excel2 = _interopRequireDefault(_excel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var anwersRouter = (0, _express.Router)();
var answers = new _answersModel2.default();

anwersRouter.route('/').get(function (req, res) {
    req.checkQuery('from', 'Invalid From date').notEmpty().isDate();
    req.checkQuery('to', 'Invalid To date').notEmpty().isDate();

    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            res.set('Content-Type', 'application/json');
            res.status(500).send(JSON.stringify((0, _util.removeDuplicates)(result.array(), 'param')));
            return;
        }
        answers.getReport2({ dateFrom: req.query.from, dateTo: req.query.to }).then(function (result) {
            var xlsx = new _excel2.default();
            return xlsx.exportXlsx(result.rows, result.metaData);
        }).then(function (result) {
            var requestedUrl = req.protocol + '://' + req.get('Host');
            result.fileUrl = requestedUrl + '/' + result.fileUrl;
            res.contentType('application/json').status(200);
            res.send(JSON.stringify(result));
        }).catch(function (err) {
            res.set('Content-Type', 'application/json');
            res.status(err.status).send(JSON.stringify(err));
        });
    });
});

exports.default = anwersRouter;
//# sourceMappingURL=answersRouter.js.map