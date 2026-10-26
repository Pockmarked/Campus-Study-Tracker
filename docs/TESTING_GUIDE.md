# Panduan Pengujian & Pengambilan 7 Bukti Wajib Praktikum — Campus Study Tracker
**Mahasiswa**: Mochammad Nadhif Athallah (102062400144)  
**Mata Kuliah**: Komputasi Awan (Semester 5)

Dokumen ini memuat prosedur resmi pengujian untuk menghasilkan dan memverifikasi **Tujuh Bukti Pengujian Wajib** yang disyaratkan oleh asisten praktikum Komputasi Awan.

---

## Ringkasan Prosedur 7 Bukti Wajib Asprak

| No. Bukti | Nama Bukti | Lokasi Eksekusi | Perintah / Tindakan | Berkas Bukti yang Dihasilkan |
| :---: | :--- | :---: | :--- | :--- |
| **1** | Struktur Project & Konfigurasi | Host Lokal / GitHub | `ls -la`, `cat Dockerfile`, `compose.yaml` | `evidence/01-project-structure/bukti_01_project_structure.png` |
| **2** | Status Container di Azure VM | Terminal SSH VM | `docker compose ps` | `evidence/02-container-status/bukti_02_docker_compose_ps.png` |
| **3** | Akses Aplikasi via Public IP | Browser Laptop | Buka `http://<IP_PUBLIC_VM>` | `evidence/03-public-access/bukti_03_public_access.png` |
| **4** | Halaman Overview Azure Portal | Browser Laptop | Portal Azure -> VM Overview | `evidence/04-azure-overview/bukti_04_azure_vm_overview.png` |
| **5** | Uji Persistensi Data Database | Browser & Terminal | Buat sesi belajar -> `down` -> `up -d` -> verifikasi GET | `evidence/05-data-persistence/bukti_05_uji_persistensi.png` |
| **6** | Keamanan Network Database | Terminal SSH VM | `docker network inspect campus_study_backend_net` | `evidence/06-network-security/bukti_06_internal_network.png` |
| **7** | Kebijakan Restart Container | Terminal SSH VM | `docker inspect RestartPolicy`, SIGKILL crash test | `evidence/07-restart-test/bukti_07_restart_test.png` |

---

## Panduan Detail Tiap Bukti

### BUKTI 1: STRUKTUR PROJECT DAN KONFIGURASI
1. **Langkah Verifikasi:**
   Periksa pohon berkas repositori GitHub atau direktori lokal:
   ```bash
   ls -la
   cat Dockerfile
   cat compose.yaml
   ```
2. **Kondisi yang Tervalidasi:**
   - Direktori terstruktur (`src/`, `public/`, `docs/`, `tests/`, `scripts/`, `evidence/`).
   - File `Dockerfile` multi-stage build dan non-root user `node`.
   - File `.env` terproteksi dan tidak ter-commit ke Git.

---

### BUKTI 2: STATUS CONTAINER DI AZURE VM
1. **Langkah Verifikasi:**
   Di terminal SSH Azure VM:
   ```bash
   cd ~/campus-study-tracker
   docker compose ps
   ```
2. **Kondisi yang Tervalidasi:**
   - Container `campus-study-app` berstatus `Up (healthy)` dengan port `0.0.0.0:80->3000/tcp`.
   - Container `campus-study-db` berstatus `Up (healthy)` dengan port `5432/tcp` internal.

---

### BUKTI 3: APLIKASI MELALUI PUBLIC IP
1. **Langkah Verifikasi:**
   Buka browser dan akses alamat IP publik:
   ```text
   http://<IP_PUBLIC_VM>
   ```
2. **Kondisi yang Tervalidasi:**
   - Address bar memuat URL IP publik Azure VM.
   - Header menampilkan nama Mochammad Nadhif Athallah (102062400144).
   - Indikator database berstatus "DB Healthy".

---

### BUKTI 4: HALAMAN OVERVIEW AZURE PORTAL
1. **Langkah Verifikasi:**
   Buka Azure Portal -> Virtual Machines -> VM Anda.
2. **Kondisi yang Tervalidasi:**
   - Menampilkan Nama VM, OS Linux Ubuntu 24.04, Status Running, dan Public IP.

---

### BUKTI 5: UJI PERSISTENSI BASIS DATA
1. **Langkah Verifikasi:**
   - Buat satu sesi belajar baru via form web UI.
   - Matikan kontainer: `docker compose down`.
   - Nyalakan kembali: `docker compose up -d`.
   - Refresh browser web: data sesi baru terbukti persisten dan tetap tampil.

---

### BUKTI 6: KEAMANAN JARINGAN DATABASE
1. **Langkah Verifikasi:**
   ```bash
   docker network inspect campus_study_backend_net
   ```
2. **Kondisi yang Tervalidasi:**
   - Atribut `"Internal": true`.
   - Database tidak dapat diakses langsung dari host atau internet publik.

---

### BUKTI 7: KEBIJAKAN RESTART KONTAINER
1. **Langkah Verifikasi:**
   - Periksa konfigurasi: `docker inspect campus-study-app | grep RestartPolicy`.
   - Terminasi proses paksa: `docker kill campus-study-app`.
   - Periksa status: Kontainer otomatis berstatus `Up` kembali dalam beberapa detik.
