const {HttpStatusCodes} = require('../http/StatusCodes.js');

const DEFAULT_CONTENT = {
    error: 'Not Implemented',
    messages: [
        'The requested endpoint does not exist.'
    ]
}

function CatchAll(status=HttpStatusCodes.notImplemented,content=DEFAULT_CONTENT){
    return (req, res, next) => {
        res.status(status).send(content);
    }
}

module.exports = {
    CatchAll
}