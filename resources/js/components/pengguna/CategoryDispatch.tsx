import React from 'react';
import { CATEGORY_OPTIONS } from '../../data/mockData';
import { ReportCategory } from '../../types';

interface CategoryDispatchProps {
  onSelectCategory: (category: ReportCategory) => void;
}

export const CategoryDispatch: React.FC<CategoryDispatchProps> = ({ onSelectCategory }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 w-full">
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <span className="text-xs font-bold text-emerald-700 tracking-widest uppercase">
          KATEGORI FASILITAS UMUM
        </span>
        <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl text-slate-900 font-bold">
          Pilih Jenis Fasilitas yang Rusak
        </h2>
        <p className="text-sm sm:text-base text-slate-600">
          Klik salah satu kategori di bawah untuk langsung membuka formulir pengaduan sesuai regu penanganan.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {CATEGORY_OPTIONS.map((item) => (
          <button
            key={item.key}
            onClick={() => onSelectCategory(item.key as ReportCategory)}
            className="group flex flex-col items-center text-center p-5 bg-white rounded-2xl hover:border-emerald-600 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer border border-slate-200 text-left focus:outline-none"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors mb-3 shadow-2xs">
              <span className="material-symbols-outlined text-[26px]">{item.icon}</span>
            </div>
            <h3 className="font-headline text-sm font-bold text-slate-900 mb-1 leading-snug group-hover:text-emerald-800 transition-colors">
              {item.label}
            </h3>
            <p className="text-[11px] text-slate-500 leading-snug">
              {item.desc}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
};
