"use strict";

/* eslint no-console:off */

// Load the input workbook from file.

var XlsxPopulate = require('xlsx-populate');

// Get template workbook and sheet.
XlsxPopulate.fromFileAsync('./template.xlsx').then(function (workbook) {
    // Randomly generate 10 rows of data.
    var sheet = workbook.sheet('ClickThroughRateSheet');
    sheet.range("B3:B13").value(function () {
        return parseInt(1e3 * Math.random());
    });
    sheet.range("C3:C13").value(function () {
        return parseInt(1e6 * Math.random());
    });
    sheet.range("D3:D13").formula("B3/C3").style("numberFormat", "0.00%");

    console.log(sheet.usedRange().value());

    // Write to file.
    return workbook.toFileAsync('./out.xlsx');
});
//# sourceMappingURL=index.js.map