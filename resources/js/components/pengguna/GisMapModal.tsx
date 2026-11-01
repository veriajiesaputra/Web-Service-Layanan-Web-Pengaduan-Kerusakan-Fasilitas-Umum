import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { ReportItem } from '../../types';

interface GisMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: ReportItem[];
  onSelectReport: (report: ReportItem) => void;
}

export const GisMapModal: React.FC<GisMapModalProps> = ({
  isOpen,
  onClose,
  reports,
  onSelectReport,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapType, setMapType] = useState<'streets' | 'satellite' | 'carto'>('streets');
  const [activeReport, setActiveReport] = useState<ReportItem | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const filteredReports = reports.filter((r) => {
    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.location && r.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.dusun && r.dusun.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Initialize Leaflet Map when modal opens
  useEffect(() => {
    if (!isOpen) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
        tileLayerRef.current = null;
      }
      return;
    }

    const timer = setTimeout(() => {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: [-6.8797, 109.1835],
        zoom: 15,
        scrollWheelZoom: true,
        zoomControl: false,
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      const initialTile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      tileLayerRef.current = initialTile;

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;

      map.invalidateSize();
    }, 150);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
        tileLayerRef.current = null;
      }
    };
  }, [isOpen]);

  // Handle Layer change (Streets / Satellite / Carto)
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    mapInstanceRef.current.removeLayer(tileLayerRef.current);

    let tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let attribution = '&copy; OpenStreetMap contributors';

    if (mapType === 'satellite') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = 'Tiles &copy; Esri';
    } else if (mapType === 'carto') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      attribution = '&copy; OpenStreetMap &copy; CARTO';
    }

    const newTile = L.tileLayer(tileUrl, { attribution, maxZoom: 19 }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newTile;
  }, [mapType]);

  // Update Markers
  useEffect(() => {
    if (!isOpen || !mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    const validCoords: L.LatLngExpression[] = [];

    filteredReports.forEach((report) => {
      let lat = report.coordinates?.lat;
      let lng = report.coordinates?.lng;

      if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
        const xPercent = report.coordinates?.xPercent ?? 50;
        const yPercent = report.coordinates?.yPercent ?? 50;
        lat = -6.8797 + (yPercent - 50) * 0.0003;
        lng = 109.1835 + (xPercent - 50) * 0.0003;
      }

      validCoords.push([lat, lng]);

      let pinColor = '#f59e0b'; // Amber (Diajukan)
      if (report.status === 'Selesai') pinColor = '#059669'; // Emerald
      else if (report.status === 'Sedang Dikerjakan') pinColor = '#2563eb'; // Blue
      else if (report.status === 'Dijadwalkan') pinColor = '#9333ea'; // Purple
      else if (report.status === 'Ditolak') pinColor = '#dc2626'; // Red

      const iconHtml = `
        <div style="background-color: ${pinColor}; width: 34px; height: 34px; border-radius: 9999px; box-shadow: 0 4px 10px rgba(0,0,0,0.35); border: 2.5px solid white; display: flex; align-items: center; justify-content: center; color: white;">
          <span class="material-symbols-outlined" style="font-size: 18px; line-height: 1;">${report.categoryIcon || 'location_on'}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'citizen-gis-pin',
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        popupAnchor: [0, -18],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      const popupDiv = document.createElement('div');
      popupDiv.style.fontFamily = 'inherit';
      popupDiv.style.minWidth = '210px';
      popupDiv.innerHTML = `
        <div style="padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-family: monospace; font-weight: 700; color: #047857; font-size: 11px;">${report.id}</span>
            <span style="background-color: ${pinColor}; color: white; padding: 2px 7px; border-radius: 9999px; font-weight: 700; font-size: 10px;">${report.status}</span>
          </div>
          <h4 style="font-weight: 700; font-size: 13px; color: #0f172a; margin: 0 0 4px 0; line-height: 1.3;">${report.title}</h4>
          <p style="font-size: 11px; color: #475569; margin: 0 0 6px 0;">📍 ${report.location || report.dusun}</p>
          <div style="font-size: 10px; color: #64748b; margin-bottom: 8px;">
            Pelapor: <strong>${report.reporterName || 'Warga'}</strong>
          </div>
          <button id="citizen-popup-btn-${report.id.replace(/[^a-zA-Z0-9]/g, '')}" style="width: 100%; padding: 6px 12px; background-color: #047857; color: white; border: none; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer;">
            Buka Rincian Laporan &rarr;
          </button>
        </div>
      `;

      marker.bindPopup(popupDiv);

      marker.on('popupopen', () => {
        const cleanId = report.id.replace(/[^a-zA-Z0-9]/g, '');
        const btn = document.getElementById(`citizen-popup-btn-${cleanId}`);
        if (btn) {
          btn.onclick = () => {
            onSelectReport(report);
            onClose();
          };
        }
      });

      marker.on('click', () => {
        setActiveReport(report);
      });

      marker.addTo(markersLayerRef.current!);
    });

    if (validCoords.length > 0 && mapInstanceRef.current) {
      const bounds = L.latLngBounds(validCoords);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }
  }, [filteredReports, isOpen, onClose, onSelectReport]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">map</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline text-lg sm:text-xl font-bold text-slate-900">
                  Peta Wilayah Interaktif GIS Desa Kepunduhan (Kec. Kramat, Kab. Tegal)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  OpenStreetMap
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Peta kartografi resmi sebaran laporan fasilitas umum &amp; infrastruktur 6 dusun.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Map Type Switcher */}
            <div className="bg-slate-200/70 p-1 rounded-xl flex items-center gap-1 text-xs font-bold">
              <button
                onClick={() => setMapType('streets')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  mapType === 'streets' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
                }`}
              >
                Peta Jalan
              </button>
              <button
                onClick={() => setMapType('satellite')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  mapType === 'satellite' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
                }`}
              >
                Satelit
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Toolbar Filter */}
        <div className="px-5 py-2.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { key: 'all', label: 'Semua Kategori' },
              { key: 'jalan', label: 'Jalan' },
              { key: 'irigasi', label: 'Irigasi' },
              { key: 'penerangan', label: 'PJU' },
              { key: 'kebersihan', label: 'Sampah' },
              { key: 'taman', label: 'Pohon' },
              { key: 'fasilitas', label: 'Balai/Pos' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setSelectedCategory(f.key)}
                className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors shrink-0 ${
                  selectedCategory === f.key
                    ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari lokasi / judul / tiket..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>
        </div>

        {/* Real Leaflet Map Container */}
        <div className="relative flex-1 bg-slate-100 overflow-hidden">
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {/* Floating Stats */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-md border border-slate-200 hidden md:block z-10">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Pemetaan GIS Desa
            </span>
            <span className="text-sm font-bold text-slate-900 block">
              {filteredReports.length} Aduan Tersebar
            </span>
            <span className="text-[11px] text-slate-500">
              Klik pin untuk melihat rincian lokasi
            </span>
          </div>

          {/* Bottom-right Legend */}
          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-md border border-slate-200 text-xs hidden sm:flex items-center gap-3 z-10">
            <span className="flex items-center gap-1.5 font-medium text-slate-700 text-[11px]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Selesai
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-700 text-[11px]">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Proses
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-700 text-[11px]">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> Jadwal
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-700 text-[11px]">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Diajukan
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
