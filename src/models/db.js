let config;

if (process.env.NODE_ENV === 'home') {
    config = require('../config/configHome.json');
}
if (process.env.NODE_ENV === 'work') {
    config = require('../config/config.json');
}

let oracleDb = require('oracledb');

export default class Db {
    doConnect = () => oracleDb.getConnection(config.db);
    doExecuteArr = (connect, sql) => connect.execute(sql, [], {});
    doClose = (connect) => connect.close();
}
