import { ReportItem, VillageStat, FieldTeam, EmergencyContact } from '../types';

export const ASSETS = {
  logo: 'https://lh3.googleusercontent.com/aida/AEtjO1XotV8pFaL330qjp3YaGAnoaimQntfTUuHbboC_ffR50B4C-8EdM8DQMuIv7QfP2pAQXdQHwbUbhOYE4yqVjQymVPoGnKkj2BET9bxiJp2iXquHBxrHQ2AQ9mZZLBGQXEXxdV8c3EBZeyJmbJADlrfiKnwO3IiQx2_9ViMu1mDsL1DUJwL3X21C54FMBv0oMAbJujnuXS5GLTFXHnqXREr9aHgZoq62THmQNJvNwc0fA6Z7WZzbzPT4uzzs',
  avatar: 'https://lh3.googleusercontent.com/aida/AEtjO1Xq0BgAzQ0X8OXJZMkbCK9oq5ETHjmoz7SeRMjxNmFG774VPnueBrKAtu6cbbT8CAo9-EFDkuOTplGCqF47mAsJYpgAibW_90enpfvhQq3KAuPCYF3O71ph-j-k5o-GXjyb0-rjgQ_puDKAHlIP0YDCjX41_3NOcNytxgnWOhlcj1Pg3k25HvVDzUDzh-b5lkBgkshznYV45LjBssQXhVg9J3oAt1XaUfi-G3bbxJPyjT99WsT5IcV4pR8s',
  heroBg: '/images/desa.png',
  mapBg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAz9xSZ8TyuiRhodrBHYvpqwmoggrjphoiPe9Igl7x_y-JJxtGSvPil2pCHs7lgKlcgHDz5fFTpgq6NWSNpzfVDCiEoBipEwNy4-_MAcPiKwfgjs5apQiPr_0nCi8-ziH1xBGRARg5unmC2IzW6kG2k8Eci1fatB9FLH7H8kdnzER1pYaxFOTr99FmrHMUQ2NCL5S2Lt09iTg4FUtBn-_FW0juP207Yx1_VZegYW1pT80lFDRlzyk8pHQ'
};

export const VILLAGE_DUSUNS = [
  'Dusun Beringin (Krajan)',
  'Dusun Kepunduhan Timur',
  'Dusun Kepunduhan Barat',
  'Blok Sawah Tani',
  'Kawasan Usaha & Pasar Desa',
  'Wilayah Jalur Pantura Kramat'
];

export const CATEGORY_OPTIONS = [
  {
    key: 'jalan',
    label: 'Jalan & Jembatan',
    icon: 'add_road',
    desc: 'Jalan berlubang, paving rusak, jembatan desa'
  },
  {
    key: 'irigasi',
    label: 'Saluran Air & Irigasi',
    icon: 'water_damage',
    desc: 'Irigasi mampet, selokan meluap, pintu air'
  },
  {
    key: 'penerangan',
    label: 'Penerangan Jalan',
    icon: 'light',
    desc: 'Lampu jalan mati, tiang miring, kabel kendor'
  },
  {
    key: 'kebersihan',
    label: 'Kebersihan & Sampah',
    icon: 'delete_sweep',
    desc: 'Tempat sampah liar, tumpukan sampah, TPS'
  },
  {
    key: 'fasilitas',
    label: 'Fasilitas & Balai',
    icon: 'roofing',
    desc: 'Poskamling rusak, balai RT, lapangan umum'
  },
  {
    key: 'taman',
    label: 'Taman & Pohon',
    icon: 'park',
    desc: 'Pohon tumbang/rindang membahayakan jalan'
  }
];

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    title: 'Posko Siaga Bencana Desa Kepunduhan',
    phone: '0812-3456-7890',
    desc: 'Satgas penanggulangan banjir, tanggul jebol, pohon tumbang Jl. Beringin',
    icon: 'phone_in_talk',
    badge: '24 Jam'
  },
  {
    title: 'Bhabinkamtibmas Polsek Kramat',
    phone: '0812-3456-7890',
    desc: 'Aiptu Bambang Wijaya - Kamtibmas Desa Kepunduhan',
    icon: 'shield_person',
    badge: 'Polri'
  },
  {
    title: 'Babinsa Koramil 06 Kramat',
    phone: '0813-9876-5432',
    desc: 'Serma Hendra Kusuma - Pembina teritorial Desa Kepunduhan',
    icon: 'military_tech',
    badge: 'TNI-AD'
  },
  {
    title: 'Ambulans Siaga Desa Kepunduhan',
    phone: '(0283) 555-0199',
    desc: 'Layanan antar pasien darurat 24 jam gratis warga Kepunduhan',
    icon: 'emergency',
    badge: 'Kesehatan'
  },
  {
    title: 'PLN Rayon Kramat Tegal',
    phone: '123',
    desc: 'Layanan aduan kabel putus dan gangguan listrik Pantura',
    icon: 'bolt',
    badge: 'Kelistrikan'
  }
];

export const INITIAL_STATS: VillageStat[] = [
  {
    value: '98.5%',
    title: 'Ditanggapi',
    description: 'Respon awal petugas desa dalam kurun waktu 1x24 jam kerja.',
    icon: 'quickreply'
  },
  {
    value: '24',
    title: 'Petugas Siaga',
    description: 'Tim teknis & satgas gotong royong aktif di 6 dusun wilayah desa.',
    icon: 'engineering'
  },
  {
    value: '1.450+',
    title: 'Warga Aktif',
    description: 'Warga terdaftar yang berpartisipasi menjaga fasilitas desa.',
    icon: 'groups'
  }
];

export const FIELD_TEAMS: FieldTeam[] = [
  {
    id: 'team-bm',
    code: 'BM',
    name: 'Regu Bina Marga (Jalan & Jembatan)',
    division: 'Infrastruktur Jalan',
    leader: 'Suryadi (Koordinator Jalan)',
    activeMembers: 6,
    status: 'Bertugas',
    currentLocation: 'Jl. Beringin RT 02 Dusun Beringin (Tambal Paving Cepat)',
    assignedTickets: ['#LAP-0412', '#LAP-0413', '#LAP-0419'],
    vehicle: 'Pick-Up L300 & Stamper Mesin',
  },
  {
    id: 'team-ta',
    code: 'TA',
    name: 'Tim Tata Air & Irigasi Desa',
    division: 'Pengairan & Drainase',
    leader: 'Mansur Efendi',
    activeMembers: 5,
    status: 'Bertugas',
    currentLocation: 'Blok Sawah Tani (Normalisasi Tanggul Saluran Irigasi)',
    assignedTickets: ['#LAP-0417', '#LAP-0421'],
    vehicle: 'Alkon Pompa 3 Inch & Gerobak Dorong',
  },
  {
    id: 'team-pju',
    code: 'PJU',
    name: 'Regu Kelistrikan & PJU',
    division: 'Penerangan Umum',
    leader: 'Agus Salim',
    activeMembers: 4,
    status: 'Siaga',
    currentLocation: 'Bengkel Balai Desa Kepunduhan (Jl. Beringin No. 1)',
    assignedTickets: ['#LAP-0418', '#LAP-0420', '#LAP-0423'],
    vehicle: 'Mobil Tangga Hidrolik Mini',
  },
  {
    id: 'team-kth',
    code: 'KTH',
    name: 'Satgas Kebersihan & Ruang Hijau',
    division: 'Lingkungan Hidup',
    leader: 'Teguh Wibowo',
    activeMembers: 8,
    status: 'Bertugas',
    currentLocation: 'Jalur Pantura Kramat & Kawasan Pasar Desa Kepunduhan',
    assignedTickets: ['#LAP-0414', '#LAP-0415', '#LAP-0416'],
    vehicle: 'Truk Dump Sampah & Chainsaw',
  }
];

export const INITIAL_REPORTS: ReportItem[] = [
  {
    id: '#LAP-0412',
    title: 'Jalan Paving Berlubang dan Amblas Depan SDN Kepunduhan',
    category: 'jalan',
    categoryLabel: 'Jalan & Jembatan',
    categoryIcon: 'add_road',
    status: 'Sedang Dikerjakan',
    location: 'Jl. Beringin RT 02 / RW 01 (Depan SDN Kepunduhan)',
    dusun: 'Dusun Beringin (Krajan)',
    description: 'Paving jalan desa amblas dengan diameter sekitar 1 meter dan kedalaman 15 cm akibat sering dilalui truk pengangkut material, membahayakan anak-anak sekolah yang melintas.',
    timeAgo: '2 jam lalu',
    createdAt: '2026-10-31 08:30',
    priority: 'Tinggi',
    officerBadge: 'Ditangani: Regu BM',
    officerBadgeType: 'officer',
    coordinates: {
      lat: -6.8795,
      lng: 109.1832,
      xPercent: 48,
      yPercent: 50
    },
    reporterName: 'Siti Rahmawati',
    isAnonymous: false,
    upvotes: 24,
    timeline: [
      {
        title: 'Laporan Dikirimkan Warga',
        time: '31 Oct 2026, 08:30 WIB',
        description: 'Laporan masuk antrean verifikasi balai desa.',
        actor: 'Siti Rahmawati',
        isCompleted: true
      },
      {
        title: 'Verifikasi Kaur Pelayanan Desa',
        time: '31 Oct 2026, 09:10 WIB',
        description: 'Lokasi telah dicek dan masuk prioritas tinggi karena dekat fasilitas pendidikan.',
        actor: 'Kaur Pelayanan Desa',
        isCompleted: true
      },
      {
        title: 'Disposisi ke Regu Bina Marga',
        time: '31 Oct 2026, 10:00 WIB',
        description: 'Regu BM meluncur dengan Pick-Up L300 dan mesin stamper paving.',
        actor: 'Suryadi (Koordinator BM)',
        isCompleted: true
      }
    ],
    comments: [
      {
        id: 'c_001_1',
        author: 'Budi Santoso',
        role: 'Warga Jl. Beringin No. 1',
        text: 'Terima kasih respon cepatnya tim desa. Anak-anak memang rawan jatuh kalau lewat pagi hari.',
        time: '1 jam lalu'
      }
    ]
  },
  {
    id: '#LAP-0417',
    title: 'Tanggul Saluran Irigasi Jebol di Blok Sawah Tani',
    category: 'irigasi',
    categoryLabel: 'Saluran Air & Irigasi',
    categoryIcon: 'water_damage',
    status: 'Sedang Dikerjakan',
    location: 'Saluran Sekunder Blok Sawah Tani RT 01 / RW 03',
    dusun: 'Blok Sawah Tani',
    description: 'Tanggul pembatas saluran irigasi sawah jebol sepanjang 5 meter akibat luapan debit air hujan lebat semalam. Air menggenangi persemaian bibit padi.',
    timeAgo: '5 jam lalu',
    createdAt: '2026-10-31 06:10',
    priority: 'Tinggi',
    officerBadge: 'Ditangani: Tim TA',
    officerBadgeType: 'officer',
    coordinates: {
      lat: -6.8825,
      lng: 109.1852,
      xPercent: 60,
      yPercent: 75
    },
    reporterName: 'Bambang Sutrisno',
    isAnonymous: false,
    upvotes: 42,
    timeline: [
      {
        title: 'Laporan Diterima',
        time: '31 Oct 2026, 06:10 WIB',
        description: 'Laporan darurat kelompok tani Desa Kepunduhan diterima.',
        actor: 'Bambang Sutrisno',
        isCompleted: true
      },
      {
        title: 'Pengalihan Pintu Air & Pemasangan Bronjong',
        time: '31 Oct 2026, 07:00 WIB',
        description: 'Tim Tata Air menurunkan pompa Alkon dan gotong royong bersama petani memasang cerucuk bambu.',
        actor: 'Mansur Efendi',
        isCompleted: true
      }
    ],
    comments: [
      {
        id: 'c_017_1',
        author: 'Mansur Efendi',
        role: 'Koordinator Tim Tata Air',
        text: 'Sedang penutupan darurat dengan sandbag. Debit air utama di intake barat sudah kami kecilkan sementara.',
        time: '3 jam lalu'
      }
    ]
  },
  {
    id: '#LAP-0418',
    title: 'Lampu PJU Mati Total di Pertigaan Dusun Kepunduhan Timur',
    category: 'penerangan',
    categoryLabel: 'Penerangan Jalan',
    categoryIcon: 'light',
    status: 'Sedang Dikerjakan',
    location: 'Pertigaan Gardu Dusun Kepunduhan Timur RT 05 / RW 02',
    dusun: 'Dusun Kepunduhan Timur',
    description: 'Tiga unit lampu penerangan jalan mati sejak 2 malam terakhir. Kondisi jalan menjadi gelap gulita dan rawan kecelakaan serta aksi kriminalitas malam.',
    timeAgo: '6 jam lalu',
    createdAt: '2026-10-31 05:20',
    priority: 'Sedang',
    officerBadge: 'Ditangani: Regu PJU',
    officerBadgeType: 'officer',
    coordinates: {
      lat: -6.8788,
      lng: 109.1848,
      xPercent: 58,
      yPercent: 38
    },
    reporterName: 'Ahmad Fauzi',
    isAnonymous: false,
    upvotes: 18,
    timeline: [
      {
        title: 'Laporan Diterima',
        time: '31 Oct 2026, 05:20 WIB',
        description: 'Laporan masuk verifikasi teknis kelistrikan.',
        actor: 'Ahmad Fauzi',
        isCompleted: true
      },
      {
        title: 'Jadwal Penggantian Bohlam LED',
        time: '31 Oct 2026, 08:00 WIB',
        description: 'Mobil tangga hidrolik mini dijadwalkan ke lokasi sore ini.',
        actor: 'Agus Salim',
        isCompleted: true
      }
    ]
  },
  {
    id: '#LAP-0414',
    title: 'Dahan Pohon Trembesi Rindang Menjuntai di Jalur Pantura Kramat',
    category: 'taman',
    categoryLabel: 'Taman & Pohon',
    categoryIcon: 'park',
    status: 'Sedang Dikerjakan',
    location: 'Jalur Utama Pantura Kramat KM 12 (Perbatasan Desa Kepunduhan)',
    dusun: 'Wilayah Jalur Pantura Kramat',
    description: 'Dahan pohon pelindung trembesi sudah lapuk dan menjulur rendah ke badan jalan nasional Pantura, rawan tersangkut atap bus dan truk tronton.',
    timeAgo: '1 hari lalu',
    createdAt: '2026-10-30 14:15',
    priority: 'Tinggi',
    officerBadge: 'Ditangani: Satgas KTH',
    officerBadgeType: 'officer',
    coordinates: {
      lat: -6.8775,
      lng: 109.1825,
      xPercent: 45,
      yPercent: 22
    },
    reporterName: 'Kusnandar',
    isAnonymous: false,
    upvotes: 35,
    timeline: [
      {
        title: 'Laporan Diterima',
        time: '30 Oct 2026, 14:15 WIB',
        description: 'Laporan diverifikasi tim lingkungan hidup.',
        actor: 'Kusnandar',
        isCompleted: true
      },
      {
        title: 'Eksekusi Pemangkasan Dahan',
        time: '31 Oct 2026, 09:30 WIB',
        description: 'Satgas KTH memangkas dahan pohon menggunakan chainsaw dan mengamankan bahu jalan.',
        actor: 'Teguh Wibowo',
        isCompleted: true
      }
    ]
  },
  {
    id: '#LAP-0415',
    title: 'Penumpukan Sampah Organik dan Plastik di Belakang Pasar Desa',
    category: 'kebersihan',
    categoryLabel: 'Kebersihan & Sampah',
    categoryIcon: 'delete_sweep',
    status: 'Selesai',
    location: 'Area TPS Pasar Desa Kepunduhan RT 02 / RW 01',
    dusun: 'Kawasan Usaha & Pasar Desa',
    description: 'Sampah sisa sayuran dan limbah pedagang menumpuk dan menimbulkan bau tak sedap pasca hari pasaran wage.',
    timeAgo: '1 hari lalu',
    createdAt: '2026-10-30 10:00',
    priority: 'Sedang',
    officerBadge: 'Selesai: Satgas KTH',
    officerBadgeType: 'officer',
    coordinates: {
      lat: -6.8805,
      lng: 109.1842,
      xPercent: 52,
      yPercent: 56
    },
    reporterName: 'Rina Anggraini',
    isAnonymous: false,
    upvotes: 29,
    timeline: [
      {
        title: 'Laporan Masuk',
        time: '30 Oct 2026, 10:00 WIB',
        description: 'Laporan pengaduan sampah pedagang pasar diterima.',
        actor: 'Rina Anggraini',
        isCompleted: true
      },
      {
        title: 'Pengangkutan Sampah Tuntas',
        time: '30 Oct 2026, 15:45 WIB',
        description: 'TPS pasar telah dibersihkan dan disemprot disinfektan.',
        actor: 'Teguh Wibowo',
        isCompleted: true
      }
    ],
    comments: [
      {
        id: 'c_015_1',
        author: 'Rina Anggraini',
        role: 'Pelaku UMKM',
        text: 'Alhamdulillah pasar sudah bersih dan tidak bau lagi. Terima kasih tim kebersihan!',
        time: 'Kemarin sore'
      }
    ]
  },
  {
    id: '#LAP-0419',
    title: 'Pengaspalan Ulang Gang Masjid Al-Hidayah Dusun Beringin',
    category: 'jalan',
    categoryLabel: 'Jalan & Jembatan',
    categoryIcon: 'add_road',
    status: 'Selesai',
    location: 'Gang Masjid Al-Hidayah, Dusun Beringin RT 01 / RW 01',
    dusun: 'Dusun Beringin (Krajan)',
    description: 'Permukaan aspal gang menuju masjid kampung sudah mengelupas parah, menimbulkan kubangan air saat hujan.',
    timeAgo: '2 hari lalu',
    createdAt: '2026-10-29 09:00',
    priority: 'Sedang',
    officerBadge: 'Selesai: Regu BM',
    officerBadgeType: 'officer',
    coordinates: {
      lat: -6.8792,
      lng: 109.1828,
      xPercent: 46,
      yPercent: 48
    },
    reporterName: 'Budi Santoso',
    isAnonymous: false,
    upvotes: 39,
    timeline: [
      {
        title: 'Laporan Selesai Dikerjakan',
        time: '30 Oct 2026, 16:00 WIB',
        description: 'Pengaspalan selesai dan sudah dapat dilalui kendaraan jamaah dengan aman.',
        actor: 'Suryadi (Koordinator BM)',
        isCompleted: true
      }
    ]
  }
];
