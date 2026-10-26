# Panduan Pemecahan Masalah (Troubleshooting Guide) — Campus Study Tracker
**Mahasiswa**: Mochammad Nadhif Athallah (102062400144)  
**Mata Kuliah**: Komputasi Awan (Semester 5)

Dokumen ini memuat daftar kendala teknis yang umum terjadi selama instalasi, build, deployment, dan pengujian kontainer Docker pada Azure VM beserta langkah solusi konkretnya.

---

## 1. Kendala Akses Website (Browser Menampilkan "Connection Refused")

### Gejala:
Browser tidak dapat membuka `http://<IP_PUBLIC_VM>` dan menampilkan pesan *Connection Refused* atau *ERR_CONNECTION_TIMED_OUT*.

### Kemungkinan Penyebab & Solusi:
1. **Status VM Azure sedang Deallocated/Stopped:**  
   Buka Azure Portal -> Virtual Machines -> VM Anda. Pastikan status adalah **Running**. Jika Stopped, klik tombol **Start**.
2. **IP Publik Azure VM Berubah:**  
   Jika VM pernah dimatikan tanpa reservasi Static IP, alamat IP publik akan berganti saat dinyalakan kembali. Periksa IP terbaru di halaman Overview Azure Portal.
3. **Port 80 Belum Dibuka pada Network Security Group (NSG):**  
   Masuk ke Azure Portal -> VM -> **Networking**. Tambahkan Inbound rule: Protocol: `TCP`, Port: `80`, Action: `Allow`.
4. **Kontainer Aplikasi Belum Berjalan:**  
   Masuk ke SSH VM dan periksa: `docker compose ps`. Jika kontainer mati, jalankan: `docker compose up -d`.

---

## 2. Kendala Healthcheck Database ("service_healthy" Timeout)

### Gejala:
Saat menjalankan `docker compose up -d`, service `app` tertahan dengan pesan *waiting for database to be healthy* lalu mengalami timeout.

### Kemungkinan Penyebab & Solusi:
1. **Kredensial Tidak Cocok antara App dan Database:**  
   Periksa file `.env` di VM. Pastikan `DB_USER`, `DB_PASSWORD`, dan `DB_NAME` sama persis dengan `POSTGRES_USER`, `POSTGRES_PASSWORD`, dan `POSTGRES_DB`.
2. **Kapasitas Disk Host Penuh:**  
   Jalankan `df -h` di terminal VM. Jika disk penuh, bersihkan image lama: `docker system prune -af`.
3. **Periksa Log Database:**  
   Jalankan: `docker compose logs database`.

---

## 3. Konflik Port 80 pada Host Linux

### Gejala:
Pesan error saat menjalankan docker compose:  
`Bind for 0.0.0.0:80 failed: port is already allocated`

### Solusi:
1. Periksa proses yang menggunakan port 80 di host:
   ```bash
   sudo ss -tulpn | grep :80
   ```
2. Jika Apache2 atau Nginx bawaan Ubuntu sedang aktif di background:
   ```bash
   sudo systemctl stop apache2 nginx
   sudo systemctl disable apache2 nginx
   ```
3. Jalankan ulang: `docker compose up -d`.

---

## 4. Permission Denied pada Docker Socket

### Gejala:
`permission denied while trying to connect to the Docker daemon socket`

### Solusi:
Jalankan di VM:
```bash
sudo usermod -aG docker $USER
sudo chown root:docker /var/run/docker.sock
sudo chmod 660 /var/run/docker.sock
newgrp docker
```
