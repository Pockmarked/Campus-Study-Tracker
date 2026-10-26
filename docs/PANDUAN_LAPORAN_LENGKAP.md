# PANDUAN PENYUSUNAN LAPORAN PRAKTIKUM KOMPUTASI AWAN
## MODUL: VIRTUALISASI PROYEK PRIBADI DENGAN DOCKER PADA AZURE VIRTUAL MACHINE

**Mahasiswa**: Mochammad Nadhif Athallah  
**NIM**: 102062400144  
**Mata Kuliah**: Komputasi Awan (Semester 5)  
**Judul Proyek**: Campus Study Tracker (Cloud Docker Edition)  
**Format Penamaan File Final**: `102062400144_MochammadNadhifAthallah_TugasDocker.docx` (atau `.pdf`)

---

## 1. STRUKTUR & TATA LETAK LAPORAN RESMI

Laporan praktikum disarankan dibuat sebanyak **3 sampai 4 halaman** rapi di Microsoft Word dengan susunan bab sebagai berikut:

### Halaman 1: Identitas & Matriks 8 Ketentuan Wajib
- **Header**: Judul Praktikum Komputasi Awan, Identitas Lengkap (Nama: Mochammad Nadhif Athallah, NIM: 102062400144, Kelas).
- **Deskripsi Singkat Proyek**: Penjelasan aplikasi *Campus Study Tracker* sebagai sistem pencatatan target dan durasi sesi belajar mahasiswa berbasis Node.js 20 Alpine, PostgreSQL 16 Alpine, dan Docker Compose.
- **Tabel Matriks 8 Ketentuan Wajib Asprak**: (Copy tabel di Bagian 2 di bawah).

### Halaman 2: Bukti 1, Bukti 2, dan Bukti 3
- **Bukti 1**: Tangkapan Layar Struktur Proyek di GitHub & Terminal VM (`ls -la`).
- **Bukti 2**: Tangkapan Layar Status Kontainer Aktif (`docker compose ps` status `Up (healthy)`).
- **Bukti 3**: Tangkapan Layar Akses Publik Aplikasi & Endpoint `/health` melalui Browser.

### Halaman 3: Bukti 4 dan Bukti 5
- **Bukti 4**: Tangkapan Layar Azure Portal Overview (Menampilkan VM Name, Status Running/Deallocated, dan Public IP).
- **Bukti 5**: Tangkapan Layar Pengujian Persistensi Data PostgreSQL (Data tetap utuh setelah container di-restart).

### Halaman 4: Bukti 6, Bukti 7, dan Kesimpulan
- **Bukti 6**: Tangkapan Layar Keamanan Jaringan Internal Database (`docker network inspect`).
- **Bukti 7**: Tangkapan Layar Pengujian Kebijakan Restart Otomatis (`unless-stopped` pasca simulasi crash).
- **Kesimpulan Praktikum**: Pernyataan bahwa seluruh 8 ketentuan wajib telah terpenuhi dan sistem berjalan stabil pada infrastruktur Microsoft Azure.

---

## 2. TABEL MATRIKS 8 KETENTUAN WAJIB ASPRAK

Salin tabel berikut langsung ke Word pada Halaman 1:

| No | Ketentuan Wajib Asprak | Status | Keterangan Implementasi Teknis |
| :---: | :--- | :---: | :--- |
| **1** | **Dockerfile Sendiri** | **MEMENUHI** | Dibuat multi-stage build berbasis image `node:20-alpine`, non-root user `node`, exposed port 3000, serta healthcheck internal menggunakan `curl`. |
| **2** | **Compose Minimal Dua Service** | **MEMENUHI** | Mengorkestrasi 2 service utama (`app` dan `database`) serta 1 profile service (`test-runner`) dalam file `compose.yaml`. |
| **3** | **Internal Network Database** | **MEMENUHI** | Database PostgreSQL berada di dalam jaringan bridge internal (`campus_study_backend_net`) dengan parameter `internal: true`. Port 5432 tidak dipublikasikan ke host demi keamanan. |
| **4** | **Persistent Volume** | **MEMENUHI** | Menggunakan named volume `study_postgres_data` yang di-mount ke direktori `/var/lib/postgresql/data` sehingga data sesi belajar persisten saat container dimatikan. |
| **5** | **Healthcheck & Depends_on** | **MEMENUHI** | Database divalidasi via `pg_isready` dan aplikasi via HTTP endpoint `/health`. Service `app` memiliki konfigurasi `depends_on: database: condition: service_healthy`. |
| **6** | **Restart Unless-Stopped** | **MEMENUHI** | Diterapkan kebijakan `restart: unless-stopped` pada service `app` dan `database`, menjamin proses me-recover otomatis saat terjadi unhandled crash. |
| **7** | **Keamanan Environment** | **MEMENUHI** | File `.env` dikecualikan dari version control melalui `.gitignore`. Disediakan file contoh `.env.example` yang bebas dari kredensial sensitif. |
| **8** | **Deployment Azure VM IP Publik** | **MEMENUHI** | Seluruh stack di-deploy pada Microsoft Azure Virtual Machine (Ubuntu 24.04 LTS) dan sukses diakses via browser publik melalui port 80. |

---

## 3. PANDUAN PENGAMBILAN & PENAMAAN 7 GAMBAR BUKTI

Berikut adalah daftar nama file gambar yang harus disimpan ke folder `evidence/` dan dimasukkan ke laporan Word:

### Bukti 1: Struktur Proyek & Dockerfile
- **Nama File**: `evidence/01-project-structure/bukti_01_project_structure.png`
- **Cara Pengambilan**: Buka repository GitHub di browser atau buka terminal Azure VM dan ketik `ls -la`. Pastikan file `Dockerfile`, `compose.yaml`, `.env.example`, `.gitignore`, dan direktori `src/` terlihat jelas.
- **Keterangan Gambar (Caption)**:  
  *Gambar 1: Struktur direktori proyek Campus Study Tracker pada repositori GitHub dan Azure VM, menunjukkan Dockerfile mandiri dan berkas konfigurasi Compose.*

### Bukti 2: Status Kontainer (docker compose ps)
- **Nama File**: `evidence/02-container-status/bukti_02_docker_compose_ps.png`
- **Cara Pengambilan**: Jalankan perintah `docker compose ps` di terminal VM. Pastikan kontainer `campus-study-app` dan `campus-study-db` berstatus `Up (healthy)`.
- **Keterangan Gambar (Caption)**:  
  *Gambar 2: Hasil eksekusi docker compose ps yang memverifikasi kedua service berjalan stabil dengan status healthy.*

### Bukti 3: Akses Publik Melalui Browser
- **Nama File**: `evidence/03-public-access/bukti_03_public_access.png`
- **Cara Pengambilan**: Buka browser di laptop, akses `http://<IP-PUBLIK-AZURE-VM>/`. Pastikan antarmuka *Campus Study Tracker* tampil lengkap dengan nama Mochammad Nadhif Athallah (102062400144) dan indikator status database hijau.
- **Keterangan Gambar (Caption)**:  
  *Gambar 3: Tampilan antarmuka web Campus Study Tracker yang dapat diakses publik melalui browser via alamat IP Azure VM.*

### Bukti 4: Azure Portal Overview
- **Nama File**: `evidence/04-azure-overview/bukti_04_azure_vm_overview.png`
- **Cara Pengambilan**: Buka Microsoft Azure Portal, masuk ke halaman Virtual Machines, klik VM milik Anda. Tangkap layar yang menampilkan Nama VM, Status (Running / Stopped), Public IP, dan Resource Group.
- **Keterangan Gambar (Caption)**:  
  *Gambar 4: Tangkapan layar panel Microsoft Azure Portal yang menunjukkan status dan konfigurasi Virtual Machine Ubuntu.*

### Bukti 5: Uji Persistensi Data PostgreSQL
- **Nama File**: `evidence/05-data-persistence/bukti_05_uji_persistensi.png`
- **Cara Pengambilan**:
  1. Tambah 1 data sesi belajar baru di web UI.
  2. Matikan kontainer di VM: `docker compose down`.
  3. Nyalakan kembali kontainer: `docker compose up -d`.
  4. Refresh web browser, ambil tangkapan layar yang membuktikan data baru tersebut tetap ada dan tidak terhapus.
- **Keterangan Gambar (Caption)**:  
  *Gambar 5: Verifikasi persistensi basis data relasional PostgreSQL menggunakan named volume setelah proses restart kontainer.*

### Bukti 6: Keamanan Jaringan Internal Database
- **Nama File**: `evidence/06-network-security/bukti_06_internal_network.png`
- **Cara Pengambilan**: Jalankan di terminal VM:  
  `docker network inspect campus_study_backend_net`  
  Tangkap layar baris `"Internal": true` dan daftar kontainer yang terhubung.
- **Keterangan Gambar (Caption)**:  
  *Gambar 6: Inspeksi Docker Network yang memverifikasi bahwa jaringan database PostgreSQL terisolasi secara internal.*

### Bukti 7: Pengujian Auto-Restart Kontainer
- **Nama File**: `evidence/07-restart-test/bukti_07_restart_test.png`
- **Cara Pengambilan**:
  1. Jalankan `docker inspect campus-study-app | grep -A 5 RestartPolicy` (menampilkan `unless-stopped`).
  2. Simulasikan crash dengan `docker kill campus-study-app`.
  3. Jalankan `docker compose ps` setelah 3 detik yang menunjukkan kontainer otomatis hidup kembali (*RestartCount* bertambah).
- **Keterangan Gambar (Caption)**:  
  *Gambar 7: Bukti efektivitas kebijakan restart unless-stopped dalam memulihkan kontainer secara otomatis pasca crash.*

---

## 4. CHECKLIST FINAL SEBELUM SUBMIT KE LMS

- [ ] Laporan Word memuat nama lengkap: **Mochammad Nadhif Athallah** dan NIM: **102062400144**.
- [ ] Matriks 8 Ketentuan Wajib tercantum lengkap pada Halaman 1.
- [ ] Seluruh 7 bukti pengujian memiliki tangkapan layar dan keterangan gambar yang jelas.
- [ ] Tidak ada kredensial atau password rahasia yang terbuka di dalam teks laporan.
- [ ] Repositori GitHub bersifat Publik sehingga dapat diakses oleh Asisten Praktikum.
- [ ] Virtual Machine Azure telah di-**Stop (Deallocate)** setelah pengambilan gambar untuk menghemat kredit langganan Azure for Students!
