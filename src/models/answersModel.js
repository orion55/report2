import Db from './db';
import {jsUcfirst} from '../util';

let dbOrcl = new Db();

export default class answersModel {
    getReport = (arrDate) => {
        return new Promise((resolve, reject) => {
            // let sql = 'select * from X$USERS t order by xu$name';
            const sql = `select t.operdate,
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