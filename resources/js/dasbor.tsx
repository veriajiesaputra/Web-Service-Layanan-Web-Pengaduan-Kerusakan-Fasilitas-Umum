import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ReportItem, ReportStatus, ReportPriority, FieldTeam } from './types';
import { AdminSidebar, AdminTab } from './components/dasbor/AdminSidebar';
import { AdminNavbar } from './components/dasbor/AdminNavbar';
import { OverviewView } from './components/dasbor/OverviewView';
import { ReportTable } from './components/dasbor/ReportTable';
import { AdminDetailModal } from './components/dasbor/AdminDetailModal';
import { AdminVerificationModal } from './components/dasbor/AdminVerificationModal';
import { AdminNewReportModal } from './components/dasbor/AdminNewReportModal';
import { AdminExportModal } from './components/dasbor/AdminExportModal';
import { AdminMapView } from './components/dasbor/AdminMapView';
import { AdminTeamsView } from './components/dasbor/AdminTeamsView';
import { AdminNotesView } from './components/dasbor/AdminNotesView';
import { AdminStatsView } from './components/dasbor/AdminStatsView';
import { AdminSettingsView } from './components/dasbor/AdminSettingsView';
import { FieldOpsView } from './components/dasbor/FieldOpsView';
import { FIELD_TEAMS } from './data/mockData';
import { api } from './services/api';

function getInitialServerData(): { initialReports?: ReportItem[]; teams?: any; notes?: any; stats?: any } {
  try {
    const el = document.getElementById('server-data');
    if (el && el.textContent) {
      return JSON.parse(el.textContent);
    }
  } catch (e) {
    console.error('Error parsing server data:', e);
  }
  return {};
}

export default function DasborApp() {
  const serverData = getInitialServerData();

  // Role State (Administrator Desa vs Regu Petugas Lapangan)
  const [userRole, setUserRole] = useState<'admin' | 'field_officer'>(() => {
    return (localStorage.getItem('desa_mandiri_admin_role') as 'admin' | 'field_officer') || 'admin';
  });

  // Teams State
  const [teams, setTeams] = useState<FieldTeam[]>(serverData.teams || FIELD_TEAMS);
  const [selectedTeamId, setSelectedTeamId] = useState<string>(() => {
    return localStorage.getItem('desa_mandiri_selected_team_id') || 'team-bm';
  });

  const selectedTeam = teams.find((t) => t.id === selectedTeamId) || teams[0] || FIELD_TEAMS[0];

  // Navigation State
  const [activeTab, setActiveTab] = useState<AdminTab>(() => {
    return userRole === 'field_officer' ? 'tugas_lapangan' : 'dasbor';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Reports Data State
  const [reports, setReports] = useState<ReportItem[]>(serverData.initialReports || []);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter / Search State
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals State
  const [detailReport, setDetailReport] = useState<ReportItem | null>(null);
  const [verifyingReport, setVerifyingReport] = useState<ReportItem | null>(null);
  const [isNewReportOpen, setIsNewReportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Toast Notification Feedback
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Refresh reports & teams from backend
  const refreshReports = async () => {
    try {
      setIsRefreshing(true);
      const [reportsData, teamsData] = await Promise.all([
        api.getReports(),
        api.getTeams().catch(() => null),
      ]);

      if (Array.isArray(reportsData)) {
        setReports(reportsData);
      }
      if (Array.isArray(teamsData) && teamsData.length > 0) {
        setTeams(teamsData);
      }
      showToast('Data berhasil disinkronisasi dari database MySQL', 'info');
    } catch (e) {
      console.error('Gagal memuat data dari API:', e);
      showToast('Gagal menyinkronkan data dengan backend', 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Load latest on mount if empty
  useEffect(() => {
    if (!serverData.initialReports || serverData.initialReports.length === 0) {
      refreshReports();
    }
  }, []);

  // Role switching handler
  const handleRoleChange = (newRole: 'admin' | 'field_officer') => {
    setUserRole(newRole);
    localStorage.setItem('desa_mandiri_admin_role', newRole);
    if (newRole === 'field_officer') {
      setActiveTab('tugas_lapangan');
      showToast(`Beralih ke Mode Regu Petugas Lapangan (${selectedTeam?.name})`, 'info');
    } else {
      setActiveTab('dasbor');
      showToast('Beralih ke Mode Administrator Desa (Kaur Pelayanan)', 'info');
    }
  };

  const handleSelectTeam = (team: FieldTeam) => {
    setSelectedTeamId(team.id);
    localStorage.setItem('desa_mandiri_selected_team_id', team.id);
    showToast(`Regu aktif disetel ke: ${team.name}`, 'info');
  };

  const handleUpdateTeamStatus = async (teamId: string, status: 'Bertugas' | 'Siaga' | 'Istirahat') => {
    try {
      await api.updateTeam(teamId, { status });
      setTeams((prev) => prev.map((t) => (t.id === teamId ? { ...t, status } : t)));
      showToast(`Status regu berhasil diubah menjadi "${status}"`, 'success');
    } catch (e) {
      // Local fallback
      setTeams((prev) => prev.map((t) => (t.id === teamId ? { ...t, status } : t)));
      showToast(`Status regu diubah menjadi "${status}" (lokal)`, 'info');
    }
  };

  // Handlers for Reports
  const handleVerifyConfirm = async (
    reportId: string,
    assignedTeam: string,
    notes: string,
    priority?: ReportPriority
  ) => {
    try {
      const updated = await api.verifyReport(reportId, {
        assignedTeam,
        notes,
        priority,
        status: 'Sedang Dikerjakan',
      });

      setReports((prev) => prev.map((r) => (r.id === reportId ? updated : r)));
      showToast(`Aduan ${reportId} berhasil diverifikasi & didisposisikan ke ${assignedTeam}`);
    } catch (err) {
      console.error('Gagal memverifikasi aduan:', err);
      // Fallback local update
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? {
                ...r,
                status: 'Sedang Dikerjakan',
                assignedTeam,
                notes,
                priority: priority || r.priority,
                timeline: [
                  ...(r.timeline || []),
                  {
                    title: `Diverifikasi & Disposisi ke ${assignedTeam}`,
                    time: 'Baru saja',
                    description: notes,
                    actor: 'Admin Pelayanan Desa',
                    isCompleted: true,
                  },
                ],
              }
            : r
        )
      );
      showToast(`Aduan ${reportId} berhasil diverifikasi (lokal)`);
    }
  };

  const handleUpdateReport = async (updated: ReportItem) => {
    try {
      const res = await api.updateReport(updated.id, updated);
      setReports((prev) => prev.map((r) => (r.id === updated.id ? res : r)));
      showToast(`Data aduan ${updated.id} berhasil diperbarui`);
    } catch (err) {
      console.error('Gagal memperbarui aduan:', err);
      setReports((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      showToast(`Data aduan ${updated.id} diperbarui (lokal)`);
    }
  };

  const handleQuickStatusChange = async (reportId: string, newStatus: ReportStatus) => {
    try {
      const target = reports.find((r) => r.id === reportId);
      if (!target) return;

      const updated = await api.updateReport(reportId, {
        ...target,
        status: newStatus,
      });

      setReports((prev) => prev.map((r) => (r.id === reportId ? updated : r)));
      showToast(`Status tiket ${reportId} diubah menjadi "${newStatus}"`);
    } catch (err) {
      console.error('Gagal mengubah status cepat:', err);
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
      );
      showToast(`Status tiket ${reportId} diubah menjadi "${newStatus}" (lokal)`);
    }
  };

  const handleBatchVerify = async (ids: string[]) => {
    try {
      for (const id of ids) {
        await api.updateReport(id, { status: 'Sedang Dikerjakan' });
      }
      setReports((prev) =>
        prev.map((r) => (ids.includes(r.id) ? { ...r, status: 'Sedang Dikerjakan' } : r))
      );
      showToast(`${ids.length} tiket terpilih berhasil diverifikasi massal`);
    } catch (err) {
      console.error('Gagal verifikasi massal:', err);
      setReports((prev) =>
        prev.map((r) => (ids.includes(r.id) ? { ...r, status: 'Sedang Dikerjakan' } : r))
      );
      showToast(`${ids.length} tiket diverifikasi massal (lokal)`);
    }
  };

  const handleBatchReject = async (ids: string[]) => {
    try {
      for (const id of ids) {
        await api.updateReport(id, {
          status: 'Ditolak',
          rejectionReason: 'Ditolak secara massal oleh verifikator desa.',
        });
      }
      setReports((prev) =>
        prev.map((r) =>
          ids.includes(r.id)
            ? { ...r, status: 'Ditolak', rejectionReason: 'Ditolak secara massal oleh verifikator desa.' }
            : r
        )
      );
      showToast(`${ids.length} tiket ditolak secara massal`);
    } catch (err) {
      console.error('Gagal tolak massal:', err);
      setReports((prev) =>
        prev.map((r) => (ids.includes(r.id) ? { ...r, status: 'Ditolak' } : r))
      );
      showToast(`${ids.length} tiket ditolak (lokal)`);
    }
  };

  const handleAddReport = async (newReport: ReportItem) => {
    try {
      const created = await api.createReport(newReport);
      setReports((prev) => [created, ...prev]);
      showToast(`Aduan baru ${created.id} berhasil ditambahkan ke database MySQL`);
    } catch (err) {
      console.error('Gagal menambahkan aduan baru:', err);
      setReports((prev) => [newReport, ...prev]);
      showToast(`Aduan baru ${newReport.id} berhasil ditambahkan (lokal)`);
    }
  };

  const pendingCount = reports.filter((r) => r.status === 'Diajukan').length;
  const urgentCount = reports.filter(
    (r) => r.status === 'Diajukan' && (r.priority === 'Mendesak' || r.priority === 'Tinggi')
  ).length;

  // Calculate field tasks for selected team
  const fieldTaskCount = reports.filter((r) => {
    if (!r.assignedTeam || !selectedTeam) return false;
    const assigned = r.assignedTeam.toLowerCase();
    const tName = selectedTeam.name.toLowerCase();
    const tCode = selectedTeam.code.toLowerCase();
    const isThisTeam = assigned === tName || assigned.includes(tCode) || tName.includes(assigned);
    return isThisTeam && (r.status === 'Sedang Dikerjakan' || r.status === 'Dijadwalkan');
  }).length;

  return (
    <div className="min-h-screen bg-slate-100 antialiased text-slate-800">
      {/* Toast Notification Floating */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl bg-slate-900 text-white border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-300">
          <span
            className={`material-symbols-outlined text-[20px] ${
              toast.type === 'error'
                ? 'text-red-400'
                : toast.type === 'info'
                ? 'text-blue-400'
                : 'text-emerald-400'
            }`}
          >
            {toast.type === 'error' ? 'error' : toast.type === 'info' ? 'info' : 'check_circle'}
          </span>
          <span className="text-xs font-semibold">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white p-0.5 ml-1"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Sidebar Component (Fixed on desktop, overlay drawer on mobile) */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'verifikasi') {
            setSelectedStatusTab('diajukan');
          } else if (tab === 'laporan') {
            setSelectedStatusTab('all');
          }
        }}
        pendingCount={pendingCount}
        totalCount={reports.length}
        fieldTaskCount={fieldTaskCount}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        userRole={userRole}
        onRoleChange={handleRoleChange}
        selectedTeam={selectedTeam}
        teams={teams}
        onSelectTeam={handleSelectTeam}
      />

      {/* Main Content Area (Padded on desktop by lg:pl-64 so it NEVER touches the fixed sidebar) */}
      <div className="lg:pl-64 min-h-screen flex flex-col">
        {/* Top Navbar */}
        <AdminNavbar
          activeTab={activeTab}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNewReportClick={() => setIsNewReportOpen(true)}
          onExportClick={() => setIsExportOpen(true)}
          onRefresh={refreshReports}
          isRefreshing={isRefreshing}
          urgentCount={urgentCount}
          userRole={userRole}
          onRoleChange={handleRoleChange}
          selectedTeam={selectedTeam}
          onUpdateTeamStatus={handleUpdateTeamStatus}
        />

        {/* Role Banner Notification */}
        {userRole === 'field_officer' && (
          <div className="bg-amber-500/10 border-b border-amber-300 px-4 sm:px-8 py-2.5 flex items-center justify-between text-xs text-amber-950">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-700 text-[18px]">engineering</span>
              <span>
                Anda sedang melihat tampilan <strong>Regu Petugas Lapangan ({selectedTeam?.name})</strong>.
                Menampilkan tugas teknis yang didelegasikan.
              </span>
            </div>
            <button
              onClick={() => handleRoleChange('admin')}
              className="text-amber-900 font-bold hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Beralih ke Administrator Desa</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        )}

        {/* Page Body Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Dedicated Field Ops View for Field Officer */}
          {activeTab === 'tugas_lapangan' && (
            <FieldOpsView
              team={selectedTeam}
              reports={reports}
              onOpenReportDetail={(r) => setDetailReport(r)}
              onQuickStatusChange={handleQuickStatusChange}
              onSelectTab={(tab) => setActiveTab(tab)}
              onUpdateTeamStatus={handleUpdateTeamStatus}
            />
          )}

          {activeTab === 'dasbor' && (
            <>
              {userRole === 'admin' ? (
                <OverviewView
                  reports={reports}
                  onSelectTab={(tab) => {
                    setActiveTab(tab);
                    if (tab === 'verifikasi') setSelectedStatusTab('diajukan');
                    if (tab === 'laporan') setSelectedStatusTab('all');
                  }}
                  onOpenDetail={(r) => setDetailReport(r)}
                  onOpenVerify={(r) => setVerifyingReport(r)}
                  onNewReport={() => setIsNewReportOpen(true)}
                />
              ) : (
                <FieldOpsView
                  team={selectedTeam}
                  reports={reports}
                  onOpenReportDetail={(r) => setDetailReport(r)}
                  onQuickStatusChange={handleQuickStatusChange}
                  onSelectTab={(tab) => setActiveTab(tab)}
                  onUpdateTeamStatus={handleUpdateTeamStatus}
                />
              )}
            </>
          )}

          {activeTab === 'laporan' && (
            <ReportTable
              reports={reports}
              selectedStatusTab={selectedStatusTab}
              onSelectStatusTab={setSelectedStatusTab}
              onOpenDetail={(r) => setDetailReport(r)}
              onOpenVerify={(r) => setVerifyingReport(r)}
              onQuickStatusChange={handleQuickStatusChange}
              onBatchVerify={handleBatchVerify}
              onBatchReject={handleBatchReject}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          )}

          {activeTab === 'verifikasi' && (
            <>
              {userRole === 'admin' ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-600 text-[20px]">pending_actions</span>
                      <span>
                        Menampilkan <strong>{pendingCount} aduan baru</strong> berstatus "Diajukan" yang menunggu verifikasi petugas.
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveTab('laporan')}
                      className="font-bold text-amber-800 hover:underline"
                    >
                      Lihat Semua Tiket &rarr;
                    </button>
                  </div>

                  <ReportTable
                    reports={reports}
                    selectedStatusTab="diajukan"
                    onSelectStatusTab={setSelectedStatusTab}
                    onOpenDetail={(r) => setDetailReport(r)}
                    onOpenVerify={(r) => setVerifyingReport(r)}
                    onQuickStatusChange={handleQuickStatusChange}
                    onBatchVerify={handleBatchVerify}
                    onBatchReject={handleBatchReject}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                  />
                </div>
              ) : (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
                  <span className="material-symbols-outlined text-[48px] text-amber-500">lock</span>
                  <h3 className="font-headline text-base font-bold text-slate-800">
                    Halaman Dibatasi Untuk Administrator Desa
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Antrean verifikasi aduan masuk dikelola langsung oleh Kaur Pelayanan Desa. Silakan buka tab "Tugas Regu Saya" untuk melihat daftar instruksi kerja Anda.
                  </p>
                  <button
                    onClick={() => setActiveTab('tugas_lapangan')}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
                  >
                    Buka Tugas Regu Saya
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === 'peta' && (
            <AdminMapView
              reports={reports}
              onSelectReport={(r) => setDetailReport(r)}
            />
          )}

          {activeTab === 'petugas' && (
            <AdminTeamsView
              reports={reports}
              teams={teams}
              userRole={userRole}
              selectedTeam={selectedTeam}
              onUpdateTeamStatus={handleUpdateTeamStatus}
              onOpenReportDetail={(r) => setDetailReport(r)}
            />
          )}

          {activeTab === 'catatan' && <AdminNotesView />}

          {activeTab === 'statistik' && <AdminStatsView reports={reports} />}

          {activeTab === 'pengaturan' && (
            <>
              {userRole === 'admin' ? (
                <AdminSettingsView />
              ) : (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
                  <span className="material-symbols-outlined text-[48px] text-slate-400">admin_panel_settings</span>
                  <h3 className="font-headline text-base font-bold text-slate-800">
                    Pengaturan Sistem Hanya Dapat Diakses Oleh Administrator
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Konfigurasi database, parameter SLA, dan identitas desa hanya dapat diubah oleh Kaur Pelayanan Desa.
                  </p>
                  <button
                    onClick={() => handleRoleChange('admin')}
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold"
                  >
                    Beralih ke Akun Administrator
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Detail & Action Modal */}
      <AdminDetailModal
        report={detailReport}
        onClose={() => setDetailReport(null)}
        onUpdate={handleUpdateReport}
      />

      {/* Quick Verification & Disposition Modal */}
      <AdminVerificationModal
        report={verifyingReport}
        onClose={() => setVerifyingReport(null)}
        onConfirm={handleVerifyConfirm}
      />

      {/* New Report Intake Modal */}
      <AdminNewReportModal
        isOpen={isNewReportOpen}
        onClose={() => setIsNewReportOpen(false)}
        onAddReport={handleAddReport}
      />

      {/* Export Modal */}
      <AdminExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        reports={reports}
      />
    </div>
  );
}

// Mount to DOM
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<DasborApp />);
}
