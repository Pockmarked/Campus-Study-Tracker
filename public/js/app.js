// ==============================================================================
// Campus Study Tracker - Client Interactive Controller
// Author : Mochammad Nadhif Athallah (102062400144)
// ==============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const sessionsGrid = document.getElementById('sessionsGrid');
  const sessionCountTag = document.getElementById('sessionCountTag');
  const searchInput = document.getElementById('searchInput');
  const statusFilter = document.getElementById('statusFilter');
  const priorityFilter = document.getElementById('priorityFilter');
  
  // Stat Elements
  const statTotalSessions = document.getElementById('statTotalSessions');
  const statTotalHours = document.getElementById('statTotalHours');
  const statPendingSessions = document.getElementById('statPendingSessions');
  const statCompletedSessions = document.getElementById('statCompletedSessions');
  
  // Health Element
  const healthPill = document.getElementById('healthPill');
  const healthStatusText = document.getElementById('healthStatusText');
  
  // Modal Elements
  const modalOverlay = document.getElementById('sessionModalOverlay');
  const openAddModalBtn = document.getElementById('openAddModalBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelModalBtn = document.getElementById('cancelModalBtn');
  const sessionForm = document.getElementById('sessionForm');
  const modalTitle = document.getElementById('modalTitle');
  const sessionIdInput = document.getElementById('sessionId');
  const formSubject = document.getElementById('formSubject');
  const formTopic = document.getElementById('formTopic');
  const formDuration = document.getElementById('formDuration');
  const formTargetDate = document.getElementById('formTargetDate');
  const formPriority = document.getElementById('formPriority');
  const formStatus = document.getElementById('formStatus');
  const formNotes = document.getElementById('formNotes');

  let allSessions = [];

  // Set default target date to tomorrow
  const setDefaultDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    formTargetDate.value = tomorrow.toISOString().split('T')[0];
  };

  // Check Backend & Database Health
  const checkHealth = async () => {
    try {
      const res = await fetch('/health');
      if (res.ok) {
        const data = await res.json();
        healthStatusText.textContent = `DB Healthy (${data.database.latencyMs}ms)`;
        healthPill.style.borderColor = 'rgba(16, 185, 129, 0.4)';
      } else {
        healthStatusText.textContent = 'Degraded';
        healthPill.style.borderColor = 'rgba(244, 63, 94, 0.4)';
      }
    } catch (e) {
      healthStatusText.textContent = 'Disconnected';
      healthPill.style.borderColor = 'rgba(244, 63, 94, 0.4)';
    }
  };

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      const res = await fetch('/api/sessions/statistics');
      const json = await res.json();
      if (json.success) {
        statTotalSessions.textContent = json.data.totalSessions;
        statTotalHours.innerHTML = `${json.data.totalHours} <small>Jam</small>`;
        statPendingSessions.textContent = json.data.pendingSessions + json.data.inProgressSessions;
        statCompletedSessions.textContent = json.data.completedSessions;
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  // Fetch all sessions
  const fetchSessions = async () => {
    try {
      const search = searchInput.value.trim();
      const status = statusFilter.value;
      const priority = priorityFilter.value;

      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (status !== 'All') params.append('status', status);
      if (priority !== 'All') params.append('priority', priority);

      const res = await fetch(`/api/sessions?${params.toString()}`);
      const json = await res.json();

      if (json.success) {
        allSessions = json.data;
        renderSessions(allSessions);
        sessionCountTag.textContent = `${allSessions.length} Sesi Terdaftar`;
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
      sessionsGrid.innerHTML = `
        <div class="empty-state">
          <p>Gagal terhubung ke database backend. Periksa apakah container PostgreSQL berjalan.</p>
        </div>
      `;
    }
  };

  // Render cards
  const renderSessions = (sessions) => {
    if (!sessions || sessions.length === 0) {
      sessionsGrid.innerHTML = `
        <div class="empty-state">
          <p style="font-size: 1.5rem; margin-bottom: 0.5rem;">📖</p>
          <h4>Belum ada sesi belajar yang cocok</h4>
          <p>Gunakan tombol "+ Tambah Sesi Baru" untuk merencanakan target belajar.</p>
        </div>
      `;
      return;
    }

    sessionsGrid.innerHTML = sessions.map(s => {
      const formattedDate = new Date(s.target_date).toLocaleDateString('id-ID', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

      const statusClass = s.status.toLowerCase().replace(' ', '-');
      const priorityClass = s.priority.toLowerCase();

      return `
        <div class="session-card status-${statusClass}" data-id="${s.id}">
          <div>
            <div class="card-top">
              <span class="subject-badge">${escapeHtml(s.subject)}</span>
              <div class="badges-right">
                <span class="priority-tag priority-${priorityClass}">${s.priority}</span>
                <span class="status-tag status-${statusClass}">${s.status}</span>
              </div>
            </div>

            <h3 class="card-title">${escapeHtml(s.topic)}</h3>
            ${s.notes ? `<p class="card-notes">${escapeHtml(s.notes)}</p>` : ''}
          </div>

          <div>
            <div class="card-meta-row">
              <div class="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>${s.duration_minutes} Menit</span>
              </div>
              <div class="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>${formattedDate}</span>
              </div>
            </div>

            <div class="card-actions">
              <button class="toggle-status-btn" onclick="toggleStatus(${s.id}, '${s.status}')">
                ${s.status === 'Completed' ? '↩️ Tandai Belum Selesai' : '✓ Selesaikan'}
              </button>

              <div class="action-btn-group">
                <button class="btn-icon" title="Edit Sesi" onclick="openEditModal(${s.id})">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                </button>
                <button class="btn-icon delete" title="Hapus Sesi" onclick="deleteSession(${s.id})">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  };

  // Helper function to escape HTML
  const escapeHtml = (str) => {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  // Modal open/close handlers
  const openModal = (isEdit = false) => {
    modalTitle.textContent = isEdit ? 'Edit Sesi Belajar' : 'Tambah Sesi Belajar Baru';
    modalOverlay.classList.add('active');
  };

  const closeModal = () => {
    modalOverlay.classList.remove('active');
    sessionForm.reset();
    sessionIdInput.value = '';
    setDefaultDate();
  };

  openAddModalBtn.addEventListener('click', () => {
    sessionIdInput.value = '';
    sessionForm.reset();
    setDefaultDate();
    openModal(false);
  });

  closeModalBtn.addEventListener('click', closeModal);
  cancelModalBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Save session (Create or Update)
  sessionForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = sessionIdInput.value;
    const payload = {
      subject: formSubject.value.trim(),
      topic: formTopic.value.trim(),
      duration_minutes: parseInt(formDuration.value, 10),
      target_date: formTargetDate.value,
      priority: formPriority.value,
      status: formStatus.value,
      notes: formNotes.value.trim()
    };

    try {
      const url = id ? `/api/sessions/${id}` : '/api/sessions';
      const method = id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (json.success) {
        closeModal();
        fetchSessions();
        fetchStatistics();
      } else {
        alert(`Gagal menyimpan: ${json.message}`);
      }
    } catch (err) {
      alert(`Terjadi kesalahan jaringan: ${err.message}`);
    }
  });

  // Global actions for inline card buttons
  window.openEditModal = (id) => {
    const session = allSessions.find(s => s.id === id);
    if (!session) return;

    sessionIdInput.value = session.id;
    formSubject.value = session.subject;
    formTopic.value = session.topic;
    formDuration.value = session.duration_minutes;
    formTargetDate.value = session.target_date.split('T')[0];
    formPriority.value = session.priority;
    formStatus.value = session.status;
    formNotes.value = session.notes || '';

    openModal(true);
  };

  window.toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    try {
      const res = await fetch(`/api/sessions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const json = await res.json();
      if (json.success) {
        fetchSessions();
        fetchStatistics();
      }
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  window.deleteSession = async (id) => {
    if (!confirm(`Hapus sesi belajar #${id}?`)) return;

    try {
      const res = await fetch(`/api/sessions/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        fetchSessions();
        fetchStatistics();
      }
    } catch (err) {
      console.error('Error deleting session:', err);
    }
  };

  // Search and Filter Listeners
  let searchTimeout = null;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(fetchSessions, 250);
  });

  statusFilter.addEventListener('change', fetchSessions);
  priorityFilter.addEventListener('change', fetchSessions);

  // Initial Load
  setDefaultDate();
  checkHealth();
  fetchStatistics();
  fetchSessions();

  // Periodic health check every 15s
  setInterval(checkHealth, 15000);
});
