import React from 'react';
import { FieldTeam, ReportItem } from '../../types';

interface AdminTeamsViewProps {
  reports: ReportItem[];
  teams?: FieldTeam[];
  userRole?: 'admin' | 'field_officer';
  selectedTeam?: FieldTeam;
  onUpdateTeamStatus?: (teamId: string, status: 'Bertugas' | 'Siaga' | 'Istirahat') => void;
  onOpenReportDetail?: (report: ReportItem) => void;
}

export const AdminTeamsView: React.FC<AdminTeamsViewProps> = ({
  reports,
  teams = [],
  userRole = 'admin',
  selectedTeam,
  onUpdateTeamStatus,
  onOpenReportDetail,
}) => {
  const totalMembers = teams.reduce((acc, curr) => acc + (curr.activeMembers || 0), 0);
  const activeTeams = teams.filter((t) => t.status === 'Bertugas').length;
  const standbyTeams = teams.filter((t) => t.status === 'Siaga').length;
  const restingTeams = teams.filter((t) => t.status === 'Istirahat').length;

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Bertugas':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Siaga':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Istirahat':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Header Banner */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-[24px]">engineering</span>
            <h2 className="font-headline text-lg font-bold text-slate-900">
              Kesiapan Regu &amp; Armada Satgas Lapangan
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {userRole === 'admin'
              ? 'Pantau ketersediaan personil siaga dan armada operasional seluruh regu di 6 dusun wilayah desa.'
              : `Panel Kesiapan Regu • Anda terautentikasi sebagai ${selectedTeam?.leader || 'Koordinator'} (${selectedTeam?.name}).`}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            {activeTeams} Bertugas
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            {standbyTeams} Siaga
          </span>
          {restingTeams > 0 && (
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold">
              {restingTeams} Istirahat
            </span>
          )}
        </div>
      </div>

      {/* Role Notice Info Card */}
      {userRole === 'admin' ? (
        <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200/80 text-xs text-slate-700 flex items-center gap-3">
          <span className="material-symbols-outlined text-slate-500 text-[20px] shrink-0">visibility</span>
          <div>
            <strong className="text-slate-900 font-bold block">Mode Pemantauan Administrator (Hanya Melihat):</strong>
            <span>
              Status kesiapan operasional (Bertugas / Siaga / Istirahat) dikelola secara mandiri oleh masing-masing koordinator petugas di lapangan saat bertugas.
            </span>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-3">
          <span className="material-symbols-outlined text-amber-600 text-[20px] shrink-0">verified_user</span>
          <div>
            <strong className="text-amber-950 font-bold block">Hak Akses Petugas Terverifikasi:</strong>
            <span>
              Anda memiliki wewenang untuk mengubah status operasional <strong>{selectedTeam?.name}</strong>. Data regu lainnya hanya dapat dipantau sebagai referensi koordinasi.
            </span>
          </div>
        </div>
      )}

      {/* Grid of Teams */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {teams.map((team) => {
          // Check if this card belongs to the currently logged in field team
          const isMyTeam = userRole === 'field_officer' && selectedTeam?.id === team.id;

          // Count active reports assigned to this team
          const assignedReports = reports.filter((r) => {
            if (!r.assignedTeam) return false;
            const a = r.assignedTeam.toLowerCase();
            const t = team.name.toLowerCase();
            const c = team.code.toLowerCase();
            return (
              (a === t || a.includes(c) || t.includes(a) || (team.assignedTickets && team.assignedTickets.includes(r.id))) &&
              (r.status === 'Sedang Dikerjakan' || r.status === 'Dijadwalkan')
            );
          });

          return (
            <div
              key={team.id}
              className={`bg-white rounded-2xl border transition-all p-5 flex flex-col justify-between ${
                isMyTeam
                  ? 'border-amber-400 shadow-md ring-2 ring-amber-400/30'
                  : 'border-slate-200 shadow-xs hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs ${
                        isMyTeam ? 'bg-amber-600 text-white' : 'bg-slate-900 text-white'
                      }`}
                    >
                      {team.code}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-headline text-base font-bold text-slate-900 leading-tight">
                          {team.name}
                        </h3>
                        {isMyTeam && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase">
                            Regu Anda
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{team.division}</p>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  {isMyTeam ? (
                    // Interactive dropdown / switcher ONLY for their own team
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                      {(['Bertugas', 'Siaga', 'Istirahat'] as const).map((st) => {
                        const isCurrent = team.status === st;
                        return (
                          <button
                            key={st}
                            onClick={() => onUpdateTeamStatus && onUpdateTeamStatus(team.id, st)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                              isCurrent
                                ? st === 'Bertugas'
                                  ? 'bg-blue-600 text-white shadow-xs'
                                  : st === 'Siaga'
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-amber-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                            }`}
                            title={`Ubah status ${team.name} ke ${st}`}
                          >
                            {st}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    // READ ONLY for Admin or other teams!
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold border cursor-default flex items-center gap-1.5 select-none ${getStatusBadgeClass(
                        team.status
                      )}`}
                      title={
                        userRole === 'admin'
                          ? `Mode Pemantauan: Status hanya dapat diubah oleh petugas ${team.name}`
                          : `Akses Terbatas: Hanya dapat diubah oleh ${team.leader}`
                      }
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                      <span>{team.status}</span>
                      <span className="material-symbols-outlined text-[13px] opacity-50 ml-0.5">lock</span>
                    </div>
                  )}
                </div>

                {/* Team Details Grid */}
                <div className="space-y-2.5 text-xs text-slate-600 py-3 border-y border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Koordinator Lapangan:</span>
                    <strong className="text-slate-900 font-semibold">{team.leader}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Jumlah Personil:</span>
                    <strong className="text-slate-900 font-semibold">{team.activeMembers} Anggota</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Armada / Kendaraan:</span>
                    <strong className="text-slate-900 font-semibold">{team.vehicle}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Lokasi Penugasan:</span>
                    <span className="text-slate-800 font-medium">{team.currentLocation || 'Posko Siaga Desa'}</span>
                  </div>
                </div>

                {/* Assigned reports list */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Tiket Sedang Ditangani ({assignedReports.length})
                    </span>
                  </div>

                  {assignedReports.length === 0 ? (
                    <div className="p-3 rounded-xl bg-slate-50 text-slate-400 text-xs text-center border border-slate-100">
                      Tidak ada tiket aktif yang sedang ditugaskan ke regu ini.
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {assignedReports.map((r) => (
                        <div
                          key={r.id}
                          onClick={() => onOpenReportDetail && onOpenReportDetail(r)}
                          className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 transition-all flex items-center justify-between cursor-pointer"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="font-mono text-xs font-bold text-emerald-700">{r.id}</span>
                            <span className="text-xs text-slate-800 font-medium truncate">{r.title}</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold shrink-0">
                            {r.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Card Access Note */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                {isMyTeam ? (
                  <span className="text-amber-800 font-semibold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-amber-600">edit</span>
                    <span>Anda dapat mengubah status kesiapan regu ini</span>
                  </span>
                ) : userRole === 'admin' ? (
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-slate-400">lock</span>
                    <span>Hanya dapat diubah oleh petugas regu bersangkutan</span>
                  </span>
                ) : (
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-slate-400">lock</span>
                    <span>Dikelola oleh {team.leader}</span>
                  </span>
                )}
                <span className="text-[11px] text-slate-400 font-mono">{team.id}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
