const {HttpStatusCodes} = require('../http/StatusCodes.js');
const { Log } = require('@precision-sustainable-ag/psa-utils');

function ErrorRenderer(err, req, res, next) {
    const statusCode = err.getStatus() || HttpStatusCodes.internal;
    let response;
    
    if(err?.toJSON) response = err.toJSON();
    else response = {
        metadata: err?.metadata || false,
        message: err?.message || false,
        stack: err?.stack || false,
    };
    
    Log.Debug(err); 
    res.status(statusCode).json(response);
}



module.exports = {
    ErrorRenderer
}