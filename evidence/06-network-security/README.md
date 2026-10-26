# Bukti 6: Keamanan Jaringan Internal Database

## Deskripsi Bukti
Tangkapan layar hasil inspeksi Docker Network `campus_study_backend_net` yang membuktikan bahwa basis data PostgreSQL berada dalam jaringan internal terisolasi (`"Internal": true`) dan port 5432 tidak dipublikasikan ke host publik.

## Nama Target File Tangkapan Layar
Simpan tangkapan layar Anda di folder ini dengan nama:
- `bukti_06_internal_network.png`

## Perintah Terminal untuk Menampilkan Bukti
Jalankan di terminal Azure VM:
```bash
docker network inspect campus_study_backend_net
```
Pastikan baris `"Internal": true` dan daftar kontainer yang tergabung terlihat jelas pada screenshot terminal.

## Teks Keterangan Gambar untuk Word (Caption)
```text
Gambar 6: Inspeksi Docker Network yang memverifikasi bahwa jaringan database PostgreSQL terisolasi secara internal.
```

## Isi Ulasan Singkat untuk Laporan
> Aspek keamanan jaringan dipenuhi melalui network segmentation. Database PostgreSQL ditempatkan pada network internal terisolasi tanpa mempublikasikan port 5432 ke host publik. Hanya aplikasi Node.js yang berada dalam bridge network yang sama yang memiliki otoritas berkomunikasi dengan database.
