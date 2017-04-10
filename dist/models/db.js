'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var config = void 0;

if (process.env.NODE_ENV === 'home') {
    config = require('../config/configHome.json');
}
if (process.env.NODE_ENV === 'work') {
    config = require('../config/config.json');
}

var oracleDb = require('oracledb');

var Db = function Db() {
    _classCallCheck(this, Db);

    this.doConnect = function () {
        return oracleDb.getConnection(config.db);
    };

    this.doExecuteArr = function (connect, sql) {
        return connect.execute(sql, []);
    };

    this.doClose = function (connect) {
        return connect.close();
    };
}
/*doConnect = (cb) => oracleDb.getConnection(config.db, cb);
doExecuteArr = (connect, sql, cb) => connect.execute(sql, [], cb);
doRelease = (connect, cb) => connect.doRelease(cb);*/
;

exports.default = Db;
//# sourceMappingURL=db.js.map