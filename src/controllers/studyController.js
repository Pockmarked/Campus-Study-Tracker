// ==============================================================================
// Study Sessions HTTP Controller
// Project: Campus Study Tracker
// Author : Mochammad Nadhif Athallah (102062400144)
// ==============================================================================

const studyService = require('../services/studyService');

class StudyController {
  async getAllSessions(req, res, next) {
    try {
      const { search, status, priority } = req.query;
      const sessions = await studyService.getAllSessions({ search, status, priority });
      res.status(200).json({
        success: true,
        count: sessions.length,
        data: sessions
      });
    } catch (err) {
      next(err);
    }
  }

  async getSessionById(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid session ID format' });
      }

      const session = await studyService.getSessionById(id);
      if (!session) {
        return res.status(404).json({ success: false, message: `Study session #${id} not found` });
      }

      res.status(200).json({ success: true, data: session });
    } catch (err) {
      next(err);
    }
  }

  async createSession(req, res, next) {
    try {
      const { subject, topic, duration_minutes, target_date, priority, status, notes } = req.body;

      if (!subject || !subject.trim()) {
        return res.status(400).json({ success: false, message: 'Field subject is required' });
      }
      if (!topic || !topic.trim()) {
        return res.status(400).json({ success: false, message: 'Field topic is required' });
      }
      if (!target_date) {
        return res.status(400).json({ success: false, message: 'Field target_date is required' });
      }

      const newSession = await studyService.createSession({
        subject: subject.trim(),
        topic: topic.trim(),
        duration_minutes,
        target_date,
        priority,
        status,
        notes
      });

      res.status(201).json({
        success: true,
        message: 'Study session created successfully',
        data: newSession
      });
    } catch (err) {
      next(err);
    }
  }

  async updateSession(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid session ID format' });
      }

      const updated = await studyService.updateSession(id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, message: `Study session #${id} not found` });
      }

      res.status(200).json({
        success: true,
        message: 'Study session updated successfully',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteSession(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid session ID format' });
      }

      const deleted = await studyService.deleteSession(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: `Study session #${id} not found` });
      }

      res.status(200).json({
        success: true,
        message: `Study session #${id} deleted successfully`,
        data: deleted
      });
    } catch (err) {
      next(err);
    }
  }

  async getStatistics(req, res, next) {
    try {
      const stats = await studyService.getStatistics();
      res.status(200).json({ success: true, data: stats });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new StudyController();
