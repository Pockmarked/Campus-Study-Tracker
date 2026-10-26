// ==============================================================================
// Study Sessions Data Access & Service Layer
// Project: Campus Study Tracker
// Author : Mochammad Nadhif Athallah (102062400144)
// ==============================================================================

const db = require('../database/db');

class StudyService {
  async getAllSessions({ search, status, priority } = {}) {
    let query = 'SELECT * FROM study_sessions WHERE 1=1';
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (subject ILIKE $${params.length} OR topic ILIKE $${params.length} OR notes ILIKE $${params.length})`;
    }

    if (status && status !== 'All') {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }

    if (priority && priority !== 'All') {
      params.push(priority);
      query += ` AND priority = $${params.length}`;
    }

    query += ' ORDER BY target_date ASC, id ASC';

    const { rows } = await db.query(query, params);
    return rows;
  }

  async getSessionById(id) {
    const { rows } = await db.query('SELECT * FROM study_sessions WHERE id = $1', [id]);
    return rows[0] || null;
  }

  async createSession({ subject, topic, duration_minutes, target_date, priority, status, notes }) {
    const query = `
      INSERT INTO study_sessions (subject, topic, duration_minutes, target_date, priority, status, notes, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
      RETURNING *;
    `;
    const params = [
      subject,
      topic,
      parseInt(duration_minutes, 10) || 60,
      target_date,
      priority || 'Medium',
      status || 'Pending',
      notes || ''
    ];

    const { rows } = await db.query(query, params);
    return rows[0];
  }

  async updateSession(id, { subject, topic, duration_minutes, target_date, priority, status, notes }) {
    const existing = await this.getSessionById(id);
    if (!existing) return null;

    const query = `
      UPDATE study_sessions
      SET 
        subject = COALESCE($1, subject),
        topic = COALESCE($2, topic),
        duration_minutes = COALESCE($3, duration_minutes),
        target_date = COALESCE($4, target_date),
        priority = COALESCE($5, priority),
        status = COALESCE($6, status),
        notes = COALESCE($7, notes),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *;
    `;

    const params = [
      subject !== undefined ? subject : existing.subject,
      topic !== undefined ? topic : existing.topic,
      duration_minutes !== undefined ? parseInt(duration_minutes, 10) : existing.duration_minutes,
      target_date !== undefined ? target_date : existing.target_date,
      priority !== undefined ? priority : existing.priority,
      status !== undefined ? status : existing.status,
      notes !== undefined ? notes : existing.notes,
      id
    ];

    const { rows } = await db.query(query, params);
    return rows[0];
  }

  async deleteSession(id) {
    const { rows } = await db.query('DELETE FROM study_sessions WHERE id = $1 RETURNING *', [id]);
    return rows[0] || null;
  }

  async getStatistics() {
    const totalQuery = 'SELECT COUNT(*) as total_sessions, COALESCE(SUM(duration_minutes), 0) as total_minutes FROM study_sessions';
    const pendingQuery = "SELECT COUNT(*) as pending_count FROM study_sessions WHERE status = 'Pending'";
    const inProgressQuery = "SELECT COUNT(*) as in_progress_count FROM study_sessions WHERE status = 'In Progress'";
    const completedQuery = "SELECT COUNT(*) as completed_count FROM study_sessions WHERE status = 'Completed'";

    const [totalRes, pendingRes, inProgressRes, completedRes] = await Promise.all([
      db.query(totalQuery),
      db.query(pendingQuery),
      db.query(inProgressQuery),
      db.query(completedQuery)
    ]);

    const totalMinutes = parseInt(totalRes.rows[0].total_minutes, 10);
    const totalHours = (totalMinutes / 60).toFixed(1);

    return {
      totalSessions: parseInt(totalRes.rows[0].total_sessions, 10),
      totalMinutes,
      totalHours: parseFloat(totalHours),
      pendingSessions: parseInt(pendingRes.rows[0].pending_count, 10),
      inProgressSessions: parseInt(inProgressRes.rows[0].in_progress_count, 10),
      completedSessions: parseInt(completedRes.rows[0].completed_count, 10)
    };
  }
}

module.exports = new StudyService();
