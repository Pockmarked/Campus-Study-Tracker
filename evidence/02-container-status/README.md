# Bukti 2: Status Kontainer Aktif (docker compose ps)

## Deskripsi Bukti
Tangkapan layar hasil eksekusi perintah `docker compose ps` di terminal Azure VM yang memverifikasi kedua service (`campus-study-app` dan `campus-study-db`) berjalan stabil dengan status `Up (healthy)`.

## Nama Target File Tangkapan Layar
Simpan tangkapan layar Anda di folder ini dengan nama:
- `bukti_02_docker_compose_ps.png`

## Perintah Terminal untuk Menampilkan Bukti
Jalankan di terminal Azure VM:
```bash
docker compose ps
```

## Teks Keterangan Gambar untuk Word (Caption)
```text
Gambar 2: Hasil eksekusi docker compose ps yang memverifikasi kedua service berjalan stabil dengan status healthy.
```

## Isi Ulasan Singkat untuk Laporan
> Status kontainer dipantau melalui mekanisme Docker Healthcheck bawaan. Service `database` diverifikasi melalui utilitas `pg_isready`, sedangkan service `app` diverifikasi melalui endpoint `/health`. Kedua container berhasil mencapai status `Up (healthy)` tanpa hambatan.
