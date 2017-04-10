'use strict';

/* Copyright (c) 2015, 2016, Oracle and/or its affiliates. All rights reserved. */

/******************************************************************************
 *
 * You may not use the identified files except in compliance with the Apache
 * License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * NAME
 *   select2.js
 *
 * DESCRIPTION
 *   Executes queries to show array and object output formats.
 *   Gets results directly without using a ResultSet.
 *   Uses Oracle's sample HR schema.
 *
 *   Scripts to create the HR schema can be found at:
 *   https://github.com/oracle/db-sample-schemas
 *
 *  *****************************************************************************/

var async = require('async');
var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');

// Properties are applicable to all connections and SQL executions.
// They can also be set or overridden at the individual execute() call level
//
// This script sets outFormat in the execute() call but it could be set here instead:
// oracledb.outFormat = oracledb.OBJECT;

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
    conn.execute("select * from X$USERS t order by xu$name", function (err, result) {
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
    conn.execute("select * from X$USERS t order by xu$name", {}, // A bind variable parameter is needed to disambiguate the following options parameter
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

async.waterfall([doconnect, doquery_array, doquery_object], function (err, conn) {
    if (err) {
        console.error("In waterfall error cb: ==>", err, "<==");
    }
    if (conn) dorelease(conn);
});
//# sourceMappingURL=select2.js.map