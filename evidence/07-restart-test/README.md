# Bukti 7: Pengujian Kebijakan Restart Otomatis (unless-stopped)

## Deskripsi Bukti
Tangkapan layar hasil inspeksi konfigurasi `RestartPolicy` pada kontainer serta bukti pengujian auto-restart saat kontainer mengalami crash mendadak akibat sinyal terminasi paksa.

## Nama Target File Tangkapan Layar
Simpan tangkapan layar Anda di folder ini dengan nama:
- `bukti_07_restart_test.png`

## Perintah Terminal untuk Menampilkan Bukti
Jalankan langkah-langkah berikut di terminal Azure VM:
```bash
# 1. Tampilkan kebijakan restart policy
docker inspect --format='Name: {{.Name}} | RestartPolicy: {{.HostConfig.RestartPolicy.Name}}' campus-study-app campus-study-db

# 2. Catat status awal
docker compose ps

# 3. Simulasikan terminasi paksa
docker kill campus-study-app

# 4. Periksa kembali status kontainer setelah 3 detik
sleep 3
docker compose ps
```
Tangkap layar terminal yang memperlihatkan status kontainer kembali `Up` dengan waktu `Up ... seconds` yang baru atau *RestartCount* yang bertambah.

## Teks Keterangan Gambar untuk Word (Caption)
```text
Gambar 7: Bukti efektivitas kebijakan restart unless-stopped dalam memulihkan kontainer secara otomatis pasca crash.
```

## Isi Ulasan Singkat untuk Laporan
> Mekanisme *high availability* tingkat dasar dicapai dengan menerapkan kebijakan `restart: unless-stopped`. Saat proses Node.js dihentikan mendadak, daemon Docker secara proaktif mendeteksi kegagalan tersebut dan meluncurkan ulang kontainer dalam hitungan detik.
