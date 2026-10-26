# MATRIKS KEPATUHAN 8 KETENTUAN WAJIB ASPRAK
## PROYEK: CAMPUS STUDY TRACKER
**Mahasiswa**: Mochammad Nadhif Athallah (102062400144)

Dokumen ini memetakan seluruh ketentuan praktikum dari asisten praktikum ke berkas implementasi dan konfigurasi teknis yang terdapat pada proyek ini.

---

### Ketentuan 1: Dockerfile Sendiri
- **Status**: MEMENUHI (100%)
- **Berkas Implementasi**: `Dockerfile`
- **Rincian Teknis**:
  - Menggunakan *multi-stage build* berbasis `node:20-alpine`.
  - Menggunakan non-root user bawaan Alpine (`USER node`).
  - Menetapkan `WORKDIR /app` dengan *chown* kepemilikan yang tepat.
  - Membuka port internal `EXPOSE 3000`.
  - Menyertakan instruksi `HEALTHCHECK` berbasis `curl -f http://localhost:3000/health`.

---

### Ketentuan 2: Compose Minimal Dua Service
- **Status**: MEMENUHI (100%)
- **Berkas Implementasi**: `compose.yaml`
- **Rincian Teknis**:
  - Service 1: `app` (Node.js 20 Express Web Server).
  - Service 2: `database` (PostgreSQL 16 Alpine Database Engine).
  - Service 3: `test-runner` (Profile test untuk pengujian otomatis integrasi).

---

### Ketentuan 3: Internal Network Database
- **Status**: MEMENUHI (100%)
- **Berkas Implementasi**: `compose.yaml` (blok `networks`)
- **Rincian Teknis**:
  - Jaringan `campus_backend_net` dideklarasikan dengan parameter `internal: true`.
  - Port PostgreSQL 5432 **tidak di-expose atau dipublikasikan** ke port host Azure VM.
  - Hanya service `app` yang berada di dalam jaringan yang sama yang dapat mengakses database melalui DNS container `database`.

---

### Ketentuan 4: Persistent Volume
- **Status**: MEMENUHI (100%)
- **Berkas Implementasi**: `compose.yaml` (blok `volumes`)
- **Rincian Teknis**:
  - Named volume: `study_postgres_data`.
  - Target mount: `/var/lib/postgresql/data`.
  - Teruji: Ketika kontainer database dimatikan (`docker compose down`) dan dijalankan ulang, seluruh tabel `study_sessions` dan data riwayat belajar tetap utuh tanpa kehilangan data.

---

### Ketentuan 5: Healthcheck & Depends_on
- **Status**: MEMENUHI (100%)
- **Berkas Implementasi**: `compose.yaml` (service `database` dan `app`)
- **Rincian Teknis**:
  - Database healthcheck: `pg_isready -U $$POSTGRES_USER -d $$POSTGRES_DB` (interval: 10s, timeout: 5s, retries: 5).
  - Web healthcheck: `curl -f http://localhost:3000/health || exit 1`.
  - Dependensi deklaratif: `depends_on: database: condition: service_healthy`. Mencegah aplikasi start sebelum database siap menerima query.

---

### Ketentuan 6: Restart Policy Unless-Stopped
- **Status**: MEMENUHI (100%)
- **Berkas Implementasi**: `compose.yaml` (service `app` dan `database`)
- **Rincian Teknis**:
  - Ditentukan `restart: unless-stopped` pada kedua service.
  - Memastikan proses yang mengalami sinyal crash atau kernel termination di-restart otomatis oleh daemon Docker dalam waktu singkat.

---

### Ketentuan 7: Keamanan Environment
- **Status**: MEMENUHI (100%)
- **Berkas Implementasi**: `.gitignore`, `.env.example`, `.env`
- **Rincian Teknis**:
  - File `.env` yang memuat password PostgreSQL diabaikan oleh Git.
  - Disediakan `.env.example` sebagai referensi struktur variabel bagi pengguna lain.
  - Tidak ada hardcoded password pada source code repository.

---

### Ketentuan 8: Deployment Azure VM IP Publik
- **Status**: MEMENUHI (100%)
- **Berkas Implementasi**: Port mapping `80:3000` pada `compose.yaml` & script `scripts/deploy-azure.sh`
- **Rincian Teknis**:
  - Web server melayani request HTTP publik pada port standar 80.
  - Dapat diakses oleh browser asisten praktikum melalui IP publik Virtual Machine.
