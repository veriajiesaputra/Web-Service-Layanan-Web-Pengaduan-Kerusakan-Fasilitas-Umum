import React, { useState, useMemo } from 'react';
import { ReportItem, ReportStatus, ReportPriority } from '../../types';
import { CATEGORY_OPTIONS, VILLAGE_DUSUNS } from '../../data/mockData';

interface ReportTableProps {
  reports: ReportItem[];
  selectedStatusTab: string;
  onSelectStatusTab: (status: string) => void;
  onOpenDetail: (report: ReportItem) => void;
  onOpenVerify: (report: ReportItem) => void;
  onQuickStatusChange: (reportId: string, newStatus: ReportStatus) => void;
  onBatchVerify: (ids: string[]) => void;
  onBatchReject: (ids: string[]) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const ReportTable: React.FC<ReportTableProps> = ({
  reports,
  selectedStatusTab,
  onSelectStatusTab,
  onOpenDetail,
  onOpenVerify,
  onQuickStatusChange,
  onBatchVerify,
  onBatchReject,
  searchQuery,
  onSearchChange,
}) => {
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dusunFilter, setDusunFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState<'terbaru' | 'prioritas' | 'lokasi'>('terbaru');

  // Multi-select state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Status counts
  const statusCounts = useMemo(() => {
    return {
      all: reports.length,
      diajukan: reports.filter((r) => r.status === 'Diajukan').length,
      proses: reports.filter((r) => r.status === 'Sedang Dikerjakan').length,
      dijadwalkan: reports.filter((r) => r.status === 'Dijadwalkan').length,
      selesai: reports.filter((r) => r.status === 'Selesai').length,
      ditolak: reports.filter((r) => r.status === 'Ditolak').length,
    };
  }, [reports]);

  // Filtering
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      // Status tab
      if (selectedStatusTab === 'diajukan' && r.status !== 'Diajukan') return false;
      if (selectedStatusTab === 'proses' && r.status !== 'Sedang Dikerjakan') return false;
      if (selectedStatusTab === 'dijadwalkan' && r.status !== 'Dijadwalkan') return false;
      if (selectedStatusTab === 'selesai' && r.status !== 'Selesai') return false;
      if (selectedStatusTab === 'ditolak' && r.status !== 'Ditolak') return false;

      // Category
      if (categoryFilter && r.category !== categoryFilter) return false;

      // Dusun
      if (dusunFilter && !r.dusun.toLowerCase().includes(dusunFilter.toLowerCase())) return false;

      // Priority
      if (priorityFilter && r.priority !== priorityFilter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = r.id.toLowerCase().includes(q);
        const matchTitle = r.title.toLowerCase().includes(q);
        const matchReporter = r.reporterName.toLowerCase().includes(q);
        const matchLocation = r.location.toLowerCase().includes(q);
        const matchDesc = r.description.toLowerCase().includes(q);
        if (!matchId && !matchTitle && !matchReporter && !matchLocation && !matchDesc) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'prioritas') {
        const weights = { Mendesak: 4, Tinggi: 3, Sedang: 2, Rendah: 1 };
        return (weights[b.priority] || 2) - (weights[a.priority] || 2);
      }
      if (sortBy === 'lokasi') {
        return a.dusun.localeCompare(b.dusun);
      }
      return (b.createdAt || b.id).localeCompare(a.createdAt || a.id);
    });
  }, [reports, selectedStatusTab, categoryFilter, dusunFilter, priorityFilter, searchQuery, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage) || 1;
  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredReports.slice(start, start + itemsPerPage);
  }, [filteredReports, currentPage]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedReports.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const resetFilters = () => {
    setCategoryFilter('');
    setDusunFilter('');
    setPriorityFilter('');
    setSortBy('terbaru');
    onSearchChange('');
    onSelectStatusTab('all');
    setCurrentPage(1);
  };

  const getPriorityBadge = (p: ReportPriority) => {
    switch (p) {
      case 'Mendesak':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Tinggi':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Sedang':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Rendah':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (s: ReportStatus) => {
    switch (s) {
      case 'Selesai':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Sedang Dikerjakan':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Dijadwalkan':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Ditolak':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Diajukan':
      default:
        return 'bg-amber-100 text-amber-900 border-amber-300';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Top Status Tabs */}
      <div className="border-b border-slate-200 bg-slate-50/70 p-3 sm:px-5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'Semua Aduan', count: statusCounts.all },
            { id: 'diajukan', label: 'Diajukan', count: statusCounts.diajukan, badgeClass: 'bg-amber-200 text-amber-900 font-bold' },
            { id: 'proses', label: 'Sedang Dikerjakan', count: statusCounts.proses, badgeClass: 'bg-blue-200 text-blue-900 font-bold' },
            { id: 'dijadwalkan', label: 'Dijadwalkan', count: statusCounts.dijadwalkan, badgeClass: 'bg-purple-200 text-purple-900 font-bold' },
            { id: 'selesai', label: 'Selesai', count: statusCounts.selesai, badgeClass: 'bg-emerald-200 text-emerald-900 font-bold' },
            { id: 'ditolak', label: 'Ditolak', count: statusCounts.ditolak, badgeClass: 'bg-red-200 text-red-900 font-bold' },
          ].map((tab) => {
            const isActive = selectedStatusTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  onSelectStatusTab(tab.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-white/25 text-white' : tab.badgeClass}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <span className="text-xs text-slate-500 font-medium hidden md:inline">
          Total hasil: <strong className="text-slate-800">{filteredReports.length}</strong> tiket
        </span>
      </div>

      {/* Filters & Search Row */}
      <div className="p-4 sm:px-5 border-b border-slate-200 bg-white space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
          {/* Category Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Kategori
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
              className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-600 focus:outline-none"
            >
              <option value="">Semua Kategori</option>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Dusun Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Wilayah Dusun
            </label>
            <select
              value={dusunFilter}
              onChange={(e) => { setDusunFilter(e.target.value); setCurrentPage(1); }}
              className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-600 focus:outline-none"
            >
              <option value="">Semua Dusun</option>
              {VILLAGE_DUSUNS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Prioritas
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
              className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-600 focus:outline-none"
            >
              <option value="">Semua Prioritas</option>
              <option value="Mendesak">Mendesak</option>
              <option value="Tinggi">Tinggi</option>
              <option value="Sedang">Sedang</option>
              <option value="Rendah">Rendah</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Urutkan
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-600 focus:outline-none"
            >
              <option value="terbaru">Terbaru Masuk</option>
              <option value="prioritas">Prioritas Tertinggi</option>
              <option value="lokasi">Wilayah Dusun (A-Z)</option>
            </select>
          </div>

          {/* Reset Action */}
          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="w-full py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>Reset Filter</span>
            </button>
          </div>
        </div>

        {/* Batch action banner */}
        {selectedIds.length > 0 && (
          <div className="p-2.5 px-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="material-symbols-outlined text-[18px] text-emerald-700">check_box</span>
              <span>{selectedIds.length} tiket dipilih</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onBatchVerify(selectedIds);
                  setSelectedIds([]);
                }}
                className="px-3 py-1 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors"
              >
                Verifikasi Terpilih
              </button>
              <button
                onClick={() => {
                  onBatchReject(selectedIds);
                  setSelectedIds([]);
                }}
                className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
              >
                Tolak Terpilih
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="px-2.5 py-1 text-slate-600 hover:text-slate-900 text-xs font-semibold"
              >
                Batal
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
            <tr>
              <th className="p-3.5 w-10 text-center">
                <input
                  type="checkbox"
                  checked={paginatedReports.length > 0 && selectedIds.length === paginatedReports.length}
                  onChange={handleSelectAll}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
                />
              </th>
              <th className="p-3.5 whitespace-nowrap">ID Tiket</th>
              <th className="p-3.5">Pelapor &amp; Kontak</th>
              <th className="p-3.5">Kategori &amp; Uraian Kerusakan</th>
              <th className="p-3.5">Wilayah Dusun</th>
              <th className="p-3.5">Waktu</th>
              <th className="p-3.5">Prioritas</th>
              <th className="p-3.5">Status Penanganan</th>
              <th className="p-3.5 text-right whitespace-nowrap">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {paginatedReports.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-12 text-center text-slate-500">
                  <span className="material-symbols-outlined text-4xl text-slate-300 mb-2 block">
                    inbox
                  </span>
                  <p className="font-bold text-sm text-slate-700">Tidak ada aduan yang sesuai filter.</p>
                  <p className="text-xs text-slate-400 mt-1">Coba sesuaikan pencarian atau klik tombol Reset Filter.</p>
                </td>
              </tr>
            ) : (
              paginatedReports.map((report) => {
                const isSelected = selectedIds.includes(report.id);
                return (
                  <tr
                    key={report.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isSelected ? 'bg-emerald-50/40' : ''
                    }`}
                  >
                    <td className="p-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(report.id)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
                      />
                    </td>

                    {/* ID Tiket */}
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {report.id}
                      </span>
                    </td>

                    {/* Pelapor */}
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{report.reporterName}</div>
                      <div className="text-[11px] text-slate-500">
                        {report.reporterRole || (report.isAnonymous ? 'Warga Anonim' : 'Warga')}
                      </div>
                      {report.reporterPhone && (
                        <a
                          href={`tel:${report.reporterPhone}`}
                          className="text-[11px] text-emerald-600 hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <span className="material-symbols-outlined text-[13px]">call</span>
                          <span>{report.reporterPhone}</span>
                        </a>
                      )}
                    </td>

                    {/* Kategori & Uraian */}
                    <td className="p-3.5 max-w-xs sm:max-w-sm">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-semibold text-slate-700 mb-1 border border-slate-200">
                        <span className="material-symbols-outlined text-[13px] text-emerald-600">
                          {report.categoryIcon || 'construction'}
                        </span>
                        <span>{report.categoryLabel || report.category}</span>
                      </div>
                      <div className="font-bold text-slate-900 line-clamp-1">{report.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{report.description}</div>
                    </td>

                    {/* Dusun & Lokasi */}
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="font-bold text-slate-800">{report.dusun}</div>
                      <div className="text-[11px] text-slate-500 max-w-[160px] truncate" title={report.location}>
                        {report.location}
                      </div>
                    </td>

                    {/* Waktu */}
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="text-slate-800 font-medium">{report.timeAgo}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{report.createdAt}</div>
                    </td>

                    {/* Prioritas */}
                    <td className="p-3.5 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityBadge(report.priority)}`}>
                        {report.priority}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-3.5 whitespace-nowrap">
                      <div>
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border inline-flex items-center gap-1.5 ${getStatusBadge(report.status)}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          <span>{report.status}</span>
                        </span>
                        {report.assignedTeam && (
                          <div className="text-[10px] font-semibold text-slate-600 mt-1 truncate max-w-[150px]" title={report.assignedTeam}>
                            ↳ {report.assignedTeam}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Aksi */}
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        {report.status === 'Diajukan' && (
                          <button
                            onClick={() => onOpenVerify(report)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-2xs transition-colors flex items-center gap-1"
                            title="Verifikasi laporan dan disposisi ke tim lapangan"
                          >
                            <span className="material-symbols-outlined text-[14px]">verified</span>
                            <span>Verifikasi</span>
                          </button>
                        )}

                        <button
                          onClick={() => onOpenDetail(report)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors flex items-center gap-1"
                          title="Buka rincian lengkap aduan & kelola tindak lanjut"
                        >
                          <span className="material-symbols-outlined text-[15px]">visibility</span>
                          <span>Detail</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-3.5 sm:px-5 border-t border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            Halaman <strong className="text-slate-800">{currentPage}</strong> dari <strong>{totalPages}</strong>
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition-colors"
            >
              Sebelumnya
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                  currentPage === idx + 1
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition-colors"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
