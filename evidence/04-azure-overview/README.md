# Bukti 4: Azure Portal VM Overview

## Deskripsi Bukti
Tangkapan layar panel overview Virtual Machine pada Microsoft Azure Portal. Tangkapan layar ini membuktikan keberadaan VM Ubuntu 24.04 dengan status aktif (Running) atau Stopped (deallocated), Resource Group, Public IP address, serta ukuran instance yang digunakan.

## Nama Target File Tangkapan Layar
Simpan tangkapan layar Anda di folder ini dengan nama:
- `bukti_04_azure_vm_overview.png`

## Cara Mengambil Bukti di Azure Portal
1. Masuk ke portal: [https://portal.azure.com](https://portal.azure.com)
2. Buka menu **Virtual Machines**.
3. Pilih VM yang Anda gunakan untuk praktikum ini.
4. Tangkap layar bagian **Overview** yang memperlihatkan:
   - Nama Virtual Machine
   - Status
   - Public IP Address
   - Operating System (Linux - Ubuntu)
   - Size (contoh: Standard_B1s)

## Teks Keterangan Gambar untuk Word (Caption)
```text
Gambar 4: Tangkapan layar panel Microsoft Azure Portal yang menunjukkan status dan konfigurasi Virtual Machine Ubuntu.
```

## Isi Ulasan Singkat untuk Laporan
> Virtual Machine di-provisioning pada region Microsoft Azure dengan sistem operasi Ubuntu Server 24.04 LTS. Konfigurasi Network Security Group (NSG) disesuaikan untuk mengizinkan traffic inbound port 22 (SSH) dan port 80 (HTTP).
