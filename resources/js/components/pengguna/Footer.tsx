import React from 'react';

interface FooterProps {
  onOpenAllReports: () => void;
  onOpenGisModal: () => void;
  onOpenEmergencyModal: () => void;
  onOpenInfoModal: (title: string, content: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAllReports,
  onOpenGisModal,
  onOpenEmergencyModal,
  onOpenInfoModal
}) => {
  const showPrivacy = () => {
    onOpenInfoModal(
      'Kebijakan Privasi Warga',
      'Pemerintah Desa Kepunduhan berkomitmen menjaga kerahasiaan identitas pelapor. Setiap warga memiliki hak untuk melapor secara anonim tanpa mencantumkan identitas publik. Nomor kontak pelapor hanya digunakan oleh Kaur Pelayanan dan Satgas Lapangan untuk konfirmasi lokasi dan progres pengerjaan, serta tidak akan pernah disebarluaskan kepada pihak ketiga.'
    );
  };

  const showTerms = () => {
    onOpenInfoModal(
      'Syarat & Ketentuan Pengaduan',
      '1. Laporan yang diajukan harus berkaitan dengan fasilitas umum, kebersihan, keamanan, dan ketertiban di wilayah administratif Desa Kepunduhan, Kec. Kramat, Kab. Tegal 52181.\n2. Laporan wajib menyertakan deskripsi yang jelas dan foto bukti faktual di lapangan.\n3. Dilarang mengunggah konten yang mengandung ujaran kebencian, fitnah, hoaks, atau kepentingan politik praktis.\n4. Setiap laporan yang valid akan diverifikasi oleh Kaur Pelayanan dalam kurun waktu 1x24 jam kerja.'
    );
  };

  const showSOP = () => {
    onOpenInfoModal(
      'Standar Operasional Prosedur (SOP) Penanganan Aduan',
      'Tahap 1: Pengisian dan pengunggahan laporan oleh warga masyarakat melalui portal web.\nTahap 2: Verifikasi fisik & administratif oleh Kaur Pelayanan dan Kepala Dusun (maksimal 24 jam).\nTahap 3: Disposisi surat tugas kepada Satgas Gotong Royong / Tim Teknis Desa / Dinas Terkait.\nTahap 4: Pelaksanaan perbaikan di lokasi dengan dokumentasi sebelum dan sesudah.\nTahap 5: Penutupan tiket pengaduan, pengunggahan bukti penyelesaian, dan pelaporan berkala dalam rapat BPD.'
    );
  };

  const showAPBDes = () => {
    onOpenInfoModal(
      'Transparansi APBDes & Dana Pemeliharaan Sarpras',
      'Alokasi Anggaran Pendapatan dan Belanja Desa (APBDes) Tahun Anggaran Berjalan:\n• Anggaran Pemeliharaan Jalan & Jembatan: Rp 85.000.000 (Realisasi: 72%)\n• Pemeliharaan Saluran Irigasi Tersier: Rp 45.000.000 (Realisasi: 85%)\n• Penerangan Jalan Umum & Kelistrikan: Rp 30.000.000 (Realisasi: 64%)\n• Kebersihan TPS & Pengelolaan Sampah: Rp 28.000.000 (Realisasi: 90%)\n• Swadaya Gotong Royong Masyarakat: Rp 22.500.000\n\nSeluruh laporan realisasi keuangan diawasi oleh Badan Permusyawaratan Desa (BPD) dan dapat diakses terbuka oleh seluruh warga.'
    );
  };

  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-12">
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">account_balance</span>
              </div>
              <div>
                <span className="font-headline text-base text-white font-bold tracking-tight block">
                  Desa Kepunduhan
                </span>
                <span className="text-[11px] text-emerald-400 block -mt-0.5">
                  Kec. Kramat, Kab. Tegal 52181
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Kantor Balai Desa: Jl. Beringin No. 1 Desa Kepunduhan, Kec. Kramat, Kab. Tegal, Jawa Tengah 52181.
            </p>
            <div className="text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-[16px]">mail</span>
                <a href="mailto:kepunduhanjaya96@gmail.com" className="text-emerald-300 hover:underline">
                  kepunduhanjaya96@gmail.com
                </a>
              </div>
            </div>
            <div className="pt-1">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/80 text-emerald-400 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Sistem Pelayanan Aktif
              </span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <h3 className="font-headline text-sm sm:text-base text-white font-bold tracking-tight">
              Jam Layanan Balai Desa
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-emerald-400">
              Senin - Jumat 08:00 - 15:00 WIB
            </p>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Pelayanan administrasi warga, pengaduan fasilitas, dan koordinasi satgas penanganan fisik di lapangan.
            </p>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs pt-1">
              <span className="material-symbols-outlined text-[16px] text-slate-400">schedule</span>
              <span>Sabtu, Minggu &amp; Libur: Tutup</span>
            </div>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h3 className="font-headline text-sm sm:text-base text-white font-bold tracking-tight">
              Kontak Siaga 24 Jam
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-amber-500">
                  shield_person
                </span>
                <a href="tel:081234567890" className="hover:text-emerald-400 transition-colors">
                  Bhabinkamtibmas Kramat: 0812-3456-7890
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-amber-500">
                  military_tech
                </span>
                <a href="tel:081398765432" className="hover:text-emerald-400 transition-colors">
                  Babinsa Kramat: 0813-9876-5432
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-rose-500">
                  emergency
                </span>
                <a href="tel:02835550199" className="hover:text-rose-400 transition-colors font-medium text-slate-300">
                  Ambulans Desa: (0283) 555-0199
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <h3 className="font-headline text-sm sm:text-base text-white font-bold tracking-tight">
              Transparansi &amp; Akuntabilitas
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Transparansi Dana Desa &amp; Layanan Terpadu diawasi langsung oleh Badan Permusyawaratan Desa (BPD) Kepunduhan.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={showAPBDes}
                className="text-xs sm:text-sm font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 text-left cursor-pointer"
              >
                <span>Pantau Realisasi APBDes</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>
              <button
                onClick={onOpenGisModal}
                className="text-xs sm:text-sm font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 text-left cursor-pointer"
              >
                <span>Peta Persebaran Masalah</span>
                <span className="material-symbols-outlined text-[15px]">pin_drop</span>
              </button>
            </div>
          </div>
        </div>

        {/* Copyright and Legal Links */}
        <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-xs text-slate-500">
          <p>
            © 2026 Pemerintah Desa Kepunduhan, Kec. Kramat, Kab. Tegal. Hak Cipta Dilindungi.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 text-slate-400 text-xs">
            <button onClick={showPrivacy} className="hover:text-emerald-400 transition-colors cursor-pointer">
              Kebijakan Privasi
            </button>
            <span className="text-slate-700">•</span>
            <button onClick={showTerms} className="hover:text-emerald-400 transition-colors cursor-pointer">
              Syarat &amp; Ketentuan
            </button>
            <span className="text-slate-700">•</span>
            <button onClick={showSOP} className="hover:text-emerald-400 transition-colors cursor-pointer">
              SOP Aduan
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
