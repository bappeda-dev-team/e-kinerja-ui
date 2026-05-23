export type KetepatanWaktu = "tepat_waktu" | "terlambat" | "lebih_awal"

export interface CreatePenilaianRequest {
  distribusi_id: string
  tingkat_keberhasilan: number
  ketepatan_waktu: KetepatanWaktu
  komentar?: string
  tanggal_selesai: string
}

export interface UpdatePenilaianRequest {
  tingkat_keberhasilan?: number
  ketepatan_waktu?: KetepatanWaktu
  komentar?: string
  tanggal_selesai?: string
}

export interface PenilaianResponse {
  id: string
  distribusi?: {
    id: string
    permintaan_id?: string
    menu?: string
  }
  penilai?: {
    id: string
    username: string
    full_name: string
  }
  tingkat_keberhasilan: number
  ketepatan_waktu?: KetepatanWaktu
  komentar?: string
  tanggal_selesai?: string
  created_at: string
  updated_at: string
}
