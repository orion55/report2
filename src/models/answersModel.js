import Db from './db';
import {jsUcfirst, nonSpecialSymbol} from '../util';
let _ = require('lodash');

let dbOrcl = new Db();

export default class answersModel {
    getReport = (arrDate) => {
        return new Promise((resolve, reject) => {
            let sql = '';

            if (process.env.NODE_ENV === 'home') {
                sql = `select t.operdate,
                     t.closedate,
                     t.closeday,
                     t.closetime,
                     t.usercodeopen,
                     t.usercodeclose,
                     t.unloadseqdel,
                     t.unloadseqback,
                     t.btrv_address,
                     t.rowver
                     from operdays t
                     where t.operdate >= to_date(:dateFrom, 'mm.dd.yyyy')
                     and t.operdate <= to_date(:dateTo, 'mm.dd.yyyy')
                     order by t.operdate asc`;
            } else {
                sql = 'select t.docdate AS "Дата ED274", ' +
                    't.opernum AS "Код ED273", ' +
                    'p.docdate AS "Дата документа", ' +
                    'p.docnum  AS "Номер документа", ' +
                    'p.paysum  AS "Сумма документа", ' +
                    'i.ed244_answercode, ' +
                    'i.ed244_purpose ' +
                    'FROM ESIDMESSAGE t, esid273doc a, payorder p, inesidmessage i ' +
                    "where t.doctype = 273 " +
                    "and t.opernum = a.esidopernum " +
                    "AND p.opernum = a.payopernum " +
                    "AND i.edtype = 'ED274' " +
                    "and i.eddate >= to_date(:dateFrom, 'mm.dd.yyyy') " +
                    "and i.eddate <= to_date(:dateTo, 'mm.dd.yyyy') " +
                    "AND a.edno = MOD(i.ed243_edno / 1000, 1) * 1000" +
                    "AND i.ed243_eddate = a.eddate";
            }
            dbOrcl.doConnect()
                .then(connection => {
                    return dbOrcl.doExecuteArr(connection, sql, arrDate)
                        .then(result => {
                            let arrRows = [];
                            const metaData = result.metaData.map(el => jsUcfirst(el.name));

                            function processResultSet() {
                                result.resultSet.getRow()
                                    .then(row => {
                                        if (!row) {
                                            dbOrcl.doCloseResultSet(result.resultSet);
                                            // console.log(arrRows.length);
                                            return resolve({rows: arrRows, metaData: metaData});
                                        }
                                        arrRows.push(row.map(el => nonSpecialSymbol(el)));
                                        processResultSet();
                                    })
                            }

                            processResultSet();
                        })
                        .catch(err => {
                            dbOrcl.doClose(connection);
                            reject({status: 500, msg: "Error getting data", detail_msg: err.message});
                        })
                })
                .catch(err => {
                    reject({status: 500, msg: "Error connecting to DB", detail_msg: err.message});
                });
        })
    };

    getReport2 = (arrDate) => {
        const mymaxnumrows = 100;
        let metaData = [];

        let promiseTotal = new Promise((resolve, reject) => {
            let sql = 'select COUNT(t.docdate) "Total"' +
                'FROM ESIDMESSAGE t, esid273doc a, payorder p, inesidmessage i ' +
                "where t.doctype = 273 " +
                "and t.opernum = a.esidopernum " +
                "AND p.opernum = a.payopernum " +
                "AND i.edtype = 'ED274' " +
                "and i.eddate >= to_date(:dateFrom, 'mm.dd.yyyy') " +
                "and i.eddate <= to_date(:dateTo, 'mm.dd.yyyy') " +
                "AND a.edno = MOD(i.ed243_edno / 1000, 1) * 1000" +
                "AND i.ed243_eddate = a.eddate";
            dbOrcl.doConnect()
                .then(connection => {
                    return dbOrcl.doExecute(connection, sql, arrDate)
                        .then(result => {
                            resolve(result.rows[0][0]);
                        })
                        .catch(err => {
                            dbOrcl.doClose(connection);
                            reject({status: 500, msg: "Error getting data", detail_msg: err.message});
                        })
                })
                .catch(err => {
                    reject({status: 500, msg: "Error connecting to DB", detail_msg: err.message});
                });
        });

        function promiseItem(offset) {
            return new Promise((resolve, reject) => {
                let sql = 'select t.docdate AS "Дата ED274", ' +
                    't.opernum AS "Код ED273", ' +
                    'p.docdate AS "Дата документа", ' +
                    'p.docnum  AS "Номер документа", ' +
                    'p.paysum  AS "Сумма документа", ' +
                    'i.ed244_answercode, ' +
                    'i.ed244_purpose ' +
                    'FROM ESIDMESSAGE t, esid273doc a, payorder p, inesidmessage i ' +
                    "where t.doctype = 273 " +
                    "and t.opernum = a.esidopernum " +
                    "AND p.opernum = a.payopernum " +
                    "AND i.edtype = 'ED274' " +
                    "and i.eddate >= to_date(:dateFrom, 'mm.dd.yyyy') " +
                    "and i.eddate <= to_date(:dateTo, 'mm.dd.yyyy') " +
                    "AND a.edno = MOD(i.ed243_edno / 1000, 1) * 1000" +
                    "AND i.ed243_eddate = a.eddate";

                sql = "SELECT * FROM (SELECT A.*, ROWNUM AS MY_RNUM FROM"
                    + "(" + sql + ") A "
                    + "WHERE ROWNUM <= :maxnumrows + :offset) WHERE MY_RNUM > :offset";

                dbOrcl.doConnect()
                    .then(connection => {
                        return dbOrcl.doExecuteArr(connection, sql, {
                            ...arrDate,
                            offset: offset,
                            maxnumrows: mymaxnumrows
                        })
                            .then(result => {
                                metaData = result.metaData.map(el => jsUcfirst(el.name)).map(el => nonSpecialSymbol(el));
                                metaData.pop();
                                let arrRows = [];

                                function processResultSet() {
                                    result.resultSet.getRow()
                                        .then(row => {
                                            if (!row) {
                                                dbOrcl.doCloseResultSet(result.resultSet);
                                                return resolve(arrRows);
                                            }

                                            let data = row.map(el => nonSpecialSymbol(el));
                                            data.pop();
                                            arrRows.push(data);

                                            processResultSet();
                                        })
                                }

                                processResultSet();
                            })
                            .catch(err => {
                                dbOrcl.doClose(connection);
                                reject({status: 500, msg: "Error getting data", detail_msg: err.message});
                            })
                    })
                    .catch(err => {
                        reject({status: 500, msg: "Error connecting to DB", detail_msg: err.message});
                    });
            });
        }

        let promiseTotalResult = new Promise(function (resolve, reject) {
            promiseTotal
                .then(result => {
                    const countPromise = Math.ceil(result / mymaxnumrows);
                    let arrPromise = [];
                    let myoffset = 0;

                    for (let i = 1; i <= countPromise; i++) {
                        arrPromise.push(promiseItem(myoffset));
                        myoffset += mymaxnumrows;
                    }

                    resolve(arrPromise);
                })
                .catch(err => {
                    reject(err);
                });
        });

        return new Promise(function (resolve, reject) {
            promiseTotalResult
                .then(arrPromise => {
                    Promise.all(arrPromise)
                        .then(values => {
                            resolve({rows: _.flattenDepth(values, 1), metaData: metaData});
                        })
                        .catch(err => {
                            reject(err);
                        });
                });
        });
    };
}