# Panduan Deployment Azure Virtual Machine — Campus Study Tracker
**Mahasiswa**: Mochammad Nadhif Athallah (102062400144)  
**Mata Kuliah**: Komputasi Awan (Semester 5)

Panduan komprehensif ini menjelaskan langkah demi langkah pelaksanaan deployment proyek **Campus Study Tracker** ke Microsoft Azure Virtual Machine milik mahasiswa.

---

## 1. Informasi Lingkungan Virtual Machine

- **Sistem Operasi Rekomendasi:** Ubuntu Server 24.04 LTS (Gen2)
- **Ukuran VM:** Standard_B1s atau Standard_B2s (Azure for Students)
- **Port Jaringan Terbuka (NSG):** Port 22 (SSH) dan Port 80 (HTTP).  
  *Catatan Penting: Port 5432 (PostgreSQL) TIDAK BOLEH dibuka pada NSG demi kepatuhan Ketentuan 3.*

---

## 2. Langkah Persiapan Sebelum Deployment

1. **Nyalakan Virtual Machine:**
   - Buka [Azure Portal](https://portal.azure.com/).
   - Masuk ke menu **Virtual Machines** -> pilih VM Anda.
   - Pastikan status VM adalah **Running**. Jika masih *Stopped (deallocated)*, klik tombol **Start**.
   - Catat **Public IP address** terbaru VM Anda.

2. **Periksa Network Security Group (NSG):**
   - Di halaman VM, pilih **Networking** (atau **Network settings**).
   - Pastikan terdapat Inbound Port Rule untuk:
     - Port `22` (SSH) — Action: Allow
     - Port `80` (HTTP) — Action: Allow
   - Pastikan TIDAK ADA aturan yang mengizinkan port `5432` dari internet.

---

## 3. Pengemasan & Pengiriman Kode Program ke VM (Clean Transfer)

Untuk mencegah pengiriman folder `node_modules` maupun file `.env`, gunakan berkas arsip terkompresi bersih:

1. **Kemas Proyek di Laptop (PowerShell):**
   ```powershell
   powershell -ExecutionPolicy Bypass -File "scripts\package-project.ps1"
   ```
   *Skrip ini menghasilkan berkas `campus-study-tracker-102062400144.zip` yang telah mengecualikan node_modules, .git, dan .env.*

2. **Kirim Berkas Arsip ke Azure VM:**
   ```powershell
   scp -i ~/.ssh/id_ed25519 campus-study-tracker-102062400144.zip <username>@<IP_PUBLIC_VM>:~/
   ```

---

## 4. Eksekusi Deployment di Azure VM Melalui SSH

1. **Masuk ke Sesi SSH VM:**
   ```bash
   ssh <username>@<IP_PUBLIC_VM>
   ```

2. **Ekstrak Berkas Proyek di Direktori Home:**
   ```bash
   mkdir -p ~/campus-study-tracker
   unzip -q ~/campus-study-tracker-102062400144.zip -d ~/campus-study-tracker/
   cd ~/campus-study-tracker
   ```

3. **Jalankan Skrip Deployment Otomatis:**
   ```bash
   chmod +x scripts/deploy-azure.sh
   ./scripts/deploy-azure.sh
   ```

4. **Verifikasi Status Kontainer:**
   ```bash
   docker compose ps
   ```
   *Pastikan kedua service: `campus-study-app` dan `campus-study-db` berstatus Up (healthy).*

---

## 5. Pengujian & Pengambilan 7 Bukti Praktikum

Jalankan script audit:
```bash
chmod +x scripts/verify-evidence.sh
./scripts/verify-evidence.sh
```

Ambil screenshot sesuai instruksi pada `docs/PANDUAN_LAPORAN_LENGKAP.md`.

---

## 6. Prosedur Pasca-Praktikum (Penghematan Kredit Azure)

Setelah seluruh gambar bukti pengujian berhasil diambil:
1. Kembali ke **Azure Portal**.
2. Masuk ke halaman **Virtual Machines** -> pilih VM Anda.
3. Klik tombol **Stop**.
4. Konfirmasi hingga status berubah menjadi **Stopped (deallocated)** agar tidak ada biaya komputasi yang terus berjalan.
