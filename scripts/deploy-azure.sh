#!/usr/bin/env bash
# ==============================================================================
# Script Otomasi Deployment Azure VM - Campus Study Tracker
# Mahasiswa : Mochammad Nadhif Athallah (102062400144)
# Mata Kuliah: Komputasi Awan (Cloud Computing)
# ==============================================================================

set -euo pipefail

echo "=========================================================="
echo " Starting Automated Deployment: Campus Study Tracker"
echo " Mahasiswa : Mochammad Nadhif Athallah (102062400144)"
echo " Server OS : Ubuntu Linux (Azure Virtual Machine)"
echo "=========================================================="

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

# 1. Pastikan file .env tersedia
if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    echo "[SETUP] Menyalin .env.example ke .env..."
    cp .env.example .env
  else
    echo "[ERROR] File .env atau .env.example tidak ditemukan!"
    exit 1
  fi
fi

# 2. Hardening Docker Socket Permissions (Prioritas Keamanan)
echo "[SECURITY] Memeriksa hak akses Docker socket..."
if [ -S /var/run/docker.sock ]; then
  sudo chown root:docker /var/run/docker.sock || true
  sudo chmod 660 /var/run/docker.sock || true
  echo "[SECURITY] Docker socket diamankan dengan permission 660 (root:docker)."
fi

# 3. Pull / Build Images
echo "[DOCKER] Melakukan build container images..."
docker compose build --pull

# 4. Jalankan Services
echo "[DOCKER] Menjalankan multi-container service (detached mode)..."
docker compose up -d

# 5. Tunggu status healthy
echo "[HEALTH] Menunggu container berstatus healthy..."
MAX_WAIT=60
COUNTER=0
while [ $COUNTER -lt $MAX_WAIT ]; do
  DB_STATUS=$(docker inspect --format='{{json .State.Health.Status}}' campus-study-db 2>/dev/null || echo '"unknown"')
  APP_STATUS=$(docker inspect --format='{{json .State.Health.Status}}' campus-study-app 2>/dev/null || echo '"unknown"')

  if [ "$DB_STATUS" = '"healthy"' ] && [ "$APP_STATUS" = '"healthy"' ]; then
    echo "[HEALTH] Seluruh container (database & app) berstatus HEALTHY!"
    break
  fi

  echo "  Menunggu status healthy... DB: $DB_STATUS, APP: $APP_STATUS (${COUNTER}s)"
  sleep 5
  COUNTER=$((COUNTER + 5))
done

# 6. Status Akhir
echo "=========================================================="
echo " Ringkasan Status Container:"
docker compose ps
echo "=========================================================="
echo " Deployment Selesai!"
echo " Uji endpoint publik: curl -I http://localhost:80/health"
