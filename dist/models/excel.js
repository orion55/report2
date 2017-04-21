'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var xlsx = require('xlsx-populate');
var fs = require('fs');
var moment = require('moment');

var xlsxModel = function xlsxModel() {
    var _this = this;

    _classCallCheck(this, xlsxModel);

    this.exportXlsx = function (rows) {
        var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        return new Promise(function (resolve, reject) {
            xlsx.fromBlankAsync().then(function (workbook) {
                var Sheet = workbook.sheet(0);
                var numRow = 1;

                if (headers !== []) {
                    for (var i = 0; i < headers.length; i++) {
                        Sheet.row(numRow).cell(i + 1).value(headers[i]);
                    }
                }

                numRow++;
                var startCell = Sheet.row(numRow).cell(1);
                var endCell = Sheet.row(numRow + rows.length - 1).cell(headers.length);
                var range = Sheet.range(startCell, endCell);
                range.value(rows);

                if (process.env.NODE_ENV === 'home') {
                    _this.formatXlsx(workbook, headers.length, rows.length);
                } else {
                    _this.formatXlsx2(workbook, headers.length, rows.length);
                }

                _this.saveXlsx(workbook).then(function (fileUrl) {
                    return resolve({ status: 200, fileUrl: fileUrl });
                });
            }).catch(function (err) {
                return reject({ status: 500, msg: "Error export to Excel", detail_msg: err.message });
            });
        });
    };

    this.formatXlsx = function (workbook, maxHeaders, maxRows) {
        var Sheet = workbook.sheet(0);
        var Range = Sheet.range(1, 1, 1, maxHeaders);
        Range.style("fontColor", "ffffff").style("fill", "4F81BD").style("bold", true);

        for (var i = 2; i <= maxRows + 1; i++) {
            Range = Sheet.range(i, 1, i, maxHeaders);
            if (i % 2) {
                Range.style("fill", "FFFFFF").style("fontColor", "000000").style("bottomBorder", true).style("borderColor", "95B3D7");
            } else {
                Range.style("fill", "DCE6F1").style("fontColor", "000000").style("bottomBorder", true).style("borderColor", "95B3D7");
            }
        }

        Range = Sheet.range(2, 1, maxRows + 1, 1);
        Range.style("numberFormat", "dd.mm.yyyy");
        Range = Sheet.range(2, 2, maxRows + 1, 2);
        Range.style("numberFormat", "dd.mm.yyyy");

        for (var _i = 1; _i <= maxHeaders; _i++) {
            Sheet.column(_i).width(12);
        }
    };

    this.formatXlsx2 = function (workbook, maxHeaders, maxRows) {
        var Sheet = workbook.sheet(0);
        var Range = Sheet.range(1, 1, 1, maxHeaders);
        Range.style("fontColor", "ffffff").style("fill", "4F81BD").style("bold", true);

        for (var i = 2; i <= maxRows + 1; i++) {
            Range = Sheet.range(i, 1, i, maxHeaders);
            if (i % 2) {
                Range.style("fill", "FFFFFF").style("fontColor", "000000").style("bottomBorder", true).style("borderColor", "95B3D7");
            } else {
                Range.style("fill", "DCE6F1").style("fontColor", "000000").style("bottomBorder", true).style("borderColor", "95B3D7");
            }
        }

        Range = Sheet.range(2, 1, maxRows + 1, 1);
        Range.style("numberFormat", "dd.mm.yyyy");
        Range = Sheet.range(2, 3, maxRows + 1, 3);
        Range.style("numberFormat", "dd.mm.yyyy");
        Range = Sheet.range(2, 4, maxRows + 1, 4);
        Range.style("numberFormat", "0.00");
        Range = Sheet.range(2, 5, maxRows + 1, 5);
        Range.style("numberFormat", "0.00");

        for (var _i2 = 1; _i2 <= maxHeaders - 1; _i2++) {
            Range = Sheet.range(2, _i2, maxRows + 1, _i2);
            Range.style("horizontalAlignment", "center");
        }

        var arrWidth = [11, 11, 16, 17, 17, 17, 60];
        for (var _i3 = 1; _i3 <= maxHeaders; _i3++) {
            Sheet.column(_i3).width(arrWidth[_i3 - 1]);
        }
    };

    this.saveXlsx = function (workbook) {
        return new Promise(function (resolve, reject) {
            var reportPath = _path2.default.join(_index2.default.get('docsPath'), 'report');

            fs.access(reportPath, fs.F_OK, function (err) {
                if (err) {
                    fs.mkdirSync(reportPath);
                } else {
                    fs.readdir(reportPath, function (err, files) {
                        if (!err) {
                            files.filter(function (file) {
                                return _path2.default.extname(file) === '.xlsx';
                            }).forEach(function (file) {
                                fs.unlink(_path2.default.join(reportPath, file), function (err) {
                                    if (err) console.log(err.message);
                                });
                            });
                        }
                    });
                }

                var now = moment().format("DDMMYYYY-HHmmss");
                var fileName = _path2.default.join(reportPath, 'report' + now + '.xlsx');
                var fileUrl = 'report/report' + now + '.xlsx';
                workbook.toFileAsync(fileName).then(resolve(fileUrl)).catch(function (err) {
                    reject({ status: 500, msg: "Error export to Excel", detail_msg: err.message });
                });
            });
        });
    };
};

exports.default = xlsxModel;
//# sourceMappingURL=excel.js.map