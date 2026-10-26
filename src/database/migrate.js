// ==============================================================================
// Database Schema Migration & Seed Runner
// Project: Campus Study Tracker
// Author : Mochammad Nadhif Athallah (102062400144)
// ==============================================================================

const db = require('./db');

const migrateSchema = async () => {
  console.log('[MIGRATION] Checking & applying database schema...');

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS study_sessions (
      id SERIAL PRIMARY KEY,
      subject VARCHAR(150) NOT NULL,
      topic VARCHAR(255) NOT NULL,
      duration_minutes INTEGER NOT NULL DEFAULT 60,
      target_date DATE NOT NULL,
      priority VARCHAR(20) NOT NULL DEFAULT 'Medium',
      status VARCHAR(20) NOT NULL DEFAULT 'Pending',
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await db.query(createTableQuery);

  // Check if initial records exist
  const countResult = await db.query('SELECT COUNT(*) FROM study_sessions');
  const count = parseInt(countResult.rows[0].count, 10);

  if (count === 0) {
    console.log('[MIGRATION] Seeding initial study records for student: Mochammad Nadhif Athallah...');
    
    const seedQuery = `
      INSERT INTO study_sessions (subject, topic, duration_minutes, target_date, priority, status, notes)
      VALUES
        ('Komputasi Awan', 'Virtualisasi Container Docker & Orchestration Multi-Service', 90, CURRENT_DATE + INTERVAL '1 day', 'High', 'In Progress', 'Praktikum Week 6 deploy Azure VM dan Docker Compose'),
        ('Jaringan Komputer', 'Analisis Protokol TCP/IP dan Network Topology Routing', 60, CURRENT_DATE + INTERVAL '2 day', 'High', 'Pending', 'Persiapan ujian tengah semester modul subnetting'),
        ('Rekayasa Perangkat Lunak', 'Implementasi Clean Architecture & Microservices Pattern', 120, CURRENT_DATE + INTERVAL '3 day', 'Medium', 'Pending', 'Mempelajari pattern repository dan domain-driven design'),
        ('Basis Data Lanjut', 'Optimasi Query SQL & Connection Pool Indexing', 75, CURRENT_DATE + INTERVAL '4 day', 'Medium', 'Completed', 'Simulasi EXPLAIN ANALYZE pada tabel relasional'),
        ('Keamanan Informasi', 'Penerapan Linux Privilege Hardening & Docker Socket Security', 60, CURRENT_DATE + INTERVAL '5 day', 'High', 'Completed', 'Audit perizinan socket 660 dan manajemen grup non-root');
    `;
    await db.query(seedQuery);
    console.log('[MIGRATION] 5 initial study sessions successfully seeded.');
  } else {
    console.log(`[MIGRATION] Database already populated with ${count} existing sessions.`);
  }
};

module.exports = { migrateSchema };
