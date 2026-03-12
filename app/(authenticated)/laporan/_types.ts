export interface APIResponse<T> {
  status: number
  message: string
  data: T
}

export interface LaporanRequest {
  laporan_progress: string
  permintaan_id: string
}

export interface LaporanResponse {
  id: string
  laporan_progress: string
  permintaan_id: string
  programmer_id?: string
  created_at?: string
  updated_at?: string
}

export interface LaporanKinerjaItem {
  id: string
  laporan_progress: string
  permintaan_id: string
  programmer_id?: string
  created_at?: string
}