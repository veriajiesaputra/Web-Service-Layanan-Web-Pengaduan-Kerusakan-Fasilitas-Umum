# Sistem Layanan Pengaduan Warga Terpadu & Dasbor Operasional Desa (Desa Kepunduhan)

> **Proyek Mata Kuliah:** Pemrograman Web Service  
> **Institusi:** Universitas Harkat Negeri — Fakultas Sains dan Teknologi  
> **Studi Kasus:** Desa Kepunduhan, Kec. Kramat, Kab. Tegal 52181  
> **Penyusun (Kelompok 6):**  
> 1. Veri Ajie Saputra (NIM: 23215017) – Koordinator & Core API Engineer  
> 2. Siti Furkotun Najiyah (NIM: 23215056) – Identity & Citizen Auth Specialist  
> 3. Siti Novia Desi Nurkhikmah (NIM: 23215006) – Field Operations Specialist  
> 4. Tiara Aulia Maharani (NIM: 23215039) – Community & Emergency Specialist  

---

## 📌 Tentang Proyek
Aplikasi web service terpadu untuk pelayanan aspirasi dan pengaduan infrastruktur masyarakat desa. Sistem ini menghubungkan antarmuka warga (Citizen Portal), panel operasional perangkat desa (Admin Dashboard), dan koordinasi satgas lapangan (Field Teams) melalui arsitektur **RESTful API modern**.

---

## 🌟 Fitur Utama

### 1. Portal Layanan Warga (Public Portal)
* **Pelaporan Aduan Infrastruktur**: Formulir interaktif dengan upload foto, penentuan dusun, RT/RW, dan titik koordinat lokasi.
* **Autentikasi Akun Warga**: Registrasi & login warga dengan validasi nomor WhatsApp untuk kepemilikan tiket aduan.
* **Fitur "Laporan Saya"**: Filter khusus untuk memantau status aduan yang diajukan oleh akun warga yang sedang login.
* **Peta GIS Wilayah Interaktif**: Pemetaan sebaran aduan berbasis **OpenStreetMap & Leaflet** dengan layer peta jalan dan citra satelit.
* **Transparansi Penanganan**: Riwayat linimasa penanganan (*timeline tracking*), upvote dukungan warga, dan kolom komentar.

### 2. Panel Dasbor Administrator Desa
* **Verifikasi & Disposisi Tiket**: Menerima aduan warga, menentukan skala prioritas, dan menugaskan ke 4 divisi Satgas Lapangan:
  1. *Regu Bina Marga (Jalan & Jembatan)*
  2. *Tim Tata Air & Irigasi Desa*
  3. *Regu Kelistrikan & PJU (Penerangan Jalan Umum)*
  4. *Satgas Kebersihan & Ruang Hijau*
* **Peta GIS Persebaran Wilayah**: Pemantauan spasial geografis sebaran aduan per-dusun dengan filter status.
* **Catatan Koordinasi Harian**: Dokumentasi arahan dan catatan harian perangkat desa.
* **Statistik & Laporan Real-Time**: Ringkasan metrik respon penanganan dan persentase tindak lanjut aduan.

### 3. RESTful Web Service
* Menggunakan standar HTTP Semantik: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
* Format data pertukaran terstandarisasi **JSON** dengan *Content Negotiation* (`Accept: application/json`).
* *Error Handling & Status Codes*: `200 OK`, `201 Created`, `403 Forbidden`, `404 Not Found`, dan `422 Unprocessable Entity`.

---

## 📡 Daftar Endpoint REST API

| Method | Endpoint URI | Keterangan |
| :--- | :--- | :--- |
| `GET` | `/api/reports` | Mengambil seluruh daftar laporan pengaduan & filter |
| `POST` | `/api/reports` | Membuat laporan pengaduan warga baru |
| `GET` | `/api/reports/{id}` | Melihat detail satu laporan beserta riwayat tracking |
| `PUT/PATCH` | `/api/reports/{id}` | Memperbarui status / disposisi tiket aduan |
| `DELETE` | `/api/reports/{id}` | Menghapus laporan (proteksi hak milik pelapor) |
| `GET` | `/api/reports/stats` | Mengambil agregasi data statistik laporan |
| `GET` | `/api/teams` | Mengambil daftar tim satgas lapangan & penugasan |
| `POST` | `/api/citizen/login` | Autentikasi sesi akun warga |
| `POST` | `/api/citizen/register`| Pendaftaran akun warga desa baru |
| `GET` | `/api/emergency-contacts`| Daftar kontak darurat dan instansi penanganan desa |

---

## 🚀 Cara Menjalankan Aplikasi di Lokal

### 1. Prasyarat
* PHP >= 8.2 (Laragon / XAMPP)
* Composer
* Node.js >= 18 & NPM

### 2. Langkah Instalasi
```bash
# 1. Clone repository ini
git clone <URL_REPOSITORY_ANDA>
cd web_service

# 2. Install dependensi PHP & JavaScript
composer install
npm install

# 3. Buat file environment
cp .env.example .env
php artisan key:generate

# 4. Build asset frontend (React & Tailwind CSS)
npm run build

# 5. Jalankan server lokal
php artisan serve
```

Aplikasi dapat diakses melalui browser:
* **Portal Warga:** [http://127.0.0.1:8000](http://127.0.0.1:8000)
* **Panel Admin:** [http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin)
* **API Endpoint:** [http://127.0.0.1:8000/api/reports](http://127.0.0.1:8000/api/reports)

---

## 🧪 Pengujian API (API Client / Postman)
Pengujian REST API dapat dilakukan menggunakan Postman atau cURL:

```bash
# 1. Menguji GET Semua Laporan (Status 200 OK)
curl -i -s http://127.0.0.1:8000/api/reports -H "Accept: application/json"

# 2. Menguji POST Buat Laporan Baru (Status 201 Created)
curl -i -s -X POST http://127.0.0.1:8000/api/reports \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"title":"Lampu jalan padam","category":"penerangan","location":"Dusun Krajan","description":"Padam sejak semalam","reporterName":"Budi Santoso","reporterPhone":"08123456789"}'

# 3. Menguji Validasi Error (Status 422 Unprocessable Entity)
curl -i -s -X POST http://127.0.0.1:8000/api/reports \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{}'
```

---

## 📄 Lisensi
Proyek ini dikembangkan untuk keperluan akademik Mata Kuliah Pemrograman Web Service.
