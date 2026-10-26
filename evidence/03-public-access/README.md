# Bukti 3: Akses Publik Melalui Browser

## Deskripsi Bukti
Tangkapan layar antarmuka aplikasi web *Campus Study Tracker* yang diakses melalui browser pada komputer lokal menggunakan alamat IP Publik Azure VM (Port 80). Tangkapan layar ini memperlihatkan antarmuka lengkap dengan identitas mahasiswa (Mochammad Nadhif Athallah - 102062400144) serta indikator database yang sehat.

## Nama Target File Tangkapan Layar
Simpan tangkapan layar Anda di folder ini dengan nama:
- `bukti_03_public_access.png`

## URL Akses Browser
Buka di browser Anda:
```text
http://<IP-PUBLIK-AZURE-VM>/
```
dan juga bisa menunjukkan endpoint health:
```text
http://<IP-PUBLIK-AZURE-VM>/health
```

## Teks Keterangan Gambar untuk Word (Caption)
```text
Gambar 3: Tampilan antarmuka web Campus Study Tracker yang dapat diakses publik melalui browser via alamat IP Azure VM.
```

## Isi Ulasan Singkat untuk Laporan
> Aplikasi web berhasil menyajikan dashboard interaktif bagi mahasiswa dengan fitur pencatatan sesi belajar, filtering, status live health check, serta metrik durasi belajar yang tersambung langsung ke basis data relasional PostgreSQL.
