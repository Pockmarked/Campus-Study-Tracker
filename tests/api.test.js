// ==============================================================================
// Functional & API Test Suite
// Project: Campus Study Tracker
// Author : Mochammad Nadhif Athallah (102062400144)
// ==============================================================================

const request = require('supertest');
const app = require('../src/app');

describe('Campus Study Tracker - API Test Suite', () => {
  it('GET /health - should return UP status and author metadata', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body.author).toBe('Mochammad Nadhif Athallah');
    expect(res.body.nim).toBe('102062400144');
  });

  it('GET /api/sessions - should return list of sessions and success flag', async () => {
    const res = await request(app).get('/api/sessions');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/sessions/statistics - should return aggregated stats', async () => {
    const res = await request(app).get('/api/sessions/statistics');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('totalSessions');
    expect(res.body.data).toHaveProperty('totalHours');
  });

  it('POST /api/sessions - should reject creation with missing required fields', async () => {
    const res = await request(app)
      .post('/api/sessions')
      .send({ subject: '' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('GET /unknown-route - should return standard 404 response', async () => {
    const res = await request(app).get('/non-existent-endpoint');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
