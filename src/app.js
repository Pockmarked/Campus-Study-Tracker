// ==============================================================================
// Express Application Setup
// Project: Campus Study Tracker
// Author : Mochammad Nadhif Athallah (102062400144)
// ==============================================================================

const express = require('express');
const path = require('path');
const healthRoutes = require('./routes/healthRoutes');
const studyRoutes = require('./routes/studyRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development/testing
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  }
  next();
});

// Serve static frontend assets
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/health', healthRoutes);
app.use('/api/sessions', studyRoutes);

// Fallback to index.html for root path or SPA navigation
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 404 & Global Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
