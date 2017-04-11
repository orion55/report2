import Db from './db';

let dbOrcl = new Db();

export default class answersModel {
    getReport = () => {
        return new Promise((resolve, reject) => {
            let sql = 'select * from X$USERS t order by xu$name';
            dbOrcl.doConnect()
                .then(connection => {
                    return dbOrcl.doExecuteArr(connection, sql)
                        .then(result => {
                            let arrRows = [];

                            function processResultSet() {
                                result.resultSet.getRow()
                                    .then(row => {
                                        if (!row) {
                                            dbOrcl.doCloseResultSet(result.resultSet);
                                            return resolve(arrRows);
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