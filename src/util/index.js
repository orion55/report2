export function removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
}

export function jsUcfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export function nonSpecialSymbol(string) {
    return (typeof string === 'string') ? string.replace(/[^\u0020-\u007F\u0400-\u04FF]/gi, "") : string;
}