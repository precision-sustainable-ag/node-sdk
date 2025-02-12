## Description
Lightweight framework built on top of ExpressJS which handles a lot of boiler plate code, including 
- error handling
- basic catch all middleware
- standard HTTP Errors
- route declarations
- OpenAPI document endpoints
- Swagger UI

## Quick Start

#### Install
```bash
npm i @precision-sustainable-ag/http-sdk
```

#### index.js
```javascript
const { HttpServer, HttpStatusCodes, BadRequest } = require("@precision-sustainable-ag/http-sdk");

const config = {
    PORT: 8081,
    APP_NAME: 'Quick Start App'
};

const app = HttpServer.factory(config);

app.GET({ path:'/example',
    status: HttpStatusCodes.ok, // status code to be used if all goes well.
    middleware: (req,res,next) => { // validate / inject params or any pre-processing.
        req.arg1 = 'test'; 
        req.example = [1,2,3,4]; 
        next(); 
    },
    handler: ({arg1, example}) => { // handle incoming request
        console.log(arg1,example);
        return example.map(i => `${arg1} ${i}`);
    },
    closers: (req,res,next) => { // post-processing
        res.data = {
            examples: res.data,
            closed: true,
        }
        next();
    }
});

app.GET({ path:'/example/badRequest',
    status: HttpStatusCodes.ok, // status code to be used if all goes well.
    middleware: (req,res,next) => { // validate / inject params or any pre-processing.
        const params = {
            requiredParam: undefined,
            numericParam: 'this is a string'
        }
        throw new BadRequest(params,'requiredParam was not provided.','numericParam was non-numeric.');
    },
    handler: ({arg1, example}) => { // handle incoming request
        console.log(arg1,example);
        return example.map(i => `${arg1} ${i}`);
    },
    closers: (req,res,next) => { // post-processing
        res.data = {
            examples: res.data,
            closed: true,
        }
        next();
    }
});

app.run();
```

## Recommended Folder Structure

```
project-root/
│── .env
│── src/
    │── app.js
    │── index.js
    ├── middleware/
        │── ExampleMiddleware.js
    ├── closers/
        │── ExampleCloser.js
    ├── handlers/
        │── ExampleHandler.js
    │── routes/
        │── index.js
```

#### src/app.js
```javascript

const {ServerI} = require('@precision-sustainable-ag/http-sdk');

const App = ServerI.factory({
    PORT:8081, 
    APP_NAME:'Example API'
});

module.exports = {
    App
}
```

#### src/index.js
```javascript

const { App } = require('./app.js');
const routes = require('./src/routes');

routes.register(App);

App.run();
```


#### src/routes/index.js
```javascript
const { HttpStatusCodes } = require('@precision-sustainable-ag/http-sdk');
const { ExampleHandler }  = require('./handlers/ExampleHandler.js');
//const MoreRoutes = require('./MoreRoutes.js');

const BASE_PATH = '/api';

module.exports = {
    register: (app) => {

        app.GET({ path:`${BASE_PATH}/example`,
            status: HttpStatusCodes.ok,
            middleware: [ // supports function or array.
                ExampleMiddleware
            ],
            handler: ExampleHandler,
            closers: [ // supports function or array.
                ExampleCloser
            ],
        });

        // example of registering more routes in this register function. 
        // MoreRoutes.register(app);
    }
}
```

#### src/middleware/ExampleMiddleware.js
```javascript
function ExampleMiddleware(req,res,next) {
    req.args = {};
    
    if(req.query.email) req.args.email = req?.query?.email;
    else req.args.email = req?.body?.email;
    
    return next();
}

module.exports = {
    ExampleMiddleware
}
```
#### src/handlers/ExampleHandler.js
> route handlers automatically support async functions.  
> handlers are automatically wrapped in a try/catch  
> returned values are automatically set to res.data

```javascript
async function ExampleHandler(req){
    const {email} = req.args;

    const profile = await getUserProfile(email);

    return {email, profile};
}
```

#### src/closers/ExampleCloser.js
```javascript
function ExampleCloser(req,res,next) {
    const {email, profile} = res.data;

    res.data = {
        email,
        ...profile
    };

    return next();
}

module.exports = {
    ExampleCloser
}
```