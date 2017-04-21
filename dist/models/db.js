'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var config = '';

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

var oracleDb = require('oracledb');

var Db = function Db() {
    _classCallCheck(this, Db);

    this.doConnect = function () {
        return oracleDb.getConnection(config.db);
    };

    this.doExecuteArr = function (connect, sql, arrDate) {
        return connect.execute(sql, arrDate, { resultSet: true, prefetchRows: 1 });
    };

    this.doClose = function (connect) {
        return connect.close();
    };

    this.doCloseResultSet = function (resultSet) {
        return resultSet.close();
    };
};

exports.default = Db;
//# sourceMappingURL=db.js.map