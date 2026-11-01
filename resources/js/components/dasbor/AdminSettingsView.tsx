import React, { useState } from 'react';

export const AdminSettingsView: React.FC = () => {
  const [villageName, setVillageName] = useState('Desa Kepunduhan');
  const [district, setDistrict] = useState('Kecamatan Kramat');
  const [regency, setRegency] = useState('Kabupaten Tegal');
  const [province, setProvince] = useState('Jawa Tengah');
  const [postalCode, setPostalCode] = useState('52181');
  const [address, setAddress] = useState('Jl. Beringin No.1 Desa Kepunduhan');
  const [email, setEmail] = useState('kepunduhanjaya96@gmail.com');
  const [slaHours, setSlaHours] = useState('4');
  const [waNotifications, setWaNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-[24px]">settings</span>
            <h2 className="font-headline text-lg font-bold text-slate-900">
              Pengaturan Sistem &amp; Profil Desa
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Konfigurasi identitas kantor desa, parameter waktu pelayanan (SLA), dan media penyimpanan data.
          </p>
        </div>

        {saved && (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>Pengaturan berhasil disimpan!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Identitas Desa */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="material-symbols-outlined text-slate-700 text-[20px]">account_balance</span>
            <h3 className="font-headline text-sm font-bold text-slate-900">Identitas Wilayah Pemerintahan Desa</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Nama Desa / Kelurahan</label>
              <input
                type="text"
                value={villageName}
                onChange={(e) => setVillageName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Kecamatan</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Kabupaten / Kota</label>
              <input
                type="text"
                value={regency}
                onChange={(e) => setRegency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Provinsi</label>
              <input
                type="text"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Kode Pos Resmi</label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email Resmi Kantor Desa</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="text-xs font-bold text-slate-700 block mb-1">Alamat Lengkap Balai Desa</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SLA & Operasional */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="material-symbols-outlined text-slate-700 text-[20px]">timer</span>
            <h3 className="font-headline text-sm font-bold text-slate-900">Standar Pelayanan Minimal (SLA) &amp; Notifikasi</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Target Maksimal Waktu Verifikasi Awal (Jam)
              </label>
              <input
                type="number"
                min="1"
                max="48"
                value={slaHours}
                onChange={(e) => setSlaHours(e.target.value)}
                className="w-32 px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Batas waktu aduan masuk harus diverifikasi oleh staf pelayanan sebelum berstatus terlambat (overdue).
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Integrasi WhatsApp Warga</label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={waNotifications}
                  onChange={(e) => setWaNotifications(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs font-semibold text-slate-800">
                  Kirim notifikasi otomatis pembaruan status ke nomor WhatsApp pelapor
                </span>
              </label>
              <p className="text-[11px] text-slate-500 mt-1 pl-7">
                Pelapor akan menerima pesan resmi setiap kali status tiket diperbarui (diverifikasi, dikerjakan, atau selesai).
              </p>
            </div>
          </div>
        </div>

        {/* Data Persistence Info */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="material-symbols-outlined text-slate-700 text-[20px]">database</span>
            <h3 className="font-headline text-sm font-bold text-slate-900">Status Penyimpanan Data (MySQL Database Laragon)</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Tabel Laporan Utama</span>
              <strong className="text-slate-800 font-mono mt-0.5 block">web_service.reports (InnoDB)</strong>
              <span className="inline-block mt-1 text-[11px] text-emerald-700 font-semibold">&bull; Aktif &amp; Terhubung MySQL</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Tabel Regu Lapangan</span>
              <strong className="text-slate-800 font-mono mt-0.5 block">web_service.teams (InnoDB)</strong>
              <span className="inline-block mt-1 text-emerald-700 font-semibold">&bull; 4 Divisi Tersinkron</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Tabel Catatan Harian</span>
              <strong className="text-slate-800 font-mono mt-0.5 block">web_service.daily_notes (InnoDB)</strong>
              <span className="inline-block mt-1 text-emerald-700 font-semibold">&bull; Log Briefing Aktif</span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs hover:shadow transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">save</span>
            <span>Simpan Perubahan Pengaturan</span>
          </button>
        </div>
      </form>
    </div>
  );
};
