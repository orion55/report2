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
                    if (headers !== []) {
                        for (let i = 0; i < headers.length; i++) {
                            Sheet.row(1).cell(i + 1).value(headers[i]);
                        }
                    }
                    this.saveXlsx(workbook)
                        .then(fileUrl => resolve({status: 200, fileUrl: fileUrl}))
                })
                .catch(err => {
                    reject({status: 500, msg: "Error export to Excel", detail_msg: err.message});
                })
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
                                .forEach(file => fs.unlinkSync(path.join(reportPath, file)));
                        }
                    });
                }
                const now = moment().format("DDMMYYYY");
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

