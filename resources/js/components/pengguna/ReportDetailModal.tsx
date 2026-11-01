import React, { useState, useEffect } from 'react';
import { ReportItem, CitizenUser } from '../../types';
import { isReportOwner } from '../../utils/auth';

interface ReportDetailModalProps {
  report: ReportItem | null;
  onClose: () => void;
  onUpvote: (reportId: string) => void;
  onAddComment: (reportId: string, author: string, role: string, text: string) => void;
  onEditReport?: (report: ReportItem) => void;
  onDeleteReport?: (reportId: string) => void;
  currentUser?: CitizenUser | null;
  onOpenCitizenLogin?: (prompt?: string) => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  onClose,
  onUpvote,
  onAddComment,
  onEditReport,
  onDeleteReport,
  currentUser,
  onOpenCitizenLogin
}) => {
  const [copied, setCopied] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState(currentUser?.name || '');

  useEffect(() => {
    if (currentUser?.name) {
      setCommentAuthor(currentUser.name);
    }
  }, [currentUser]);


  if (!report) return null;

  const handleCopyTicket = () => {
    navigator.clipboard?.writeText(report.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(
      report.id,
      commentAuthor.trim() || 'Warga Desa',
      'Warga Masyarakat',
      commentText.trim()
    );
    setCommentText('');
  };

  // Step indices
  const getStepProgress = (status: ReportItem['status']) => {
    switch (status) {
      case 'Diajukan':
        return 1;
      case 'Dijadwalkan':
        return 2;
      case 'Sedang Dikerjakan':
        return 3;
      case 'Selesai':
        return 4;
      default:
        return 1;
    }
  };

  const currentStep = getStepProgress(report.status);

  const getStatusBadge = (status: ReportItem['status']) => {
    switch (status) {
      case 'Diajukan':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Diajukan
          </span>
        );
      case 'Selesai':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-semibold">
            <span className="material-symbols-outlined text-[14px] text-emerald-600">check_circle</span>
            Selesai
          </span>
        );
      case 'Sedang Dikerjakan':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200/80 text-xs font-semibold">
            <span className="material-symbols-outlined text-[14px] text-blue-600 animate-spin">sync</span>
            Dikerjakan
          </span>
        );
      case 'Dijadwalkan':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200/80 text-xs font-semibold">
            <span className="material-symbols-outlined text-[14px] text-purple-600">event</span>
            Dijadwalkan
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 pr-10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
              <span className="material-symbols-outlined text-[15px] text-emerald-700">
                {report.categoryIcon}
              </span>
              {report.categoryLabel}
            </span>
            <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg">
              <span className="font-mono text-xs font-bold text-emerald-700">{report.id}</span>
              <button
                onClick={handleCopyTicket}
                title="Salin nomor tiket"
                className="text-slate-400 hover:text-emerald-700 cursor-pointer flex items-center"
              >
                <span className="material-symbols-outlined text-[15px]">
                  {copied ? 'check' : 'content_copy'}
                </span>
              </button>
            </div>
            {copied && <span className="text-[11px] text-emerald-700 font-semibold animate-pulse">Tersalin!</span>}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">{report.timeAgo}</span>
            {getStatusBadge(report.status)}
          </div>
        </div>

        {/* Action Bar (Edit & Delete buttons strictly for owner, or explanation) */}
        {(() => {
          const isOwner = isReportOwner(report, currentUser);

          return (
            <div className="flex flex-wrap items-center justify-between gap-2 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-slate-400">person</span>
                  <span>{report.reporterName || 'Warga Desa'}</span>
                  {report.reporterPhone && isOwner && (
                    <span className="font-mono text-slate-400">({report.reporterPhone})</span>
                  )}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-slate-400">flag</span>
                  <span>Prioritas: <strong>{report.priority || 'Sedang'}</strong></span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {isOwner ? (
                  <>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                      <span className="material-symbols-outlined text-[14px] text-emerald-700">verified</span>
                      <span>Laporan Anda</span>
                    </span>

                    {onEditReport && (
                      <button
                        onClick={() => onEditReport(report)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-semibold border border-slate-200 hover:border-emerald-200 transition-colors cursor-pointer"
                        title="Ubah rincian laporan aduan Anda"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit_note</span>
                        <span>Ubah Laporan</span>
                      </button>
                    )}

                    {onDeleteReport && (
                      <button
                        onClick={() => onDeleteReport(report.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 transition-colors cursor-pointer"
                        title="Hapus laporan aduan Anda"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                        <span>Hapus Laporan</span>
                      </button>
                    )}
                  </>
                ) : (
                  report.isAnonymous ? (
                    <span className="text-[11px] text-slate-400 italic flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">lock</span>
                      <span>Laporan Anonim (Dikelola Admin)</span>
                    </span>
                  ) : !currentUser ? (
                    <button
                      type="button"
                      onClick={() => onOpenCitizenLogin?.(`Masuk sebagai ${report.reporterName} untuk mengedit atau menghapus laporan ini.`)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50/80 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">login</span>
                      <span>Pelapor aduan ini? Masuk akun</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">shield</span>
                      <span>Akses kelola hanya untuk pelapor</span>
                    </span>
                  )
                )}
              </div>
            </div>
          );
        })()}


        {/* Title & Description */}
        <div className="py-4 space-y-2.5">
          <h2 className="font-headline text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
            {report.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-slate-400">location_on</span>
            <span className="font-medium text-slate-700">{report.location}</span>
          </p>
          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            {report.description}
          </div>

          {/* Photo attachment display */}
          {report.photos?.before && (
            <div className="mt-3">
              <span className="text-xs font-semibold text-slate-600 block mb-1">
                Foto Bukti Lapangan:
              </span>
              <div className="rounded-xl overflow-hidden border border-slate-200 max-h-72 bg-slate-100 group relative">
                <img
                  src={report.photos.before}
                  alt={report.title}
                  className="w-full h-full object-cover max-h-72 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          )}
        </div>

        {/* 4-Step Progress Indicator */}
        <div className="py-4 my-2 bg-slate-50 p-5 rounded-xl border border-slate-200/80">
          <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-emerald-700">timeline</span>
            Status Penanganan Aduan
          </h4>
          <div className="grid grid-cols-4 gap-2 text-center relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-colors ${
                  currentStep >= 1
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-400 border border-slate-200'
                }`}
              >
                1
              </div>
              <span className="text-[11px] font-bold text-slate-900 leading-tight">Diajukan</span>
              <span className="text-[10px] text-slate-500 hidden sm:block">Oleh warga</span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-colors ${
                  currentStep >= 2
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-400 border border-slate-200'
                }`}
              >
                2
              </div>
              <span className="text-[11px] font-bold text-slate-900 leading-tight">Verifikasi</span>
              <span className="text-[10px] text-slate-500 hidden sm:block">Perangkat Desa</span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-colors ${
                  currentStep >= 3
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-400 border border-slate-200'
                }`}
              >
                3
              </div>
              <span className="text-[11px] font-bold text-slate-900 leading-tight">Dikerjakan</span>
              <span className="text-[10px] text-slate-500 hidden sm:block">Satgas Lapangan</span>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-colors ${
                  currentStep >= 4
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-400 border border-slate-200'
                }`}
              >
                4
              </div>
              <span className="text-[11px] font-bold text-slate-900 leading-tight">Selesai</span>
              <span className="text-[10px] text-slate-500 hidden sm:block">Publikasi BPD</span>
            </div>
          </div>
        </div>

        {/* Timeline Log */}
        <div className="py-4">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
            Catatan Perkembangan Lapangan
          </h4>
          <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {report.timeline.map((event, index) => (
              <div key={index} className="flex items-start gap-3 pl-1 relative">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center z-10 shrink-0 mt-0.5 ${
                    event.isCompleted ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px]">
                    {event.isCompleted ? 'check' : 'hourglass_empty'}
                  </span>
                </div>
                <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <h5 className="text-xs font-bold text-slate-900">{event.title}</h5>
                    <span className="text-[11px] text-slate-500">{event.time}</span>
                  </div>
                  <p className="text-xs text-slate-600">{event.description}</p>
                  <span className="text-[11px] text-emerald-700 font-semibold mt-1 inline-block">
                    Petugas: {event.actor}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upvote & Citizen Comments Section */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Dukungan Warga
              </h4>
              <p className="text-xs text-slate-500">
                {report.upvotes} warga mendukung perbaikan fasilitas ini
              </p>
            </div>
            <button
              onClick={() => onUpvote(report.id)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-50 hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800 font-semibold text-xs transition-colors border border-slate-200 hover:border-emerald-200 cursor-pointer shadow-xs active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">thumb_up</span>
              <span>Dukung Aduan Ini</span>
            </button>
          </div>

          {/* Comment list */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-slate-700">Tanggapan &amp; Suara Warga ({report.comments?.length || 0}):</h5>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {report.comments && report.comments.length > 0 ? (
                report.comments.map((c) => (
                  <div key={c.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-900">{c.author}</span>
                      <span className="text-[10px] text-slate-500">{c.time}</span>
                    </div>
                    <p className="text-xs text-slate-600">{c.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic py-2">
                  Belum ada tanggapan warga. Berikan informasi tambahan di bawah.
                </p>
              )}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="pt-2 flex gap-2">
              <input
                type="text"
                value={commentAuthor}
                onChange={(e) => setCommentAuthor(e.target.value)}
                placeholder="Nama Anda"
                className="w-1/3 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
              <input
                type="text"
                required
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Tulis tanggapan atau informasi tambahan..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-semibold text-xs hover:bg-emerald-800 transition-colors cursor-pointer shrink-0"
              >
                Kirim
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
