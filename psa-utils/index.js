const {Log} = require('./logger/index.js');
const { isArray, isUndefined, isPromise, isFunction, isObject } = require('./isTypes.js');


const _default = {
    Log,
    isArray,
    isUndefined,
    isPromise,
    isFunction,
    isObject,
}

module.exports = {
    Log,
    isArray,
    isUndefined,
    isPromise,
    isFunction,
    isObject,
    default: _default,
}