const xlsx = require('xlsx-populate');
const fs = require('fs');
const moment = require('moment');
import path from 'path';
import app from '../index';

export default class xlsxModel {
    exportXlsx = (rows, headers = []) => {
        return new Promise((resolve, reject) => {
            xlsx.fromBlankAsync()
                .then(workbook => {
                    const Sheet = workbook.sheet(0);
                    let numRow = 1;

                    if (headers !== []) {
                        for (let i = 0; i < headers.length; i++) {
                            Sheet.row(numRow).cell(i + 1).value(headers[i]);
                        }
                    }

                    numRow++;
                    const startCell = Sheet.row(numRow).cell(1);
                    const endCell = Sheet.row(numRow + rows.length - 1).cell(headers.length);
                    const range = Sheet.range(startCell, endCell);
                    range.value(rows);

                    this.saveXlsx(workbook)
                        .then(fileUrl => resolve({status: 200, fileUrl: fileUrl}))
                })
                .catch(err =>
                    reject({status: 500, msg: "Error export to Excel", detail_msg: err.message})
                )
        })
    };

    saveXlsx = (workbook) => {
        return new Promise((resolve, reject) => {
            const reportPath = path.join(app.get('docsPath'), 'report');

            fs.access(reportPath, fs.F_OK, (err) => {
                if (err) {
                    fs.mkdirSync(reportPath)
                } else {
                    fs.readdir(reportPath, (err, files) => {
                        if (!err) {
                            files.filter(file => path.extname(file) === '.xlsx')
                                .forEach(file => {
                                    fs.unlink(path.join(reportPath, file), (err) => {
                                        if (err) console.log(err.message)
                                    })
                                });
                        }
                    });
                }

                const now = moment().format("DDMMYYYY-HHmmss");
                let fileName = path.join(reportPath, 'report' + now + '.xlsx');
                const fileUrl = 'report/report' + now + '.xlsx';
                workbook.toFileAsync(fileName)
                    .then(
                        resolve(fileUrl)
                    )
                    .catch(err => {
                        reject({status: 500, msg: "Error export to Excel", detail_msg: err.message});
                    })

            });

        })
    }
}

