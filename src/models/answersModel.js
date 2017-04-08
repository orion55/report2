import Db from './db';

let dbOrcl = new Db();

export default class answersController {
    getReport(cb) {
        dbOrcl.doConnect(function (err, connection) {
            if (err) {
                cb({status: 500, message: "Error connecting to DB", detailed_message: err.message}, null);
            }
            let sql = 'select * from X$USERS t order by xu$name';
            dbOrcl.doExecuteArr(connection, sql, function (err, result) {
                    if (err) {
                        cb({status: 500, message: "Error getting data", detailed_message: err.message}, null);
                    } else {
                        dbOrcl.doRelease(connection, function (err) {
                            if (err) {
                                cb({status: 500, message: "Error doRelease", detailed_message: err.message}, null);
                            } else {
                                cb(null, result);
                            }
                        });

                    }
                }
            )
        })
    }
}