import React, { useState } from 'react';
import { ReportItem } from '../../types';

interface AdminExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: ReportItem[];
}

export const AdminExportModal: React.FC<AdminExportModalProps> = ({
  isOpen,
  onClose,
  reports,
}) => {
  if (!isOpen) return null;

  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'print'>('csv');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = () => {
    if (exportFormat === 'print') {
      window.print();
      return;
    }

    if (exportFormat === 'json') {
      window.location.href = '/api/reports/export?format=json';
    } else {
      window.location.href = '/api/reports/export?format=csv';
    }

    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        <div className="p-4 sm:px-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <span className="material-symbols-outlined text-[20px]">download</span>
            </span>
            <div>
              <h3 className="font-headline text-base font-bold leading-tight">Ekspor Rekap Laporan</h3>
              <p className="text-xs text-slate-300">Unduh arsip seluruh {reports.length} aduan warga desa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-600">
            Pilih format keluaran untuk keperluan arsip, laporan ke kecamatan/kabupaten, atau analisis spreadsheet:
          </p>

          <div className="grid grid-cols-1 gap-2.5">
            <label
              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                exportFormat === 'csv'
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <input
                type="radio"
                name="export_format"
                checked={exportFormat === 'csv'}
                onChange={() => setExportFormat('csv')}
                className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">table_view</span>
                  Berkas CSV / Excel (.csv)
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Kompatibel dengan Microsoft Excel, Google Sheets, dan LibreOffice Calc.
                </span>
              </div>
            </label>

            <label
              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                exportFormat === 'json'
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <input
                type="radio"
                name="export_format"
                checked={exportFormat === 'json'}
                onChange={() => setExportFormat('json')}
                className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-blue-600 text-[18px]">data_object</span>
                  Format Baku JSON (.json)
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Data mentah terstruktur lengkap dengan histori timeline &amp; riwayat komentar.
                </span>
              </div>
            </label>

            <label
              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                exportFormat === 'print'
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <input
                type="radio"
                name="export_format"
                checked={exportFormat === 'print'}
                onChange={() => setExportFormat('print')}
                className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-purple-600 text-[18px]">print</span>
                  Cetak Lembar Laporan (Print / PDF)
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Format cetak bersih siap print atau Simpan sebagai PDF dari browser.
                </span>
              </div>
            </label>
          </div>

          {downloadSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
              <span>Pengunduhan dimulai secara otomatis!</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-200">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Tutup
            </button>
            <button
              onClick={handleDownload}
              className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs hover:shadow transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>Unduh Sekarang</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
