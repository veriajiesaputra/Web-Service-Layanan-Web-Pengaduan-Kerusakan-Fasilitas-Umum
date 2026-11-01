import React, { useState } from 'react';
import { ASSETS } from '../../data/mockData';
import { ReportItem } from '../../types';

interface MapAndSOPProps {
  reports: ReportItem[];
  onOpenGisModal: () => void;
  onSelectReport: (report: ReportItem) => void;
}

export const MapAndSOP: React.FC<MapAndSOPProps> = ({
  reports,
  onOpenGisModal,
  onSelectReport
}) => {
  const [activePin, setActivePin] = useState<ReportItem | null>(null);

  // Find key reports for interactive pins
  const reportSelesai = reports.find(r => r.status === 'Selesai') || reports[1];
  const reportDiajukan = reports.find(r => r.status === 'Diajukan') || reports[0];
  const reportProses = reports.find(r => r.status === 'Sedang Dikerjakan') || reports[2];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Peta Sebaran Laporan */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-slate-200/80">
          {/* Header & Legend */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                Geografis Wilayah
              </span>
              <h3 className="font-headline text-xl sm:text-2xl text-slate-900 font-bold tracking-tight">
                Peta Sebaran Laporan
              </h3>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                Selesai
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                Proses
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                Diajukan
              </span>
            </div>
          </div>

          {/* Interactive Map Visual */}
          <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-inner group border border-slate-200">
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url('${ASSETS.mapBg}')` }}
            />
            <div className="absolute inset-0 bg-emerald-950/10 pointer-events-none" />

            {/* Pin 1: Selesai */}
            {reportSelesai && (
              <div
                onClick={() => onSelectReport(reportSelesai)}
                onMouseEnter={() => setActivePin(reportSelesai)}
                onMouseLeave={() => setActivePin(null)}
                style={{ top: '28%', left: '33%' }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform cursor-pointer z-10"
                title={`${reportSelesai.id} - ${reportSelesai.title}`}
              >
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md border-2 border-white hover:bg-emerald-700 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">check</span>
                </div>
              </div>
            )}

            {/* Pin 2: Diajukan (Bouncing) */}
            {reportDiajukan && (
              <div
                onClick={() => onSelectReport(reportDiajukan)}
                onMouseEnter={() => setActivePin(reportDiajukan)}
                onMouseLeave={() => setActivePin(null)}
                style={{ top: '50%', right: '25%' }}
                className="absolute transform translate-x-1/2 -translate-y-1/2 transition-transform cursor-pointer z-10"
                title={`${reportDiajukan.id} - ${reportDiajukan.title}`}
              >
                <div className="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md border-2 border-white animate-bounce">
                  <span className="material-symbols-outlined text-[18px]">priority_high</span>
                </div>
              </div>
            )}

            {/* Pin 3: Sedang Dikerjakan */}
            {reportProses && (
              <div
                onClick={() => onSelectReport(reportProses)}
                onMouseEnter={() => setActivePin(reportProses)}
                onMouseLeave={() => setActivePin(null)}
                style={{ bottom: '25%', left: '50%' }}
                className="absolute transform -translate-x-1/2 translate-y-1/2 group-hover:scale-110 transition-transform cursor-pointer z-10"
                title={`${reportProses.id} - ${reportProses.title}`}
              >
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md border-2 border-white hover:bg-blue-700 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">build</span>
                </div>
              </div>
            )}

            {/* Hover Tooltip Preview */}
            {activePin && (
              <div className="absolute top-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-lg border border-slate-200 z-20 animate-in fade-in">
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-emerald-700">{activePin.id} • {activePin.categoryLabel}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {activePin.status}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-900 truncate">{activePin.title}</p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">📍 {activePin.location}</p>
              </div>
            )}

            {/* Floating indicator */}
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-xs border border-slate-200">
              <p className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                <span>3 Titik Aktif di Dusun Krajan &amp; Sukamaju</span>
              </p>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="mt-5 flex flex-col sm:flex-row justify-between sm:items-center gap-3 pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Terintegrasi dengan Pemetaan Wilayah Desa Mandiri.
            </p>
            <button
              onClick={onOpenGisModal}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-50 hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800 font-semibold text-xs sm:text-sm border border-slate-200 hover:border-emerald-200 shadow-xs transition-colors cursor-pointer"
            >
              <span>Buka Peta Interaktif GIS</span>
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            </button>
          </div>
        </div>

        {/* Right Column: Alur 4 Langkah Transparansi */}
        <div className="lg:col-span-6 space-y-4">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
              SOP Penanganan Aduan
            </span>
            <h3 className="font-headline text-xl sm:text-2xl text-slate-900 font-bold tracking-tight">
              Alur Transparansi Pelaporan Desa
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              Setiap laporan diproses terstruktur dan dapat diawasi langsung oleh seluruh warga demi azas keterbukaan publik.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {/* Step 1 */}
            <div className="flex items-start gap-4 p-4.5 bg-white rounded-xl shadow-xs border border-slate-200/80 hover:border-emerald-200 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center font-headline text-sm font-bold shrink-0">
                1
              </div>
              <div>
                <h4 className="font-headline text-sm sm:text-base font-bold text-slate-900">
                  Warga Mengisi Laporan
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                  Lengkapi foto bukti kerusakan fasilitas, titik lokasi dusun/RT, dan deskripsi kebutuhan warga secara ringkas.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4 p-4.5 bg-white rounded-xl shadow-xs border border-slate-200/80 hover:border-emerald-200 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center font-headline text-sm font-bold shrink-0">
                2
              </div>
              <div>
                <h4 className="font-headline text-sm sm:text-base font-bold text-slate-900">
                  Verifikasi Perangkat Desa
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                  Kaur Pelayanan dan Kepala Dusun memeriksa keabsahan di lapangan &amp; menetapkan skala prioritas penanganan.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4 p-4.5 bg-white rounded-xl shadow-xs border border-slate-200/80 hover:border-emerald-200 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center font-headline text-sm font-bold shrink-0">
                3
              </div>
              <div>
                <h4 className="font-headline text-sm sm:text-base font-bold text-slate-900">
                  Tindak Lanjut Lapangan
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                  Satgas desa, tim teknis kelistrikan, atau dinas terkait ditugaskan mengeksekusi perbaikan secara langsung.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-4 p-4.5 bg-white rounded-xl shadow-xs border border-slate-200/80 hover:border-emerald-200 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center font-headline text-sm font-bold shrink-0">
                4
              </div>
              <div>
                <h4 className="font-headline text-sm sm:text-base font-bold text-slate-900">
                  Laporan Ditutup &amp; Dipublikasi
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                  Foto hasil perbaikan diunggah transparan kepada pelapor dan dapat dievaluasi bersama oleh Badan Permusyawaratan Desa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
