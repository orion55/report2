import Db from './db';

let dbOrcl = new Db();

export default class answersModel {
    getReport2 = () => {
        return new Promise((resolve, reject) => {
            let sql = 'select * from X$USERS t order by xu$name';
            dbOrcl.doConnect()
                .then(connection => {
                    dbOrcl.doExecuteArr(connection, sql)
                        .then(result => {
                            dbOrcl.doClose(connection);
                            resolve(result);
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