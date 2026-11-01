import React, { useState, useRef, useEffect } from 'react';
import { CitizenUser } from '../../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCreateModal: () => void;
  onOpenAllReportsModal: (filterMyReports?: boolean) => void;
  onOpenGisModal: () => void;
  onOpenEmergencyModal: () => void;
  onOpenAnnouncementModal: () => void;
  currentUser: CitizenUser | null;
  onOpenCitizenLogin: () => void;
  onLogoutCitizen: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenCreateModal,
  onOpenAllReportsModal,
  onOpenGisModal,
  onOpenEmergencyModal,
  onOpenAnnouncementModal,
  currentUser,
  onOpenCitizenLogin,
  onLogoutCitizen,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (tabKey: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setActiveTab(tabKey);
    setMobileMenuOpen(false);

    if (tabKey === 'buat-laporan') {
      onOpenCreateModal();
    } else if (tabKey === 'daftar-laporan') {
      onOpenAllReportsModal(false);
    } else if (tabKey === 'statistik-dan-peta') {
      onOpenGisModal();
    } else if (tabKey === 'kontak-darurat') {
      onOpenEmergencyModal();
    } else if (tabKey === 'beranda') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      {/* Top Announcement Bar */}
      <div 
        onClick={onOpenAnnouncementModal}
        className="bg-emerald-50 text-emerald-900 border-b border-emerald-100/80 px-4 py-1.5 text-xs cursor-pointer hover:bg-emerald-100/70 transition-colors select-none"
        title="Klik untuk melihat detail pengumuman desa"
      >
        <div className="flex items-center justify-center gap-2 max-w-7xl mx-auto truncate">
          <span className="material-symbols-outlined text-[16px] text-emerald-700 shrink-0">campaign</span>
          <span className="truncate font-medium">Pengumuman: Musrenbang Desa &amp; Kerja Bakti Saluran Irigasi Hari Minggu Ini</span>
          <span className="text-[11px] font-bold text-emerald-700 shrink-0 hover:underline hidden sm:inline">Lihat Detail &rarr;</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div 
          onClick={() => handleNavClick('beranda')}
          className="flex items-center gap-3 shrink-0 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[22px]">account_balance</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-lg font-bold text-slate-900 tracking-tight leading-tight group-hover:text-emerald-700 transition-colors">
              Desa Kepunduhan
            </span>
            <span className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
              Kec. Kramat, Kab. Tegal
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5">
          <button
            onClick={() => handleNavClick('beranda')}
            className={`px-3.5 py-2 text-sm font-semibold rounded-xl transition-all ${
              activeTab === 'beranda'
                ? 'text-emerald-800 bg-emerald-50 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => handleNavClick('buat-laporan')}
            className={`px-3.5 py-2 text-sm font-semibold rounded-xl transition-all ${
              activeTab === 'buat-laporan'
                ? 'text-emerald-800 bg-emerald-50 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            Buat Laporan
          </button>
          <button
            onClick={() => handleNavClick('daftar-laporan')}
            className={`px-3.5 py-2 text-sm font-semibold rounded-xl transition-all ${
              activeTab === 'daftar-laporan'
                ? 'text-emerald-800 bg-emerald-50 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            Daftar Laporan
          </button>
          <button
            onClick={() => handleNavClick('statistik-dan-peta')}
            className={`px-3.5 py-2 text-sm font-semibold rounded-xl transition-all ${
              activeTab === 'statistik-dan-peta'
                ? 'text-emerald-800 bg-emerald-50 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            Statistik &amp; Peta
          </button>
          <button
            onClick={() => handleNavClick('kontak-darurat')}
            className={`px-3.5 py-2 text-sm font-semibold rounded-xl transition-all ${
              activeTab === 'kontak-darurat'
                ? 'text-emerald-800 bg-emerald-50 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            Kontak Darurat
          </button>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Citizen Account Chip / Login Button */}
          {currentUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                title="Profil Akun Warga Anda"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                  {currentUser.name.charAt(0).toUpperCase()}
                </span>
                <span className="max-w-[90px] sm:max-w-[120px] truncate">{currentUser.name}</span>
                <span className="material-symbols-outlined text-[16px] text-emerald-600">expand_more</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2 py-1.5 border-b border-slate-100 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</span>
                      <span className="material-symbols-outlined text-[14px] text-emerald-600">verified</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">{currentUser.phone}</p>
                    <p className="text-[10px] text-emerald-700 font-medium mt-0.5">
                      📍 {currentUser.dusun} {currentUser.rtRw ? `(${currentUser.rtRw})` : ''}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenAllReportsModal(true);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[17px] text-emerald-600">assignment_ind</span>
                    <span>Laporan Saya</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenCitizenLogin();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[17px] text-slate-500">switch_account</span>
                    <span>Ganti Akun Warga</span>
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onLogoutCitizen();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[17px]">logout</span>
                    <span>Keluar Akun</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenCitizenLogin}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all cursor-pointer"
              title="Masuk atau Buat Akun Warga Desa"
            >
              <span className="material-symbols-outlined text-[17px] text-emerald-700">login</span>
              <span className="hidden sm:inline">Masuk Warga</span>
              <span className="sm:hidden">Masuk</span>
            </button>
          )}

          <a
            href="/admin"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 transition-all"
            title="Masuk ke Panel Dasbor Administrator Desa"
          >
            <span className="material-symbols-outlined text-[16px] text-slate-500">admin_panel_settings</span>
            <span>Panel Admin</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Menu Navigasi"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1.5 shadow-lg animate-in slide-in-from-top-2 duration-150">
          {currentUser && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 mb-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-950 block">{currentUser.name}</span>
                  <span className="text-[11px] text-emerald-700 font-mono">{currentUser.phone}</span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogoutCitizen();
                  }}
                  className="text-xs text-rose-600 font-bold hover:underline"
                >
                  Keluar
                </button>
              </div>
              <div className="mt-2.5 pt-2 border-t border-emerald-100/80 flex items-center gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAllReportsModal(true);
                  }}
                  className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px] text-emerald-600">assignment_ind</span>
                  Laporan Saya
                </button>
                <span className="text-slate-300">•</span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCitizenLogin();
                  }}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px] text-slate-500">switch_account</span>
                  Ganti Akun
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => handleNavClick('beranda')}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50 flex items-center justify-between"
          >
            <span>Beranda</span>
            <span className="material-symbols-outlined text-[18px] text-slate-400">chevron_right</span>
          </button>
          <button
            onClick={() => handleNavClick('buat-laporan')}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50 flex items-center justify-between"
          >
            <span>Buat Laporan Baru</span>
            <span className="material-symbols-outlined text-[18px] text-slate-400">chevron_right</span>
          </button>
          <button
            onClick={() => handleNavClick('daftar-laporan')}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50 flex items-center justify-between"
          >
            <span>Daftar Laporan Warga</span>
            <span className="material-symbols-outlined text-[18px] text-slate-400">chevron_right</span>
          </button>
          <button
            onClick={() => handleNavClick('statistik-dan-peta')}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50 flex items-center justify-between"
          >
            <span>Statistik &amp; Peta GIS</span>
            <span className="material-symbols-outlined text-[18px] text-slate-400">chevron_right</span>
          </button>
          <button
            onClick={() => handleNavClick('kontak-darurat')}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50 flex items-center justify-between"
          >
            <span>Kontak Darurat Desa</span>
            <span className="material-symbols-outlined text-[18px] text-slate-400">chevron_right</span>
          </button>

          <div className="pt-2 border-t border-slate-100 flex gap-2">
            {!currentUser && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCitizenLogin();
                }}
                className="flex-1 py-2 text-center text-xs font-bold rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
              >
                Masuk Akun Warga
              </button>
            )}
            <a
              href="/admin"
              className="flex-1 py-2 text-center text-xs font-bold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Masuk Panel Admin
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
