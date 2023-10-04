const request = require('supertest');
const app = require('../../app.js'); 

describe('Health check endpoint', () => {

  it('returns 200 OK', async () => {
    
    const response = await request(app)
      .get('/healthz')

    expect(response.statusCode).toBe(200);

  });

});