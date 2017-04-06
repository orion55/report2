let oracleDb = require('oracledb');
import config from '../config.json';

export default class Db {
    connect = (cb) => oracleDb.getConnection(config.db, cb);

}
