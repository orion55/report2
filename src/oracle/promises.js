/* Copyright (c) 2016, Oracle and/or its affiliates. All rights reserved. */

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
 *   promises.js
 *
 * DESCRIPTION
 *   Executes a basic query using promises instead of the callback pattern.
 *
 *   Scripts to create the HR schema can be found at:
 *   https://github.com/oracle/db-sample-schemas
 *
 *****************************************************************************/

var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');

oracledb.getConnection(
    {
        user: dbConfig.user,
        password: dbConfig.password,
        connectString: dbConfig.connectString
    })
    .then(function (connection) {
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
            "and i.eddate >= to_date('01.01.2017', 'mm.dd.yyyy') " +
            "and i.eddate <= to_date('02.01.2017', 'mm.dd.yyyy') " +
            "AND MOD(i.ed243_edno / 1000, 1) * 1000 = a.edno " +
            "AND i.ed243_eddate = a.eddate";
        return connection.execute(sql, [])
            .then(function (result) {
                console.log(result.metaData);
                console.log(result.rows);

                return connection.close();
            })
            .catch(function (err) {
                console.log(err.message);

                return connection.close();
            });
    })
    .catch(function (err) {
        console.error(err.message);
    });
