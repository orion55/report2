import Db from './db';
import {jsUcfirst} from '../util';

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
                    "AND MOD(i.ed243_edno / 1000, 1) * 1000 = a.edno " +
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
                                            return resolve({rows: arrRows, metaData: metaData});
                                        }
                                        arrRows.push(row);
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
}