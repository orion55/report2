let config;

if (process.env.NODE_ENV === 'home') {
    config = require('../config/configDbHome.json');
}
if (process.env.NODE_ENV === 'work') {
    config = require('../config/configDb.json');
}

let oracleDb = require('oracledb');

export default class Db {
    doConnect = () => oracleDb.getConnection(config.db);
    doExecuteArr = (connect, sql, arrDate) => connect.execute(sql, arrDate, {resultSet: true});
    // doExecuteArr = (connect, sql, arrDate) => connect.execute(sql, [], {resultSet: true});
    doClose = (connect) => connect.close();
    doCloseResultSet = (resultSet) => resultSet.close();
}
