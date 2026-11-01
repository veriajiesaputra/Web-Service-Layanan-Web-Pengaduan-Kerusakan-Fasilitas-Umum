import React from 'react';
import { ReportItem } from '../../types';
import { FIELD_TEAMS } from '../../data/mockData';

interface OverviewViewProps {
  reports: ReportItem[];
  onSelectTab: (tab: any) => void;
  onOpenDetail: (report: ReportItem) => void;
  onOpenVerify: (report: ReportItem) => void;
  onNewReport: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  reports,
  onSelectTab,
  onOpenDetail,
  onOpenVerify,
  onNewReport,
}) => {
  const total = reports.length;
  const diajukan = reports.filter((r) => r.status === 'Diajukan').length;
  const sedangDikerjakan = reports.filter((r) => r.status === 'Sedang Dikerjakan').length;
  const dijadwalkan = reports.filter((r) => r.status === 'Dijadwalkan').length;
  const selesai = reports.filter((r) => r.status === 'Selesai').length;

  const urgentReports = reports.filter(
    (r) => r.status === 'Diajukan' && (r.priority === 'Mendesak' || r.priority === 'Tinggi')
  );

  const latestReports = reports.slice(0, 5);

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
    const c = r.category || 'fasilitas';
    categoryCounts[c] = (categoryCounts[c] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* 4 Standard Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total */}
        <div 
          onClick={() => onSelectTab('laporan')}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Aduan Warga</span>
            <div className="font-headline text-3xl font-bold text-slate-900 mt-1">{total}</div>
            <p className="text-xs text-slate-500 mt-0.5">Tersimpan di database MySQL</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <span className="material-symbols-outlined text-[26px]">inbox</span>
          </div>
        </div>

        {/* Card 2: Menunggu Verifikasi */}
        <div 
          onClick={() => onSelectTab('verifikasi')}
          className="p-5 rounded-2xl bg-white border border-amber-200 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
        >
          <div>
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Menunggu Verifikasi</span>
            <div className="font-headline text-3xl font-bold text-amber-600 mt-1">{diajukan}</div>
            <p className="text-xs text-amber-700 mt-0.5 font-medium">Perlu penugasan satgas Segera →</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[26px]">pending_actions</span>
          </div>
        </div>

        {/* Card 3: Sedang Dikerjakan */}
        <div 
          onClick={() => onSelectTab('laporan')}
          className="p-5 rounded-2xl bg-white border border-blue-200 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Sedang Dikerjakan</span>
            <div className="font-headline text-3xl font-bold text-blue-600 mt-1">{sedangDikerjakan + dijadwalkan}</div>
            <p className="text-xs text-blue-600 mt-0.5">{sedangDikerjakan} aktif, {dijadwalkan} dijadwalkan</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <span className="material-symbols-outlined text-[26px]">construction</span>
          </div>
        </div>

        {/* Card 4: Selesai */}
        <div 
          onClick={() => onSelectTab('laporan')}
          className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Selesai Ditangani</span>
            <div className="font-headline text-3xl font-bold text-emerald-600 mt-1">{selesai}</div>
            <p className="text-xs text-emerald-700 mt-0.5 font-medium">Tuntas &amp; terdokumentasi</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <span className="material-symbols-outlined text-[26px]">task_alt</span>
          </div>
        </div>
      </div>

      {/* Urgent Pending Alerts if any */}
      {urgentReports.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-700 text-[20px]">warning</span>
              <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                Perhatian: {urgentReports.length} Aduan Masuk Berkategori Prioritas Mendesak / Tinggi
              </h3>
            </div>
            <button
              onClick={() => onSelectTab('verifikasi')}
              className="text-xs text-amber-900 font-bold hover:underline"
            >
              Buka Semua Antrean ({diajukan}) →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {urgentReports.map((r) => (
              <div
                key={r.id}
                className="p-3 bg-white rounded-xl border border-amber-200 shadow-2xs flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-800">{r.id}</span>
                    <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-red-100 text-red-800">
                      {r.priority}
                    </span>
                    <span className="text-[11px] text-slate-500">{r.dusun}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mt-1">{r.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{r.location}</p>
                </div>
                <button
                  onClick={() => onOpenVerify(r)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 transition-colors"
                >
                  Verifikasi
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid: Latest Reports & Field Teams Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Latest Reports */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-headline text-base font-bold text-slate-900">Aduan Terbaru Masuk</h3>
              <p className="text-xs text-slate-500">5 laporan masyarakat terakhir yang masuk ke portal</p>
            </div>
            <button
              onClick={() => onSelectTab('laporan')}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              Lihat Semua ({total}) →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {latestReports.map((report) => (
              <div
                key={report.id}
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors rounded-xl px-2"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[18px] text-emerald-600">
                      {report.categoryIcon || 'construction'}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-700">{report.id}</span>
                      <span className="text-xs font-bold text-slate-900 line-clamp-1">{report.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {report.dusun} • {report.timeAgo} • Pelapor: {report.reporterName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    report.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' :
                    report.status === 'Sedang Dikerjakan' ? 'bg-blue-100 text-blue-800' :
                    report.status === 'Dijadwalkan' ? 'bg-purple-100 text-purple-800' :
                    report.status === 'Ditolak' ? 'bg-red-100 text-red-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {report.status}
                  </span>

                  <button
                    onClick={() => onOpenDetail(report)}
                    className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                    title="Detail"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Category Distribution & Regu Field Teams */}
        <div className="space-y-6">
          {/* Category Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
            <h3 className="font-headline text-sm font-bold text-slate-900">Distribusi Kategori Kerusakan</h3>
            <div className="space-y-2.5">
              {Object.entries(categoryLabels).map(([key, label]) => {
                const count = categoryCounts[key] || 0;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={key}>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-700">{label}</span>
                      <span className="text-slate-500">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Regu Siaga Box */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-headline text-sm font-bold text-slate-900">Kesiapan Regu Lapangan</h3>
              <button
                onClick={() => onSelectTab('petugas')}
                className="text-xs text-emerald-700 font-bold hover:underline"
              >
                Semua Regu →
              </button>
            </div>

            <div className="space-y-2">
              {FIELD_TEAMS.map((team) => (
                <div key={team.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 font-mono">[{team.code}]</span>
                    <div>
                      <span className="font-semibold text-slate-800 block leading-tight">{team.name}</span>
                      <span className="text-[10px] text-slate-500">{team.currentLocation}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    team.status === 'Bertugas' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {team.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
