"use strict";

var arr = [{
    param: "from",
    msg: "Invalid From date"
}, {
    param: "from",
    msg: "Invalid From date"
},
/*{
    param: "to",
    msg: "Invalid To date"
},*/
{
    param: "to",
    msg: "Invalid To date"
}];

/*const param = array.map(obj => obj.param).filter((v, i) => param.indexOf(v) === i);
 console.log(param);*/

function removeDuplicates(myArr, prop) {
    return myArr.filter(function (obj, pos, arr) {
        return arr.map(function (mapObj) {
            return mapObj[prop];
        }).indexOf(obj[prop]) === pos;
    });
}

console.log(removeDuplicates(arr, 'param'));
//# sourceMappingURL=misc.js.map