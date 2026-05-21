import type { LaporanResponse } from "@/types/laporan"
import type { ReportStatus } from "@/types/dashboard"

export function mapReportStatus(status?: string): ReportStatus {
  const normalized = status?.toLowerCase()
  if (normalized === "hijau" || normalized === "terverifikasi") return "terverifikasi"
  if (normalized === "kuning" || normalized === "merah" || normalized === "revisi") return "revisi"
  return "menunggu"
}

export function formatDate(value?: string) {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "-"
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

export function formatRelativeTime(value?: string) {
  if (!value) return "Waktu tidak diketahui"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Waktu tidak diketahui"
  const diffHours = Math.round((new Date().getTime() - date.getTime()) / (1000 * 60 * 60))
  if (diffHours < 1) return "Baru saja"
  if (diffHours < 24) return `${diffHours} jam lalu`
  const diffDays = Math.round(diffHours / 24)
  if (diffDays === 1) return "Kemarin"
  if (diffDays < 7) return `${diffDays} hari lalu`
  return formatDate(value)
}

export function getProgrammerName(item: LaporanResponse) {
  if (item.programmer?.full_name?.trim()) return item.programmer.full_name
  if (item.programmer?.username?.trim()) return item.programmer.username
  if (item.programmer?.id?.trim()) return `Programmer ${item.programmer.id.slice(0, 8)}`
  return "Belum ada programmer"
}
