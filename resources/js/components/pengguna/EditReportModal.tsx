import React, { useState, useEffect } from 'react';
import { CATEGORY_OPTIONS, VILLAGE_DUSUNS } from '../../data/mockData';
import { ReportCategory, ReportItem } from '../../types';

interface EditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ReportItem | null;
  onUpdateReport: (id: string, updatedData: Partial<ReportItem> & { rtRw?: string; phone?: string; photoUrl?: string }) => Promise<void> | void;
}

export const EditReportModal: React.FC<EditReportModalProps> = ({
  isOpen,
  onClose,
  report,
  onUpdateReport
}) => {
  const [category, setCategory] = useState<ReportCategory>('jalan');
  const [dusun, setDusun] = useState<string>(VILLAGE_DUSUNS[0]);
  const [rtRw, setRtRw] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<ReportItem['priority']>('Sedang');
  const [reporterName, setReporterName] = useState('');
  const [phone, setPhone] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync form state whenever report changes or modal opens
  useEffect(() => {
    if (report) {
      setCategory(report.category);
      setDusun(report.dusun || VILLAGE_DUSUNS[0]);
      
      // Extract RT/RW from location if formatted like "Dusun, RT..."
      const parts = (report.location || '').split(',');
      if (parts.length > 1) {
        setRtRw(parts.slice(1).join(',').trim());
      } else {
        setRtRw(report.location || '');
      }

      setTitle(report.title || '');
      setDescription(report.description || '');
      setPriority(report.priority || 'Sedang');
      setReporterName(report.reporterName === 'Warga Anonim' ? '' : (report.reporterName || ''));
      setPhone(report.reporterPhone || '');
      setIsAnonymous(report.isAnonymous || false);
      setSelectedPhoto(report.photos?.before || null);
    }
  }, [report, isOpen]);

  if (!isOpen || !report) return null;

  const samplePhotos = [
    { label: 'Jalan Berlubang', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80' },
    { label: 'Saluran Irigasi', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?w=600&auto=format&fit=crop&q=80' },
    { label: 'Lampu PJU Padam', url: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=600&auto=format&fit=crop&q=80' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Mohon lengkapi judul dan rincian deskripsi laporan.');
      return;
    }

    setIsSubmitting(true);
    try {
      const locationFull = rtRw.trim() ? `${dusun}, ${rtRw}` : `${dusun}, Wilayah Desa Kepunduhan`;

      await onUpdateReport(report.id, {
        title: title.trim(),
        category,
        dusun,
        rtRw: rtRw.trim(),
        location: locationFull,
        description: description.trim(),
        priority,
        reporterName: isAnonymous ? 'Warga Anonim' : (reporterName.trim() || report.reporterName || 'Warga Desa'),
        reporterPhone: phone.trim() || report.reporterPhone || undefined,
        phone: phone.trim() || report.reporterPhone || undefined,
        isAnonymous,
        photoUrl: selectedPhoto || undefined,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs font-semibold mb-2">
            <span className="material-symbols-outlined text-[15px] text-emerald-700">edit_document</span>
            <span>Ubah Data Laporan ({report.id})</span>
          </div>
          <h2 className="font-headline text-2xl font-bold text-slate-900">
            Perbarui Informasi Aduan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Sesuaikan detail kerusakan atau perbaiki informasi lokasi yang dilaporkan sebelumnya.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              1. Kategori Fasilitas
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORY_OPTIONS.map((item) => (
                <button
                  type="button"
                  key={item.key}
                  onClick={() => setCategory(item.key as ReportCategory)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                    category === item.key
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600'
                      : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Location Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                2. Wilayah Dusun
              </label>
              <select
                value={dusun}
                onChange={(e) => setDusun(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              >
                {VILLAGE_DUSUNS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                RT / RW / Patokan Lokasi
              </label>
              <input
                type="text"
                required
                value={rtRw}
                onChange={(e) => setRtRw(e.target.value)}
                placeholder="Contoh: RT 03 / RW 02 dekat Jembatan"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Title & Description */}
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
              3. Judul Masalah / Kerusakan
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Aspal amblas tergerus air hujan"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
              4. Rincian Deskripsi &amp; Kebutuhan
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan kondisi kerusakan secara detail..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          {/* Priority & Photo Attachment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                Tingkat Urgensi
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Rendah', 'Sedang', 'Tinggi'] as const).map((lvl) => (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setPriority(lvl)}
                    className={`py-2 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                      priority === lvl
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                Lampiran Foto Bukti
              </label>
              <div className="flex gap-2">
                {samplePhotos.map((photo, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setSelectedPhoto(selectedPhoto === photo.url ? null : photo.url)}
                    className={`relative w-14 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedPhoto === photo.url
                        ? 'border-emerald-600 ring-2 ring-emerald-200'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                    title={photo.label}
                  >
                    <img src={photo.url} alt={photo.label} className="w-full h-full object-cover" />
                    {selectedPhoto === photo.url && (
                      <div className="absolute inset-0 bg-emerald-700/40 flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      </div>
                    )}
                  </button>
                ))}
                <label className="w-14 h-12 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-emerald-700 cursor-pointer transition-colors">
                  <span className="material-symbols-outlined text-[18px]">add_a_photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => setSelectedPhoto(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Citizen Identity */}
          <div className="p-4 bg-slate-50 rounded-xl space-y-3 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Identitas Pelapor
              </span>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-emerald-700 focus:ring-emerald-600"
                />
                <span>Laporkan Sebagai Anonim</span>
              </label>
            </div>

            {!isAnonymous ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="Nama Lengkap Warga"
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="No. WhatsApp (cth: 0812...)"
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                🔒 Nama pelapor disamarkan di papan publik.
              </p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 text-white font-semibold text-sm hover:bg-emerald-800 shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                  <span>Menyimpan Perubahan...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
