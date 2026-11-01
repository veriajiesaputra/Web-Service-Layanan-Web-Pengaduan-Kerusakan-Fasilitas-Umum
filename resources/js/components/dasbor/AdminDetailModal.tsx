import React, { useState } from 'react';
import { ReportItem, ReportStatus, ReportPriority } from '../../types';
import { FIELD_TEAMS } from '../../data/mockData';

interface AdminDetailModalProps {
  report: ReportItem | null;
  onClose: () => void;
  onUpdate: (updated: ReportItem) => void;
}

export const AdminDetailModal: React.FC<AdminDetailModalProps> = ({
  report,
  onClose,
  onUpdate,
}) => {
  if (!report) return null;

  const [status, setStatus] = useState<ReportStatus>(report.status);
  const [priority, setPriority] = useState<ReportPriority>(report.priority);
  const [assignedTeam, setAssignedTeam] = useState<string>(report.assignedTeam || '');
  const [notes, setNotes] = useState<string>(report.notes || '');
  const [rejectionReason, setRejectionReason] = useState<string>(report.rejectionReason || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    onUpdate({
      ...report,
      status,
      priority,
      assignedTeam: assignedTeam || undefined,
      notes: notes || undefined,
      rejectionReason: status === 'Ditolak' ? rejectionReason : undefined,
    });
    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 400);
  };

  const getStatusBadge = (s: ReportStatus) => {
    switch (s) {
      case 'Selesai': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Sedang Dikerjakan': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Dijadwalkan': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Ditolak': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-amber-100 text-amber-900 border-amber-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div 
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Header */}
        <div className="p-4 sm:px-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <span className="material-symbols-outlined text-[24px]">assignment</span>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-emerald-800">{report.id}</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[11px] font-semibold">
                  {report.categoryLabel || report.category}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(status)}`}>
                  {status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Diterima: {report.timeAgo} ({report.createdAt}) • Dusun: {report.dusun}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Content Scrollable Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Section 1: Reporter Info */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Identitas Pelapor Warga</span>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5">{report.reporterName}</h4>
              <p className="text-xs text-slate-500">{report.reporterRole || (report.isAnonymous ? 'Warga Anonim' : 'Warga RT Setempat')}</p>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-xs px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold flex items-center gap-1.5 shadow-2xs">
                <span className="material-symbols-outlined text-[15px] text-emerald-600">thumb_up</span>
                <span>{report.upvotes} Dukungan Warga</span>
              </span>

              {report.reporterPhone && (
                <a
                  href={`tel:${report.reporterPhone}`}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">call</span>
                  <span>{report.reporterPhone}</span>
                </a>
              )}
            </div>
          </div>

          {/* Section 2: Problem Information */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Detail Aduan Fasilitas</span>
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
              <h3 className="text-base font-bold text-slate-900">{report.title}</h3>
              <p className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                <span className="material-symbols-outlined text-[16px] text-red-500">location_on</span>
                <span>{report.location} ({report.dusun})</span>
              </p>
              <div className="pt-2 border-t border-slate-100 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {report.description}
              </div>
            </div>
          </div>

          {/* Section 3: Photos if available */}
          {report.photos && (report.photos.before || report.photos.after) && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Dokumentasi Foto Lapangan</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {report.photos.before && (
                  <div>
                    <span className="text-[11px] font-semibold text-slate-600 block mb-1">Foto Kondisi / Sebelum</span>
                    <img 
                      src={report.photos.before} 
                      alt="Foto Aduan" 
                      className="w-full h-44 object-cover rounded-xl border border-slate-200 shadow-2xs"
                    />
                  </div>
                )}
                {report.photos.after && (
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-700 block mb-1">Foto Pasca Perbaikan / Selesai</span>
                    <img 
                      src={report.photos.after} 
                      alt="Foto Selesai" 
                      className="w-full h-44 object-cover rounded-xl border border-emerald-300 ring-2 ring-emerald-500/20 shadow-2xs"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section 4: Stepper Timeline Kronologi */}
          {report.timeline && report.timeline.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Riwayat Kronologi Penanganan (Timeline)</span>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-300">
                  {report.timeline.map((event, idx) => (
                    <div key={idx} className="relative flex items-start gap-3 pl-7">
                      <div className={`absolute left-1.5 top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        event.isCompleted ? 'bg-emerald-600' : 'bg-slate-300'
                      }`} />
                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span>{event.title}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{event.time}</span>
                        </div>
                        <p className="text-slate-600 mt-0.5">{event.description}</p>
                        <span className="text-[10px] font-semibold text-emerald-700">{event.actor}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section 5: Comments if any */}
          {report.comments && report.comments.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Komentar / Aspirasi Tambahan Warga ({report.comments.length})
              </span>
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {report.comments.map((c) => (
                  <div key={c.id} className="p-3 rounded-xl bg-white border border-slate-200 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{c.author} <span className="text-[10px] text-slate-400 font-normal">({c.role})</span></span>
                      <span className="text-[10px] text-slate-400 font-normal">{c.time}</span>
                    </div>
                    <p className="text-slate-600 mt-1">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 6: Admin Action Controls Form */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-emerald-700">tune</span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                Tindak Lanjut &amp; Manajemen Status
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Status Penanganan *</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ReportStatus)}
                  className="w-full p-2.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                >
                  <option value="Diajukan">Diajukan (Menunggu Verifikasi)</option>
                  <option value="Sedang Dikerjakan">Sedang Dikerjakan</option>
                  <option value="Dijadwalkan">Dijadwalkan (Kerja Bakti/Material)</option>
                  <option value="Selesai">Selesai Ditangani</option>
                  <option value="Ditolak">Ditolak / Di Luar Kewenangan Desa</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tingkat Prioritas *</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as ReportPriority)}
                  className="w-full p-2.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                >
                  <option value="Rendah">Rendah</option>
                  <option value="Sedang">Sedang</option>
                  <option value="Tinggi">Tinggi</option>
                  <option value="Mendesak">Mendesak</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Regu Penugasan Lapangan</label>
              <select
                value={assignedTeam}
                onChange={(e) => setAssignedTeam(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="">-- Belum Ditugaskan / Swadaya RT --</option>
                {FIELD_TEAMS.map((t) => (
                  <option key={t.id} value={t.name}>
                    [{t.code}] {t.name}
                  </option>
                ))}
              </select>
            </div>

            {status === 'Ditolak' && (
              <div>
                <label className="text-xs font-bold text-red-700 block mb-1">Alasan Penolakan / Disposisi Luar *</label>
                <input
                  type="text"
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Contoh: Kewenangan PLN Rayon / Jalur Jalan Provinsi..."
                  className="w-full p-2.5 rounded-lg bg-white border border-red-300 text-xs text-slate-900 focus:ring-1 focus:ring-red-600 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Catatan Internal Perangkat / Tindak Lanjut</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Catatan kebutuhan material, target penyelesaian, koordinasi RT..."
                className="w-full p-2.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Pembaruan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
