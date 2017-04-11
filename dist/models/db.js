'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var config = void 0;

if (process.env.NODE_ENV === 'home') {
    config = require('../config/configDbHome.json');
}
if (process.env.NODE_ENV === 'work') {
    config = require('../config/configDb.json');
}

var oracleDb = require('oracledb');

var Db = function Db() {
    _classCallCheck(this, Db);

    this.doConnect = function () {
        return oracleDb.getConnection(config.db);
    };

    this.doExecuteArr = function (connect, sql) {
        return connect.execute(sql, [], { resultSet: true });
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