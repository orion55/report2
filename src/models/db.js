let config = '';

switch (process.env.NODE_ENV) {
    case 'home':
        config = require('../config/configDbHome.json');
        break;
    case 'work':
        config = require('../config/configDb.json');
        break;
    case 'prodaction':
        config = require('../config/configDbProd.json');
        break;
    default:
        config = require('../config/configDbProd.json');
}

let oracleDb = require('oracledb');

export default class Db {
    doConnect = () => oracleDb.getConnection(config.db);
    doExecuteArr = (connect, sql, arr) => connect.execute(sql, arr, {resultSet: true, prefetchRows: 1});
    doExecute = (connect, sql, arr) => connect.execute(sql, arr, {prefetchRows: 1});
    doClose = (connect) => connect.close();
    doCloseResultSet = (resultSet) => resultSet.close();
}
