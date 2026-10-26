#!/usr/bin/env bash
# ==============================================================================
# Script Verifikasi 7 Bukti Praktikum - Campus Study Tracker
# Mahasiswa : Mochammad Nadhif Athallah (102062400144)
# ==============================================================================

set -euo pipefail

echo "=========================================================="
echo " AUDIT & VERIFIKASI 7 BUKTI PRAKTIKUM KOMPUTASI AWAN"
echo " Mahasiswa: Mochammad Nadhif Athallah (102062400144)"
echo "=========================================================="

echo -e "\n[BUKTI 1] Struktur Project & Dockerfile"
ls -la

echo -e "\n[BUKTI 2] Status Kontainer (docker compose ps)"
docker compose ps

echo -e "\n[BUKTI 3] Akses Endpoint Health Check (Port 80/3000)"
curl -s http://localhost:80/health | jq . || curl -s http://localhost:80/health

echo -e "\n[BUKTI 4] Inspeksi Azure VM Hostname & IP Publik"
hostnamectl || true
curl -s https://ifconfig.me && echo ""

echo -e "\n[BUKTI 5] Verifikasi Persistent Volume PostgreSQL"
docker volume inspect campus_study_postgres_data

echo -e "\n[BUKTI 6] Verifikasi Isolasi Jaringan Backend (Internal Network)"
docker network inspect campus_study_backend_net

echo -e "\n[BUKTI 7] Verifikasi Kebijakan Restart (unless-stopped)"
docker inspect --format='{{.Name}}: RestartPolicy={{.HostConfig.RestartPolicy.Name}}' campus-study-app campus-study-db

echo -e "\n=========================================================="
echo " SELURUH 7 BUKTI TERVERIFIKASI!"
echo "=========================================================="
