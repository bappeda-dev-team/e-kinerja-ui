export interface DashboardPemda {
  id: string
  name: string
  logo?: string
}

export interface DashboardAplikasi {
  id: string
  name: string
}

export interface DashboardPembuat {
  id: string
  username: string
  full_name: string
}

export interface DashboardAdmin {
  id: string
  username: string
  full_name: string
}

export interface DashboardPelaksana {
  id: string
  username: string
  full_name: string
}

export interface DashboardProgrammer {
  id: string
  username: string
  full_name: string
}

export interface DashboardDistribusi {
  id: string
  admin?: DashboardAdmin
  pelaksana?: DashboardPelaksana[]
  catatan?: string
  created_at?: string
  updated_at?: string
}

export interface DashboardLaporan {
  id: string
  programmer?: DashboardProgrammer
  status?: string
  catatan?: string
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

export interface DashboardResponse {
  total_permintaan: number
  total_distribusi: number
  total_laporan: number
  permintaan: DashboardPermintaanItem[]
}
