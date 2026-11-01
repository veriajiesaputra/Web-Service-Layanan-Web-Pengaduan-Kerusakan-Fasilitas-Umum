import React, { useState } from 'react';
import { ASSETS, INITIAL_STATS } from '../../data/mockData';

interface HeroProps {
  onOpenCreateModal: () => void;
  onTrackTicket: (ticketId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenCreateModal, onTrackTicket }) => {
  const [ticketInput, setTicketInput] = useState('');
  const [inputError, setInputError] = useState(false);

  const handleTrackSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = ticketInput.trim();
    if (!trimmed) {
      setInputError(true);
      setTimeout(() => setInputError(false), 2500);
      return;
    }
    onTrackTicket(trimmed);
  };

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/60 border-b border-slate-200/70">
      {/* Background Scenic View - Transparency reduced so landscape is clearly visible */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          alt="Pemandangan Desa Mandiri"
          className="w-full h-full object-cover object-center filter saturate-85 opacity-55"
          src={ASSETS.heroBg}
        />
        {/* Balanced soft gradient overlay so text remains razor-sharp while background hills & village scenery shine through */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-white/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 flex flex-col justify-between">
        <div className="max-w-3xl space-y-4">
          {/* Official Portal Pill Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold tracking-wide uppercase">
            <span className="material-symbols-outlined text-[16px] text-emerald-700">verified</span>
            <span>Portal Resmi Pengaduan &amp; Aspirasi Warga Desa</span>
          </div>

          {/* Headline */}
          <h1 className="font-headline text-3xl sm:text-5xl lg:text-[3.25rem] text-slate-900 tracking-tight font-extrabold leading-[1.15]">
            Layanan Pengaduan Fasilitas Umum Desa
          </h1>

          {/* Subheading Body */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
            Sampaikan laporan kerusakan jalan, saluran irigasi, penerangan jalan umum, dan kebersihan lingkungan desa kita secara mudah, cepat, dan transparan.
          </p>

          {/* CTA & Quick Tracking Bar */}
          <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              <span>Buat Laporan Baru</span>
            </button>

            {/* Tracking Input Box */}
            <form
              onSubmit={handleTrackSubmit}
              className={`flex-1 max-w-md flex items-center bg-white rounded-xl p-1 shadow-xs border ${
                inputError ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-300 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/20'
              } transition-all`}
            >
              <span className="material-symbols-outlined text-slate-400 pl-3 text-[20px] shrink-0">
                search
              </span>
              <input
                type="text"
                value={ticketInput}
                onChange={(e) => {
                  setTicketInput(e.target.value);
                  if (inputError) setInputError(false);
                }}
                placeholder={inputError ? 'Ketik nomor tiket terlebih dahulu...' : 'Lacak status tiket (#LAP-0412)...'}
                className="w-full bg-transparent px-3 py-2 text-slate-900 text-xs sm:text-sm focus:outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-emerald-700 text-slate-700 hover:text-white font-bold text-xs sm:text-sm transition-colors shrink-0 cursor-pointer"
              >
                Lacak
              </button>
            </form>
          </div>
        </div>

        {/* Village Impact Counter Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-10 mt-6 sm:mt-8">
          {INITIAL_STATS.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl shadow-xs hover:shadow-md transition-all border border-slate-200/80 group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-headline text-3xl font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {stat.value}
                </span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                  <span className="material-symbols-outlined text-[22px]">{stat.icon}</span>
                </div>
              </div>
              <h2 className="font-headline text-base text-slate-900 font-bold mb-0.5">
                {stat.title}
              </h2>
              <p className="text-xs text-slate-500 leading-normal">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
