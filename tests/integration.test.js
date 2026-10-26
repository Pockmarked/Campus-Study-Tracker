// ==============================================================================
// Database & Multi-Service Integration Test Suite
// Project: Campus Study Tracker
// Author : Mochammad Nadhif Athallah (102062400144)
// ==============================================================================

const db = require('../src/database/db');
const studyService = require('../src/services/studyService');

describe('Campus Study Tracker - Database Integration Tests', () => {
  afterAll(async () => {
    await db.pool.end();
  });

  it('should connect to PostgreSQL and execute a test query', async () => {
    const { rows } = await db.query('SELECT 1 + 1 AS solution');
    expect(rows[0].solution).toBe(2);
  });

  it('should create, read, update, and delete a test study session', async () => {
    // 1. Create
    const created = await studyService.createSession({
      subject: 'Uji Integrasi Otomatis',
      topic: 'Verifikasi Database Persistence',
      duration_minutes: 45,
      target_date: new Date().toISOString().split('T')[0],
      priority: 'High',
      status: 'Pending',
      notes: 'Record uji coba otomatis'
    });
    expect(created).toBeDefined();
    expect(created.id).toBeDefined();

    // 2. Read
    const fetched = await studyService.getSessionById(created.id);
    expect(fetched.topic).toBe('Verifikasi Database Persistence');

    // 3. Update
    const updated = await studyService.updateSession(created.id, {
      status: 'Completed'
    });
    expect(updated.status).toBe('Completed');

    // 4. Delete
    const deleted = await studyService.deleteSession(created.id);
    expect(deleted.id).toBe(created.id);

    // 5. Verify Deletion
    const verify = await studyService.getSessionById(created.id);
    expect(verify).toBeNull();
  });
});
