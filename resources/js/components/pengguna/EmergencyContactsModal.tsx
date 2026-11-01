import React from 'react';
import { EMERGENCY_CONTACTS } from '../../data/mockData';

interface EmergencyContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyContactsModal: React.FC<EmergencyContactsModalProps> = ({ isOpen, onClose }) => {
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

        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold mb-2">
            <span className="material-symbols-outlined text-[16px] text-rose-700">emergency</span>
            <span>Tanggap Bencana &amp; Keamanan</span>
          </div>
          <h2 className="font-headline text-xl sm:text-2xl font-bold text-slate-900">
            Kontak Darurat Desa Mandiri
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Hubungi nomor berikut jika terjadi situasi bahaya yang memerlukan tindakan cepat di lapangan.
          </p>
        </div>

        <div className="space-y-3">
          {EMERGENCY_CONTACTS.map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 hover:border-emerald-300 transition-all"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-headline font-bold text-sm text-slate-900">
                    {item.title}
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{item.desc}</p>
                <p className="font-mono text-xs font-semibold text-emerald-700 pt-0.5">{item.phone}</p>
              </div>

              <a
                href={`tel:${item.phone.replace(/[^0-9]/g, '')}`}
                className="px-3.5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 flex items-center gap-1.5 shrink-0 shadow-xs transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">call</span>
                <span>Panggil</span>
              </a>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center space-y-1">
          <p className="text-xs font-semibold text-slate-600">
            Kantor Balai Desa Kepunduhan: Jl. Beringin No. 1 Kec. Kramat Kab. Tegal 52181
          </p>
          <p className="text-[11px] text-slate-400">
            Layanan Kantor: Senin - Jumat 08:00 - 15:00 WIB • Email: kepunduhanjaya96@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
};
