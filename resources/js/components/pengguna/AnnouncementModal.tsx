import React from 'react';

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreateModal: () => void;
}

export const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  isOpen,
  onClose,
  onOpenCreateModal
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative border border-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs font-semibold mb-2">
            <span className="material-symbols-outlined text-[16px] text-emerald-700">campaign</span>
            <span>Agenda Desa Terdekat</span>
          </div>
          <h2 className="font-headline text-xl sm:text-2xl font-bold text-slate-900">
            Musrenbang &amp; Kerja Bakti Irigasi
          </h2>
          <span className="text-xs font-medium text-emerald-700 block mt-0.5">
            Minggu Ini • Pukul 07:00 WIB s/d Selesai
          </span>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-emerald-700">groups</span>
              1. Musyawarah Perencanaan Pembangunan (Musrenbangdes)
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Bertempat di Pendopo Balai Desa Kepunduhan, Jl. Beringin No. 1 Kec. Kramat. Agenda utama membahas usulan prioritas perbaikan infrastruktur jalan dusun, drainase lingkungan, dan penerangan jalan umum untuk RAPBDes tahun anggaran mendatang. Seluruh perwakilan RT/RW, Karang Taruna, dan tokoh masyarakat diundang hadir.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-emerald-700">water_damage</span>
              2. Kerja Bakti Saluran Irigasi Blok Timur &amp; Kidul
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Gotong royong pembersihan sedimentasi lumpur dan sampah ranting di sepanjang tanggul pintu air sawah timur. Diharapkan warga membawa cangkul dan karung pasir secara swadaya.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-400">Sekretariat Pemerintah Desa</span>
          <button
            onClick={() => {
              onClose();
              onOpenCreateModal();
            }}
            className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors cursor-pointer shadow-xs"
          >
            Usulkan Masalah di Musrenbang
          </button>
        </div>
      </div>
    </div>
  );
};
