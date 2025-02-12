

function isUndefined(_var){
    return typeof _var === 'undefined';
}

function isFunction(_var){
    return typeof _var === 'function';
}

function isPromise(_val) {
    return _val instanceof Promise;
}


function isObject(_var){
    return Object.isObject(_var);
}

function isArray(_var,length=0){
    return Array.isArray(_var) && _var.lenth >= length;
}

module.exports = {
    isArray,
    isObject,
    isFunction,
    isPromise,
    isUndefined,
}
