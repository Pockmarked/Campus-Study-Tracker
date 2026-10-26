# PANDUAN DEPLOYMENT PROYEK PADA AZURE VIRTUAL MACHINE
## PROYEK: CAMPUS STUDY TRACKER
**Mahasiswa**: Mochammad Nadhif Athallah (102062400144)

---

## 1. PERSIAPAN AZURE VIRTUAL MACHINE

1. **Buat Virtual Machine di Azure Portal**:
   - **Image**: Ubuntu Server 24.04 LTS x64 Gen2.
   - **Size**: Standard_B1s atau Standard_B2s (sesuai kuota Azure for Students).
   - **Authentication type**: SSH public key atau Password.
   - **Inbound Ports**: Izinkan port **SSH (22)** dan **HTTP (80)** pada Network Security Group (NSG).

2. **Koneksi SSH ke VM**:
   ```bash
   ssh <username>@<public-ip-vm>
   ```

3. **Install Docker Engine & Docker Compose pada Ubuntu**:
   ```bash
   sudo apt-get update
   sudo apt-get install -y ca-certificates curl gnupg
   sudo install -m 0755 -d /etc/apt/keyrings
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
   sudo chmod a+r /etc/apt/keyrings/docker.gpg

   echo \
     "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
     $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
     sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

   sudo apt-get update
   sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

   # Tambahkan user ke grup docker agar tidak perlu selalu mengetik sudo
   sudo usermod -aG docker $USER
   newgrp docker
   ```

---

## 2. DEPLOYMENT PROYEK DARI GITHUB

1. **Clone Repositori Anda di VM**:
   ```bash
   git clone https://github.com/<username-github-anda>/Campus-Study-Tracker.git
   cd Campus-Study-Tracker
   ```

2. **Jalankan Deployment Otomatis**:
   ```bash
   chmod +x scripts/deploy-azure.sh
   ./scripts/deploy-azure.sh
   ```
   Script di atas akan secara otomatis:
   - Membuat file `.env` dari `.env.example`.
   - Mengamankan permission `/var/run/docker.sock` menjadi `660`.
   - Melakukan `docker compose build`.
   - Menjalankan kontainer aplikasi dan basis data (`docker compose up -d`).
   - Melakukan loop pengecekan hingga status kontainer `healthy`.

3. **Verifikasi Status Kontainer**:
   ```bash
   docker compose ps
   ```
   Pastikan kedua service: `campus-study-app` dan `campus-study-db` berstatus `Up (healthy)`.

---

## 3. PENGAMBILAN 7 BUKTI PRAKTIKUM

Jalankan script verifikasi untuk menampilkan seluruh data yang dibutuhkan:
```bash
chmod +x scripts/verify-evidence.sh
./scripts/verify-evidence.sh
```

Ambil tangkapan layar terminal dan web browser sesuai panduan pada file `docs/PANDUAN_LAPORAN_LENGKAP.md`.

---

## 4. PENTING: PENGHEMATAN SALDO AZURE FOR STUDENTS

Setelah semua screenshot berhasil diambil:
1. Masuk ke **Azure Portal**.
2. Buka menu **Virtual Machines**.
3. Pilih VM Anda, lalu klik tombol **Stop**.
4. Pastikan status VM berubah menjadi **Stopped (deallocated)**.
   *(Jika status hanya "Stopped", komputasi masih dikenakan tagihan. Pastikan statusnya "Stopped (deallocated)" agar saldo kredit mahasiswa Anda aman).*
