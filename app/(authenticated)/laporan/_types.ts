export interface APIResponse<T> {
  status: number
  message: string
  data: T
}

export interface LaporanRequest {
  laporan_progress: string
  permintaan_id: string
}

export interface LaporanPermintaan {
  id: string
  pemda: string
  aplikasi: string
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
}

export interface LaporanResponse {
  id: string
  permintaan: LaporanPermintaan
  programmer: LaporanProgrammer
  laporan_progress: string
  status?: string
  created_at?: string
  updated_at?: string
}

export interface LaporanKinerjaItem {
  id: string
  laporan_progress: string
  permintaan: LaporanPermintaan
  programmer: LaporanProgrammer
  status?: string
  created_at?: string
}