export interface PenugasanNamedEntity {
  id?: string
  name?: string
  logo?: string
}

export interface PenugasanPermintaan {
  id?: string
  tanggal_deadline?: string
}

export interface PenugasanDistribusi {
  id?: string
  permintaan_id?: string
  pemda?: string | PenugasanNamedEntity
  aplikasi?: string | PenugasanNamedEntity
  komentar?: string
  permintaan?: PenugasanPermintaan
}

export interface PenugasanProgrammer {
  id?: string
  username?: string
  full_name?: string
  profile_picture?: string
}

// distribusi_pelaksana — notifikasi penugasan ke programmer
export interface PelaksanaResponse {
  id: string
  distribusi?: PenugasanDistribusi
  programmer?: PenugasanProgrammer
  is_read?: boolean
  created_at?: string
  updated_at?: string
}

// Alias lama agar tidak breaking komponen yang sudah pakai PenugasanResponse
export type PenugasanResponse = PelaksanaResponse

export interface PenugasanItem {
  id: string
  distribusi_id: string
  permintaan_id: string
  nama_pemda: string
  aplikasi: string
  logo_pemda: string
  komentar: string
  programmer_nama: string
  programmer_username: string
  tanggal_deadline?: string
  is_read?: boolean
  created_at?: string
  updated_at?: string
}

// penugasan — detail tugas yang dibuat admin per distribusi_pelaksana
export type PenugasanPrioritas = "low" | "medium" | "high"
export type PenugasanStatus = "belum_mulai" | "sedang_berjalan" | "selesai" | "revisi"

export interface PenugasanDetail {
  id: string
  distribusi_pelaksana_id?: string
  judul: string
  deskripsi?: string
  deadline?: string
  prioritas?: PenugasanPrioritas
  estimasi_hari?: number
  urutan?: number
  status?: PenugasanStatus
  programmer?: PenugasanProgrammer
  created_at?: string
  updated_at?: string
}

export interface PenugasanDetailRequest {
  distribusi_pelaksana_id: string
  judul: string
  deskripsi?: string
  deadline?: string
  prioritas?: PenugasanPrioritas
  estimasi_hari?: number
  urutan?: number
  status?: PenugasanStatus
}

export interface UpdatePenugasanStatusRequest {
  status: PenugasanStatus
}

export interface ReassignPenugasanRequest {
  distribusi_pelaksana_id: string
}
