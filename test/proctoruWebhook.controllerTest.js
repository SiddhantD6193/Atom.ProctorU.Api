const request = require('supertest');
const app = require('../src/server');

describe('ProctorU Middleware', () => {
  it('should forward payload to Admin API', async () => {
    const res = await request(app)
      .post('/admin/v1/middleware/webhook')
      .set('x-proctoru-secret', process.env.PROCTORU_SHARED_SECRET)
      .send({ event: { type: 'event-reservation-confirmation' } });
    expect(res.status).toBe(200);
  });
});
