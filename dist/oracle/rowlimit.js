'use strict';

var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');

var myoffset = 2; // number of rows to skip
var mymaxnumrows = 6; // number of rows to fetch

oracledb.getConnection({
    user: dbConfig.user,
    password: dbConfig.password,
    connectString: dbConfig.connectString
}, function (err, connection) {
    if (err) {
        console.error(err.message);
        return;
    }

    // var sql = "SELECT employee_id, last_name FROM employees ORDER BY employee_id";
    var sql = "select * from X$USERS t order by xu$name";
    if (connection.oracleServerVersion >= 1201000000) {
        // 12c row-limiting syntax
        sql += " OFFSET :offset ROWS FETCH NEXT :maxnumrows ROWS ONLY";
    } else {
        // Pre-12c syntax [could also customize the original query and use row_number()]
        sql = "SELECT * FROM (SELECT A.*, ROWNUM AS MY_RNUM FROM" + "(" + sql + ") A " + "WHERE ROWNUM <= :maxnumrows + :offset) WHERE MY_RNUM > :offset";
    }

    connection.execute(sql, { offset: myoffset, maxnumrows: mymaxnumrows }, { maxRows: 150 }, function (err, result) {
        if (err) {
            console.error(err.message);
        } else {
            console.log("Executed: " + sql);
            console.log("Number of rows returned: " + result.rows.length);
            console.log(result.rows);
        }
    });
});
//# sourceMappingURL=rowlimit.js.map