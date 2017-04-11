'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _db = require('./db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dbOrcl = new _db2.default();

var answersModel = function answersModel() {
    _classCallCheck(this, answersModel);

    this.getReport = function () {
        return new Promise(function (resolve, reject) {
            var sql = 'select * from X$USERS t order by xu$name';
            dbOrcl.doConnect().then(function (connection) {
                return dbOrcl.doExecuteArr(connection, sql).then(function (result) {
                    var arrRows = [];

                    function processResultSet() {
                        result.resultSet.getRow().then(function (row) {
                            if (!row) {
                                dbOrcl.doCloseResultSet(result.resultSet);
                                return resolve(arrRows);
                            }
                            arrRows.push(row);
                            processResultSet();
                        });
                    }
                    processResultSet();
                }).catch(function (err) {
                    dbOrcl.doClose(connection);
                    reject({ status: 500, msg: "Error getting data", detail_msg: err.message });
                });
            }).catch(function (err) {
                reject({ status: 500, msg: "Error connecting to DB", detail_msg: err.message });
            });
        });
    };
};

exports.default = answersModel;
//# sourceMappingURL=answersModel.js.map