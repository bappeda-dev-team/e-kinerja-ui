export interface PermintaanResponse {

  id: string

  pemda: string
  aplikasi: string
  menu: string

  kondisi_awal: string
  kondisi_diharapkan: string

  tanggal_pesanan?: string
  tanggal_deadline?: string

  lampiran?: any[]

  pembuat?: string

  created_at?: string
  updated_at?: string

}

export interface PermintaanRequest {

  pemda_id: string
  aplikasi_id: string
  menu: string

  kondisi_awal: string
  kondisi_diharapkan: string

  tanggal_pesanan?: string
  tanggal_deadline?: string

}