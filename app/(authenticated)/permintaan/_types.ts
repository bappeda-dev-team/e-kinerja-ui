export interface PermintaanPemda {
  id: string
  name: string
}

export interface PermintaanAplikasi {
  id: string
  name: string
}

export interface PermintaanPembuat {
  id: string
  username: string
  full_name: string
}

export interface PermintaanResponse {

  id: string

  pemda: PermintaanPemda
  aplikasi: PermintaanAplikasi
  menu: string

  kondisi_awal: string
  kondisi_diharapkan: string

  tanggal_pesanan?: string
  tanggal_deadline?: string

  lampiran?: string[]

  pembuat?: PermintaanPembuat

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