import React from 'react';
import { ReportItem } from '../../types';
import { VILLAGE_DUSUNS } from '../../data/mockData';

interface AdminStatsViewProps {
  reports: ReportItem[];
}

export const AdminStatsView: React.FC<AdminStatsViewProps> = ({ reports }) => {
  const total = reports.length;
  const diajukan = reports.filter((r) => r.status === 'Diajukan').length;
  const sedangDikerjakan = reports.filter((r) => r.status === 'Sedang Dikerjakan').length;
  const dijadwalkan = reports.filter((r) => r.status === 'Dijadwalkan').length;
  const selesai = reports.filter((r) => r.status === 'Selesai').length;
  const ditolak = reports.filter((r) => r.status === 'Ditolak').length;

  const totalHandled = selesai + sedangDikerjakan + dijadwalkan;
  const resolutionRate = total > 0 ? ((selesai / total) * 100).toFixed(1) : '100.0';
  const responseRate = total > 0 ? (((total - diajukan) / total) * 100).toFixed(1) : '100.0';

  // Category breakdown
  const categoryLabels: Record<string, string> = {
    jalan: 'Jalan & Jembatan',
    irigasi: 'Saluran Air & Irigasi',
    penerangan: 'Penerangan Jalan',
    kebersihan: 'Kebersihan & Sampah',
    fasilitas: 'Fasilitas & Balai',
    taman: 'Taman & Pohon',
  };

  const categoryCounts: Record<string, number> = {};
  reports.forEach((r) => {
    const cat = r.category || 'fasilitas';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const categoryBreakdown = Object.entries(categoryLabels).map(([key, label]) => {
    const count = categoryCounts[key] || 0;
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return { key, label, count, pct };
  });

  // Dusun breakdown
  const dusunStats = VILLAGE_DUSUNS.map((dusun) => {
    const dusunReports = reports.filter((r) => r.dusun === dusun);
    const done = dusunReports.filter((r) => r.status === 'Selesai').length;
    const pending = dusunReports.filter((r) => r.status === 'Diajukan').length;
    return {
      name: dusun,
      total: dusunReports.length,
      done,
      pending,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-[24px]">analytics</span>
            <h2 className="font-headline text-lg font-bold text-slate-900">
              Statistik Pelayanan &amp; Kinerja SLA Desa
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Analisis data tren pengaduan warga, kecepatan respon, dan distribusi sebaran 6 dusun.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Tahun 2026 • Live MySQL Database
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Total Aduan Warga</span>
          <p className="font-headline text-3xl font-bold text-slate-900 mt-1">{total}</p>
          <p className="text-xs text-slate-500 mt-1">Seluruh tiket tercatat</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] uppercase tracking-wider text-emerald-600 font-bold">Tingkat Penyelesaian</span>
          <p className="font-headline text-3xl font-bold text-emerald-700 mt-1">{resolutionRate}%</p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${resolutionRate}%` }}></div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] uppercase tracking-wider text-blue-600 font-bold">Respon Disposisi (SLA)</span>
          <p className="font-headline text-3xl font-bold text-blue-700 mt-1">{responseRate}%</p>
          <p className="text-xs text-slate-500 mt-1">{total - diajukan} tiket telah ditindaklanjuti</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] uppercase tracking-wider text-amber-600 font-bold">Perlu Verifikasi</span>
          <p className="font-headline text-3xl font-bold text-amber-600 mt-1">{diajukan}</p>
          <p className="text-xs text-slate-500 mt-1">Menunggu disposisi regu</p>
        </div>
      </div>

      {/* Breakdown by Category and Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
          <h3 className="font-headline text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
            <span>Sebaran Menurut Kategori Fasilitas</span>
            <span className="text-xs text-slate-400 font-normal">Persentase</span>
          </h3>

          <div className="space-y-4">
            {categoryBreakdown.map((item) => (
              <div key={item.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{item.label}</span>
                  <span className="font-bold text-slate-900">
                    {item.count} Laporan ({item.pct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-700 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dusun Breakdown Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
          <h3 className="font-headline text-sm font-bold text-slate-900 mb-4">
            Distribusi Aduan per Wilayah Dusun
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-2.5">Wilayah Dusun</th>
                  <th className="pb-2.5 text-center">Total</th>
                  <th className="pb-2.5 text-center">Selesai</th>
                  <th className="pb-2.5 text-center">Tertunda</th>
                  <th className="pb-2.5 text-right">Persentase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {dusunStats.map((ds) => {
                  const pct = total > 0 ? Math.round((ds.total / total) * 100) : 0;
                  return (
                    <tr key={ds.name} className="hover:bg-slate-50/80">
                      <td className="py-2.5 text-slate-900 font-semibold">{ds.name}</td>
                      <td className="py-2.5 text-center font-bold text-slate-800">{ds.total}</td>
                      <td className="py-2.5 text-center text-emerald-700 font-semibold">{ds.done}</td>
                      <td className="py-2.5 text-center text-amber-700 font-semibold">{ds.pending}</td>
                      <td className="py-2.5 text-right text-slate-500 font-mono">{pct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
