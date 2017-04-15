app.post('/writeEmployeeDataExcel', function (req, res) {
    if (req.body.length > 0) {
        console.log('here');
        let data = req.body;
        let index = ['title', 'first_name', 'last_name', 'email', 'dateofbirth', 'hire_date'];
        let filename = "newemployeesheet.xlsx";
        let workbook = Workbook.fromFile("../client/app/downloads/employeeTemp.xlsx", function (err, workbook) {
            if (err) return res.status(500).send(err);
            let sheet = workbook.getSheet(0);
            let i = 0;
            for (let rowNum = 2; rowNum < parseInt(data.length) + 2; rowNum++) {
                let row = sheet.getRow(rowNum);
                for (let colNum = 1; colNum < parseInt(index.length) + 1; colNum++) {
                    let cell = row.getCell(colNum);
                    let exceldata = '';
                    if ((index[colNum - 1] === 'dateofbirth' || index[colNum - 1] === 'hire_date') && typeof data[i][index[colNum - 1]] !== 'undefined') {
                        let dateNow = new Date(data[i][index[colNum - 1]]);
                        let dd = dateNow.getDate() < 10 ? '0' + dateNow.getDate() : dateNow.getDate();
                        let monthSingleDigit = dateNow.getMonth() + 1;
                        let mm = monthSingleDigit < 10 ? '0' + monthSingleDigit : monthSingleDigit;
                        let yy = dateNow.getFullYear().toString();
                        exceldata = date = dd + '/' + mm + '/' + yy;
                    } else {
                        exceldata = data[i][index[colNum - 1]];
                    }

                    cell.setValue(exceldata);
                }
                i++;
            }

            workbook.toFileSync("../client/app/downloads/" + filename);
            res.status(200).send({'name': filename});
            fs.exists("../client/app/downloads/" + filename, function (exists) {
                if (exists) {
                    fs.unlink("../client/app/downloads/" + filename);
                }
                workbook.toFileSync("../client/app/downloads/" + filename);
                res.status(200).send({'name': filename});

            });

        });
    }
});