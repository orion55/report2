const xlsx = require('xlsx-populate');
const fs = require('fs');
const moment = require('moment');
import path from 'path';
import app from '../index';

export function saveXlsx(workbook) {
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
            fs.access(fileName, fs.F_OK, (err) => {
                if (!err) {
                    fs.unlinkSync(fileName);
                }
                workbook.toFileAsync(fileName)
                    .then(
                        resolve(fileName)
                    )
                    .catch(err => {
                        reject({status: 500, msg: "Error export to Excel", detail_msg: err.message});
                    })
            });
        });
    })
}

export function exportXlsx(rows, headers = []) {
    return new Promise((resolve, reject) => {
        xlsx.fromBlankAsync()
            .then(workbook => {
                workbook.sheet("Sheet1").cell("A1").value("This is neat!");
                return saveXlsx(workbook)
            })
            .catch(err => {
                reject({status: 500, msg: "Error export to Excel", detail_msg: err.message});
            })
    })
}
