'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _db = require('./db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dbOrcl = new _db2.default();
var numRows = 100;

var answersModel = function answersModel() {
    _classCallCheck(this, answersModel);

    this.getReport2 = function () {
        return new Promise(function (resolve, reject) {
            var sql = 'select * from X$USERS t order by xu$name';
            dbOrcl.doConnect().then(function (connection) {
                dbOrcl.doExecuteArr(connection, sql)
                /*.then(result => {
                 dbOrcl.doClose(connection);
                 resolve(result);
                 })*/
                .then(function (resultSet) {
                    var arrRows = [];

                    function processResultSet() {
                        resultSet.getRow().then(function (row) {
                            if (!row) {
                                dbOrcl.doClose(connection);
                                resolve(arrRows);
                            }
                            arrRows.push(row);
                            processResultSet();
                        }).catch(function (err) {
                            dbOrcl.doClose(connection);
                            reject({
                                status: 500,
                                message: "Error getting row",
                                detailed_message: err.message
                            });
                        });
                    }
                }).catch(function (err) {
                    dbOrcl.doClose(connection);
                    reject({ status: 500, message: "Error getting data", detailed_message: err.message });
                });
            }).catch(function (err) {
                reject({ status: 500, message: "Error connecting to DB", detailed_message: err.message });
            });
        });
    };
};

exports.default = answersModel;
//# sourceMappingURL=answersModel.js.map