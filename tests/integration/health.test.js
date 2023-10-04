const { app, server } = require('../../server.js');
const request = require('supertest');

describe('Health check endpoint', () => {
  it('returns 200 OK', async () => {
    const response = await request(app).get('/healthz');
    expect(response.statusCode).toBe(200);
  });
});

    afterAll((done) => {
    server.close(done);
});