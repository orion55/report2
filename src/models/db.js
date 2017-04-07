import config from '../config.json';
let oracleDb = require('oracledb');

export default class Db {
    connect = (cb) => oracleDb.getConnection(config.db, cb);
    executeObj = (connect, sql, cb) => connect.execute(sql, {outFormat: oracledb.OBJECT}, cb(err, result));
}
