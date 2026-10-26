// ==============================================================================
// Server Entry Point & Lifecycle Controller
// Project: Campus Study Tracker
// Author : Mochammad Nadhif Athallah (102062400144)
// ==============================================================================

const app = require('./app');
const config = require('./config/environment');
const { migrateSchema } = require('./database/migrate');
const { pool } = require('./database/db');

const PORT = config.app.port;

const startServer = async () => {
  try {
    console.log('='.repeat(60));
    console.log(`Starting ${config.app.name}...`);
    console.log(`Author: ${config.app.author} (${config.app.nim})`);
    console.log(`Environment: ${config.app.env}`);
    console.log('='.repeat(60));

    // Run database migrations and seeding
    await migrateSchema();

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`[SERVER] Running successfully on http://0.0.0.0:${PORT}`);
      console.log(`[HEALTH] Endpoint available at http://0.0.0.0:${PORT}/health`);
    });

    // Graceful Shutdown handling
    const shutdown = async (signal) => {
      console.log(`\n[SHUTDOWN] Received signal ${signal}. Closing gracefully...`);
      server.close(async () => {
        console.log('[SERVER] HTTP server closed.');
        try {
          await pool.end();
          console.log('[DB POOL] Database pool connections terminated cleanly.');
        } catch (err) {
          console.error('[DB POOL ERROR] Error closing pool:', err.message);
        }
        process.exit(0);
      });

      // Force close after 10s timeout
      setTimeout(() => {
        console.error('[SHUTDOWN] Timeout exceeded. Forcing termination.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (err) {
    console.error('[FATAL] Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();
