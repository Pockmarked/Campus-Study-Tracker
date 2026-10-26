// ==============================================================================
// Health Check Route
// Project: Campus Study Tracker
// Author : Mochammad Nadhif Athallah (102062400144)
// ==============================================================================

const express = require('express');
const router = express.Router();
const db = require('../database/db');
const config = require('../config/environment');

router.get('/', async (req, res) => {
  const startTime = Date.now();
  let dbStatus = 'healthy';
  let dbLatency = 0;

  try {
    const dbStart = Date.now();
    await db.query('SELECT 1');
    dbLatency = Date.now() - dbStart;
  } catch (err) {
    dbStatus = `unhealthy: ${err.message}`;
  }

  const isHealthy = dbStatus === 'healthy';

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'UP' : 'DOWN',
    project: config.app.name,
    author: config.app.author,
    nim: config.app.nim,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: dbStatus,
      latencyMs: dbLatency
    },
    system: {
      memoryUsageMB: Math.round(process.memoryUsage().rss / (1024 * 1024)),
      nodeVersion: process.version
    }
  });
});

module.exports = router;
