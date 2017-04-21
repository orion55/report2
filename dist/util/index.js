"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.removeDuplicates = removeDuplicates;
exports.jsUcfirst = jsUcfirst;
function removeDuplicates(myArr, prop) {
    return myArr.filter(function (obj, pos, arr) {
        return arr.map(function (mapObj) {
            return mapObj[prop];
        }).indexOf(obj[prop]) === pos;
    });
}

function jsUcfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
//# sourceMappingURL=index.js.map