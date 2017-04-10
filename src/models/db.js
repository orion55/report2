let config;

if (process.env.NODE_ENV === 'home') {
    config = require('../config/configHome.json');
}
if (process.env.NODE_ENV === 'work') {
    config = require('../config/config.json');
}

let oracleDb = require('oracledb');

export default class Db {
    /*doConnect = (cb) => oracleDb.getConnection(config.db, cb);
    doExecuteArr = (connect, sql, cb) => connect.execute(sql, [], cb);
    doRelease = (connect, cb) => connect.doRelease(cb);*/
    doConnect = () => oracleDb.getConnection(config.db);
    doExecuteArr = (connect, sql) => connect.execute(sql, []);
    doClose= (connect) => connect.close();
}
