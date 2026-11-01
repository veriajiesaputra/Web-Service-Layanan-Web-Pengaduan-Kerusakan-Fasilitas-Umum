import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { CATEGORY_OPTIONS, VILLAGE_DUSUNS } from '../../data/mockData';
import { ReportCategory, ReportItem, CitizenUser } from '../../types';

interface CreateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: ReportCategory;
  onSubmitReport: (newReport: ReportItem) => void;
  currentUser: CitizenUser | null;
  onOpenLoginModal: (prompt?: string) => void;
}

export const CreateReportModal: React.FC<CreateReportModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'jalan',
  onSubmitReport,
  currentUser,
  onOpenLoginModal
}) => {
  const [category, setCategory] = useState<ReportCategory>(defaultCategory);
  const [dusun, setDusun] = useState<string>(currentUser?.dusun || VILLAGE_DUSUNS[0]);
  const [rtRw, setRtRw] = useState(currentUser?.rtRw || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<ReportItem['priority']>('Sedang');
  const [reporterName, setReporterName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  // Maps API & Interactive Pin Picker states
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [pickedCoords, setPickedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isGettingGps, setIsGettingGps] = useState(false);
  const [reverseAddress, setReverseAddress] = useState<string | null>(null);
  const miniMapContainerRef = useRef<HTMLDivElement>(null);
  const miniMapInstanceRef = useRef<L.Map | null>(null);
  const miniMarkerRef = useRef<L.Marker | null>(null);

  const handleGetGpsLocation = () => {
    if (!navigator.geolocation) {
      alert('Perangkat atau browser Anda tidak mendukung fitur deteksi GPS.');
      return;
    }
    setIsGettingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        setPickedCoords({ lat, lng });
        setShowMapPicker(true);

        if (miniMapInstanceRef.current && miniMarkerRef.current) {
          miniMapInstanceRef.current.setView([lat, lng], 16);
          miniMarkerRef.current.setLatLng([lat, lng]);
        }
        setIsGettingGps(false);

        // Reverse Geocoding via OpenStreetMap Nominatim
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await res.json();
          if (data && data.display_name) {
            setReverseAddress(data.display_name);
          }
        } catch (_) {}
      },
      (err) => {
        setIsGettingGps(false);
        alert('Gagal mendeteksi lokasi GPS: ' + err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    if (!showMapPicker || !miniMapContainerRef.current) return;

    if (!miniMapInstanceRef.current) {
      const defaultLat = pickedCoords?.lat || -6.8797;
      const defaultLng = pickedCoords?.lng || 109.1835;

      const map = L.map(miniMapContainerRef.current, {
        center: [defaultLat, defaultLng],
        zoom: 15,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      const markerIcon = L.divIcon({
        className: 'custom-pin-picker',
        html: `<div style="background-color: #ef4444; width: 26px; height: 26px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><div style="width: 8px; height: 8px; background: white; border-radius: 50%; transform: rotate(45deg);"></div></div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 26],
      });

      const marker = L.marker([defaultLat, defaultLng], {
        draggable: true,
        icon: markerIcon,
      }).addTo(map);

      marker.on('dragend', async () => {
        const pos = marker.getLatLng();
        const lat = Number(pos.lat.toFixed(6));
        const lng = Number(pos.lng.toFixed(6));
        setPickedCoords({ lat, lng });
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await res.json();
          if (data && data.display_name) {
            setReverseAddress(data.display_name);
          }
        } catch (_) {}
      });

      map.on('click', async (e: L.LeafletMouseEvent) => {
        const lat = Number(e.latlng.lat.toFixed(6));
        const lng = Number(e.latlng.lng.toFixed(6));
        marker.setLatLng([lat, lng]);
        setPickedCoords({ lat, lng });
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await res.json();
          if (data && data.display_name) {
            setReverseAddress(data.display_name);
          }
        } catch (_) {}
      });

      miniMapInstanceRef.current = map;
      miniMarkerRef.current = marker;

      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    } else {
      setTimeout(() => {
        miniMapInstanceRef.current?.invalidateSize();
      }, 100);
    }
  }, [showMapPicker]);

  useEffect(() => {
    if (!isOpen) {
      if (miniMapInstanceRef.current) {
        miniMapInstanceRef.current.remove();
        miniMapInstanceRef.current = null;
        miniMarkerRef.current = null;
      }
      setShowMapPicker(false);
      setPickedCoords(null);
      setReverseAddress(null);
    }
  }, [isOpen]);

  // Sync default category and user info
  useEffect(() => {
    if (defaultCategory) {
      setCategory(defaultCategory);
    }
  }, [defaultCategory]);

  useEffect(() => {
    if (currentUser) {
      setReporterName(currentUser.name);
      setPhone(currentUser.phone);
      if (currentUser.dusun) setDusun(currentUser.dusun);
      if (currentUser.rtRw) setRtRw(currentUser.rtRw);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const samplePhotos = [
    { label: 'Jalan Berlubang', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80' },
    { label: 'Saluran Irigasi', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?w=600&auto=format&fit=crop&q=80' },
    { label: 'Lampu PJU Padam', url: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=600&auto=format&fit=crop&q=80' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert('Mohon lengkapi judul dan deskripsi kerusakan.');
      return;
    }

    // ENFORCE CITIZEN LOGIN FOR NON-ANONYMOUS SUBMISSIONS
    if (!isAnonymous && !currentUser) {
      onOpenLoginModal(
        'Pengaduan non-anonim memerlukan masuk akun warga agar tiket aduan terlindungi dan hanya Anda yang berhak mengubah atau menghapusnya.'
      );
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const newTicketId = `#LAP-${randomNum}`;
      const activeCat = CATEGORY_OPTIONS.find((c) => c.key === category);

      const locationFull = rtRw.trim() 
        ? `${dusun}, ${rtRw.trim()}` 
        : `${dusun}, Wilayah Desa Kepunduhan`;

      const finalReporterName = isAnonymous 
        ? 'Warga Anonim' 
        : (currentUser?.name || reporterName.trim() || 'Warga Desa');

      const finalPhone = isAnonymous
        ? undefined
        : (currentUser?.phone || phone.trim() || undefined);

      const finalRole = isAnonymous
        ? 'Warga'
        : (currentUser?.role || (rtRw ? `Warga ${rtRw}` : 'Warga Desa'));

      const newReport: ReportItem = {
        id: newTicketId,
        title: title.trim(),
        category,
        categoryLabel: activeCat ? activeCat.label : 'Fasilitas Umum',
        categoryIcon: activeCat ? activeCat.icon : 'construction',
        status: 'Diajukan',
        location: locationFull,
        dusun,
        description: description.trim(),
        timeAgo: 'Baru saja',
        createdAt: 'Hari ini, baru saja',
        priority,
        officerBadge: `Prioritas: ${priority}`,
        officerBadgeType: 'priority',
        coordinates: pickedCoords ? {
          lat: pickedCoords.lat,
          lng: pickedCoords.lng,
          xPercent: 50,
          yPercent: 50
        } : {
          lat: -6.8797 + (Math.random() - 0.5) * 0.006,
          lng: 109.1835 + (Math.random() - 0.5) * 0.006,
          xPercent: 30 + Math.floor(Math.random() * 45),
          yPercent: 30 + Math.floor(Math.random() * 45)
        },
        reporterName: finalReporterName,
        reporterRole: finalRole,
        reporterPhone: finalPhone,
        isAnonymous,
        upvotes: 1,
        photos: selectedPhoto ? { before: selectedPhoto } : undefined,
        timeline: [
          {
            title: 'Laporan Dikirimkan Warga',
            time: 'Baru saja',
            description: 'Laporan tercatat di sistem desa dan masuk antrean verifikasi Kaur Pelayanan.',
            actor: finalReporterName,
            isCompleted: true
          },
          {
            title: 'Pemeriksaan Verifikasi Lapangan',
            time: 'Menunggu 1x24 jam',
            description: 'Petugas atau Kepala Dusun akan meninjau kondisi lapangan.',
            actor: 'Kaur Pelayanan Desa',
            isCompleted: false
          }
        ]
      };

      onSubmitReport(newReport);
      setIsSubmitting(false);
      setSubmittedTicket(newTicketId);
    }, 500);
  };

  const handleResetAndClose = () => {
    setSubmittedTicket(null);
    setTitle('');
    setDescription('');
    if (!currentUser) {
      setRtRw('');
      setReporterName('');
      setPhone('');
    }
    setSelectedPhoto(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {submittedTicket ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>
            <h3 className="font-headline text-2xl font-bold text-slate-900">
              Laporan Berhasil Diajukan!
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Terima kasih atas partisipasi aktif Anda dalam menjaga fasilitas desa. Tiket laporan Anda telah diterbitkan:
            </p>
            <div className="inline-block bg-slate-50 border-2 border-dashed border-emerald-600 px-6 py-3 rounded-xl">
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block">
                Nomor Tiket Aduan
              </span>
              <span className="font-mono text-2xl font-black text-emerald-700 tracking-wider">
                {submittedTicket}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {!isAnonymous && currentUser ? (
                <span className="text-emerald-700 font-semibold">
                  🛡️ Laporan ini terikat pada akun Anda ({currentUser.name}). Hanya Anda yang dapat mengubah dan menghapus tiket ini.
                </span>
              ) : (
                'Simpan nomor tiket ini untuk memantau status penanganan secara berkala.'
              )}
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={handleResetAndClose}
                className="px-6 py-2.5 rounded-xl bg-emerald-700 text-white font-semibold text-sm hover:bg-emerald-800 transition-colors cursor-pointer shadow-xs"
              >
                Lihat di Daftar Laporan
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Modal Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs font-semibold mb-2">
                <span>🌱</span>
                <span>Formulir Resmi Pengaduan Desa</span>
              </div>
              <h2 className="font-headline text-2xl sm:text-3xl font-bold text-slate-900">
                Buat Laporan Fasilitas Umum
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Laporan Anda akan otomatis diteruskan kepada Satgas Gotong Royong dan Kaur Pelayanan Desa.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Category Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  1. Pilih Kategori Fasilitas
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

              {/* Titik Peta Presisi & GPS */}
              <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-sky-700">pin_drop</span>
                    Titik Lokasi Peta Presisi (Maps API &amp; GPS)
                  </label>
                  <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full border border-sky-200">
                    {pickedCoords ? 'Titik Terkunci' : 'Opsional'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-2">
                  <button
                    type="button"
                    onClick={handleGetGpsLocation}
                    disabled={isGettingGps}
                    className="flex-1 min-w-[150px] py-1.5 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
                  >
                    {isGettingGps ? (
                      <>
                        <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full"></span>
                        <span>Mencari GPS...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[16px]">my_location</span>
                        <span>Gunakan Lokasi GPS Saya</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowMapPicker(!showMapPicker)}
                    className="py-1.5 px-3 bg-white hover:bg-sky-50 border border-sky-300 text-sky-800 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">map</span>
                    <span>{showMapPicker ? 'Tutup Peta' : 'Pilih Titik di Peta'}</span>
                  </button>
                </div>

                {pickedCoords && (
                  <div className="bg-white border border-sky-300 rounded-lg p-2.5 text-xs mb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 font-mono font-bold text-sky-900">
                        <span className="material-symbols-outlined text-[15px] text-emerald-600">check_circle</span>
                        Lat: {pickedCoords.lat}, Lng: {pickedCoords.lng}
                      </div>
                      <button
                        type="button"
                        onClick={() => { setPickedCoords(null); setReverseAddress(null); }}
                        className="text-[11px] text-red-600 hover:underline cursor-pointer"
                      >
                        Hapus Titik
                      </button>
                    </div>
                    {reverseAddress && (
                      <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                        📍 Alamat OSM: {reverseAddress}
                      </p>
                    )}
                  </div>
                )}

                {showMapPicker && (
                  <div className="rounded-xl overflow-hidden border border-sky-300 shadow-inner">
                    <div className="bg-sky-100 px-3 py-1.5 text-[11px] font-semibold text-sky-900 flex items-center justify-between">
                      <span>Geser pin merah atau klik pada peta untuk menentukan titik kejadian:</span>
                      <span className="font-mono text-[10px] text-sky-700">OpenStreetMap</span>
                    </div>
                    <div ref={miniMapContainerRef} className="w-full h-48 bg-slate-100 z-0" />
                  </div>
                )}
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
                  placeholder="Contoh: Aspal amblas tergerus air hujan di jalan utama dusun"
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
                  placeholder="Jelaskan kondisi kerusakan secara detail, potensi bahaya, atau perkiraan penanganan yang diperlukan..."
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
                    Lampiran Foto Bukti (Opsional)
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

              {/* Citizen Identity & Auth Box */}
              <div className="p-4 bg-slate-50 rounded-xl space-y-3 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[17px]">badge</span>
                    Identitas Pelapor
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded text-emerald-700 focus:ring-emerald-600"
                    />
                    <span>Kirim Sebagai Anonim</span>
                  </label>
                </div>

                {/* If Not Anonymous */}
                {!isAnonymous ? (
                  currentUser ? (
                    /* Logged in citizen card */
                    <div className="bg-emerald-50/80 border border-emerald-200 p-3.5 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-emerald-700 text-[20px]">verified</span>
                          <span className="font-bold text-sm text-emerald-950">{currentUser.name}</span>
                          <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-200/70 text-emerald-800 font-mono">
                            {currentUser.phone}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                          Akun Terverifikasi
                        </span>
                      </div>

                      <div className="text-xs text-emerald-800 flex items-center justify-between pt-1 border-t border-emerald-100">
                        <span>📍 {currentUser.dusun} {currentUser.rtRw ? `(${currentUser.rtRw})` : ''}</span>
                        <span className="text-[11px] text-emerald-600 italic">
                          🛡️ Hanya Anda yang berhak mengedit / menghapus laporan ini
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* Not logged in: Alert and action buttons */
                    <div className="bg-amber-50/90 border border-amber-200 p-4 rounded-xl space-y-3">
                      <div className="flex items-start gap-2.5 text-amber-900">
                        <span className="material-symbols-outlined text-[20px] text-amber-600 shrink-0 mt-0.5">
                          lock_clock
                        </span>
                        <div className="text-xs leading-relaxed space-y-1">
                          <p className="font-bold">
                            Diperlukan Masuk Akun Warga untuk Pengaduan Non-Anonim
                          </p>
                          <p className="text-slate-600">
                            Agar laporan terikat pada Anda dan <strong>hanya Anda yang berhak menghapus atau mengubahnya</strong>, silakan masuk akun atau gunakan mode anonim.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => onOpenLoginModal('Masuk akun warga agar laporan tercatat atas nama Anda dan hanya Anda yang berhak menghapusnya.')}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <span className="material-symbols-outlined text-[16px]">login</span>
                          <span>Masuk / Daftar Akun Warga</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setIsAnonymous(true)}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 transition-colors cursor-pointer"
                        >
                          <span>Kirim Sebagai Anonim Saja</span>
                        </button>
                      </div>
                    </div>
                  )
                ) : (
                  /* Anonymous explanation */
                  <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 space-y-1">
                    <p className="text-xs text-slate-700 font-semibold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-slate-500">visibility_off</span>
                      <span>Mode Laporan Anonim</span>
                    </p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Laporan akan ditampilkan sebagai "Warga Anonim". Catatan: Laporan anonim hanya dapat dikelola dan dihapus oleh Administrator Desa untuk menghindari penghapusan sepihak.
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
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
                      <span>Menerbitkan Tiket...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">send</span>
                      <span>Kirim Laporan Pengaduan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
