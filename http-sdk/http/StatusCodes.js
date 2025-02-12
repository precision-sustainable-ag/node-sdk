
class HttpStatusCodes {
    
    static continue         = 100;
    static ok               = 200;
    static created          = 201;
    static accepted         = 202;
    static noContent        = 204;
    static badRequest       = 400;
    static unauthorized     = 401;
    static forbidden        = 403;
    static notFound         = 404;
    static notAllowed       = 405;
    static notAccepted      = 406;
    static conflict         = 409;
    static teapot           = 418;
    static unprocessible    = 422;
    static tooManyAttempts  = 429;
    static internal         = 500;
    static notImplemented   = 501;
    static unavailable      = 503;
}

module.exports = {
    HttpStatusCodes
}
