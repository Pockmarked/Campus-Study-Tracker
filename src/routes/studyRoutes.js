// ==============================================================================
// Study Sessions API Routes
// Project: Campus Study Tracker
// Author : Mochammad Nadhif Athallah (102062400144)
// ==============================================================================

const express = require('express');
const router = express.Router();
const studyController = require('../controllers/studyController');

router.get('/statistics', (req, res, next) => studyController.getStatistics(req, res, next));
router.get('/', (req, res, next) => studyController.getAllSessions(req, res, next));
router.get('/:id', (req, res, next) => studyController.getSessionById(req, res, next));
router.post('/', (req, res, next) => studyController.createSession(req, res, next));
router.put('/:id', (req, res, next) => studyController.updateSession(req, res, next));
router.delete('/:id', (req, res, next) => studyController.deleteSession(req, res, next));

module.exports = router;
