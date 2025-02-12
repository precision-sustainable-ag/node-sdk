const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { Log } = require("@precision-sustainable-ag/psa-utils");
const { isFunction, isUndefined, isPromise } = require("@precision-sustainable-ag/psa-utils");
const { ErrorRenderer } = require("../middleware/ErrorRender.js");
const {MultiMessageError} = require("../errors/MultiMessageError.js");
const {CatchAll} = require("../middleware/CatchAll.js");
const {HttpStatusCodes} = require("./StatusCodes.js");
const { ReadYaml } = require('../utils/readYaml.js');
const fs = require('fs');

const _http_methods_array = ['get','post','put','delete','patch'];
const _http_methods_set = new Set(_http_methods_array);
const HTTP_METHODS = {
    array: _http_methods_array,
    set: _http_methods_set,
    string: _http_methods_array.join(','),
    allows: (_method) => _http_methods_set.has(_method),
}

function MakeApp(){
    return express();
}

function DefaultHandler(req){ 
    const {params, body} = req;

    return {
        status: HttpStatusCodes.ok,
        content: {params, body}
    }
}

function SetOpenAPI({ app, path='/api-docs', json, yaml, middleware=[], options={explorer: true}}={}) {

    // Determine the document to send
    let document;

    if (json) {
        document = json;  // Use the provided JSON document
    } else if (yaml) {
        document = ReadYaml(yaml);
    } else {
        // Handle the case where neither json nor yaml is provided
        return app.get('/openapi.json', [...middleware], (req, res) => {
            res.status(HttpStatusCodes.notImplemented).send({ message: 'No document provided' }); // Default response
        });
    }

    app.get('/openapi.json', [...middleware], (req, res, next) => {  // Added middleware support
        res.status(HttpStatusCodes.ok).send(document);  // Send the determined document
    });

    app.use(path, swaggerUi.serve, swaggerUi.setup(document, options));
}

function BuildMainActionPerformer(status, handler){
    
    if(!isFunction(handler)) throw new Error(`Invalid Handler. must be a function.`);

    return async (req, res, next) => {
        try {
            let result = handler(req, res);

            if(isPromise(result)) result = await result;


            if (isUndefined(result)) {
                status = HttpStatusCodes.noContent;
                result = { message: 'No content provided' }
            }

            res.status(status);
            res.data = result;
            next();
        } catch (e) {
            return next(e);
        }
    }
}

function SendResponse(req,res,next){
    const data = res.data;
    res.send(data);
}

function SetHandler({ app, status=HttpStatusCodes.ok, path='/', handler, middleware=[], closers=[], _method='get' } = {}) {
    const setterFunc = app[_method].bind(app);
    if(!isFunction(setterFunc)) throw new Error(`Invalid App method binding: ${_method}`);
    setterFunc(path, middleware, BuildMainActionPerformer(status, handler), closers, SendResponse);     
    return this;   
}

function StartServer({app, errorRender, catchAll, logger, config={} }={}){

    const {PORT,APP_NAME} = config;

    if(!PORT) throw new Error('Failed To start Server: Missing PORT.')

    if(isFunction(catchAll)) app.use(catchAll);
    else app.use(CatchAll());

    if(isFunction(errorRender)) app.use(errorRender);
    else app.use(ErrorRenderer);

    // Start the server
    app.listen(PORT, () => {
        const onStartLogStatement = `${APP_NAME ?? 'Service'} is running on port ${PORT}`;
        if(typeof logger === 'function') logger(onStartLogStatement);
        else Log.System(onStartLogStatement);
    });
}

function RunningInDocker() {
    return fs.existsSync('/.dockerenv');
}

function SetDockerConfig({config}){
    config.docker = true
    config.PORT = config.DOCKER_PORT ?? 80;
}

class RoutesList {
    constructor(routes){
        this._routes = routes;
        const self = this;

        for(let _method of HTTP_METHODS.array){
            if(!Array.isArray(routes[_method])) throw new Error(`Missing Routes List Container: ${_method}`);
            const methodRouteSet = new Set(routes[_method]);
            this[_method] = {
                array: routes[_method],
                map: methodRouteSet,
                has: (path) => methodRouteSet.has(path)
            }
        }
    }

    gets(){
        return this.get;
    }

    posts(){
        return this.post;
    }

    puts(){
        return this.put;
    }

    patches(){
        return this.patch;
    }

    deletes(){
        return this.delete;
    }
}

class ServerI {

    constructor(config={}){

        if(RunningInDocker()) SetDockerConfig({config});

        this._routeList = null;

        this.container = {
            app: MakeApp(),
            routes: {},
            config: config,
        };

        for(let _method of HTTP_METHODS.array){
            this.container.routes[_method] = [];
        }
    }
    
    static factory(config={}){
        return new ServerI(config);
    }

    routes(){
        if(this._routeList) return this._routeList;

        return this._routeList = new RoutesList(this.container.routes);
    }

    getApp(){
        return this.container.app;
    }

    openAPI({path='/api-docs', json, middleware=[], options={}}={}){
        const {app} = this.container;
        
        SetOpenAPI({app, path, json, middleware});
        return this;
    }
    
    run({errorRender,logger}={}){
        const {app,config} = this.container;
        StartServer({app,config,errorRender,logger});
        return this;
    }

    use(handler){
        const {app} = this.container;
        app.use(handler);
    }

    registerRoute({path, status, middleware = [], handler=DefaultHandler, closers = [], _method='get'}){
        const {app,routes} = this.container;
        let failed = false;
        let failureMessages = [`Invalid Route Instantiation ${path}:`];

        if(!HTTP_METHODS.allows(_method)) {
            failureMessages.push(`Invalid Parameter: _method must be one of [${HTTP_METHODS.string}]`);
            failed = true;
        }

        if(!isFunction(handler)) {
            failureMessages.push('Invalid Parameter: handler must be a function.');
            failed = true;
        }

        if(!Array.isArray(middleware) && !isFunction(middleware)) {
            failureMessages.push('Invalid Parameter: middleware must be a function or an array of functions.');
            failed = true;
        }

        if(!Array.isArray(closers) && !isFunction(closers)) {
            failureMessages.push('Invalid Parameter: closers must be a function or an array of functions.');
            failed = true;
        }

        if(isFunction(middleware)) middleware = [middleware];
        else if(Array.isArray(middleware)){
            for(let [index,_func] of middleware.entries()){
                if(!isFunction(_func)) {
                    failureMessages.push(`middleware[${index}] must be a function.`);
                    failed = true;
                }
            }
        }

        if(isFunction(closers)) closers = [closers];
        else if(Array.isArray(closers)) {
            for(let [index,_func] of closers.entries()){
                if(!isFunction(_func)) {
                    failureMessages.push(`closers[${index}] must be a function.`);
                    failed = true;
                }
            }
        }
        
        if(failed === true) throw new MultiMessageError(...failureMessages);
        routes[_method].push(path);   
        SetHandler({path, status, app, handler, middleware, closers, _method});
        return this;
    }

    GET({path, status, middleware = [], handler=DefaultHandler, closers = []}){
        const _method = 'get';

        return this.registerRoute({path, status, middleware, handler, closers, _method});
    }

    POST({path, status, middleware = [], handler=DefaultHandler, closers = []}){
        const _method = 'post';

        return this.registerRoute({path, status, middleware, handler, closers, _method});
    }
    
    PUT({path, status, middleware = [], handler=DefaultHandler, closers = []}){
        const _method = 'put';

        return this.registerRoute({path, status, middleware, handler, closers, _method});
    }

    PATCH({path, status, middleware = [], handler=DefaultHandler, closers = []}){
        const _method = 'patch';

        return this.registerRoute({path, status, middleware, handler, closers, _method});
    }

    DELETE({path, status, middleware = [], handler=DefaultHandler, closers = []}){
        const _method = 'delete';

        return this.registerRoute({path, status, middleware, handler, closers, _method});
    }

}


module.exports = {
    MakeApp,
    DefaultHandler,
    SetOpenAPI,
    SetHandler,
    StartServer,
    RunningInDocker,
    SetDockerConfig,
    ServerI,
    HTTP_METHODS,
}