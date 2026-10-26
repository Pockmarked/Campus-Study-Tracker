# Penjelasan Konfigurasi Docker & Dockerfile — Campus Study Tracker
**Mahasiswa**: Mochammad Nadhif Athallah (102062400144)  
**Mata Kuliah**: Komputasi Awan (Semester 5)

Dokumen ini menyajikan rincian teknis mengenai desain `Dockerfile` dan `compose.yaml` yang dibangun khusus untuk proyek **Campus Study Tracker**, sesuai 8 ketentuan wajib tugas praktikum Komputasi Awan.

---

## 1. Rincian & Manfaat Multi-Stage Dockerfile

Dockerfile dibangun dari awal (*custom-built*) menggunakan pendekatan **Multi-Stage Build** berbasis image resmi Node.js Alpine (`node:20-alpine`).

```dockerfile
# STAGE 1: Dependencies Builder
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# STAGE 2: Minimal Production Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

RUN apk add --no-cache curl && chown -R node:node /app

COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json ./
COPY --chown=node:node src/ ./src/
COPY --chown=node:node public/ ./public/

USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["node", "src/server.js"]
```

### Keunggulan Desain Ini:
1. **Optimasi Docker Layer Caching:**  
   File `package.json` dan `package-lock.json` disalin terlebih dahulu sebelum seluruh source code. Jika hanya file frontend atau rute yang diedit, Docker akan menggunakan layer dependensi dari cache build sebelumnya sehingga proses build sangat cepat.
2. **Keterpisahan Build & Runtime (Multi-Stage):**  
   Stage `deps` menyelesaikan instalasi dependensi tanpa menyisakan cache npm di layer akhir.
3. **Ukuran Image Ringan:**  
   Penggunaan base image `alpine` menghasilkan ukuran kontainer akhir yang sangat ringkas (~150MB).
4. **Keamanan Non-Root User (`USER node`):**  
   Menetapkan `USER node` guna mencegah potensi privilege escalation pada host Linux.
5. **Observabilitas Healthcheck:**  
   Pemeriksaan periodik internal dengan `curl -f http://localhost:3000/health` memberikan sinyal kesehatan kontainer secara presisi.

---

## 2. Penjelasan Konfigurasi `compose.yaml`

File `compose.yaml` mengorkestrasi dua service utama dan satu profile test:

### A. Service `app`
- **`build.context: .`**: Membangun image aplikasi secara mandiri.
- **`ports: - "${APP_PORT:-80}:3000"`**: Memetakan port HTTP 80 pada host VM ke port 3000 kontainer.
- **`networks: [campus_frontend_net, campus_backend_net]`**: Jembatan antara lalu lintas publik dan komunikasi basis data backend.
- **`depends_on.database.condition: service_healthy`**: Menjamin web server baru menyala setelah database PostgreSQL benar-benar siap.
- **`restart: unless-stopped`**: Memastikan aplikasi hidup kembali secara otomatis saat terjadi unhandled crash.

### B. Service `database`
- **`image: postgres:16-alpine`**: Basis data relasional stabil dan hemat memori.
- **`networks: [campus_backend_net]`**: Berada di jaringan terisolasi (`internal: true`).
- **`volumes: [study_postgres_data:/var/lib/postgresql/data]`**: Data tetap tersimpan persisten.
- **`healthcheck`**: Menguji kesiapan server database melalui perintah `pg_isready`.
