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
        console.log("Sorry, no DB config");
}

let oracleDb = require('oracledb');

export default class Db {
    doConnect = () => oracleDb.getConnection(config.db);
    doExecuteArr = (connect, sql, arrDate) => connect.execute(sql, arrDate, {resultSet: true, prefetchRows: 1});
    doClose = (connect) => connect.close();
    doCloseResultSet = (resultSet) => resultSet.close();
}
