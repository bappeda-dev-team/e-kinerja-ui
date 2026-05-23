
export interface DashboardPemda {
  id: string
  name: string
  logo?: string
}

export interface DashboardAplikasi {
  id: string
  name: string
  logo?: string
}

export interface DashboardPembuat {
  id: string
  username: string
  full_name: string
  profile_picture?: string
}

export interface DashboardAdmin {
  id: string
  username: string
  full_name: string
  profile_picture?: string
}

export interface DashboardPelaksana {
  id: string
  username: string
  full_name: string
  profile_picture?: string
}

export interface DashboardProgrammer {
  id: string
  username: string
  full_name: string
  profile_picture?: string
}

export interface DashboardDistribusi {
  id: string
  admin?: DashboardAdmin
  pelaksana?: DashboardPelaksana[]
  komentar?: string
  created_at?: string
  updated_at?: string
}

export interface DashboardLaporan {
  id: string
  programmer?: DashboardProgrammer
  laporan_progress?: string
  status?: string
  status_verified?: string
  is_submitted_to_verified?: boolean
  created_at?: string
  updated_at?: string
}

export interface DashboardPermintaanItem {
  id: string
  pemda: DashboardPemda
  aplikasi: DashboardAplikasi
  menu: string
  kondisi_awal: string
  kondisi_diharapkan: string
  tanggal_pesanan?: string
  tanggal_deadline?: string
  status?: string
  pembuat?: DashboardPembuat
  distribusi?: DashboardDistribusi[]
  laporan?: DashboardLaporan[]
  created_at?: string
  updated_at?: string
}

// ─── Dashboard response per role (dari GET /dashboard) ────────

export interface SuperAdminDashboardResponse {
  total_permintaan: number
  total_distribusi: number
  total_laporan: number
  permintaan: DashboardPermintaanItem[]
}

// Alias lama agar tidak breaking DashboardClient super-admin
export type DashboardResponse = SuperAdminDashboardResponse

export interface AdminDashboardResponse {
  total_permintaan: number
  total_distribusi: number
  total_pelaksana: number
  permintaan: DashboardPermintaanItem[]
}

export interface ProgrammerDashboardPenugasan {
  id: string
  distribusi_pelaksana_id?: string
  judul: string
  deskripsi?: string
  deadline?: string
  prioritas?: "low" | "medium" | "high"
  estimasi_hari?: number
  urutan?: number
  status?: "belum_mulai" | "sedang_berjalan" | "selesai" | "revisi"
  created_at?: string
  updated_at?: string
}

export interface ProgrammerDashboardLaporan {
  id: string
  laporan_progress?: string
  status?: string
  status_verified?: string
  is_submitted_to_verified?: boolean
  programmer?: DashboardProgrammer
  permintaan?: {
    id: string
    pemda?: DashboardPemda | string
    aplikasi?: DashboardAplikasi | string
    menu?: string
    kondisi_awal?: string
    kondisi_diharapkan?: string
    tanggal_deadline?: string
  }
  created_at?: string
  updated_at?: string
}

export interface ProgrammerDashboardResponse {
  total_penugasan: number
  total_laporan: number
  penugasan: ProgrammerDashboardPenugasan[]
  laporan: ProgrammerDashboardLaporan[]
}

export interface VerifikatorDashboardLaporan {
  id: string
  laporan_progress?: string
  status?: string
  status_verified?: string
  is_submitted_to_verified?: boolean
  permintaan?: {
    id: string
    pemda?: DashboardPemda | string
    aplikasi?: DashboardAplikasi | string
    menu?: string
    tanggal_deadline?: string
  }
  programmer?: DashboardProgrammer
  created_at?: string
  updated_at?: string
}

export interface VerifikatorDashboardResponse {
  total_menunggu: number
  total_revisi: number
  total_terverifikasi: number
  laporan: VerifikatorDashboardLaporan[]
}

// ─── Activity feed (dari GET /dashboard/activity) ─────────────

export interface DashboardActivityItem {
  id?: string
  event_type: string
  description?: string
  created_at: string
  // payload bervariasi per event_type
  [key: string]: unknown
}

export interface DashboardActivityResponse {
  activities: DashboardActivityItem[]
}

// ─── UI types ─────────────────────────────────────────────────

export interface AdminPermintaanItem {
  id: string
  nama_pemda: string
  logo_pemda?: string
  aplikasi: string
  menu: string
  deadline: string
  sudahDistribusi: boolean
  distribusiId?: string
  programmers: string[]
  updatedAt: string
}

export interface AdminDashboardSummary {
  total: number
  sudahDistribusi: number
  belumDistribusi: number
}

export type ReportStatus = "pending" | "revision" | "approved"

export interface ProgrammerTaskItem {
  id: string
  pemda: string
  kategori: string
  alasan: string
  menu: string
  kondisiAwal: string
  kondisiDiharapkan: string
  progress: string
  programmer: string
  status: string
  statusLabel: ReportStatus
  deadline: string
  createdAt: string
  updatedAt: string
}

export interface ProgrammerDashboardSummary {
  total: number
  pending: number
  revision: number
  approved: number
}

export interface ProgrammerPenugasanSummary {
  total: number
  belum_mulai: number
  sedang_berjalan: number
  selesai: number
  revisi: number
}

export type { ProgrammerDashboardSummary as DashboardSummary }
