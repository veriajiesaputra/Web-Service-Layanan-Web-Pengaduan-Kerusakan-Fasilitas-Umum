import React from 'react';

interface EmergencyBannerProps {
  onOpenEmergencyModal: () => void;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({ onOpenEmergencyModal }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 w-full">
      <div className="p-6 sm:p-8 bg-rose-50/80 rounded-2xl shadow-xs border border-rose-200/80 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100/80 text-rose-800 text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px] text-rose-700">emergency</span>
            <span>Keadaan Darurat Infrastruktur &amp; Bencana</span>
          </div>
          <h3 className="font-headline text-lg sm:text-xl font-bold text-rose-950">
            Butuh Penanganan Cepat untuk Kondisi Bahaya?
          </h3>
          <p className="text-xs sm:text-sm text-rose-900/90 leading-relaxed font-normal">
            Untuk kabel listrik putus bertegangan, tanggul jebol, atau pohon tumbang yang menutup jalan desa/menimpa rumah, segera hubungi kontak siaga darurat:
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <a
            href="tel:081234567890"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-semibold text-sm shadow-xs transition-colors text-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">phone_in_talk</span>
            <span>Posko Siaga: 0812-3456-7890</span>
          </a>

          <a
            href="tel:081198765432"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-rose-50/60 text-slate-800 font-semibold text-sm shadow-xs transition-colors text-center border border-rose-200 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-amber-700">shield</span>
            <span>Babinsa: 0811-9876-5432</span>
          </a>
        </div>
      </div>
    </section>
  );
};
