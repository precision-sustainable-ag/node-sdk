const { HttpResponseError } = require('./HttpResponseError.js');
const {HttpStatusCodes} = require('../http/StatusCodes.js');

function GetOpenAPISchema(){
  return {
    type: 'object',
    properties: {
      messages: { type: 'array', items: { type: 'string' } },
      stack: { type: 'string' },
    },
    required: ['messages','stack']
  }
}

class InternalServerError extends HttpResponseError {

  static GetOpenAPISchema = GetOpenAPISchema;

  static status = HttpStatusCodes.internal;

  constructor(...messages){
      super(...messages);
  }

  toJSON(){
    return {
      messages: this.messages,
      stack: this.stack,
    }
  }
  
}

module.exports  = {
  InternalServerError,
}