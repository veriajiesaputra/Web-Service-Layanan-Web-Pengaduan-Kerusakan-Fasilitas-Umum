import React, { useState } from 'react';
import { ReportItem, ReportPriority } from '../../types';
import { FIELD_TEAMS } from '../../data/mockData';

interface AdminVerificationModalProps {
  report: ReportItem | null;
  onClose: () => void;
  onConfirm: (reportId: string, assignedTeam: string, notes: string, priority?: ReportPriority) => void;
}

export const AdminVerificationModal: React.FC<AdminVerificationModalProps> = ({
  report,
  onClose,
  onConfirm,
}) => {
  if (!report) return null;

  // Auto suggest team based on category
  const getSuggestedTeam = () => {
    const cat = report.category.toLowerCase();
    if (cat === 'jalan' || cat.includes('jalan')) return FIELD_TEAMS[0].name;
    if (cat === 'irigasi' || cat.includes('air')) return FIELD_TEAMS[1].name;
    if (cat === 'penerangan' || cat.includes('lampu')) return FIELD_TEAMS[2].name;
    return FIELD_TEAMS[3].name;
  };

  const [selectedTeam, setSelectedTeam] = useState<string>(getSuggestedTeam());
  const [priority, setPriority] = useState<ReportPriority>(report.priority || 'Sedang');
  const [notes, setNotes] = useState<string>('Laporan telah diverifikasi sah. Ditugaskan untuk pengecekan fisik dan perbaikan segera.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    onConfirm(report.id, selectedTeam, notes, priority);
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        <div className="p-4 sm:px-6 bg-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-white/20">
              <span className="material-symbols-outlined text-[20px]">verified</span>
            </span>
            <div>
              <h3 className="font-headline text-base font-bold leading-tight">
                Verifikasi &amp; Disposisi Aduan
              </h3>
              <p className="text-xs text-emerald-100">Tiket: {report.id} • {report.reporterName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <div className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Aduan Masuk</div>
            <div className="font-bold text-slate-900">{report.title}</div>
            <div className="text-slate-600">{report.location} ({report.dusun})</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Tingkat Prioritas
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as ReportPriority)}
                className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="Rendah">Rendah</option>
                <option value="Sedang">Sedang</option>
                <option value="Tinggi">Tinggi</option>
                <option value="Mendesak">Mendesak</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Status Baru
              </label>
              <div className="w-full p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-xs font-bold text-blue-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                <span>Sedang Dikerjakan</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Pilih Regu Penugasan Lapangan *
            </label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              required
            >
              {FIELD_TEAMS.map((t) => (
                <option key={t.id} value={t.name}>
                  [{t.code}] {t.name} • {t.status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Instruksi Tambahan untuk Regu &amp; Log Warga
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              placeholder="Tuliskan catatan teknis material atau waktu penyelesaian..."
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span>{isSubmitting ? 'Memproses...' : 'Kirim Disposisi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
