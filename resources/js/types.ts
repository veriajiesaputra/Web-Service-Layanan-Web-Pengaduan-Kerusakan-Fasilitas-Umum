export type ReportStatus = 'Diajukan' | 'Sedang Dikerjakan' | 'Dijadwalkan' | 'Selesai' | 'Ditolak';

export type ReportCategory = 
  | 'jalan'
  | 'irigasi'
  | 'penerangan'
  | 'kebersihan'
  | 'fasilitas'
  | 'taman';

export type ReportPriority = 'Rendah' | 'Sedang' | 'Tinggi' | 'Mendesak';

export interface TimelineEvent {
  title: string;
  time: string;
  description: string;
  actor: string;
  isCompleted: boolean;
}

export interface CommentItem {
  id: string;
  author: string;
  role: string;
  text: string;
  time: string;
  createdAt?: string;
}

export interface ReportItem {
  id: string; // e.g. "#LAP-0412"
  title: string;
  category: ReportCategory;
  categoryLabel: string;
  categoryIcon: string;
  status: ReportStatus;
  location: string;
  dusun: string;
  description: string;
  timeAgo: string;
  createdAt: string;
  priority: ReportPriority;
  officerBadge: string;
  officerBadgeType: 'priority' | 'time' | 'officer' | 'date';
  coordinates: {
    lat: number;
    lng: number;
    xPercent: number; // For SVG interactive map
    yPercent: number;
  };
  reporterName: string;
  reporterRole?: string;
  reporterPhone?: string;
  isAnonymous: boolean;
  upvotes: number;
  hasUpvoted?: boolean;
  timeline: TimelineEvent[];
  photos?: {
    before?: string;
    after?: string;
  };
  comments?: CommentItem[];
  assignedTeam?: string;
  notes?: string;
  rejectionReason?: string;
}

// For backwards compatibility in dasbor if needed
export type CitizenReport = ReportItem;

export interface FieldTeam {
  id: string;
  code: string; // e.g. "BM", "TA", "PJU", "KTH"
  name: string;
  division: string;
  leader: string;
  activeMembers: number;
  status: 'Bertugas' | 'Siaga' | 'Istirahat';
  currentLocation: string;
  assignedTickets: string[];
  vehicle: string;
}

export interface DailyNote {
  id: string;
  time: string;
  author: string;
  text: string;
  createdAt?: string;
}

export interface EmergencyContact {
  title: string;
  phone: string;
  desc: string;
  icon: string;
  badge: string;
}

export interface VillageStat {
  value: string;
  title: string;
  description: string;
  icon: string;
}

export interface CitizenUser {
  id: string;
  nik?: string;
  name: string;
  phone: string;
  dusun: string;
  rtRw?: string;
  role?: string;
  token?: string;
}

