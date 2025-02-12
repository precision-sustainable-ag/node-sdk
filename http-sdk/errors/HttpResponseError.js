const { MultiMessageError } = require('./MultiMessageError.js');
const {HttpStatusCodes} = require('../http/StatusCodes.js'); 

class HttpResponseError extends MultiMessageError {

    static status = HttpStatusCodes.badRequest;

    constructor(...messages) {
        super(...messages);
    }
    
    getStatus(){
        return this.constructor.status;
    }

    static [Symbol.hasInstance](obj) {
        // Check if the instance has specific properties typical of an Axios or Fetch response
        return obj 
          && typeof obj === 'object' 
          && obj?.status ===  this.status;
    }

}

module.exports = {
    HttpResponseError
}