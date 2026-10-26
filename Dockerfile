# ==============================================================================
# STAGE 1: DEPENDENCIES BUILDER
# ==============================================================================
FROM node:20-alpine AS deps

WORKDIR /app

# Salin berkas manifest dependensi untuk layer caching
COPY package.json package-lock.json ./

# Pasang dependensi produksi secara bersih
RUN npm ci --omit=dev --ignore-scripts

# ==============================================================================
# STAGE 2: PRODUCTION RUNNER
# ==============================================================================
FROM node:20-alpine AS runner

WORKDIR /app

# Atur lingkungan produksi
ENV NODE_ENV=production
ENV PORT=3000

# Pasang curl untuk healthcheck container
RUN apk add --no-cache curl

# Salin modul dari stage deps
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./

# Salin seluruh kode aplikasi & aset statis
COPY src/ ./src/
COPY public/ ./public/

# Jalankan kontainer menggunakan pengguna non-root bawaan Alpine demi keamanan
USER node

# Ekspos port aplikasi internal
EXPOSE 3000

# Pemeriksaan kesehatan berkala di dalam kontainer
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Titik masuk eksekusi server
CMD ["node", "src/server.js"]
