'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ALPHA = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

var writeToExcel = function writeToExcel(objects, selectedFields, spreadsheetName) {

    var self = undefined;

    try {
        var rowsOfData = objects;
        var lineNum = 1;
        var worksheetColumns = [];

        _.forEach(selectedFields, function () {
            worksheetColumns.push({ wch: 25 });
        });

        var workbook = {
            SheetNames: [spreadsheetName],
            Sheets: _defineProperty({}, spreadsheetName, {
                '!ref': 'A1:',
                '!cols': worksheetColumns
            })
        };

        for (var i = 0; i < selectedFields.length; i++) {
            worksheetColumns.push({ wch: 25 });
            var currentCell = self._calculateCurrentCellReference(i, lineNum);
            workbook.Sheets[spreadsheetName][currentCell] = {
                t: "s",
                v: selectedFields[i].displayName,
                s: { font: { bold: true } }
            };
        }

        lineNum++;

        rowsOfData.forEach(function (offer) {
            var fieldMap = self._transformFieldsAndMapToColumnNames(offer);
            for (var _i = 0; _i < selectedFields.length; _i++) {
                var displayValue = fieldMap[selectedFields[_i].displayName];
                var _currentCell = self._calculateCurrentCellReference(_i, lineNum);
                workbook.Sheets[spreadsheetName][_currentCell] = {
                    t: "s",
                    v: displayValue,
                    s: {
                        font: { sz: "11", bold: false },
                        alignment: { wrapText: true, vertical: 'top' },
                        fill: { fgColor: { rgb: 'ffffff' } },
                        border: {
                            left: { style: 'thin', color: { auto: 1 } },
                            right: { style: 'thin', color: { auto: 1 } },
                            top: { style: 'thin', color: { auto: 1 } },
                            bottom: { style: 'thin', color: { auto: 1 } }
                        }
                    }
                };
            }
            lineNum++;
        });

        var lastColumnInSheet = selectedFields.length - 1;
        var endOfRange = self._calculateCurrentCellReference(lastColumnInSheet, lineNum);
        workbook.Sheets[spreadsheetName]['!ref'] += endOfRange;
        var fileName = spreadsheetName + '.xlsx';
        var workbookOutput = xlsx.write(workbook, { bookSST: true, type: 'binary' });

        var s2ab = function s2ab(s) {
            var buffer = new ArrayBuffer(s.length);
            var view = new Uint8Array(buffer);
            for (var _i2 = 0; _i2 !== s.length; ++_i2) {
                view[_i2] = s.charCodeAt(_i2) & 0xFF;
            }
            return buffer;
        };

        saveAs(new undefined.$window.Blob([s2ab(workbookOutput)], { type: "application/octet-stream" }), fileName);
        self.excelFinished = false;
        self.excelProjects = [];
        self.exceloffset = 0;
    } catch (e) {
        console.log('Error in Excel Save: ' + e.message);
    }
};

var _calculateCurrentCellReference = function _calculateCurrentCellReference(index, lineNumber) {
    return index > 25 ? ALPHA[Math.floor(index / 26 - 1)] + ALPHA[index % 26] + lineNumber : ALPHA[index] + lineNumber;
};

var _longFormCalculateCurrentCellReference = function _longFormCalculateCurrentCellReference(index, lineNumber) {
    var currentCellReference = '';
    var alphaVal = '';
    if (index > 25) {
        var firstLetterVal = Math.floor(index / 26 - 1);
        var secondLetterVal = index % 26;
        alphaVal = ALPHA[firstLetterVal] + ALPHA[secondLetterVal];
        currentCellReference = alphaVal + lineNumber;
    } else {
        alphaVal = ALPHA[index];
        currentCellReference = alphaVal + lineNumber;
    }
    return currentCellReference;
};
//# sourceMappingURL=excel.js.map