const request = require('supertest');
const app = require('../server');

describe('Smoke Test', () => {
  it('Server should start', async () => {
    const res = await request(app).get('/api/health');
    if (res.statusCode !== 200) {
      throw new Error('Server failed to start');
    }
  });
});