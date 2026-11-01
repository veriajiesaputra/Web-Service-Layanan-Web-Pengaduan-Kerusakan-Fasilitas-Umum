import React, { useState, useEffect } from 'react';
import { ReportItem, CitizenUser } from '../../types';
import { isReportOwner } from '../../utils/auth';

interface AllReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: ReportItem[];
  onSelectReport: (report: ReportItem) => void;
  onOpenCreateModal: () => void;
  onEditReport?: (report: ReportItem) => void;
  onDeleteReport?: (reportId: string) => void;
  currentUser?: CitizenUser | null;
  initialFilterMyReports?: boolean;
}

export const AllReportsModal: React.FC<AllReportsModalProps> = ({
  isOpen,
  onClose,
  reports,
  onSelectReport,
  onOpenCreateModal,
  onEditReport,
  onDeleteReport,
  currentUser,
  initialFilterMyReports = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [onlyMyReports, setOnlyMyReports] = useState(initialFilterMyReports);

  useEffect(() => {
    if (isOpen) {
      setOnlyMyReports(initialFilterMyReports);
    }
  }, [isOpen, initialFilterMyReports]);

  if (!isOpen) return null;

  const myReportsCount = reports.filter((r) => isReportOwner(r, currentUser)).length;

  const filtered = reports.filter((r) => {
    if (onlyMyReports && !isReportOwner(r, currentUser)) {
      return false;
    }

    const matchSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reporterName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchCat = categoryFilter === 'all' || r.category === categoryFilter;
    return matchSearch && matchStatus && matchCat;
  });

  const getStatusBadge = (status: ReportItem['status']) => {
    switch (status) {
      case 'Diajukan':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Diajukan
          </span>
        );
      case 'Sedang Dikerjakan':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200/80 text-[11px] font-semibold">
            <span className="material-symbols-outlined text-[13px] animate-spin">sync</span>
            Dikerjakan
          </span>
        );
      case 'Dijadwalkan':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200/80 text-[11px] font-semibold">
            <span className="material-symbols-outlined text-[13px]">event</span>
            Dijadwalkan
          </span>
        );
      case 'Selesai':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[11px] font-semibold">
            <span className="material-symbols-outlined text-[13px]">check_circle</span>
            Selesai
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl max-w-5xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-700 text-2xl">
                format_list_bulleted
              </span>
              <h2 className="font-headline text-xl sm:text-2xl font-bold text-slate-900">
                Daftar Seluruh Laporan Warga
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Transparansi penanganan sarana prasarana desa dan fasilitas umum Desa Kepunduhan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenCreateModal();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Buat Laporan</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Tab Toggle (Semua vs Laporan Saya) */}
        {currentUser && (
          <div className="pt-3 pb-1 flex gap-2 shrink-0">
            <button
              onClick={() => setOnlyMyReports(false)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                !onlyMyReports
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua Laporan ({reports.length})
            </button>
            <button
              onClick={() => setOnlyMyReports(true)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                onlyMyReports
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">assignment_ind</span>
              <span>Laporan Saya ({myReportsCount})</span>
            </button>
          </div>
        )}

        {/* Filter Controls */}
        <div className="py-3 space-y-3 shrink-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Search Input */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari kata kunci, nomor tiket #LAP..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
            >
              <option value="all">Semua Status (Diajukan, Pengerjaan, Selesai)</option>
              <option value="Diajukan">Diajukan</option>
              <option value="Sedang Dikerjakan">Sedang Dikerjakan</option>
              <option value="Dijadwalkan">Dijadwalkan</option>
              <option value="Selesai">Selesai</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
            >
              <option value="all">Semua Kategori Fasilitas</option>
              <option value="jalan">Jalan &amp; Jembatan</option>
              <option value="irigasi">Saluran Air &amp; Irigasi</option>
              <option value="penerangan">Penerangan Jalan</option>
              <option value="kebersihan">Kebersihan &amp; Sampah</option>
              <option value="fasilitas">Fasilitas &amp; Balai</option>
              <option value="taman">Taman &amp; Pohon</option>
            </select>
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filtered.length > 0 ? (
            filtered.map((report) => {
              const isOwner = isReportOwner(report, currentUser);

              return (
                <div
                  key={report.id}
                  onClick={() => {
                    onSelectReport(report);
                    onClose();
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group ${
                    isOwner
                      ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/70'
                      : 'bg-slate-50/60 hover:bg-slate-50 border-slate-200/80 hover:border-emerald-300'
                  }`}
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-700">
                        {report.id}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                        {report.categoryLabel}
                      </span>
                      {getStatusBadge(report.status)}
                      {report.priority && (
                        <span className="text-[10px] text-slate-500 font-medium">
                          Prioritas: {report.priority}
                        </span>
                      )}
                      {isOwner && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-300">
                          <span className="material-symbols-outlined text-[12px] text-emerald-700">verified</span>
                          <span>Laporan Anda</span>
                        </span>
                      )}
                    </div>
                    <h4 className="font-headline font-bold text-sm sm:text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {report.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      📍 {report.location} • <span className="text-slate-600 font-medium">{report.reporterName}</span>
                    </p>
                  </div>

                  <div className="flex items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                    <span className="text-[11px] text-slate-400 hidden sm:inline">{report.timeAgo}</span>
                    
                    <div className="flex items-center gap-1">
                      {/* Only show Edit and Delete buttons if current user is owner */}
                      {isOwner && onEditReport && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditReport(report);
                          }}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-100/80 transition-colors"
                          title="Ubah laporan Anda"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit_note</span>
                        </button>
                      )}

                      {isOwner && onDeleteReport && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteReport(report.id);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Hapus laporan Anda"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      )}

                      <span className="text-xs font-semibold text-emerald-700 flex items-center gap-0.5 ml-1">
                        <span>Detail</span>
                        <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">search_off</span>
              <p className="text-slate-800 font-bold">
                {onlyMyReports ? 'Anda belum memiliki laporan di desa ini' : 'Tidak ditemukan laporan yang cocok'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {onlyMyReports 
                  ? 'Klik tombol "Buat Laporan" di atas untuk mengajukan aduan baru.'
                  : 'Coba sesuaikan kata kunci pencarian atau ubah opsi filter.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-100 mt-3 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Menampilkan {filtered.length} dari {reports.length} total laporan</span>
          <span className="text-emerald-700 font-semibold">Desa Kepunduhan Terbuka &amp; Responsif</span>
        </div>
      </div>
    </div>
  );
};
