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
