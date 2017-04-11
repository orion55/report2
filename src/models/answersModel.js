import Db from './db';

let dbOrcl = new Db();
const numRows = 100;

export default class answersModel {
    getReport2 = () => {
        return new Promise((resolve, reject) => {
            let sql = 'select * from X$USERS t order by xu$name';
            dbOrcl.doConnect()
                .then(connection => {
                    dbOrcl.doExecuteArr(connection, sql)
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
                                        }
                                    )
                                    .catch(err => {
                                        dbOrcl.doCloseResultSet(result.resultSet)
                                            .then(dbOrcl.doClose(connection)
                                                .then(reject({
                                                    status: 500, message: "Error getting row",
                                                    detailed_message: err.message
                                                }))
                                            )

                                    });
                            }

                            processResultSet();
                        })
                        .catch(err => {
                            dbOrcl.doClose(connection);
                            reject({status: 500, message: "Error getting data", detailed_message: err.message});
                        });
                })
                .catch(err => {
                    reject({status: 500, message: "Error connecting to DB", detailed_message: err.message});
                });
        })
    }
}