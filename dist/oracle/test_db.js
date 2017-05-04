'use strict';

var _answersModel = require('../models/answersModel');

var _answersModel2 = _interopRequireDefault(_answersModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var answers = new _answersModel2.default();
answers.getReport2({ dateFrom: '04.01.2017', dateTo: '04.30.2017' }).then(function (result) {
    console.log(result);
}).catch(function (err) {
    console.log(err);
});
//# sourceMappingURL=test_db.js.map