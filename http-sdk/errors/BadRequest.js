const { HttpResponseError } = require('./HttpResponseError.js');
const {HttpStatusCodes} = require('../http/StatusCodes.js');

function GetOpenAPISchema(){
  return {
    type: 'object',
    properties: {
      messages: { type: 'array', items: { type: 'string' } },
      payload: { type: 'object' },
    },
    required: ['messages']
  }
}

class BadRequest extends HttpResponseError {

  static GetOpenAPISchema = GetOpenAPISchema;

  static status = HttpStatusCodes.badRequest;

  constructor(payload, ...messages){
    const payloadIsString = typeof payload === 'string'
    if(payloadIsString) messages = [payload, ...messages];
    super(...messages);
    if(!payloadIsString) this.payload = payload;
  }

  toJSON(){
    return {
      messages: this.messages,
      payload: this.payload,
    }
  }
  
}

module.exports  = {
  BadRequest,
}