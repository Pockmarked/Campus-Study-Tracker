# Kebijakan Keamanan Sistem (Security Policy & Best Practices) — Campus Study Tracker
**Mahasiswa**: Mochammad Nadhif Athallah (102062400144)  
**Mata Kuliah**: Komputasi Awan (Semester 5)

Dokumen ini menguraikan seluruh lapisan pertahanan dan praktik keamanan (*defense-in-depth*) yang diterapkan pada proyek **Campus Study Tracker**.

---

## 1. Perlindungan Kredensial & Lingkungan (.env Protection)

- **Pemisahan Konfigurasi dan Kode:** Seluruh kredensial sensitif seperti nama database, user, dan password dibaca melalui environment variables menggunakan pustaka `dotenv`.
- **Eksklusi Git:** File `.env` secara tegas didaftarkan pada `.gitignore`. Kredensial tidak pernah masuk ke dalam staging Git maupun riwayat commit GitHub.
- **Eksklusi Image Docker:** File `.env` didaftarkan pada `.dockerignore` untuk memastikan file rahasia lokal tidak pernah tersalin ke dalam layer image kontainer.
- **Penyediaan Template Aman:** Disediakan file `.env.example` yang hanya berisi nama variabel dan nilai contoh non-sensitif sebagai panduan konfigurasi.

---

## 2. Isolasi Jaringan Database (Internal Network Isolation)

- **Tidak Ada Port Host yang Dipublikasikan:** File `compose.yaml` secara sengaja **tidak** menyertakan direktif `ports` pada service `database`.
- **Docker Internal Bridge Network:** Service `database` hanya terhubung ke jaringan `campus_study_backend_net` yang memiliki konfigurasi:
  ```yaml
  campus_backend_net:
    name: campus_study_backend_net
    driver: bridge
    internal: true
  ```
  Direktif `internal: true` melarang paket jaringan keluar ke internet maupun menerima koneksi masuk langsung dari gateway host. Satu-satunya entitas yang dapat berkomunikasi dengan PostgreSQL adalah kontainer `app` yang berada pada jaringan yang sama.

---

## 3. Penguatan Keamanan Kontainer (Container Hardening)

- **Non-Root Execution (`USER node`):** Pada `Dockerfile`, stage akhir (*runner*) beralih ke user `node` berhak akses terbatas (*least privilege*).
- **Minimal Base Image:** Penggunaan `node:20-alpine` dan `postgres:16-alpine` memangkas utilitas yang tidak diperlukan dan memperkecil attack surface.
- **Multi-Stage Build Sanitization:** Alat kompilasi dan dependensi pengembangan dibuang pada stage builder sehingga image produksi hanya membawa file esensial.
- **Docker Socket Hardening:** Permission `/var/run/docker.sock` dipelihara pada `root:docker 660` dan tidak pernah dibiarkan `666` (world-writable).

---

## 4. Keamanan Aplikasi & Validasi Data

- **Pencegahan SQL Injection:** Seluruh kueri SQL di `src/services/studyService.js` menggunakan *parameterized queries* bawaan PostgreSQL driver (`$1, $2, ...`). Nilai input tidak pernah digabungkan secara langsung (*string concatenation*) ke dalam kueri SQL.
- **Validasi Input Berlapis:** Validasi ketat pada `studyController.js` terhadap subjek mata kuliah, topik, durasi (menit), target tanggal, dan whitelisting prioritas/status.
- **Pencegahan Cross-Site Scripting (XSS):** Data dinamis yang dirender ke antarmuka pengguna disaring melalui fungsi `escapeHtml()`.

---

## 5. Keamanan Infrastruktur Azure

- **Kunci Asimetris Modern (SSH):** Akses remote ke Azure VM menggunakan autentikasi pasangan kunci SSH.
- **Azure Network Security Group (NSG) Rules:** Inbound hanya mengizinkan port 22 (SSH) dan port 80 (HTTP). Port 5432 (PostgreSQL) diblokir sepenuhnya dari internet.
