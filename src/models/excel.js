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

                    if (process.env.NODE_ENV === 'home') {
                        this.formatXlsx(workbook, headers.length, rows.length)
                    } else {
                        this.formatXlsx2(workbook, headers.length, rows.length)
                    }

                    this.saveXlsx(workbook)
                        .then(fileUrl => resolve({status: 200, fileUrl: fileUrl}))
                })
                .catch(err =>
                    reject({status: 500, msg: "Error export to Excel", detail_msg: err.message})
                )
        })
    };

    formatXlsx = (workbook, maxHeaders, maxRows) => {
        const Sheet = workbook.sheet(0);
        let Range = Sheet.range(1, 1, 1, maxHeaders);
        Range.style("fontColor", "ffffff").style("fill", "4F81BD").style("bold", true);

        for (let i = 2; i <= maxRows + 1; i++) {
            Range = Sheet.range(i, 1, i, maxHeaders);
            if (i % 2) {
                Range
                    .style("fill", "FFFFFF")
                    .style("fontColor", "000000")
                    .style("bottomBorder", true)
                    .style("borderColor", "95B3D7");
            } else {
                Range
                    .style("fill", "DCE6F1")
                    .style("fontColor", "000000")
                    .style("bottomBorder", true)
                    .style("borderColor", "95B3D7");
            }
        }

        Range = Sheet.range(2, 1, maxRows + 1, 1);
        Range.style("numberFormat", "dd.mm.yyyy");
        Range = Sheet.range(2, 2, maxRows + 1, 2);
        Range.style("numberFormat", "dd.mm.yyyy");

        for (let i = 1; i <= maxHeaders; i++) {
            Sheet.column(i).width(12);
        }
    };

    formatXlsx2 = (workbook, maxHeaders, maxRows) => {
        const Sheet = workbook.sheet(0);
        let Range = Sheet.range(1, 1, 1, maxHeaders);
        Range.style("fontColor", "ffffff").style("fill", "4F81BD").style("bold", true);

        for (let i = 2; i <= maxRows + 1; i++) {
            Range = Sheet.range(i, 1, i, maxHeaders);
            if (i % 2) {
                Range
                    .style("fill", "FFFFFF")
                    .style("fontColor", "000000")
                    .style("bottomBorder", true)
                    .style("borderColor", "95B3D7");
            } else {
                Range
                    .style("fill", "DCE6F1")
                    .style("fontColor", "000000")
                    .style("bottomBorder", true)
                    .style("borderColor", "95B3D7");
            }
        }

        Range = Sheet.range(2, 1, maxRows + 1, 1);
        Range.style("numberFormat", "dd.mm.yyyy");
        Range = Sheet.range(2, 3, maxRows + 1, 3);
        Range.style("numberFormat", "dd.mm.yyyy");
        Range = Sheet.range(2, 4, maxRows + 1, 4);
        Range.style("numberFormat", "0.00");
        Range = Sheet.range(2, 5, maxRows + 1, 5);
        Range.style("numberFormat", "0.00");

        for (let i = 1; i <= maxHeaders - 1; i++) {
            Range = Sheet.range(2, i, maxRows + 1, i);
            Range.style("horizontalAlignment", "center");
        }

        const arrWidth = [11, 11, 16, 17, 17, 17, 60];
        for (let i = 1; i <= maxHeaders; i++) {
            Sheet.column(i).width(arrWidth[i - 1]);
        }
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

