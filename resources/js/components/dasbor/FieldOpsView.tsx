import React, { useState } from 'react';
import { ReportItem, FieldTeam, ReportStatus } from '../../types';

interface FieldOpsViewProps {
  team: FieldTeam;
  reports: ReportItem[];
  onOpenReportDetail: (report: ReportItem) => void;
  onQuickStatusChange: (reportId: string, newStatus: ReportStatus) => void;
  onSelectTab: (tab: any) => void;
  onUpdateTeamStatus?: (teamId: string, status: 'Bertugas' | 'Siaga' | 'Istirahat') => void;
}

export const FieldOpsView: React.FC<FieldOpsViewProps> = ({
  team,
  reports,
  onOpenReportDetail,
  onQuickStatusChange,
  onSelectTab,
  onUpdateTeamStatus,
}) => {
  const [filterTab, setFilterTab] = useState<'semua' | 'proses' | 'dijadwalkan' | 'selesai'>('semua');
  const [completionNotes, setCompletionNotes] = useState<{ [key: string]: string }>({});
  const [completingId, setCompletingId] = useState<string | null>(null);

  // Match reports assigned to this team
  const teamReports = reports.filter((r) => {
    if (!r.assignedTeam) return false;
    const assigned = r.assignedTeam.toLowerCase();
    const teamName = team.name.toLowerCase();
    const teamCode = team.code.toLowerCase();
    return (
      assigned === teamName ||
      assigned.includes(teamCode) ||
      teamName.includes(assigned) ||
      (team.assignedTickets && team.assignedTickets.includes(r.id))
    );
  });

  const inProgressReports = teamReports.filter((r) => r.status === 'Sedang Dikerjakan');
  const scheduledReports = teamReports.filter((r) => r.status === 'Dijadwalkan');
  const completedReports = teamReports.filter((r) => r.status === 'Selesai');
  const urgentCount = teamReports.filter(
    (r) => (r.status === 'Sedang Dikerjakan' || r.status === 'Dijadwalkan') && (r.priority === 'Mendesak' || r.priority === 'Tinggi')
  ).length;

  const filteredReports = teamReports.filter((r) => {
    if (filterTab === 'proses') return r.status === 'Sedang Dikerjakan';
    if (filterTab === 'dijadwalkan') return r.status === 'Dijadwalkan';
    if (filterTab === 'selesai') return r.status === 'Selesai';
    return true;
  });

  const handleFinishTask = (reportId: string) => {
    onQuickStatusChange(reportId, 'Selesai');
    setCompletingId(null);
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'Mendesak':
        return 'bg-red-500 text-white font-bold animate-pulse';
      case 'Tinggi':
        return 'bg-amber-500 text-slate-950 font-bold';
      case 'Sedang':
        return 'bg-blue-100 text-blue-800 font-semibold';
      default:
        return 'bg-slate-100 text-slate-700 font-semibold';
    }
  };

  return (
    <div className="space-y-6">
      {/* Field Operations Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 rounded-2xl shadow-md border border-slate-700 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-400 flex items-center justify-center font-bold text-xl shadow-inner shrink-0">
            <span className="material-symbols-outlined text-[32px]">engineering</span>
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                Mode Satgas Lapangan
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-700/80 text-emerald-300 text-[11px] font-mono font-bold">
                Kode: {team.code}
              </span>
            </div>
            <h2 className="font-headline text-xl font-bold text-white mt-1">
              {team.name}
            </h2>
            <div className="flex items-center gap-4 text-xs text-slate-300 mt-1 flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-emerald-400">person</span>
                Koordinator: <strong>{team.leader}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-blue-400">directions_car</span>
                Armada: {team.vehicle}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-amber-400">groups</span>
                {team.activeMembers} Personil Siaga
              </span>
            </div>
          </div>
        </div>

        {/* Team Status Quick Switcher */}
        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-700/60 flex flex-col gap-2 shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Status Kesiapan Regu Hari Ini:
          </span>
          <div className="flex items-center gap-1.5">
            {(['Bertugas', 'Siaga', 'Istirahat'] as const).map((st) => {
              const isSelected = team.status === st;
              return (
                <button
                  key={st}
                  onClick={() => onUpdateTeamStatus && onUpdateTeamStatus(team.id, st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? st === 'Bertugas'
                        ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400'
                        : st === 'Siaga'
                        ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400'
                        : 'bg-slate-600 text-white shadow-sm ring-2 ring-slate-400'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white animate-ping' : 'bg-slate-500'}`} />
                  {st}
                </button>
              );
            })}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
            <span className="material-symbols-outlined text-[14px] text-emerald-400">location_on</span>
            <span>Lokasi: {team.currentLocation || 'Wilayah Desa Mandiri'}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Tugas Regu</span>
            <span className="material-symbols-outlined text-slate-400 text-[20px]">assignment</span>
          </div>
          <p className="font-headline text-2xl font-bold text-slate-900 mt-1">{teamReports.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Didelegasikan oleh admin</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-xs bg-blue-50/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Sedang Dikerjakan</span>
            <span className="material-symbols-outlined text-blue-600 text-[20px]">handyman</span>
          </div>
          <p className="font-headline text-2xl font-bold text-blue-900 mt-1">{inProgressReports.length}</p>
          <p className="text-[11px] text-blue-600 mt-0.5">Aksi fisik di lapangan</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs bg-amber-50/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Perlu Penanganan Cepat</span>
            <span className="material-symbols-outlined text-amber-600 text-[20px]">warning</span>
          </div>
          <p className="font-headline text-2xl font-bold text-amber-900 mt-1">{urgentCount}</p>
          <p className="text-[11px] text-amber-600 mt-0.5">Prioritas Mendesak &amp; Tinggi</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs bg-emerald-50/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Tuntas Terselesaikan</span>
            <span className="material-symbols-outlined text-emerald-600 text-[20px]">check_circle</span>
          </div>
          <p className="font-headline text-2xl font-bold text-emerald-900 mt-1">{completedReports.length}</p>
          <p className="text-[11px] text-emerald-600 mt-0.5">Pekerjaan rampung</p>
        </div>
      </div>

      {/* Main Task List Header & Filter Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-headline text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600 text-[22px]">assignment_turned_in</span>
              Instruksi Kerja &amp; Tiket Tugas Lapangan
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Klik "Mulai Pengerjaan" saat tim tiba di lokasi, dan "Tandai Selesai" setelah fasilitas selesai diperbaiki.
            </p>
          </div>

          {/* Quick tab switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setFilterTab('semua')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterTab === 'semua' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({teamReports.length})
            </button>
            <button
              onClick={() => setFilterTab('proses')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterTab === 'proses' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dikerjakan ({inProgressReports.length})
            </button>
            <button
              onClick={() => setFilterTab('dijadwalkan')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterTab === 'dijadwalkan' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Antrean ({scheduledReports.length})
            </button>
            <button
              onClick={() => setFilterTab('selesai')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterTab === 'selesai' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Selesai ({completedReports.length})
            </button>
          </div>
        </div>

        {/* Task Cards List */}
        {filteredReports.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <span className="material-symbols-outlined text-[54px] text-slate-300 mb-2">task_alt</span>
            <p className="text-sm font-bold text-slate-700">Tidak ada tiket tugas pada kategori ini</p>
            <p className="text-xs text-slate-400 mt-1">
              Seluruh pekerjaan yang didelegasikan oleh Kaur Pelayanan Desa akan muncul otomatis di sini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredReports.map((report) => {
              const isCompleting = completingId === report.id;

              return (
                <div
                  key={report.id}
                  className={`p-5 rounded-xl border transition-all ${
                    report.status === 'Sedang Dikerjakan'
                      ? 'border-blue-300 bg-blue-50/15 shadow-xs'
                      : report.status === 'Selesai'
                      ? 'border-slate-200 bg-slate-50/60 opacity-80'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Left: Info & Photo */}
                    <div className="flex items-start gap-4 flex-1">
                      {report.photos?.before && (
                        <img
                          src={report.photos.before}
                          alt="Foto Lokasi"
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0 border border-slate-200 cursor-pointer shadow-xs hover:scale-105 transition-transform"
                          onClick={() => onOpenReportDetail(report)}
                        />
                      )}

                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                            {report.id}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] ${getPriorityBadge(report.priority)}`}>
                            {report.priority}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              report.status === 'Sedang Dikerjakan'
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : report.status === 'Selesai'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-purple-100 text-purple-800 border border-purple-200'
                            }`}
                          >
                            &bull; {report.status}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {report.timeAgo || report.createdAt}
                          </span>
                        </div>

                        <h4
                          onClick={() => onOpenReportDetail(report)}
                          className="font-headline text-base font-bold text-slate-900 hover:text-emerald-700 cursor-pointer transition-colors"
                        >
                          {report.title}
                        </h4>

                        <div className="flex items-center gap-2 text-xs text-slate-600 flex-wrap">
                          <span className="flex items-center gap-1 text-slate-700 font-semibold">
                            <span className="material-symbols-outlined text-[16px] text-emerald-600">location_on</span>
                            {report.location} ({report.dusun})
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                          {report.description}
                        </p>

                        {/* Internal Admin Note if present */}
                        {report.notes && (
                          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2 mt-2">
                            <span className="material-symbols-outlined text-amber-700 text-[16px] shrink-0 mt-0.5">
                              notification_important
                            </span>
                            <div>
                              <strong className="block text-[11px] uppercase tracking-wider text-amber-800 font-bold">
                                Catatan Instruksi Admin / Kaur Pelayanan:
                              </strong>
                              <span>{report.notes}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions for Field Team */}
                    <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      {report.status !== 'Selesai' && (
                        <>
                          {report.status !== 'Sedang Dikerjakan' ? (
                            <button
                              onClick={() => onQuickStatusChange(report.id, 'Sedang Dikerjakan')}
                              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all flex items-center gap-1.5"
                            >
                              <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                              <span>Mulai Pengerjaan</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => setCompletingId(isCompleting ? null : report.id)}
                              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all flex items-center gap-1.5"
                            >
                              <span className="material-symbols-outlined text-[16px]">task_alt</span>
                              <span>Selesaikan Tugas</span>
                            </button>
                          )}
                        </>
                      )}

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            onSelectTab('peta');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="Buka titik koordinat di Peta Wilayah"
                        >
                          <span className="material-symbols-outlined text-[16px] text-emerald-700">map</span>
                          <span className="hidden sm:inline">Peta</span>
                        </button>

                        <button
                          onClick={() => onOpenReportDetail(report)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="Lihat detail laporan warga"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                          <span className="hidden sm:inline">Detail</span>
                        </button>
                      </div>

                      {/* Citizen phone contact if available */}
                      {report.reporterPhone && (
                        <a
                          href={`https://wa.me/${report.reporterPhone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 mt-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">call</span>
                          Hubungi Pelapor ({report.reporterName})
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Inline Finishing Prompt if user clicked Selesaikan Tugas */}
                  {isCompleting && (
                    <div className="mt-4 pt-3 border-t border-emerald-200 bg-emerald-50/50 p-3 rounded-xl space-y-2 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
                          Konfirmasi Penyelesaian Pekerjaan #{report.id}
                        </span>
                        <button
                          onClick={() => setCompletingId(null)}
                          className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                        >
                          Batal
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Pastikan pengerjaan fisik di lokasi ({report.location}) telah selesai diuji dan siap digunakan warga.
                      </p>
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => setCompletingId(null)}
                          className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                        >
                          Tutup
                        </button>
                        <button
                          onClick={() => handleFinishTask(report.id)}
                          className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-[16px]">check</span>
                          <span>Konfirmasi Selesai &amp; Kirim Bukti</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
