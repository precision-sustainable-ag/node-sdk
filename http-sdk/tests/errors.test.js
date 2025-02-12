const { BadRequest } = require("../errors/BadRequest");


test('GetOpenAPISchema has type prop', () => {
    const schema = BadRequest.GetOpenAPISchema();
    expect(!(typeof schema.type === 'undefined'));
});