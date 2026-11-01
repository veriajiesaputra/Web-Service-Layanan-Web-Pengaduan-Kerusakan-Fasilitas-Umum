import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { ReportItem } from '../../types';
import { VILLAGE_DUSUNS } from '../../data/mockData';

interface AdminMapViewProps {
  reports: ReportItem[];
  onSelectReport: (report: ReportItem) => void;
}

export const AdminMapView: React.FC<AdminMapViewProps> = ({ reports, onSelectReport }) => {
  const [selectedDusun, setSelectedDusun] = useState<string>('all');
  const [activeFilterStatus, setActiveFilterStatus] = useState<string>('all');
  const [mapType, setMapType] = useState<'streets' | 'satellite' | 'carto'>('streets');

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const filteredReports = reports.filter((r) => {
    if (selectedDusun !== 'all' && r.dusun !== selectedDusun) return false;
    if (activeFilterStatus !== 'all' && r.status !== activeFilterStatus) return false;
    return true;
  });

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [-6.8797, 109.1835],
      zoom: 15,
      scrollWheelZoom: true,
      zoomControl: false,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    const initialTile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    tileLayerRef.current = initialTile;

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    // Invalidate size on mount to ensure tiles render properly
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersLayerRef.current = null;
      tileLayerRef.current = null;
    };
  }, []);

  // Handle Map Type change (Streets / Satellite / Carto Light)
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    mapInstanceRef.current.removeLayer(tileLayerRef.current);

    let tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let attribution = '&copy; OpenStreetMap contributors';

    if (mapType === 'satellite') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP';
    } else if (mapType === 'carto') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      attribution = '&copy; OpenStreetMap &copy; CARTO';
    }

    const newTileLayer = L.tileLayer(tileUrl, {
      attribution,
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newTileLayer;
  }, [mapType]);

  // Update Markers when reports, filter, or dusun change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    const validCoords: L.LatLngExpression[] = [];

    filteredReports.forEach((report) => {
      let lat = report.coordinates?.lat;
      let lng = report.coordinates?.lng;

      // Ensure valid numerical lat & lng, fallback if needed based on relative percentage
      if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
        const xPercent = report.coordinates?.xPercent ?? 50;
        const yPercent = report.coordinates?.yPercent ?? 50;
        lat = -6.8797 + (yPercent - 50) * 0.0003;
        lng = 109.1835 + (xPercent - 50) * 0.0003;
      }

      validCoords.push([lat, lng]);

      let pinColor = '#f59e0b'; // Amber default (Diajukan)
      if (report.status === 'Selesai') pinColor = '#059669'; // Emerald
      else if (report.status === 'Sedang Dikerjakan') pinColor = '#2563eb'; // Blue
      else if (report.status === 'Dijadwalkan') pinColor = '#9333ea'; // Purple
      else if (report.status === 'Ditolak') pinColor = '#dc2626'; // Red

      const iconHtml = `
        <div style="background-color: ${pinColor}; width: 34px; height: 34px; border-radius: 9999px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2.5px solid white; display: flex; align-items: center; justify-content: center; color: white;">
          <span class="material-symbols-outlined" style="font-size: 18px; line-height: 1;">${report.categoryIcon || 'location_on'}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'village-gis-pin',
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        popupAnchor: [0, -18],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      const popupContainer = document.createElement('div');
      popupContainer.style.fontFamily = 'inherit';
      popupContainer.style.minWidth = '210px';
      popupContainer.innerHTML = `
        <div style="padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-family: monospace; font-weight: 700; color: #047857; font-size: 11px;">${report.id}</span>
            <span style="background-color: ${pinColor}; color: white; padding: 2px 7px; border-radius: 9999px; font-weight: 700; font-size: 10px;">${report.status}</span>
          </div>
          <h4 style="font-weight: 700; font-size: 13px; color: #0f172a; margin: 0 0 4px 0; line-height: 1.3;">${report.title}</h4>
          <p style="font-size: 11px; color: #475569; margin: 0 0 6px 0;">📍 ${report.location || report.dusun}</p>
          <div style="font-size: 10px; color: #64748b; margin-bottom: 8px;">
            Pelapor: <strong>${report.reporterName || 'Warga'}</strong> (${report.priority || 'Normal'})
          </div>
          <button id="gis-popup-btn-${report.id.replace(/[^a-zA-Z0-9]/g, '')}" style="width: 100%; padding: 6px 12px; background-color: #047857; color: white; border: none; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer; transition: background 0.15s ease;">
            Lihat Rincian Laporan &rarr;
          </button>
        </div>
      `;

      marker.bindPopup(popupContainer);

      marker.on('popupopen', () => {
        const cleanId = report.id.replace(/[^a-zA-Z0-9]/g, '');
        const btn = document.getElementById(`gis-popup-btn-${cleanId}`);
        if (btn) {
          btn.onclick = () => onSelectReport(report);
        }
      });

      marker.addTo(markersLayerRef.current!);
    });

    if (validCoords.length > 0 && mapInstanceRef.current) {
      const bounds = L.latLngBounds(validCoords);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }
  }, [filteredReports, onSelectReport]);

  const handleResetView = () => {
    if (mapInstanceRef.current && markersLayerRef.current) {
      const layers = markersLayerRef.current.getLayers();
      if (layers.length > 0) {
        const group = L.featureGroup(layers);
        mapInstanceRef.current.fitBounds(group.getBounds(), { padding: [60, 60] });
      } else {
        mapInstanceRef.current.setView([-6.8797, 109.1835], 15);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter and Overview Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-[24px]">map</span>
            <h2 className="font-headline text-lg font-bold text-slate-900">
              Peta GIS Sebaran Aduan Desa Kepunduhan (Kramat, Tegal)
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
              OpenStreetMap GIS
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Peta geografis kartografi riil untuk pemantauan sebaran laporan kerusakan fasilitas desa.
          </p>
        </div>

        {/* Map Type Switcher & Reset Button */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setMapType('streets')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                mapType === 'streets' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🗺️ Peta Jalan
            </button>
            <button
              onClick={() => setMapType('satellite')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                mapType === 'satellite' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🛰️ Satelit
            </button>
            <button
              onClick={() => setMapType('carto')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                mapType === 'carto' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🏙️ Kartografi
            </button>
          </div>

          <button
            onClick={handleResetView}
            className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            title="Pusatkan peta ke seluruh titik"
          >
            <span className="material-symbols-outlined text-[16px]">center_focus_strong</span>
            <span>Reset Fokus</span>
          </button>
        </div>
      </div>

      {/* Dusun Filter Bar */}
      <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 flex flex-wrap items-center gap-1.5 overflow-x-auto">
        <span className="text-xs font-bold text-slate-500 mr-2 shrink-0">Filter Dusun:</span>
        <button
          onClick={() => setSelectedDusun('all')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
            selectedDusun === 'all'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Semua Wilayah ({reports.length})
        </button>
        {VILLAGE_DUSUNS.map((d) => {
          const count = reports.filter((r) => r.dusun === d).length;
          return (
            <button
              key={d}
              onClick={() => setSelectedDusun(d)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                selectedDusun === d
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {d} ({count})
            </button>
          );
        })}
      </div>

      {/* Real Interactive Map Canvas */}
      <div className="relative w-full h-[560px] rounded-2xl overflow-hidden border border-slate-200 shadow-md">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Legend Overlay at Bottom-Right */}
        <div className="absolute bottom-4 right-4 p-3.5 rounded-xl bg-white/95 backdrop-blur-md text-slate-800 shadow-xl border border-slate-200/90 text-xs space-y-2 z-10 hidden sm:block pointer-events-auto">
          <p className="font-bold text-[11px] uppercase tracking-wider text-slate-500 mb-1.5">
            Status Pin di Peta ({filteredReports.length})
          </p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Diajukan ({reports.filter((r) => r.status === 'Diajukan').length})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span>Proses ({reports.filter((r) => r.status === 'Sedang Dikerjakan').length})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
              <span>Jadwal ({reports.filter((r) => r.status === 'Dijadwalkan').length})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span>Selesai ({reports.filter((r) => r.status === 'Selesai').length})</span>
            </div>
          </div>
        </div>

        {/* Floating Hint Overlay at Top-Left */}
        <div className="absolute top-4 left-4 p-2.5 px-3 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-xs z-10 pointer-events-none hidden md:flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-emerald-400">touch_app</span>
          <span>Klik pin di peta untuk melihat rincian tiket aduan</span>
        </div>
      </div>
    </div>
  );
};
