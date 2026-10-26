// ==============================================================================
// PostgreSQL Connection Pool Module
// Project: Campus Study Tracker
// Author : Mochammad Nadhif Athallah (102062400144)
// ==============================================================================

const { Pool } = require('pg');
const config = require('../config/environment');

const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  user: config.db.user,
  password: config.db.password,
  max: config.db.maxConnections,
  idleTimeoutMillis: config.db.idleTimeoutMillis,
  connectionTimeoutMillis: config.db.connectionTimeoutMillis
});

pool.on('connect', () => {
  // Connection pool active
});

pool.on('error', (err) => {
  console.error('[DB POOL ERROR] Unexpected error on idle client:', err.message);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
