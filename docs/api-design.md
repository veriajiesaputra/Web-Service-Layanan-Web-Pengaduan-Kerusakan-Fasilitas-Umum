# API Design Document v1 (Milestone M2 – API Blueprint)

**Mata Kuliah:** Pemrograman Web Service (5537344 / 3 SKS)  
**Institusi:** Fakultas Sains dan Teknologi (SAINTEK), Universitas Harkat Negeri  
**Dosen Pengampu:** Zaenul Arif, S.Kom., M.Kom.  
**Tahun Akademik:** Semester 7 (Ganjil) / 2026–2027  
**Waktu Penyusunan:** Oktober 2026  

---

## A. Identitas Proyek & Anggota Kelompok

* **Nama Proyek:** Sistem Layanan Pengaduan Warga Terpadu & Dasbor Operasional Desa (Desa Mandiri)
* **Kelompok:** Kelompok-6
* **Susunan Anggota & Pembagian Tanggung Jawab:**
  1. **Veri Ajie Saputra (NIM: 23215017)** – *Koordinator & Core API Engineer* (Layanan Pengaduan & Kategori)
  2. **Siti Furkotun Najiyah (NIM: 23215056)** – *Identity & Citizen Auth Specialist* (Kependudukan, Profil, & Autentikasi)
  3. **Siti Novia Desi Nurkhikmah (NIM: 23215006)** – *Field Operations Specialist* (Satgas Lapangan, Penugasan & Disposisi)
  4. **Tiara Aulia Maharani (NIM: 23215039)** – *Community & Emergency Specialist* (Partisipasi Warga, Upvote, Komentar, & Catatan Harian)
* **Base URL:** `https://api.desamandiri.id` (Produksi) / `http://127.0.0.1:8000` (Pengembangan Lokal)
* **Prefix & Versi API:** `/api/v1`
* **Bahasa Penamaan Resource:** Bahasa Inggris (*standardized plural nouns, lowercase, kebab-case* untuk multi-kata), selaras dengan konvensi Laravel `Route::apiResource`.

---

## B. Pemodelan Resource & Relasi

Sistem memodelkan domain kebutuhan desa ke dalam resource berorientasi objek yang memisahkan model penyimpanan database (ERD) dari representasi client.

### 1. Tabel Daftar Resource Utama & Sub-Resource
| No | Resource (Jamak) | Jenis Resource | Atribut Utama | Relasi | Aktor Pengakses |
|---|---|---|---|---|---|
| 1 | `citizens` | Collection / Item | `id`, `nik`, `name`, `phone`, `dusun`, `rt_rw`, `created_at` | 1–N ke `reports` | Warga, Admin Desa |
| 2 | `categories` | Collection / Item | `id`, `name`, `slug`, `icon`, `description` | 1–N ke `reports` | Publik, Admin Desa |
| 3 | `reports` | Collection / Item | `id`, `ticket_no`, `citizen_id`, `category_id`, `title`, `description`, `location_name`, `latitude`, `longitude`, `status`, `priority`, `upvote_count`, `created_at`, `updated_at` | N–1 `citizens`, N–1 `categories`, 1–N `dispatches`, 1–N `comments`, 1–N `upvotes` | Publik, Warga, Admin, Satgas |
| 4 | `teams` | Collection / Item | `id`, `name`, `division`, `leader_name`, `phone`, `vehicle`, `status` (*ready, deployed, resting*) | 1–N ke `dispatches` | Admin Desa, Satgas |
| 5 | `dispatches` | Sub-resource | `id`, `report_id`, `team_id`, `officer_name`, `instruction`, `dispatched_at`, `completed_at` | N–1 `reports`, N–1 `teams` | Admin Desa, Satgas, Pemilik Laporan |
| 6 | `comments` | Sub-resource | `id`, `report_id`, `author_name`, `author_role` (*citizen, officer, team*), `message`, `created_at` | N–1 `reports` | Warga Pelapor, Petugas |
| 7 | `upvotes` | Sub-resource | `id`, `report_id`, `citizen_id`, `created_at` | N–1 `reports`, N–1 `citizens` | Warga Terdaftar |
| 8 | `daily-notes` | Collection / Item | `id`, `officer_name`, `title`, `note_date`, `content`, `category`, `created_at` | Bebas (Log Internal) | Admin Desa |
| 9 | `emergency-contacts` | Collection / Item | `id`, `agency_name`, `category`, `phone_number`, `description`, `is_active` | Bebas (Direktori Publik) | Publik, Warga |
| 10 | `me` | Singleton | `id`, `name`, `phone`, `dusun`, `rt_rw` | Mengarah ke profil akun login | Warga Terautentikasi |

### 2. Diagram Hubungan Resource (ERD Ringkas)
```text
 +---------------+             +----------------+
 |   citizens    | 1 ------- N |    reports     | N ------- 1 +----------------+
 +---------------+             +----------------+             |   categories   |
         |                             |                      +----------------+
         | 1                           | 1
         |                             +--------------------+
         | N                           | 1                  | 1
 +---------------+             +----------------+   +----------------+
 |    upvotes    |             |   dispatches   |   |    comments    |
 +---------------+             +----------------+   +----------------+
                                       | N
                                       |
                                       | 1
                               +----------------+
                               |     teams      |
                               +----------------+
```

---

## C. Endpoint Matrix (20 Endpoint Lengkap)

Semua endpoint diawali dengan prefix `/api/v1`.

| No | Method | Endpoint URI | Fungsi Layanan | Aktor Utama | Status Sukses | Status Gagal Umum |
|---|---|---|---|---|---|---|
| 1 | `POST` | `/auth/login` | Autentikasi sesi warga via nomor WhatsApp/OTP | Semua | `200 OK` | `400 Bad Request`, `401 Unauthorized`, `422 Unprocessable Content` |
| 2 | `POST` | `/auth/register` | Pendaftaran akun warga desa baru | Semua | `201 Created` + `Location` | `409 Conflict`, `422 Unprocessable Content` |
| 3 | `POST` | `/auth/logout` | Mencabut token akses sesi aktif | Warga Login | `204 No Content` | `401 Unauthorized` |
| 4 | `GET` | `/me` | Mengambil data profil warga yang sedang login | Warga Login | `200 OK` | `401 Unauthorized` |
| 5 | `PATCH` | `/me` | Memperbarui profil akun sendiri | Warga Login | `200 OK` | `401 Unauthorized`, `422 Unprocessable Content` |
| 6 | `GET` | `/categories` | Menampilkan seluruh kategori jenis infrastruktur | Semua | `200 OK` | - |
| 7 | `POST` | `/categories` | Menambahkan kategori aduan baru | Admin Desa | `201 Created` + `Location` | `401 Unauthorized`, `403 Forbidden`, `422 Unprocessable Content` |
| 8 | `GET` | `/reports` | Mengambil daftar aduan warga (filter, sort, pagination) | Semua | `200 OK` | `400 Bad Request`, `422 Unprocessable Content` |
| 9 | `POST` | `/reports` | Mengajukan aduan infrastruktur baru | Warga | `201 Created` + `Location` | `401 Unauthorized`, `422 Unprocessable Content` |
| 10 | `GET` | `/reports/{id}` | Melihat detail satu laporan & progres timeline | Semua | `200 OK` | `404 Not Found` |
| 11 | `PATCH` | `/reports/{id}` | Memperbarui rincian aduan (hanya status pending) | Pemilik Laporan | `200 OK` | `401`, `403`, `404`, `409 Conflict`, `422` |
| 12 | `DELETE` | `/reports/{id}` | Menghapus aduan sebelum diproses | Pemilik, Admin | `204 No Content` | `401`, `403`, `404`, `409 Conflict` |
| 13 | `POST` | `/reports/{id}/dispatches` | Verifikasi aduan dan disposisi tim lapangan | Admin Desa | `201 Created` + `Location` | `401`, `403`, `404`, `409 Conflict`, `422` |
| 14 | `GET` | `/reports/{id}/dispatches` | Melihat riwayat penugasan tim lapangan (audit) | Warga, Satgas | `200 OK` | `404 Not Found` |
| 15 | `POST` | `/reports/{id}/upvotes` | Memberikan/mencabut upvote dukungan warga | Warga Login | `201 Created` / `200 OK` | `401 Unauthorized`, `404 Not Found` |
| 16 | `GET` | `/reports/{id}/comments` | Mengambil daftar komentar diskusi aduan | Semua | `200 OK` | `404 Not Found` |
| 17 | `POST` | `/reports/{id}/comments` | Menambahkan komentar tindak lanjut penanganan | Warga, Petugas | `201 Created` + `Location` | `401`, `404`, `422 Unprocessable Content` |
| 18 | `GET` | `/teams` | Melihat ketersediaan 4 regu satgas & armada | Admin, Satgas | `200 OK` | `401 Unauthorized` |
| 19 | `PATCH` | `/teams/{id}` | Memperbarui status kesiapan regu satgas | Admin, Satgas | `200 OK` | `401`, `403`, `404`, `422` |
| 20 | `GET` | `/daily-notes` | Daftar catatan koordinasi harian perangkat desa | Admin Desa | `200 OK` | `401 Unauthorized`, `403 Forbidden` |
| 21 | `POST` | `/daily-notes` | Menambahkan catatan harian operasional baru | Admin Desa | `201 Created` + `Location` | `401`, `403`, `422 Unprocessable Content` |
| 22 | `GET` | `/emergency-contacts` | Mengambil daftar nomor darurat & instansi desa | Semua | `200 OK` | - |

---

## D. Desain Query Parameter (Filtering, Search, Sorting, & Pagination)

Diterapkan pada 2 endpoint collection utama:

### 1. Endpoint `GET /api/v1/reports`
* **Filter Parameter (Whitelist):**
  * `category_id`: integer ID kategori (contoh: `?category_id=2`)
  * `status`: enum tepat (`?status=pending` atau beberapa nilai `?status=verified,in_progress`)
  * `priority`: enum (`low`, `medium`, `high`, `urgent`)
  * `dusun`: string nama dusun (contoh: `?dusun=Krajan`)
  * `date_from` & `date_to`: tanggal ISO 8601 (contoh: `?date_from=2026-10-01&date_to=2026-10-31`)
* **Search Parameter (`q`):**
  * `?q=lampu`: melakukan pencarian parsial teks pada kolom `title`, `description`, dan `location_name`.
* **Sorting Parameter (`sort`):**
  * Whitelist field: `created_at`, `upvote_count`, `priority`.
  * Awalan minus `-` untuk urutan menurun (*descending*).
  * Contoh: `?sort=-upvote_count,-created_at`.
  * **Default Sort:** `-created_at,id` (deterministik).
* **Pagination (Offset/Page-based):**
  * Parameter: `page` dan `per_page`.
  * Default: `per_page=15` (standar Laravel).
  * Batas Maksimum: `per_page=100`.
  * Kebijakan jika melebihi batas: Respon error `422 Unprocessable Content` dengan pesan eksplisit.
* **Contoh Request Lengkap:**
  ```http
  GET /api/v1/reports?status=in_progress&category_id=1&dusun=Krajan&q=jembatan&sort=-created_at&page=1&per_page=10 HTTP/1.1
  Host: api.desamandiri.id
  Accept: application/json
  ```

### 2. Endpoint `GET /api/v1/daily-notes`
* **Filter Parameter:**
  * `category`: enum (`briefing`, `maintenance`, `incident`, `general`)
  * `date_from` & `date_to`: filter tanggal catatan
* **Search Parameter (`q`):**
  * `?q=drainase`: pencarian pada `title` dan `content`.
* **Sorting Parameter (`sort`):**
  * Whitelist field: `note_date`, `created_at`.
  * **Default Sort:** `-note_date,-created_at`.
* **Pagination:**
  * Default: `per_page=15`, Maksimum: `50`.

---

## E. Desain Representasi Data (Request & Response)

Sistem menggunakan **Envelope JSON Standar** (`data`, `links`, `meta`) yang selaras penuh dengan keluaran Eloquent API Resource Laravel. Field menggunakan format `snake_case`, waktu dengan ISO 8601 berzona waktu (+07:00), dan nilai sensitif (seperti password/token internal) disembunyikan sesuai rekomendasi OWASP API3:2023.

### 1. Representasi Collection Berpagination (`GET /api/v1/reports?page=2&per_page=2`)
```json
{
  "data": [
    {
      "id": 101,
      "ticket_no": "LAP-202610-0101",
      "title": "Lampu penerangan pos ronda padam total",
      "category": {
        "id": 3,
        "name": "Penerangan Jalan Umum (PJU)"
      },
      "reporter": {
        "id": 14,
        "name": "Budi Santoso",
        "dusun": "Krajan"
      },
      "location_name": "Pos Ronda RT 02 / RW 01",
      "latitude": -7.324512,
      "longitude": 108.219845,
      "status": "in_progress",
      "priority": "high",
      "upvote_count": 18,
      "comment_count": 4,
      "created_at": "2026-10-18T19:30:00+07:00",
      "updated_at": "2026-10-19T08:15:20+07:00"
    },
    {
      "id": 102,
      "ticket_no": "LAP-202610-0102",
      "title": "Saluran irigasi tersumbat sampah ranting",
      "category": {
        "id": 2,
        "name": "Tata Air & Irigasi Desa"
      },
      "reporter": {
        "id": 22,
        "name": "Ahmad Dahlan",
        "dusun": "Sukajaya"
      },
      "location_name": "Blok Sawah Lor RT 05",
      "latitude": -7.329811,
      "longitude": 108.223401,
      "status": "pending",
      "priority": "medium",
      "upvote_count": 7,
      "comment_count": 1,
      "created_at": "2026-10-19T07:10:00+07:00",
      "updated_at": "2026-10-19T07:10:00+07:00"
    }
  ],
  "links": {
    "first": "https://api.desamandiri.id/api/v1/reports?page=1&per_page=2",
    "last": "https://api.desamandiri.id/api/v1/reports?page=15&per_page=2",
    "prev": "https://api.desamandiri.id/api/v1/reports?page=1&per_page=2",
    "next": "https://api.desamandiri.id/api/v1/reports?page=3&per_page=2"
  },
  "meta": {
    "current_page": 2,
    "from": 3,
    "to": 4,
    "per_page": 2,
    "total": 30,
    "last_page": 15
  }
}
```

### 2. Representasi Detail Item Tunggal (`GET /api/v1/reports/101`)
```json
{
  "data": {
    "id": 101,
    "ticket_no": "LAP-202610-0101",
    "title": "Lampu penerangan pos ronda padam total",
    "category": {
      "id": 3,
      "name": "Penerangan Jalan Umum (PJU)",
      "slug": "pju"
    },
    "description": "Lampu PJU di tiang nomor 04 samping pos ronda mati sejak 2 hari lalu akibat korsleting kabel saat hujan lebat.",
    "location_name": "Pos Ronda RT 02 / RW 01, Dusun Krajan",
    "latitude": -7.324512,
    "longitude": 108.219845,
    "status": "in_progress",
    "priority": "high",
    "upvote_count": 18,
    "reporter": {
      "id": 14,
      "name": "Budi Santoso",
      "phone": "0812-3456-7890",
      "dusun": "Krajan",
      "rt_rw": "RT 02 / RW 01"
    },
    "current_dispatch": {
      "id": 45,
      "team_name": "Regu Kelistrikan & PJU",
      "officer_name": "Kaur Pembangunan",
      "instruction": "Lakukan penggantian bohlam LED 50W dan periksa sambungan trafo.",
      "dispatched_at": "2026-10-19T08:00:00+07:00"
    },
    "timeline": [
      {
        "status": "pending",
        "title": "Laporan Diajukan",
        "description": "Aduan warga tercatat pada sistem.",
        "actor": "Budi Santoso (Warga)",
        "timestamp": "2026-10-18T19:30:00+07:00"
      },
      {
        "status": "in_progress",
        "title": "Disposisi Satgas Lapangan",
        "description": "Laporan diverifikasi sah dan regu teknisi ditugaskan.",
        "actor": "Kaur Pembangunan (Admin Desa)",
        "timestamp": "2026-10-19T08:00:00+07:00"
      }
    ],
    "created_at": "2026-10-18T19:30:00+07:00",
    "updated_at": "2026-10-19T08:15:20+07:00"
  }
}
```

### 3. Representasi Singleton (`GET /api/v1/me`)
```json
{
  "data": {
    "id": 14,
    "nik": "320xxxxxxxxxxxx",
    "name": "Budi Santoso",
    "phone": "081234567890",
    "dusun": "Krajan",
    "rt_rw": "02/01",
    "total_reports": 3,
    "created_at": "2026-09-01T10:00:00+07:00"
  }
}
```

---

## F. Error Handling & Status Codes yang Konsisten

Semua endpoint menghasilkan format respon error standar yang dapat dibaca mesin (`message`, `code`, `errors`) maupun manusia:

### 1. Error Validasi Input (`422 Unprocessable Content`)
```http
HTTP/1.1 422 Unprocessable Content
Content-Type: application/json

{
  "message": "Data pengaduan yang dikirim tidak valid.",
  "errors": {
    "category_id": [
      "Kategori aduan wajib dipilih dan harus valid."
    ],
    "latitude": [
      "Titik koordinat latitude harus di antara -90 hingga 90 derajat."
    ],
    "per_page": [
      "Ukuran data per_page tidak boleh melebihi batas 100."
    ]
  }
}
```

### 2. Error Aturan Bisnis (`409 Conflict`)
Terjadi ketika aksi bertentangan dengan siklus hidup (*state*) sistem saat ini:
```http
HTTP/1.1 409 Conflict
Content-Type: application/json

{
  "message": "Laporan ini tidak dapat dihapus atau dibatalkan karena regu satgas lapangan sedang dalam proses pengerjaan.",
  "code": "REPORT_ALREADY_DISPATCHED"
}
```

### 3. Error Autentikasi & Hak Akses
* **401 Unauthorized:**
  ```json
  {
    "message": "Akses ditolak. Token autentikasi tidak ditemukan atau kedaluwarsa.",
    "code": "UNAUTHENTICATED"
  }
  ```
* **403 Forbidden:**
  ```json
  {
    "message": "Anda tidak memiliki wewenang untuk mendisposisikan tiket aduan.",
    "code": "PERMISSION_DENIED"
  }
  ```

---

## G. Aksi di Luar CRUD (Non-CRUD Process Modeling)

### Proses Bisnis: Verifikasi & Disposisi Penugasan Tim Satgas Lapangan
* **Masalah Bisnis:** Laporan aduan warga harus diverifikasi keabsahannya oleh perangkat desa, lalu ditugaskan ke salah satu regu teknisi lapangan dengan instruksi tertulis dan bukti audit waktu penugasan.
* **Pola yang Dipilih:** **Pola B (Proses Dimodelkan Sebagai Sub-Resource: `/dispatches`)**
* **Endpoint:** `POST /api/v1/reports/{id}/dispatches`
* **Alasan Pemilihan Pola B daripada Pola A / Pola C:**
  1. *Audit Trail & Riwayat Penugasan:* Penugasan memiliki metadata sendiri yang kaya (nama pejabat desa yang menugaskan, regu tim yang menerima, instruksi khusus, catatan waktu `dispatched_at`, estimasi selesai, dan bukti serah terima).
  2. *Resource-Oriented:* Menjaga URI tetap bersih dari kata kerja seperti `/verify` atau `/assignTeam`. Penugasan adalah entitas "dokumen disposisi" yang dibuat via `POST` dan dapat dibaca riwayatnya kembali via `GET /api/v1/reports/{id}/dispatches`.
  3. *Otorisasi Spesifik:* Memudahkan middleware membatasi hak akses khusus aktor Perangkat Desa (*Officer / Admin*) tanpa merusak endpoint CRUD dasar `/reports/{id}` milik warga.

#### Contoh Request:
```http
POST /api/v1/reports/101/dispatches HTTP/1.1
Host: api.desamandiri.id
Authorization: Bearer ctz_token_88921a
Content-Type: application/json

{
  "team_id": 3,
  "instruction": "Tolong segera cek tiang nomor 04 di Dusun Krajan. Sambungkan kembali kabel utama yang terputus.",
  "priority": "high"
}
```

#### Contoh Response Sukses:
```http
HTTP/1.1 201 Created
Location: /api/v1/reports/101/dispatches/45
Content-Type: application/json

{
  "data": {
    "id": 45,
    "report_id": 101,
    "team": {
      "id": 3,
      "name": "Regu Kelistrikan & PJU"
    },
    "officer_name": "Kaur Pembangunan",
    "instruction": "Tolong segera cek tiang nomor 04 di Dusun Krajan. Sambungkan kembali kabel utama yang terputus.",
    "dispatched_at": "2026-10-19T08:00:00+07:00",
    "status": "assigned"
  }
}
```

---

## H. Catatan Keputusan Desain (Architectural Decision Records)

1. **Pemilihan Pola Pembaruan: Preferensi `PATCH` Dibandingkan `PUT`**
   * *Keputusan:* Endpoint pembaruan utama dianjurkan menggunakan `PATCH` (`PATCH /api/v1/reports/{id}` dan `PATCH /api/v1/teams/{id}`).
   * *Alasan:* Dalam aplikasi seluler warga dan panel desa, client sangat jarang mengirimkan seluruh kolom objek kembali secara utuh. Memakai `PATCH` mencegah terjadinya *accidental wipe* (terhapusnya data yang tidak sengaja terlewat dikirim oleh frontend) serta jauh lebih hemat bandwidth.
2. **Model Pagination: Offset-Based untuk Laporan Desa, Cursor-Based untuk Log Diskusi**
   * *Keputusan:* Menggunakan `page` & `per_page` pada `/reports` dan `/daily-notes`.
   * *Alasan:* Operator admin desa membutuhkan navigasi nomor halaman langsung (*pagination controls*) dan informasi total baris aduan (`total`, `last_page`) untuk laporan pertanggungjawaban berkala.
3. **Penyatuan Format Envelope Respons**
   * *Keputusan:* Seluruh respons sukses wajib memiliki root envelope `data`.
   * *Alasan:* Memberikan kemudahan adaptasi bagi pengembang mobile/frontend (TypeScript interface konsisten) dan mempermudah injeksi metadata pagination atau relasi tambahan tanpa menciptakan *breaking change*.
4. **Strategi Versioning di URI (`/api/v1`)**
   * *Keputusan:* Versi diletakkan langsung pada path segmen URL.
   * *Alasan:* Sangat transparan, mudah diuji langsung di browser atau Postman tanpa memerlukan manipulasi header HTTP yang rumit, dan didukung penuh oleh routing prefix di Laravel (`Route::prefix('v1')`).

---

## Lampiran: Hasil Peer Review & Evaluasi Desain (Aktivitas 4)

Berdasarkan checklist penilaian peer review Modul Ajar Minggu ke-4:

| No | Butir Pemeriksaan | Hasil Evaluasi | Keterangan Verifikasi |
|---|---|:---:|---|
| 1 | Semua URI memakai kata benda jamak, huruf kecil, dan tanpa kata kerja | **YA** | Menggunakan `/reports`, `/teams`, `/categories`, `/dispatches` (tidak ada `/createReport` atau `/getReports`). |
| 2 | Prefix `/api/v1` dipakai konsisten | **YA** | Seluruh 20 endpoint diawali dengan `/api/v1/`. |
| 3 | Method sesuai operasi; GET tidak mengubah data | **YA** | Operasi baca hanya menggunakan `GET` murni; operasi perubahan status menggunakan `PATCH`/`POST`. |
| 4 | POST $\rightarrow$ 201, DELETE $\rightarrow$ 204, dan status gagal relevan dicantumkan | **YA** | `POST` mengembalikan status `201 Created` disertai header `Location`; `DELETE` mengembalikan `204 No Content`. |
| 5 | Nesting maksimal 2 tingkat | **YA** | Nesting terdalam dibatasi hanya 2 tingkat: `/reports/{id}/dispatches` dan `/reports/{id}/comments`. |
| 6 | Setiap collection memiliki pagination dengan batas maksimum | **YA** | Seluruh collection mendukung `page` & `per_page`, default 15, maksimal 100. |
| 7 | Filter/sort memakai query parameter dengan whitelist | **YA** | Parameter whitelist didefinisikan ketat pada query string; sortir acak ditolak dengan `422`. |
| 8 | Format error seragam | **YA** | Mengadopsi struktur `message`, `errors`, dan `code` di seluruh skenario kegagalan. |
