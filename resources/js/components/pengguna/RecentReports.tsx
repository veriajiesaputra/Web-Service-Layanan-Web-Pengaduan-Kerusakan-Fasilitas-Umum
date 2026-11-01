import React, { useState } from 'react';
import { ReportItem } from '../../types';

interface RecentReportsProps {
  reports: ReportItem[];
  onSelectReport: (report: ReportItem) => void;
  onOpenAllReports: () => void;
}

export const RecentReports: React.FC<RecentReportsProps> = ({
  reports,
  onSelectReport,
  onOpenAllReports
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filterButtons = [
    { key: 'all', label: 'Semua Laporan' },
    { key: 'jalan', label: 'Jalan' },
    { key: 'irigasi', label: 'Irigasi' },
    { key: 'penerangan', label: 'Penerangan' },
    { key: 'kebersihan', label: 'Kebersihan' },
    { key: 'taman', label: 'Taman' },
    { key: 'fasilitas', label: 'Fasilitas' }
  ];

  const filteredReports = reports.filter((r) => {
    if (activeFilter === 'all') return true;
    return r.category === activeFilter;
  });

  const getStatusBadge = (status: ReportItem['status']) => {
    switch (status) {
      case 'Diajukan':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 text-xs font-semibold shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Diajukan
          </span>
        );
      case 'Selesai':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-semibold shrink-0">
            <span className="material-symbols-outlined text-[14px] text-emerald-600">check_circle</span>
            Selesai
          </span>
        );
      case 'Sedang Dikerjakan':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200/80 text-xs font-semibold shrink-0">
            <span className="material-symbols-outlined text-[14px] text-blue-600 animate-spin">sync</span>
            Dikerjakan
          </span>
        );
      case 'Dijadwalkan':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200/80 text-xs font-semibold shrink-0">
            <span className="material-symbols-outlined text-[14px] text-purple-600">event</span>
            Dijadwalkan
          </span>
        );
      default:
        return null;
    }
  };

  const getFooterIcon = (report: ReportItem) => {
    if (report.timeAgo.includes('Selesai')) return 'event_available';
    if (report.timeAgo.includes('Dikerjakan')) return 'bolt';
    if (report.timeAgo.includes('Minggu') || report.timeAgo.includes('WIB')) return 'calendar_month';
    return 'schedule';
  };

  return (
    <section className="w-full bg-slate-50/70 py-16 sm:py-20 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Transparansi Publik
            </div>
            <h2 className="font-headline text-2xl sm:text-3xl text-slate-900 font-bold tracking-tight">
              Laporan Fasilitas Terbaru
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Pantau tindak lanjut fasilitas umum yang dilaporkan warga secara real-time dan terbuka.
            </p>
          </div>
          <button
            onClick={onOpenAllReports}
            className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-semibold text-sm shrink-0 group self-start md:self-auto cursor-pointer"
          >
            <span>Lihat Semua {reports.length > 6 ? reports.length : 184} Laporan</span>
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {filterButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setActiveFilter(btn.key)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === btn.key
                  ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100/80 hover:text-slate-900'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <article
              key={report.id}
              onClick={() => onSelectReport(report)}
              className="flex flex-col justify-between bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all group cursor-pointer overflow-hidden hover:-translate-y-0.5"
            >
              <div className="p-6">
                {/* Header tag & status */}
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                    <span className="material-symbols-outlined text-[15px] text-emerald-700">
                      {report.categoryIcon}
                    </span>
                    {report.categoryLabel}
                  </span>
                  {getStatusBadge(report.status)}
                </div>

                {/* Report Title */}
                <h3 className="font-headline text-base sm:text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                  {report.title}
                </h3>

                {/* Location */}
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-3">
                  <span className="material-symbols-outlined text-[14px] text-slate-400">location_on</span>
                  <span className="truncate">{report.location}</span>
                </p>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {report.description}
                </p>
              </div>

              {/* Bottom Details Footer */}
              <div className="px-6 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-normal">
                  <span className="material-symbols-outlined text-[14px] text-slate-400">
                    {getFooterIcon(report)}
                  </span>
                  {report.timeAgo}
                </span>

                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 text-[11px] font-medium">
                  {report.officerBadge}
                </span>

                <span className="font-mono text-slate-400 text-[11px] font-semibold">
                  {report.id}
                </span>
              </div>
            </article>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
            <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">search_off</span>
            <p className="text-slate-800 font-bold">Belum ada laporan untuk kategori ini</p>
            <p className="text-sm text-slate-500 mt-1">Jadilah warga pertama yang melaporkan fasilitas ini di desa kita.</p>
          </div>
        )}
      </div>
    </section>
  );
};
