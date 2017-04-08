let config;

if (process.env.NODE_ENV === 'home') {
    config = require('../configHome.json');
}
if (process.env.NODE_ENV === 'work') {
    config = require('../config.json');
}

let oracleDb = require('oracledb');

export default class Db {
    doConnect = (cb) => oracleDb.getConnection(config.db, cb);
    doExecuteArr = (connect, sql, cb) => connect.execute(sql, [], cb);
    doRelease = (connect, cb) => connect.doRelease(cb);
}
