'use strict';

var async = require('async');
var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');

var doconnect = function doconnect(cb) {
    oracledb.getConnection({
        user: dbConfig.user,
        password: dbConfig.password,
        connectString: dbConfig.connectString
    }, cb);
};

var dorelease = function dorelease(conn) {
    conn.close(function (err) {
        if (err) console.error(err.message);
    });
};

// Default Array Output Format
var doquery_array = function doquery_array(conn, cb) {
    var sql = 'select t.docdate AS "Дата ED274", ' + 't.opernum AS "Код ED273", ' + 'p.docdate AS "Дата документа", ' + 'p.docnum  AS "Номер документа", ' + 'p.paysum  AS "Сумма документа", ' + 'i.ed244_answercode, ' + 'i.ed244_purpose ' + 'FROM ESIDMESSAGE t, esid273doc a, payorder p, inesidmessage i ' + "where t.doctype = 273 " + "and t.opernum = a.esidopernum " + "AND p.opernum = a.payopernum " + "AND i.edtype = 'ED274' " + "and i.eddate >= to_date('01.01.2017', 'mm.dd.yyyy') " + "and i.eddate <= to_date('02.01.2017', 'mm.dd.yyyy') " + "AND MOD(i.ed243_edno / 1000, 1) * 1000 = a.edno " + "AND i.ed243_eddate = a.eddate";
    conn.execute(sql, function (err, result) {
        if (err) {
            return cb(err, conn);
        } else {
            console.log("----- Cities beginning with 'S' (default ARRAY output format) --------");
            console.log(result.rows);
            return cb(null, conn);
        }
    });
};

// Optional Object Output Format
var doquery_object = function doquery_object(conn, cb) {
    var sql = 'select t.docdate          AS "Дата ED274", ' + 't.opernum AS "Код ED273", ' + 'p.docdate AS "Дата документа", ' + 'p.docnum  AS "Номер документа", ' + 'p.paysum  AS "Сумма документа", ' + 'i.ed244_answercode, ' + 'i.ed244_purpose ' + 'FROM ESIDMESSAGE t, esid273doc a, payorder p, inesidmessage i ' + 'where t.doctype = 273 ' + 'and t.opernum = a.esidopernum ' + 'AND p.opernum = a.payopernum ' + "AND i.edtype = 'ED274' " + "and i.eddate >= to_date('01.01.17', 'dd.mm.yyyy') " + "and i.eddate <= to_date('02.01.17', 'dd.mm.yyyy') " + 'AND MOD(i.ed243_edno / 1000, 1) * 1000 = a.edno ' + 'AND i.ed243_eddate = a.eddate';
    conn.execute(sql, {}, // A bind variable parameter is needed to disambiguate the following options parameter
    // otherwise you will get Error: ORA-01036: illegal variable name/number
    { outFormat: oracledb.OBJECT }, // outFormat can be OBJECT or ARRAY.  The default is ARRAY
    function (err, result) {
        if (err) {
            return cb(err, conn);
        } else {
            console.log("----- Cities beginning with 'S' (OBJECT output format) --------");
            console.log(result.rows);
            return cb(null, conn);
        }
    });
};

async.waterfall([doconnect, doquery_array], function (err, conn) {
    if (err) {
        console.error("In waterfall error cb: ==>", err, "<==");
    }
    if (conn) dorelease(conn);
});
//# sourceMappingURL=select2.js.map