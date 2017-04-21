'use strict';

app.post('/writeEmployeeDataExcel', function (req, res) {
    if (req.body.length > 0) {
        console.log('here');
        var data = req.body;
        var index = ['title', 'first_name', 'last_name', 'email', 'dateofbirth', 'hire_date'];
        var filename = "newemployeesheet.xlsx";
        var workbook = Workbook.fromFile("../client/app/downloads/employeeTemp.xlsx", function (err, workbook) {
            if (err) return res.status(500).send(err);
            var sheet = workbook.getSheet(0);
            var i = 0;
            for (var rowNum = 2; rowNum < parseInt(data.length) + 2; rowNum++) {
                var row = sheet.getRow(rowNum);
                for (var colNum = 1; colNum < parseInt(index.length) + 1; colNum++) {
                    var cell = row.getCell(colNum);
                    var exceldata = '';
                    if ((index[colNum - 1] === 'dateofbirth' || index[colNum - 1] === 'hire_date') && typeof data[i][index[colNum - 1]] !== 'undefined') {
                        var dateNow = new Date(data[i][index[colNum - 1]]);
                        var dd = dateNow.getDate() < 10 ? '0' + dateNow.getDate() : dateNow.getDate();
                        var monthSingleDigit = dateNow.getMonth() + 1;
                        var mm = monthSingleDigit < 10 ? '0' + monthSingleDigit : monthSingleDigit;
                        var yy = dateNow.getFullYear().toString();
                        exceldata = date = dd + '/' + mm + '/' + yy;
                    } else {
                        exceldata = data[i][index[colNum - 1]];
                    }

                    cell.setValue(exceldata);
                }
                i++;
            }

            workbook.toFileSync("../client/app/downloads/" + filename);
            res.status(200).send({ 'name': filename });
            fs.exists("../client/app/downloads/" + filename, function (exists) {
                if (exists) {
                    fs.unlink("../client/app/downloads/" + filename);
                }
                workbook.toFileSync("../client/app/downloads/" + filename);
                res.status(200).send({ 'name': filename });
            });
        });
    }
});
//# sourceMappingURL=excel1.js.map