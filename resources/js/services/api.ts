import { ReportItem, FieldTeam, DailyNote, EmergencyContact, CitizenUser } from '../types';

function getCsrfToken(): string {
  const meta = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
  return meta ? meta.content : '';
}

function getStoredCitizen(): CitizenUser | null {
  try {
    const raw = localStorage.getItem('desa_mandiri_citizen');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const citizen = getStoredCitizen();
  const citizenHeaders: Record<string, string> = {};
  if (citizen?.phone) {
    citizenHeaders['X-Citizen-Phone'] = citizen.phone;
  }
  if (citizen?.name) {
    citizenHeaders['X-Citizen-Name'] = citizen.name;
  }

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-CSRF-TOKEN': getCsrfToken(),
    ...citizenHeaders,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errJson = await response.json();
      if (errJson && errJson.message) {
        errorMessage = errJson.message;
      }
    } catch (_) {
      const errorText = await response.text();
      if (errorText) errorMessage = errorText;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export const api = {

  // Reports
  async getReports(params?: { status?: string; category?: string; dusun?: string; search?: string; sort?: string }): Promise<ReportItem[]> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.category) query.append('category', params.category);
    if (params?.dusun) query.append('dusun', params.dusun);
    if (params?.search) query.append('search', params.search);
    if (params?.sort) query.append('sort', params.sort);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return request<ReportItem[]>(`/api/reports${qs}`);
  },

  async getReport(id: string): Promise<ReportItem> {
    return request<ReportItem>(`/api/reports/${encodeURIComponent(id)}`);
  },

  async createReport(data: Partial<ReportItem> & { rtRw?: string; phone?: string }): Promise<ReportItem> {
    return request<ReportItem>('/api/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateReport(id: string, data: Partial<ReportItem>): Promise<ReportItem> {
    return request<ReportItem>(`/api/reports/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteReport(id: string): Promise<{ message: string; id: string }> {
    return request<{ message: string; id: string }>(`/api/reports/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  async verifyReport(id: string, verificationData: { assignedTeam: string; notes?: string; status?: string; priority?: string }): Promise<ReportItem> {
    return request<ReportItem>(`/api/reports/${encodeURIComponent(id)}/verify`, {
      method: 'POST',
      body: JSON.stringify(verificationData),
    });
  },

  async toggleUpvote(id: string): Promise<ReportItem> {
    return request<ReportItem>(`/api/reports/${encodeURIComponent(id)}/upvote`, {
      method: 'POST',
    });
  },

  async addComment(id: string, comment: { author?: string; role?: string; text: string }): Promise<ReportItem> {
    return request<ReportItem>(`/api/reports/${encodeURIComponent(id)}/comments`, {
      method: 'POST',
      body: JSON.stringify(comment),
    });
  },

  async getStats(): Promise<any> {
    return request<any>('/api/reports/stats');
  },

  // Field Teams
  async getTeams(): Promise<FieldTeam[]> {
    return request<FieldTeam[]>('/api/teams');
  },

  async updateTeam(id: string, data: Partial<FieldTeam>): Promise<FieldTeam> {
    return request<FieldTeam>(`/api/teams/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Daily Notes
  async getDailyNotes(): Promise<DailyNote[]> {
    return request<DailyNote[]>('/api/daily-notes');
  },

  async createDailyNote(data: { text: string; author?: string }): Promise<DailyNote> {
    return request<DailyNote>('/api/daily-notes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Emergency Contacts
  async getEmergencyContacts(): Promise<EmergencyContact[]> {
    return request<EmergencyContact[]>('/api/emergency-contacts');
  },

  // Citizen Auth & Accounts
  async citizenLogin(phone: string, password?: string): Promise<{ success: boolean; user: CitizenUser; message: string }> {
    return request<{ success: boolean; user: CitizenUser; message: string }>('/api/citizen/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password: password || '123456' }),
    });
  },

  async citizenRequestOtp(phone: string): Promise<{ success: boolean; message: string; demo_otp?: string; sent_via_wa: boolean }> {
    return request<{ success: boolean; message: string; demo_otp?: string; sent_via_wa: boolean }>('/api/citizen/request-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  },

  async citizenVerifyOtp(phone: string, otp: string): Promise<{ success: boolean; user: CitizenUser; message: string }> {
    return request<{ success: boolean; user: CitizenUser; message: string }>('/api/citizen/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    });
  },

  async citizenRegister(data: { nik: string; name: string; phone: string; dusun: string; rtRw?: string; role?: string; password?: string }): Promise<{ success: boolean; user: CitizenUser; message: string }> {
    return request<{ success: boolean; user: CitizenUser; message: string }>('/api/citizen/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getCitizenDemoAccounts(): Promise<CitizenUser[]> {
    return request<CitizenUser[]>('/api/citizen/demo-accounts');
  },

  async getCitizenMe(): Promise<CitizenUser> {
    return request<CitizenUser>('/api/citizen/me');
  },
};

