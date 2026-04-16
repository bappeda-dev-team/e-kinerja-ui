// app/super-admin/laporan/types.ts

export type { ApiResponse } from "@/types/api"

export interface LaporanRequest {
  laporan_progress: string
  permintaan_id: string
  status?: string
  verifikasi_id?: string
  status_verified?: string
  is_submitted_to_verified?: boolean
}

export interface LaporanPermintaan {
  id: string
  pemda: {
    id: string
    name: string
    logo?: string
  } | string
  aplikasi: {
    id: string
    name: string
    logo?: string
  } | string
  menu: string
  kondisi_awal?: string
  kondisi_diharapkan?: string
  tanggal_pesanan?: string
  tanggal_deadline?: string
  lampiran?: string[]
}

export interface LaporanProgrammer {
  id: string
  username: string
  full_name: string
  profile_picture?: string
}

export interface LaporanVerifikasi {
  id: string
  komentar?: string | null
  status_verified?: string
}

export interface LaporanResponse {
  id: string
  permintaan: LaporanPermintaan
  programmer: LaporanProgrammer
  laporan_progress: string
  status?: string
  verifikasi?: LaporanVerifikasi[] | LaporanVerifikasi | null
  is_submitted_to_verified?: boolean
  created_at?: string
  updated_at?: string
}

export interface LaporanKinerjaItem {
  id: string
  laporan_progress: string
  permintaan: LaporanPermintaan
  programmer: LaporanProgrammer
  status?: string
  verifikasi?: LaporanVerifikasi[] | LaporanVerifikasi | null
  is_submitted_to_verified?: boolean
  created_at?: string
  updated_at?: string
  logo_pemda?: string
}
