const { ServerI, HTTP_METHODS } = require("../http/ServerI.js");

test('Register Route should not allow invalid HTTP methods.', () => {
    const invalidMethod = 'pop';
    const expectedMessage = `Invalid Parameter: _method must be one of [${HTTP_METHODS.string}]`;

    try {
        ServerI.factory().registerRoute({
            _method: invalidMethod,
            path: '/example',
        });
    } catch (e) {
        expect(Array.isArray(e?.messages)).toBe(true);
        expect(e.messages).toContain(expectedMessage);
    }
});

test('Register Route should allow valid HTTP methods.', () => {
    try {
        for(let _method of HTTP_METHODS.array) {
            ServerI.factory().registerRoute({
                _method,
                path: '/example',
            });
        }
        expect(true).toBe(true);
    } catch (e) {
        expect(false).toBe(true);
    }
});

test('Register Route should fail when handler is not a function.', () => {
    const expectedMessage = 'Invalid Parameter: handler must be a function.';
    try {
        ServerI.factory().registerRoute({
            path: '/example',
            handler: 'this should fail...'
        });
        expect(false).toBe(true);
    } catch (e) {
        expect(Array.isArray(e?.messages)).toBe(true);
        expect(e.messages).toContain(expectedMessage);
    }
});

test('Register Route should fail when middleware is not a function or an array.', () => {
    const expectedMessage = 'Invalid Parameter: middleware must be a function or an array of functions.';
    try {
        ServerI.factory().registerRoute({
            path: '/example',
            middleware: 'this should fail...'
        });
        expect(false).toBe(true);
    } catch (e) {
        expect(Array.isArray(e?.messages)).toBe(true);
        expect(e.messages).toContain(expectedMessage);
    }
});

test('Register Route should fail when closers is not a function or an array.', () => {
    const expectedMessage = 'Invalid Parameter: closers must be a function or an array of functions.';
    try {
        ServerI.factory().registerRoute({
            path: '/example',
            closers: 'this should fail...'
        });
        expect(false).toBe(true);
    } catch (e) {
        expect(Array.isArray(e?.messages)).toBe(true);
        expect(e.messages).toContain(expectedMessage);
    }
});

test('Register Route should pass when middleware is a function.', () => {
    try {
        ServerI.factory().registerRoute({
            path: '/example',
            middleware: (req,res,next) => 'this should not fail...',
        });
        expect(true).toBe(true);
    } catch (e) {
        console.error(e);
        expect(false).toBe(true);
    }
});

test('Register Route should pass when closers is a function.', () => {
    try {
        ServerI.factory().registerRoute({
            path: '/example',
            closers: (req,res,next) => 'this should not fail...',
        });
        expect(true).toBe(true);
    } catch (e) {
        console.error(e);
        expect(false).toBe(true);
    }
});

test('Register Route should fail when middleware item is not a function.', () => {
    const expectedMessage = 'middleware[1] must be a function.';
    try {
        ServerI.factory().registerRoute({
            path: '/example',
            middleware: [(req,res,next) => 'this should not fail...', 'this should fail with index 1'],
        });
        expect(false).toBe(true);
    } catch (e) {
        expect(Array.isArray(e?.messages)).toBe(true);
        expect(e.messages).toContain(expectedMessage);
    }
});

test('Register Route should fail when closers item is not a function.', () => {
    const expectedMessage = 'closers[1] must be a function.';
    try {
        ServerI.factory().registerRoute({
            path: '/example',
            closers: [(req,res,next) => 'this should not fail...', 'this should fail with index 1'],
        });
        expect(false).toBe(true);
    } catch (e) {
        expect(Array.isArray(e?.messages)).toBe(true);
        expect(e.messages).toContain(expectedMessage);
    }
});


test('Should be able to register GET method', ()=>{

    const routePath = '/example'

    try {
        const server = ServerI.factory().GET({path: routePath});
        expect(server.routes().gets().has(routePath)).toBe(true);
    } catch(e) {
        console.error(e);
        expect(false).toBe(true);
    }

});

test('Should be able to register POST method', ()=>{

    const routePath = '/example'

    try {
        const server = ServerI.factory().POST({path: routePath});
        expect(server.routes().posts().has(routePath)).toBe(true);
    } catch(e) {
        console.error(e);
        expect(false).toBe(true);
    }

});

test('Should be able to register PUT method', ()=>{

    const routePath = '/example'

    try {
        const server = ServerI.factory().PUT({path: routePath});
        expect(server.routes().puts().has(routePath)).toBe(true);
    } catch(e) {
        console.error(e);
        expect(false).toBe(true);
    }

});

test('Should be able to register PATCH method', ()=>{

    const routePath = '/example'

    try {
        const server = ServerI.factory().PATCH({path: routePath});
        expect(server.routes().patches().has(routePath)).toBe(true);
    } catch(e) {
        console.error(e);
        expect(false).toBe(true);
    }

});

test('Should be able to register DELETE method', ()=>{

    const routePath = '/example'

    try {
        const server = ServerI.factory().DELETE({path: routePath});
        expect(server.routes().deletes().has(routePath)).toBe(true);
    } catch(e) {
        console.error(e);
        expect(false).toBe(true);
    }

});