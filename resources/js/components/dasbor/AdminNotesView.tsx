import React, { useState, useEffect } from 'react';
import { DailyNote } from '../../types';
import { api } from '../../services/api';

export const AdminNotesView: React.FC = () => {
  const [notes, setNotes] = useState<DailyNote[]>([]);
  const [newText, setNewText] = useState('');
  const [author, setAuthor] = useState('Budi Santoso (Admin Desa)');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await api.getDailyNotes();
      if (Array.isArray(data)) {
        setNotes(data);
      }
    } catch (e) {
      console.error('Failed to load notes:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    try {
      setSubmitting(true);
      const created = await api.createDailyNote({
        text: newText.trim(),
        author: author.trim() || 'Admin Operasional Desa',
      });
      setNotes([created, ...notes]);
      setNewText('');
    } catch (err) {
      console.error(err);
      // Local fallback
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;
      setNotes([
        {
          id: `note-${Date.now()}`,
          time: timeStr,
          author: author.trim() || 'Admin Operasional',
          text: newText.trim(),
        },
        ...notes,
      ]);
      setNewText('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-[24px]">speaker_notes</span>
            <h2 className="font-headline text-lg font-bold text-slate-900">
              Catatan Koordinasi &amp; Briefing Harian
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Log instruksi harian, kendala cuaca/material, dan catatan penting antar perangkat desa.
          </p>
        </div>

        <button
          onClick={loadNotes}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 self-start md:self-auto"
        >
          <span className={`material-symbols-outlined text-[16px] ${loading ? 'animate-spin' : ''}`}>
            refresh
          </span>
          <span>Muat Ulang Log</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form: Add Note */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 lg:col-span-1 h-fit">
          <div className="flex items-center gap-2 mb-4">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <span className="material-symbols-outlined text-[20px]">edit_note</span>
            </span>
            <h3 className="font-headline text-sm font-bold text-slate-900">Tulis Catatan Baru</h3>
          </div>

          <form onSubmit={handleAddNote} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Nama Petugas / Jabatan</label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Contoh: Budi Santoso (Admin Desa)"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Isi Instruksi / Catatan</label>
              <textarea
                required
                rows={4}
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Tuliskan catatan briefing, misalnya: Prioritaskan pengangkutan sampah di Dusun Melati pagi ini sebelum jam 10:00..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !newText.trim()}
              className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span>{submitting ? 'Memposting...' : 'Kirim Catatan Koordinasi'}</span>
            </button>
          </form>
        </div>

        {/* Right List: Timeline of Notes */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline text-sm font-bold text-slate-900">
              Riwayat Catatan Harian ({notes.length})
            </h3>
            <span className="text-[11px] text-slate-400">Tersimpan di database MySQL</span>
          </div>

          {notes.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <span className="material-symbols-outlined text-[48px] text-slate-300 mb-2">event_busy</span>
              <p className="text-xs font-medium">Belum ada catatan koordinasi hari ini.</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                        {note.author.charAt(0)}
                      </span>
                      <strong className="text-xs font-bold text-slate-900">{note.author}</strong>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">schedule</span>
                      {note.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed pl-9 whitespace-pre-line">
                    {note.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
