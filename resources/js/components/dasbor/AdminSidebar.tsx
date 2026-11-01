import React from 'react';
import { ASSETS } from '../../data/mockData';
import { FieldTeam } from '../../types';

export type AdminTab = 
  | 'dasbor'
  | 'laporan'
  | 'verifikasi'
  | 'peta'
  | 'petugas'
  | 'catatan'
  | 'statistik'
  | 'pengaturan'
  | 'tugas_lapangan';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  pendingCount: number;
  totalCount: number;
  fieldTaskCount?: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  userRole: 'admin' | 'field_officer';
  onRoleChange: (role: 'admin' | 'field_officer') => void;
  selectedTeam?: FieldTeam;
  teams?: FieldTeam[];
  onSelectTeam?: (team: FieldTeam) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingCount,
  totalCount,
  fieldTaskCount = 0,
  isOpenMobile,
  onCloseMobile,
  userRole,
  onRoleChange,
  selectedTeam,
  teams = [],
  onSelectTeam,
}) => {
  // Menu configuration for Admin vs Field Officer
  const adminMenuSections = [
    {
      title: 'MENU UTAMA',
      items: [
        {
          id: 'dasbor' as AdminTab,
          label: 'Dasbor Ringkasan',
          icon: 'dashboard',
        },
        {
          id: 'laporan' as AdminTab,
          label: 'Semua Laporan',
          icon: 'table_chart',
          badge: `${totalCount}`,
          badgeClass: 'bg-slate-800 text-slate-300',
        },
        {
          id: 'verifikasi' as AdminTab,
          label: 'Antrean Verifikasi',
          icon: 'verified',
          badge: pendingCount > 0 ? `${pendingCount} Baru` : undefined,
          badgeClass: 'bg-amber-500 text-slate-950 font-bold animate-pulse',
        },
      ],
    },
    {
      title: 'OPERASIONAL & LAPANGAN',
      items: [
        {
          id: 'peta' as AdminTab,
          label: 'Peta GIS Wilayah',
          icon: 'map',
        },
        {
          id: 'petugas' as AdminTab,
          label: 'Regu Petugas Lapangan',
          icon: 'engineering',
        },
        {
          id: 'catatan' as AdminTab,
          label: 'Catatan Koordinasi',
          icon: 'assignment',
        },
      ],
    },
    {
      title: 'ANALISIS & SISTEM',
      items: [
        {
          id: 'statistik' as AdminTab,
          label: 'Statistik & SLA',
          icon: 'analytics',
        },
        {
          id: 'pengaturan' as AdminTab,
          label: 'Pengaturan Sistem',
          icon: 'settings',
        },
      ],
    },
  ];

  const fieldOfficerMenuSections = [
    {
      title: 'OPERASIONAL SATGAS',
      items: [
        {
          id: 'tugas_lapangan' as AdminTab,
          label: 'Tugas Regu Saya',
          icon: 'assignment_turned_in',
          badge: fieldTaskCount > 0 ? `${fieldTaskCount} Aktif` : undefined,
          badgeClass: 'bg-amber-500 text-slate-950 font-black animate-pulse',
        },
        {
          id: 'peta' as AdminTab,
          label: 'Peta Navigasi Tugas',
          icon: 'near_me',
        },
        {
          id: 'petugas' as AdminTab,
          label: 'Kesiapan Regu & Armada',
          icon: 'handyman',
        },
        {
          id: 'catatan' as AdminTab,
          label: 'Catatan Lapangan & Log',
          icon: 'assignment',
        },
      ],
    },
    {
      title: 'REFERENSI & DATA DESA',
      items: [
        {
          id: 'laporan' as AdminTab,
          label: 'Seluruh Aduan Warga',
          icon: 'list_alt',
          badge: `${totalCount}`,
          badgeClass: 'bg-slate-800 text-slate-300',
        },
      ],
    },
  ];

  const activeMenuSections = userRole === 'admin' ? adminMenuSections : fieldOfficerMenuSections;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-slate-200 flex flex-col justify-between border-r border-slate-800 shadow-2xl transition-transform duration-300 ease-in-out z-40 lg:z-30 lg:translate-x-0 ${
        isOpenMobile ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Scrollable menu items */}
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
          {/* Brand Header */}
          <div className="h-18 px-5 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/50 shrink-0">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-md shrink-0 ${
                userRole === 'admin'
                  ? 'bg-emerald-600 shadow-emerald-900/30'
                  : 'bg-amber-600 shadow-amber-900/30'
              }`}>
                <span className="material-symbols-outlined text-[22px]">
                  {userRole === 'admin' ? 'account_balance' : 'engineering'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline text-base font-bold text-white tracking-tight leading-tight">
                  Desa Kepunduhan
                </span>
                <span className={`text-[10px] font-bold tracking-wider uppercase ${
                  userRole === 'admin' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {userRole === 'admin' ? 'Panel Administrator' : 'Portal Satgas Lapangan'}
                </span>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg"
              title="Tutup Menu"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Role Switcher Tab (Admin vs Petugas Lapangan) */}
          <div className="p-3 border-b border-slate-800/80 bg-slate-950/30 space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
              Pilih Peran Sistem:
            </div>
            <div className="bg-slate-950 p-1 rounded-xl flex items-center border border-slate-800 text-xs font-bold">
              <button
                onClick={() => {
                  onRoleChange('admin');
                  onSelectTab('dasbor');
                }}
                className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  userRole === 'admin'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Masuk sebagai Administrator Desa (Kaur Pelayanan)"
              >
                <span className="material-symbols-outlined text-[15px]">admin_panel_settings</span>
                <span>Admin</span>
              </button>

              <button
                onClick={() => {
                  onRoleChange('field_officer');
                  onSelectTab('tugas_lapangan');
                }}
                className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  userRole === 'field_officer'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Masuk sebagai Regu Petugas Lapangan"
              >
                <span className="material-symbols-outlined text-[15px]">engineering</span>
                <span>Petugas</span>
              </button>
            </div>

            {/* If Field Officer, Team Switcher Dropdown */}
            {userRole === 'field_officer' && teams.length > 0 && selectedTeam && onSelectTeam && (
              <div className="pt-1">
                <label className="text-[10px] font-bold uppercase text-amber-400/90 tracking-wider block mb-1 px-1">
                  Pilih Regu Lapangan:
                </label>
                <select
                  value={selectedTeam.id}
                  onChange={(e) => {
                    const target = teams.find((t) => t.id === e.target.value);
                    if (target) onSelectTeam(target);
                  }}
                  className="w-full text-xs font-bold bg-slate-900 border border-slate-700 text-amber-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.code} - {t.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-5">
            {activeMenuSections.map((section) => (
              <div key={section.title}>
                <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {section.title}
                </div>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectTab(item.id);
                          onCloseMobile();
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                          isActive
                            ? userRole === 'admin'
                              ? 'bg-emerald-600 text-white font-bold shadow-sm shadow-emerald-950'
                              : 'bg-amber-600 text-white font-bold shadow-sm shadow-amber-950'
                            : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`material-symbols-outlined text-[19px] ${isActive ? 'text-white' : 'text-slate-400'}`}>
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeClass || 'bg-slate-800 text-slate-300'}`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Section: Portal Warga & Profile */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 space-y-2 shrink-0">
          {/* Direct Switcher to Public Portal */}
          <a
            href="/"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/20 transition-colors"
            title="Lihat website publik layanan warga"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[18px]">public</span>
              <span>Buka Portal Warga</span>
            </div>
            <span className="material-symbols-outlined text-[15px]">open_in_new</span>
          </a>

          {/* Profile Card according to Role */}
          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 ring-2 ${
                userRole === 'admin'
                  ? 'bg-emerald-700 ring-emerald-500/40'
                  : 'bg-amber-600 ring-amber-500/40'
              }`}>
                {userRole === 'admin' ? (
                  <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                ) : (
                  <span>{selectedTeam?.code || 'RG'}</span>
                )}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-white truncate">
                  {userRole === 'admin' ? 'Budi Santoso' : (selectedTeam?.leader || 'Koordinator Regu')}
                </span>
                <span className={`text-[10px] truncate font-semibold ${
                  userRole === 'admin' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {userRole === 'admin' ? 'Kaur Pelayanan Desa' : (selectedTeam?.name || 'Petugas Lapangan')}
                </span>
              </div>
            </div>
            <div 
              className={`w-2.5 h-2.5 rounded-full ring-4 ring-slate-900 ${
                userRole === 'admin' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
              }`} 
              title="Online" 
            />
          </div>
        </div>
      </aside>
    </>
  );
};
