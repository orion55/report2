export function removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
}

export function jsUcfirst(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}