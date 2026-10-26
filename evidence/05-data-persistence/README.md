# Bukti 5: Uji Persistensi Data PostgreSQL

## Deskripsi Bukti
Tangkapan layar yang membuktikan bahwa data sesi belajar yang diinput ke aplikasi tetap tersimpan aman di basis data PostgreSQL meskipun kontainer dihentikan (`docker compose down`) dan dijalankan kembali (`docker compose up -d`).

## Nama Target File Tangkapan Layar
Simpan tangkapan layar Anda di folder ini dengan nama:
- `bukti_05_uji_persistensi.png`

## Langkah Pengujian & Pengambilan Bukti
1. Buat satu sesi belajar baru di antarmuka web, misalnya:
   - Mata Kuliah: `Keamanan Komputasi Awan`
   - Topik: `Uji Coba Data Persistence Volume`
2. Di terminal Azure VM, hentikan seluruh kontainer:
   ```bash
   docker compose down
   ```
3. Nyalakan kembali kontainer:
   ```bash
   docker compose up -d
   ```
4. Buka kembali browser dan refresh halaman web `http://<IP-PUBLIK>/`.
5. Tangkap layar yang memperlihatkan bahwa sesi belajar `Keamanan Komputasi Awan` masih ada dan utuh di layar.
6. Opsional: Jalankan perintah inspect volume di terminal:
   ```bash
   docker volume inspect campus_study_postgres_data
   ```

## Teks Keterangan Gambar untuk Word (Caption)
```text
Gambar 5: Verifikasi persistensi basis data relasional PostgreSQL menggunakan named volume setelah proses restart kontainer.
```

## Isi Ulasan Singkat untuk Laporan
> Pengujian persistensi data membuktikan bahwa direktori data PostgreSQL yang dipetakan ke named volume `study_postgres_data` mengisolasi siklus hidup data dari siklus hidup kontainer. Siklus hidup container yang bersifat ephemeral tidak menyebabkan kehilangan data transaksional.
