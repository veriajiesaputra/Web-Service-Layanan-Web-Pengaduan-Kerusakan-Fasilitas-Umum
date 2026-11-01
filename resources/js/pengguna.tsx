import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Header } from './components/pengguna/Header';
import { Hero } from './components/pengguna/Hero';
import { CategoryDispatch } from './components/pengguna/CategoryDispatch';
import { RecentReports } from './components/pengguna/RecentReports';
import { MapAndSOP } from './components/pengguna/MapAndSOP';
import { EmergencyBanner } from './components/pengguna/EmergencyBanner';
import { Footer } from './components/pengguna/Footer';

import { CreateReportModal } from './components/pengguna/CreateReportModal';
import { EditReportModal } from './components/pengguna/EditReportModal';
import { DeleteConfirmModal } from './components/pengguna/DeleteConfirmModal';
import { ReportDetailModal } from './components/pengguna/ReportDetailModal';
import { GisMapModal } from './components/pengguna/GisMapModal';
import { AllReportsModal } from './components/pengguna/AllReportsModal';
import { EmergencyContactsModal } from './components/pengguna/EmergencyContactsModal';
import { AnnouncementModal } from './components/pengguna/AnnouncementModal';
import { InfoModal } from './components/pengguna/InfoModal';
import { CitizenLoginModal } from './components/pengguna/CitizenLoginModal';

import { INITIAL_REPORTS } from './data/mockData';
import { ReportCategory, ReportItem, CitizenUser } from './types';
import { api } from './services/api';

function getInitialServerData(): { initialReports?: ReportItem[]; stats?: any; contacts?: any } {
  try {
    const el = document.getElementById('server-data');
    if (el && el.textContent) {
      return JSON.parse(el.textContent);
    }
  } catch (e) {
    console.error('Error parsing server data:', e);
  }
  return {};
}

export default function PenggunaApp() {
  const serverData = getInitialServerData();
  const [reports, setReports] = useState<ReportItem[]>(serverData.initialReports || INITIAL_REPORTS);
  const [loading, setLoading] = useState(false);

  // Citizen Authentication State (persisted in localStorage)
  const [currentUser, setCurrentUser] = useState<CitizenUser | null>(() => {
    try {
      const saved = localStorage.getItem('desa_mandiri_citizen');
      return saved ? JSON.parse(saved) : null;
    } catch (_) {
      return null;
    }
  });
  const [isCitizenLoginModalOpen, setIsCitizenLoginModalOpen] = useState(false);
  const [citizenLoginPrompt, setCitizenLoginPrompt] = useState<string | undefined>(undefined);
  const [initialFilterMyReports, setInitialFilterMyReports] = useState(false);

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<string>('beranda');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createCategoryDefault, setCreateCategoryDefault] = useState<ReportCategory>('jalan');
  const [selectedReportForDetail, setSelectedReportForDetail] = useState<ReportItem | null>(null);

  // Edit & Delete modal states (Full CRUD upgrade)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [reportToEdit, setReportToEdit] = useState<ReportItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<{ id: string; title?: string } | null>(null);

  const [isAllReportsModalOpen, setIsAllReportsModalOpen] = useState(false);
  const [isGisModalOpen, setIsGisModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [infoModal, setInfoModal] = useState<{ isOpen: boolean; title: string; content: string }>({
    isOpen: false,
    title: '',
    content: ''
  });

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleOpenCitizenLogin = (prompt?: string) => {
    setCitizenLoginPrompt(prompt);
    setIsCitizenLoginModalOpen(true);
  };

  const handleLoginSuccess = (user: CitizenUser) => {
    setCurrentUser(user);
    showToast(`Selamat datang, ${user.name}! Anda kini dapat mengelola laporan Anda.`);
  };

  const handleLogoutCitizen = () => {
    localStorage.removeItem('desa_mandiri_citizen');
    setCurrentUser(null);
    showToast('Anda telah keluar dari akun warga.');
  };

  // Fetch reports from Laravel JSON API
  const refreshReports = async () => {
    try {
      const data = await api.getReports();
      if (Array.isArray(data) && data.length > 0) {
        setReports(data);
      }
    } catch (err) {
      console.warn('API getReports failed, using local/initial data', err);
    }
  };

  useEffect(() => {
    refreshReports();
  }, []);

  // Handle Ticket Tracking Search
  const handleTrackTicket = (query: string) => {
    const cleaned = query.trim().toUpperCase();
    const found = reports.find(
      (r) =>
        r.id.toUpperCase() === cleaned ||
        r.id.toUpperCase() === `#${cleaned}` ||
        r.id.replace('#', '').toUpperCase() === cleaned ||
        r.id.replace('#LAP-', '').toUpperCase() === cleaned ||
        r.title.toLowerCase().includes(query.toLowerCase())
    );

    if (found) {
      setSelectedReportForDetail(found);
      showToast(`Menampilkan rincian tiket ${found.id}: ${found.title}`);
    } else {
      showToast(`Tiket "${query}" belum ditemukan. Pastikan format cth: #LAP-0412`);
    }
  };

  // Quick category selection
  const handleSelectCategory = (cat: ReportCategory) => {
    setCreateCategoryDefault(cat);
    setIsCreateModalOpen(true);
  };

  // [C] CREATE: Add new report via API
  const handleCreateReport = async (newReport: ReportItem) => {
    try {
      setLoading(true);
      const created = await api.createReport({
        title: newReport.title,
        category: newReport.category,
        description: newReport.description,
        dusun: newReport.dusun,
        location: newReport.location,
        priority: newReport.priority,
        reporterName: newReport.reporterName,
        reporterPhone: newReport.reporterPhone,
        isAnonymous: newReport.isAnonymous,
        photoUrl: newReport.photos?.before,
        coordinates: newReport.coordinates,
      });
      setReports((prev) => [created, ...prev]);
      showToast(`Laporan ${created.id} berhasil diajukan dan tercatat resmi!`);
    } catch (e: any) {
      console.error(e);
      // Fallback local update
      setReports((prev) => [newReport, ...prev]);
      showToast(`Laporan ${newReport.id} berhasil diajukan.`);
    } finally {
      setLoading(false);
    }
  };

  // [U] UPDATE: Open edit modal & save changes
  const handleOpenEdit = (report: ReportItem) => {
    setReportToEdit(report);
    setIsEditModalOpen(true);
  };

  const handleUpdateReport = async (
    id: string,
    updatedData: Partial<ReportItem> & { rtRw?: string; phone?: string; photoUrl?: string }
  ) => {
    try {
      setLoading(true);
      const updated = await api.updateReport(id, updatedData);
      setReports((prev) => prev.map((r) => (r.id === id ? updated : r)));
      if (selectedReportForDetail?.id === id) {
        setSelectedReportForDetail(updated);
      }
      showToast(`Laporan ${id} berhasil diperbarui!`);
      setIsEditModalOpen(false);
    } catch (e: any) {
      console.error('Error updating report:', e);
      showToast(e?.message || `Gagal memperbarui: Anda bukan pemilik laporan ini.`);
    } finally {
      setLoading(false);
    }
  };

  // [D] DELETE: Open delete confirm modal & delete report
  const handleOpenDelete = (reportId: string) => {
    const found = reports.find((r) => r.id === reportId);
    setReportToDelete({ id: reportId, title: found?.title });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (reportId: string) => {
    try {
      setLoading(true);
      await api.deleteReport(reportId);
      setReports((prev) => prev.filter((r) => r.id !== reportId));
      if (selectedReportForDetail?.id === reportId) {
        setSelectedReportForDetail(null);
      }
      showToast(`Laporan ${reportId} berhasil dihapus dari sistem.`);
      setIsDeleteModalOpen(false);
    } catch (e: any) {
      console.error('Error deleting report:', e);
      showToast(e?.message || `Gagal menghapus: Anda bukan pemilik laporan ini.`);
      setIsDeleteModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  // Upvote report via API
  const handleUpvote = async (reportId: string) => {
    // Optimistic update
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          const isUpvoted = r.hasUpvoted;
          return {
            ...r,
            upvotes: isUpvoted ? Math.max(0, r.upvotes - 1) : r.upvotes + 1,
            hasUpvoted: !isUpvoted
          };
        }
        return r;
      })
    );

    setSelectedReportForDetail((prev) => {
      if (prev && prev.id === reportId) {
        const isUpvoted = prev.hasUpvoted;
        return {
          ...prev,
          upvotes: isUpvoted ? Math.max(0, prev.upvotes - 1) : prev.upvotes + 1,
          hasUpvoted: !isUpvoted
        };
      }
      return prev;
    });

    try {
      const updated = await api.toggleUpvote(reportId);
      if (updated) {
        setReports((prev) => prev.map((r) => (r.id === reportId ? updated : r)));
        if (selectedReportForDetail?.id === reportId) {
          setSelectedReportForDetail(updated);
        }
      }
    } catch (e) {
      console.error('Error toggling upvote:', e);
    }

    showToast('Terima kasih! Dukungan warga telah diperbarui.');
  };

  // Add comment via API
  const handleAddComment = async (reportId: string, author: string, role: string, text: string) => {
    const optimisticComment = {
      id: `c_${Date.now()}`,
      author: currentUser?.name || author,
      role,
      text,
      time: 'Baru saja'
    };

    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          return {
            ...r,
            comments: [...(r.comments || []), optimisticComment]
          };
        }
        return r;
      })
    );

    if (selectedReportForDetail?.id === reportId) {
      setSelectedReportForDetail((prev) =>
        prev ? { ...prev, comments: [...(prev.comments || []), optimisticComment] } : null
      );
    }

    try {
      const updated = await api.addComment(reportId, { 
        author: currentUser?.name || author, 
        role: currentUser ? `Warga ${currentUser.dusun}` : role, 
        text 
      });
      if (updated) {
        setReports((prev) => prev.map((r) => (r.id === reportId ? updated : r)));
        if (selectedReportForDetail?.id === reportId) {
          setSelectedReportForDetail(updated);
        }
      }
    } catch (e) {
      console.error('Error adding comment:', e);
    }

    showToast('Komentar warga berhasil dikirim.');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 flex flex-col font-body selection:bg-emerald-100 selection:text-emerald-900">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[80] bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <span className="material-symbols-outlined text-emerald-400 text-[20px]">
            notifications_active
          </span>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenAllReportsModal={(filterMyReports) => {
          setInitialFilterMyReports(!!filterMyReports);
          setIsAllReportsModalOpen(true);
        }}
        onOpenGisModal={() => setIsGisModalOpen(true)}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        onOpenAnnouncementModal={() => setIsAnnouncementModalOpen(true)}
        currentUser={currentUser}
        onOpenCitizenLogin={() => handleOpenCitizenLogin()}
        onLogoutCitizen={handleLogoutCitizen}
      />

      {/* Main Page Layout */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          onTrackTicket={handleTrackTicket}
        />

        {/* Quick Category Dispatch Grid */}
        <CategoryDispatch onSelectCategory={handleSelectCategory} />

        {/* Live Recent Reports */}
        <RecentReports
          reports={reports}
          onSelectReport={(r) => setSelectedReportForDetail(r)}
          onOpenAllReports={() => {
            setInitialFilterMyReports(false);
            setIsAllReportsModalOpen(true);
          }}
        />

        {/* Village Map & Standar SOP Section */}
        <MapAndSOP
          reports={reports}
          onSelectReport={(r) => setSelectedReportForDetail(r)}
          onOpenGisModal={() => setIsGisModalOpen(true)}
        />

        {/* Emergency Assistance Banner */}
        <EmergencyBanner onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)} />
      </main>

      {/* Footer */}
      <Footer
        onOpenAllReports={() => {
          setInitialFilterMyReports(false);
          setIsAllReportsModalOpen(true);
        }}
        onOpenGisModal={() => setIsGisModalOpen(true)}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        onOpenInfoModal={(title, content) => setInfoModal({ isOpen: true, title, content })}
      />

      {/* Modals Container */}
      {/* [C] CREATE REPORT MODAL */}
      <CreateReportModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        defaultCategory={createCategoryDefault}
        onSubmitReport={handleCreateReport}
        currentUser={currentUser}
        onOpenLoginModal={(prompt) => handleOpenCitizenLogin(prompt)}
      />

      {/* [R] ALL REPORTS DIRECTORY MODAL (equipped with quick Edit & Delete for owners) */}
      <AllReportsModal
        isOpen={isAllReportsModalOpen}
        onClose={() => setIsAllReportsModalOpen(false)}
        reports={reports}
        onSelectReport={(r) => {
          setIsAllReportsModalOpen(false);
          setSelectedReportForDetail(r);
        }}
        onOpenCreateModal={() => {
          setIsAllReportsModalOpen(false);
          setIsCreateModalOpen(true);
        }}
        onEditReport={handleOpenEdit}
        onDeleteReport={handleOpenDelete}
        currentUser={currentUser}
        initialFilterMyReports={initialFilterMyReports}
      />

      {/* [R] REPORT DETAIL MODAL (equipped with Edit & Delete triggers strictly for owners) */}
      <ReportDetailModal
        report={selectedReportForDetail}
        onClose={() => setSelectedReportForDetail(null)}
        onUpvote={handleUpvote}
        onAddComment={handleAddComment}
        onEditReport={handleOpenEdit}
        onDeleteReport={handleOpenDelete}
        currentUser={currentUser}
        onOpenCitizenLogin={(prompt) => handleOpenCitizenLogin(prompt)}
      />

      {/* [U] EDIT REPORT MODAL (rendered with z-[60] above detail modals) */}
      <EditReportModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setReportToEdit(null);
        }}
        report={reportToEdit}
        onUpdateReport={handleUpdateReport}
      />

      {/* [D] DELETE CONFIRM MODAL (rendered with z-[70] at top of all dialogs) */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setReportToDelete(null);
        }}
        reportId={reportToDelete?.id || null}
        reportTitle={reportToDelete?.title}
        onConfirmDelete={handleConfirmDelete}
      />

      {/* CITIZEN LOGIN & REGISTER MODAL (rendered with z-[65]) */}
      <CitizenLoginModal
        isOpen={isCitizenLoginModalOpen}
        onClose={() => setIsCitizenLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        promptMessage={citizenLoginPrompt}
      />

      {/* GIS MAP MODAL */}
      <GisMapModal
        isOpen={isGisModalOpen}
        onClose={() => setIsGisModalOpen(false)}
        reports={reports}
        onSelectReport={(r) => {
          setIsGisModalOpen(false);
          setSelectedReportForDetail(r);
        }}
      />

      {/* EMERGENCY CONTACTS MODAL */}
      <EmergencyContactsModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />

      {/* ANNOUNCEMENT MODAL */}
      <AnnouncementModal
        isOpen={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
        onOpenCreateModal={() => {
          setIsAnnouncementModalOpen(false);
          setIsCreateModalOpen(true);
        }}
      />

      {/* INFO MODAL */}
      <InfoModal
        isOpen={infoModal.isOpen}
        title={infoModal.title}
        content={infoModal.content}
        onClose={() => setInfoModal({ isOpen: false, title: '', content: '' })}
      />
    </div>
  );
}

// Mount to DOM
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<PenggunaApp />);
}
