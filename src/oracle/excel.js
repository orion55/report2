const ALPHA = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
    'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

let writeToExcel = (objects, selectedFields, spreadsheetName) => {

    let self = this;

    try {
        let rowsOfData = objects;
        let lineNum = 1;
        let worksheetColumns = [];

        _.forEach(selectedFields, function () {
            worksheetColumns.push({wch: 25});
        });

        let workbook = {
            SheetNames: [spreadsheetName],
            Sheets: {
                [spreadsheetName]: {
                    '!ref': 'A1:',
                    '!cols': worksheetColumns
                }
            }
        };

        for (let i = 0; i < selectedFields.length; i++) {
            worksheetColumns.push({wch: 25});
            let currentCell = self._calculateCurrentCellReference(i, lineNum);
            workbook.Sheets[spreadsheetName][currentCell] = {
                t: "s",
                v: selectedFields[i].displayName,
                s: {font: {bold: true}}
            };
        }

        lineNum++;

        rowsOfData.forEach(function (offer) {
            let fieldMap = self._transformFieldsAndMapToColumnNames(offer);
            for (let i = 0; i < selectedFields.length; i++) {
                let displayValue = fieldMap[selectedFields[i].displayName];
                let currentCell = self._calculateCurrentCellReference(i, lineNum);
                workbook.Sheets[spreadsheetName][currentCell] = {
                    t: "s",
                    v: displayValue,
                    s: {
                        font: {sz: "11", bold: false},
                        alignment: {wrapText: true, vertical: 'top'},
                        fill: {fgColor: {rgb: 'ffffff'}},
                        border: {
                            left: {style: 'thin', color: {auto: 1}},
                            right: {style: 'thin', color: {auto: 1}},
                            top: {style: 'thin', color: {auto: 1}},
                            bottom: {style: 'thin', color: {auto: 1}}
                        }
                    }
                };
            }
            lineNum++;
        });

        let lastColumnInSheet = selectedFields.length - 1;
        let endOfRange = self._calculateCurrentCellReference(lastColumnInSheet, lineNum);
        workbook.Sheets[spreadsheetName]['!ref'] += endOfRange;
        let fileName = spreadsheetName + '.xlsx';
        let workbookOutput = xlsx.write(workbook, {bookSST: true, type: 'binary'});

        let s2ab = function (s) {
            let buffer = new ArrayBuffer(s.length);
            let view = new Uint8Array(buffer);
            for (let i = 0; i !== s.length; ++i) {
                view[i] = s.charCodeAt(i) & 0xFF;
            }
            return buffer;
        };

        saveAs(new this.$window.Blob([s2ab(workbookOutput)], {type: "application/octet-stream"}), fileName);
        self.excelFinished = false;
        self.excelProjects = [];
        self.exceloffset = 0;
    }
    catch (e) {
        console.log('Error in Excel Save: ' + e.message);
    }
};

let _calculateCurrentCellReference = (index, lineNumber) =>
    (index > 25) ? ALPHA[Math.floor((index / 26) - 1)] + ALPHA[index % 26] + lineNumber : ALPHA[index] + lineNumber;


let _longFormCalculateCurrentCellReference = (index, lineNumber) => {
    let currentCellReference = '';
    let alphaVal = '';
    if (index > 25) {
        let firstLetterVal = Math.floor((index / 26) - 1);
        let secondLetterVal = index % 26;
        alphaVal = ALPHA[firstLetterVal] + ALPHA[secondLetterVal];
        currentCellReference = alphaVal + lineNumber;
    } else {
        alphaVal = ALPHA[index];
        currentCellReference = alphaVal + lineNumber;
    }
    return currentCellReference;
};

