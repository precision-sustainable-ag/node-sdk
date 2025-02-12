const {Singleton} = require('./singleton.js');
const {ServerI} = require('./http/ServerI.js');
const {HttpStatusCodes} = require('./http/StatusCodes.js');
const { BadRequest } = require('./errors/BadRequest.js');
const { MultiMessageError } = require('./errors/MultiMessageError.js');
const { InternalServerError } = require('./errors/InternalServerError.js');
const { UnprocessibleEntity } = require('./errors/UnprocessibleEntity.js');


const _default = {
    Singleton,
    ServerI,
    HttpStatusCodes,
    MultiMessageError,
    BadRequest,
    InternalServerError,
    UnprocessibleEntity,
}

module.exports = {
    Singleton,
    HttpServer: ServerI,
    HttpStatusCodes,
    MultiMessageError,
    BadRequest,
    InternalServerError,
    UnprocessibleEntity,
    default: _default,
}