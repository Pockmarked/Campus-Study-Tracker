// ==============================================================================
// Environment Configuration Loader & Validator
// Project: Campus Study Tracker
// Author : Mochammad Nadhif Athallah (102062400144)
// ==============================================================================

require('dotenv').config();

const config = {
  app: {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3000,
    author: 'Mochammad Nadhif Athallah',
    nim: '102062400144',
    name: 'Campus Study Tracker'
  },
  db: {
    host: process.env.DB_HOST || 'database',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME || 'campus_study_db',
    user: process.env.DB_USER || 'study_user',
    password: process.env.DB_PASSWORD || 'StudySecurePass2026!',
    maxConnections: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
  }
};

module.exports = config;
