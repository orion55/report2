'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _db = require('./db');

var _db2 = _interopRequireDefault(_db);

var _util = require('../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ = require('lodash');

var dbOrcl = new _db2.default();

var answersModel = function answersModel() {
    _classCallCheck(this, answersModel);

    this.getReport = function (arrDate) {
        return new Promise(function (resolve, reject) {
            var sql = '';

            if (process.env.NODE_ENV === 'home') {
                sql = 'select t.operdate,\n                     t.closedate,\n                     t.closeday,\n                     t.closetime,\n                     t.usercodeopen,\n                     t.usercodeclose,\n                     t.unloadseqdel,\n                     t.unloadseqback,\n                     t.btrv_address,\n                     t.rowver\n                     from operdays t\n                     where t.operdate >= to_date(:dateFrom, \'mm.dd.yyyy\')\n                     and t.operdate <= to_date(:dateTo, \'mm.dd.yyyy\')\n                     order by t.operdate asc';
            } else {
                sql = 'select t.docdate AS "Дата ED274", ' + 't.opernum AS "Код ED273", ' + 'p.docdate AS "Дата документа", ' + 'p.docnum  AS "Номер документа", ' + 'p.paysum  AS "Сумма документа", ' + 'i.ed244_answercode, ' + 'i.ed244_purpose ' + 'FROM ESIDMESSAGE t, esid273doc a, payorder p, inesidmessage i ' + "where t.doctype = 273 " + "and t.opernum = a.esidopernum " + "AND p.opernum = a.payopernum " + "AND i.edtype = 'ED274' " + "and i.eddate >= to_date(:dateFrom, 'mm.dd.yyyy') " + "and i.eddate <= to_date(:dateTo, 'mm.dd.yyyy') " + "AND a.edno = MOD(i.ed243_edno / 1000, 1) * 1000" + "AND i.ed243_eddate = a.eddate";
            }
            dbOrcl.doConnect().then(function (connection) {
                return dbOrcl.doExecuteArr(connection, sql, arrDate).then(function (result) {
                    var arrRows = [];
                    var metaData = result.metaData.map(function (el) {
                        return (0, _util.jsUcfirst)(el.name);
                    });

                    function processResultSet() {
                        result.resultSet.getRow().then(function (row) {
                            if (!row) {
                                dbOrcl.doCloseResultSet(result.resultSet);
                                // console.log(arrRows.length);
                                return resolve({ rows: arrRows, metaData: metaData });
                            }
                            arrRows.push(row.map(function (el) {
                                return (0, _util.nonSpecialSymbol)(el);
                            }));
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

    this.getReport2 = function (arrDate) {
        var mymaxnumrows = 100;
        var metaData = [];

        var promiseTotal = new Promise(function (resolve, reject) {
            var sql = 'select COUNT(t.docdate) "Total"' + 'FROM ESIDMESSAGE t, esid273doc a, payorder p, inesidmessage i ' + "where t.doctype = 273 " + "and t.opernum = a.esidopernum " + "AND p.opernum = a.payopernum " + "AND i.edtype = 'ED274' " + "and i.eddate >= to_date(:dateFrom, 'mm.dd.yyyy') " + "and i.eddate <= to_date(:dateTo, 'mm.dd.yyyy') " + "AND a.edno = MOD(i.ed243_edno / 1000, 1) * 1000" + "AND i.ed243_eddate = a.eddate";
            dbOrcl.doConnect().then(function (connection) {
                return dbOrcl.doExecute(connection, sql, arrDate).then(function (result) {
                    resolve(result.rows[0][0]);
                }).catch(function (err) {
                    dbOrcl.doClose(connection);
                    reject({ status: 500, msg: "Error getting data", detail_msg: err.message });
                });
            }).catch(function (err) {
                reject({ status: 500, msg: "Error connecting to DB", detail_msg: err.message });
            });
        });

        function promiseItem(offset) {
            return new Promise(function (resolve, reject) {
                var sql = 'select t.docdate AS "Дата ED274", ' + 't.opernum AS "Код ED273", ' + 'p.docdate AS "Дата документа", ' + 'p.docnum  AS "Номер документа", ' + 'p.paysum  AS "Сумма документа", ' + 'i.ed244_answercode, ' + 'i.ed244_purpose ' + 'FROM ESIDMESSAGE t, esid273doc a, payorder p, inesidmessage i ' + "where t.doctype = 273 " + "and t.opernum = a.esidopernum " + "AND p.opernum = a.payopernum " + "AND i.edtype = 'ED274' " + "and i.eddate >= to_date(:dateFrom, 'mm.dd.yyyy') " + "and i.eddate <= to_date(:dateTo, 'mm.dd.yyyy') " + "AND a.edno = MOD(i.ed243_edno / 1000, 1) * 1000" + "AND i.ed243_eddate = a.eddate";

                sql = "SELECT * FROM (SELECT A.*, ROWNUM AS MY_RNUM FROM" + "(" + sql + ") A " + "WHERE ROWNUM <= :maxnumrows + :offset) WHERE MY_RNUM > :offset";

                dbOrcl.doConnect().then(function (connection) {
                    return dbOrcl.doExecuteArr(connection, sql, _extends({}, arrDate, {
                        offset: offset,
                        maxnumrows: mymaxnumrows
                    })).then(function (result) {
                        metaData = result.metaData.map(function (el) {
                            return (0, _util.jsUcfirst)(el.name);
                        }).map(function (el) {
                            return (0, _util.nonSpecialSymbol)(el);
                        });
                        metaData.pop();
                        var arrRows = [];

                        function processResultSet() {
                            result.resultSet.getRow().then(function (row) {
                                if (!row) {
                                    dbOrcl.doCloseResultSet(result.resultSet);
                                    return resolve(arrRows);
                                }

                                var data = row.map(function (el) {
                                    return (0, _util.nonSpecialSymbol)(el);
                                });
                                data.pop();
                                arrRows.push(data);

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
        }

        var promiseTotalResult = new Promise(function (resolve, reject) {
            promiseTotal.then(function (result) {
                var countPromise = Math.ceil(result / mymaxnumrows);
                var arrPromise = [];
                var myoffset = 0;

                for (var i = 1; i <= countPromise; i++) {
                    arrPromise.push(promiseItem(myoffset));
                    myoffset += mymaxnumrows;
                }

                resolve(arrPromise);
            }).catch(function (err) {
                reject(err);
            });
        });

        return new Promise(function (resolve, reject) {
            promiseTotalResult.then(function (arrPromise) {
                Promise.all(arrPromise).then(function (values) {
                    resolve({ rows: _.flattenDepth(values, 1), metaData: metaData });
                }).catch(function (err) {
                    reject(err);
                });
            });
        });
    };
};

exports.default = answersModel;
//# sourceMappingURL=answersModel.js.map