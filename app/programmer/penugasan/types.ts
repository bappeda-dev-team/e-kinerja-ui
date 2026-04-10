export interface PenugasanNamedEntity {
  id?: string
  name?: string
  logo?: string
}

export interface PenugasanDistribusi {
  id?: string
  pemda?: string | PenugasanNamedEntity
  aplikasi?: string | PenugasanNamedEntity
  komentar?: string
}

export interface PenugasanProgrammer {
  id?: string
  username?: string
  full_name?: string
  profile_picture?: string
}

export interface PenugasanResponse {
  id: string
  distribusi?: PenugasanDistribusi
  programmer?: PenugasanProgrammer
  created_at?: string
  updated_at?: string
}

export interface PenugasanItem {
  id: string
  distribusi_id: string
  nama_pemda: string
  aplikasi: string
  logo_pemda: string
  komentar: string
  programmer_nama: string
  programmer_username: string
  created_at?: string
  updated_at?: string
}
