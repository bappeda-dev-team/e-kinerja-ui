export type ReportStatus = "menunggu" | "revisi" | "terverifikasi"

export interface ProgrammerTaskItem {
  id: string
  pemda: string
  kategori: string
  alasan: string
  menu: string
  kondisiAwal: string
  kondisiDiharapkan: string
  progress: string
  programmer: string
  status: string
  statusLabel: ReportStatus
  deadline: string
  createdAt: string
  updatedAt: string
}

export interface DashboardSummary {
  total: number
  menunggu: number
  revisi: number
  terverifikasi: number
}
