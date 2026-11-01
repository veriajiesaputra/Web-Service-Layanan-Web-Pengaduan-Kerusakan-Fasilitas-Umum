import React from 'react';
import { AdminTab } from './AdminSidebar';
import { FieldTeam } from '../../types';

interface AdminNavbarProps {
  activeTab: AdminTab;
  onOpenMobileMenu: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNewReportClick: () => void;
  onExportClick: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  urgentCount: number;
  userRole: 'admin' | 'field_officer';
  onRoleChange: (role: 'admin' | 'field_officer') => void;
  selectedTeam?: FieldTeam;
  onUpdateTeamStatus?: (teamId: string, status: 'Bertugas' | 'Siaga' | 'Istirahat') => void;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({
  activeTab,
  onOpenMobileMenu,
  searchQuery,
  onSearchChange,
  onNewReportClick,
  onExportClick,
  onRefresh,
  isRefreshing,
  urgentCount,
  userRole,
  onRoleChange,
  selectedTeam,
  onUpdateTeamStatus,
}) => {
  const adminTabTitles: Record<AdminTab, { title: string; subtitle: string }> = {
    dasbor: { title: 'Dasbor Ringkasan Desa', subtitle: 'Ikhtisar operasional & penanganan fasilitas desa' },
    laporan: { title: 'Semua Laporan Warga', subtitle: 'Daftar seluruh aduan & riwayat penanganan tiket desa' },
    verifikasi: { title: 'Antrean Verifikasi & Disposisi', subtitle: 'Aduan masuk yang memerlukan peninjauan dan penugasan regu' },
    peta: { title: 'Peta GIS Persebaran Wilayah', subtitle: 'Sebaran spasial titik kerusakan fasilitas umum di 6 dusun' },
    petugas: { title: 'Regu Petugas Lapangan', subtitle: 'Monitoring kesiapan armada & personil siaga desa' },
    catatan: { title: 'Catatan Koordinasi Harian', subtitle: 'Log briefing operasional harian antar perangkat desa' },
    statistik: { title: 'Statistik & Analisis SLA', subtitle: 'Metrik capaian standar pelayanan minimal penanganan aduan' },
    pengaturan: { title: 'Pengaturan Sistem Desa', subtitle: 'Identitas portal desa, parameter SLA, dan konfigurasi database' },
    tugas_lapangan: { title: 'Tugas Lapangan', subtitle: 'Daftar penugasan teknis' },
  };

  const fieldOfficerTabTitles: Record<AdminTab, { title: string; subtitle: string }> = {
    dasbor: { title: 'Dasbor Lapangan', subtitle: 'Ikhtisar penugasan kerja regu' },
    tugas_lapangan: {
      title: `Instruksi Tugas: ${selectedTeam?.name || 'Regu Lapangan'}`,
      subtitle: `Daftar pekerjaan fisik & perbaikan fasilitas yang ditugaskan kepada ${selectedTeam?.leader || 'koordinator'}`,
    },
    laporan: { title: 'Daftar Seluruh Tiket Desa', subtitle: 'Referensi data keluhan fasilitas di wilayah desa' },
    verifikasi: { title: 'Antrean Tiket', subtitle: 'Menunggu verifikasi admin' },
    peta: { title: 'Peta Rute & Navigasi Tugas', subtitle: 'Titik koordinat penugasan fasilitas yang harus ditangani regu' },
    petugas: { title: 'Kesiapan Regu & Armada', subtitle: 'Kelayakan kendaraan dan personil tim operasional' },
    catatan: { title: 'Catatan & Briefing Lapangan', subtitle: 'Instruksi pengerjaan dari Kaur Pelayanan dan log teknis' },
    statistik: { title: 'Capaian Regu', subtitle: 'Statistik penyelesaian tugas' },
    pengaturan: { title: 'Pengaturan', subtitle: 'Konfigurasi' },
  };

  const currentInfo = userRole === 'admin' 
    ? (adminTabTitles[activeTab] || adminTabTitles.dasbor)
    : (fieldOfficerTabTitles[activeTab] || fieldOfficerTabTitles.tugas_lapangan);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4 shadow-2xs shrink-0">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus:outline-none"
          title="Buka Menu"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
              userRole === 'admin'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-900 border border-amber-300'
            }`}>
              {userRole === 'admin' ? 'ADMINISTRATOR' : `SATGAS: ${selectedTeam?.code || 'REGU'}`}
            </span>
            <h1 className="font-headline text-sm sm:text-base font-bold text-slate-900 leading-tight">
              {currentInfo.title}
            </h1>
          </div>
          <span className="text-[11px] text-slate-500 hidden md:inline leading-none mt-0.5">
            {currentInfo.subtitle}
          </span>
        </div>
      </div>

      {/* Right: Search, Role Switcher Quick Pill, Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live Search */}
        <div className="relative hidden md:block w-40 lg:w-56">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Cari tiket, lokasi..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white rounded-lg border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <span className="material-symbols-outlined text-[14px]">cancel</span>
            </button>
          )}
        </div>

        {/* Server Status Pill */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>MySQL Database Aktif</span>
        </div>

        {/* Field Team Quick Status Badge (Visible for Field Officer) */}
        {userRole === 'field_officer' && selectedTeam && onUpdateTeamStatus && (
          <button
            onClick={() => {
              const nextStatus = selectedTeam.status === 'Bertugas' ? 'Siaga' : selectedTeam.status === 'Siaga' ? 'Istirahat' : 'Bertugas';
              onUpdateTeamStatus(selectedTeam.id, nextStatus);
            }}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all shadow-2xs border ${
              selectedTeam.status === 'Bertugas'
                ? 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                : selectedTeam.status === 'Siaga'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
            title="Klik untuk mengubah status kesiapan regu"
          >
            <span className={`w-2 h-2 rounded-full ${
              selectedTeam.status === 'Bertugas' ? 'bg-blue-600 animate-ping' : selectedTeam.status === 'Siaga' ? 'bg-emerald-600' : 'bg-slate-500'
            }`} />
            <span>Regu: {selectedTeam.status}</span>
          </button>
        )}

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
          title="Segarkan data dari database MySQL"
        >
          <span className={`material-symbols-outlined text-[20px] ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`}>
            refresh
          </span>
        </button>

        {/* Export Data Button (Admin only) */}
        {userRole === 'admin' && (
          <button
            onClick={onExportClick}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            title="Ekspor laporan ke CSV atau JSON"
          >
            <span className="material-symbols-outlined text-[17px]">download</span>
            <span>Ekspor</span>
          </button>
        )}

        {/* New Report Intake Button (Admin only) */}
        {userRole === 'admin' && (
          <button
            onClick={onNewReportClick}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs hover:shadow transition-all"
            title="Buat tiket aduan warga baru secara manual"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span className="hidden sm:inline">Aduan Baru</span>
          </button>
        )}
      </div>
    </header>
  );
};
