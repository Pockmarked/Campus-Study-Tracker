# Bukti 1: Struktur Proyek & Dockerfile

## Deskripsi Bukti
Tangkapan layar struktur direktori repositori proyek di GitHub dan terminal Azure VM (`ls -la`), membuktikan adanya Dockerfile mandiri, berkas `compose.yaml`, `.env.example`, `.gitignore`, dan arsitektur kode sumber modular.

## Nama Target File Tangkapan Layar
Simpan tangkapan layar Anda di folder ini dengan nama:
- `bukti_01_project_structure.png`

## Perintah Terminal untuk Menampilkan Bukti
Jalankan di root folder proyek pada terminal Azure VM:
```bash
ls -la
```

## Teks Keterangan Gambar untuk Word (Caption)
```text
Gambar 1: Struktur direktori proyek Campus Study Tracker pada repositori GitHub dan Azure VM, menunjukkan Dockerfile mandiri dan berkas konfigurasi Compose.
```

## Isi Ulasan Singkat untuk Laporan
> Proyek Campus Study Tracker mengimplementasikan struktur modular berbasis Node.js 20 dan Express. File `Dockerfile` disusun mandiri menggunakan multi-stage build untuk efisiensi dan keamanan, didampingi konfigurasi `compose.yaml` untuk mengorkestrasi multi-service secara otomatis.
