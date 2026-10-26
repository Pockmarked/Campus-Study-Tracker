# Arsitektur Sistem — Campus Study Tracker
**Mahasiswa**: Mochammad Nadhif Athallah (102062400144)  
**Mata Kuliah**: Komputasi Awan (Semester 5)

Dokumen ini mendeskripsikan rancangan arsitektur perangkat lunak, infrastruktur kontainerisasi Docker, serta tata kelola jaringan dan data pada proyek **Campus Study Tracker**.

---

## 1. Diagram Arsitektur Keseluruhan

```mermaid
graph TD
    User["🌐 Browser Pengguna / Asisten Praktikum"] -->|HTTP Port 80| Host["💻 Azure Virtual Machine (Ubuntu 24.04 LTS)"]
    
    subgraph HostVM ["Azure VM Infrastructure"]
        Host -->|Port Forwarding 80:3000| AppContainer["📦 Container: campus-study-app<br/>(Node.js 20 Alpine + Express.js)<br/>Port: 3000"]
        
        subgraph DockerBridge ["Docker Networks"]
            subgraph FrontendNet ["campus_study_frontend_net (bridge)"]
                AppContainer
            end
            
            subgraph BackendNet ["campus_study_backend_net (bridge, internal: true)"]
                AppContainer -->|Koneksi DB (DB_HOST=database:5432)| DBContainer["📦 Container: campus-study-db<br/>(PostgreSQL 16 Alpine)<br/>NO HOST PORT MAPPING"]
            end
        end
        
        subgraph StoragePersistence ["Docker Volumes"]
            DBContainer -->|Persistensi Data ke /var/lib/postgresql/data| Vol[("💾 Named Volume: campus_study_postgres_data")]
        end
    end

    classDef container fill:#1e293b,stroke:#6366f1,stroke-width:2px,color:#fff;
    classDef network fill:#0f172a,stroke:#3b82f6,stroke-width:1px,stroke-dasharray: 5 5,color:#94a3b8;
    classDef storage fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#fff;
    class AppContainer,DBContainer container;
    class FrontendNet,BackendNet network;
    class Vol storage;
```

---

## 2. Rincian Komponen Sistem

### A. Frontend Layer (Static Assets via Express)
- **Teknologi:** Semantic HTML5, Vanilla CSS3 (Custom Variables, Responsive Grid/Flexbox), Vanilla Modern JavaScript (ES6+ Modular).
- **Aset:** `public/index.html`, `public/css/style.css`, `public/js/app.js`.
- **Fungsi:** 
  - Menyajikan dashboard statistik sesi belajar (Total Sesi, Total Jam Belajar, Sesi Menunggu, Sesi Selesai).
  - Kontrol pencarian instan (*debounce search*) dan multi-filter status serta prioritas.
  - Formulir modal pembuatan dan pembaruan sesi belajar.
  - Quick action status toggle langsung dari kartu sesi.
  - Indikator detak jantung sistem (*live health status pill*).

### B. Backend Application Layer (`app`)
- **Teknologi:** Node.js v20 (Alpine), Express.js.
- **Port:** Bind ke `0.0.0.0:3000` di dalam kontainer, dipetakan ke host port `80`.
- **Modul Utama:**
  - `src/server.js`: Inisialisasi HTTP server, eksekusi migrasi skema otomatis saat start, penanganan *graceful shutdown* (`SIGTERM`, `SIGINT`).
  - `src/app.js`: Konfigurasi Express, middleware, rute API, error handling terpusat.
  - `src/controllers/studyController.js`: Validasi input request HTTP, pemetaan kode status, dan format respons JSON.
  - `src/services/studyService.js`: Logika bisnis dan query parameterized SQL ke basis data.
  - `src/database/db.js`: Connection pool PostgreSQL (`pg.Pool`).
  - `src/database/migrate.js`: Migrasi DDL tabel `study_sessions` dan seeding data awal.
  - `src/routes/healthRoutes.js`: Endpoint observabilitas `/health`.

### C. Database Layer (`database`)
- **Teknologi:** PostgreSQL 16 (Alpine).
- **Port:** `5432` (internal Docker network saja, **TIDAK** dipublikasikan ke host demi keamanan).
- **Penyimpanan:** Named Volume `campus_study_postgres_data` di-mount ke `/var/lib/postgresql/data`.
