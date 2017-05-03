var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');
var numRows = 10;  // number of rows to return from each call to getRows()

oracledb.getConnection(
    {
        user: dbConfig.user,
        password: dbConfig.password,
        connectString: dbConfig.connectString
    },
    function (err, connection) {
        if (err) {
            console.error(err.message);
            return;
        }

        var sql = 'select t.docdate AS "Дата ED274", ' +
            't.opernum AS "Код ED273", ' +
            'p.docdate AS "Дата документа", ' +
            'p.docnum  AS "Номер документа", ' +
            'p.paysum  AS "Сумма документа", ' +
            'i.ed244_answercode, ' +
            'i.ed244_purpose ' +
            'FROM ESIDMESSAGE t, esid273doc a, payorder p, inesidmessage i ' +
            "where t.doctype = 273 " +
            "and t.opernum = a.esidopernum " +
            "AND p.opernum = a.payopernum " +
            "AND i.edtype = 'ED274' " +
            "and i.eddate >= to_date('04.01.2017', 'mm.dd.yyyy') " +
            "and i.eddate <= to_date('04.30.2017', 'mm.dd.yyyy') " +
            "AND MOD(i.ed243_edno / 1000, 1) * 1000 = a.edno " +
            "AND i.ed243_eddate = a.eddate";

        connection.execute(
            sql,
            [], // no bind variables
            {
                resultSet: true, // return a result set.  Default is false
                prefetchRows: 10 // the prefetch size can be set for each query
            },
            function (err, result) {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }
                // console.log(result);
                fetchRowsFromRS(connection, result.resultSet, numRows);
            });
    });

function fetchRowsFromRS(connection, resultSet, numRows) {
    resultSet.getRows(
        numRows,  // get this many rows
        function (err, rows) {
            if (err) {
                console.error(err);
                doClose(connection, resultSet); // always close the result set
            } else if (rows.length > 0) {
                console.log("fetchRowsFromRS(): Got " + rows.length + " rows");
                // console.log(rows);
                if (rows.length === numRows) // might be more rows
                    fetchRowsFromRS(connection, resultSet, numRows);
                else
                    doClose(connection, resultSet); // always close the result set
            } else { // no rows
                doClose(connection, resultSet); // always close the result set
            }
        });
}

function doRelease(connection) {
    connection.close(
        function (err) {
            if (err) {
                console.error(err.message);
            }
        });
}

function doClose(connection, resultSet) {
    resultSet.close(
        function (err) {
            if (err) {
                console.error(err.message);
            }
            doRelease(connection);
        });
}
