import type { VerifikasiResponse } from "./types"

export type VerifikasiStatus = "menunggu" | "revisi" | "terverifikasi"

export interface VerifikasiListItem {
  id: string
  status: VerifikasiStatus
  laporanId: string
  laporanStatus: string
  progress: string
  komentar: string
  verifikator: string
  programmer: string
  diajukanPada: string
  diperbaruiPada: string
  tanggalDeadline: string
  pemdaName: string
  pemdaLogo?: string
  aplikasiName: string
  menu: string
  permintaanId: string
}

export function mapVerifikasiStatus(item: VerifikasiResponse): VerifikasiStatus {
  if (item.status_verified === "approved") return "terverifikasi"
  if (item.status_verified === "revision") return "revisi"
  if (item.status_verified === "pending" && item.komentar) return "revisi"
  return "menunggu"
}

function getProgrammerLabel(item: VerifikasiResponse) {
  const programmer = item.laporan?.programmer

  if (programmer?.full_name?.trim()) return programmer.full_name
  if (programmer?.username?.trim()) return programmer.username
  if (programmer?.id?.trim()) return `Programmer ${programmer.id.slice(0, 8)}`

  return "Belum ada programmer"
}

function getVerifikatorLabel(item: VerifikasiResponse) {
  const verifikator = item.verifikator

  if (verifikator?.full_name?.trim()) return verifikator.full_name
  if (verifikator?.username?.trim()) return verifikator.username
  if (verifikator?.id?.trim()) return `Verifikator ${verifikator.id.slice(0, 8)}`

  return "-"
}

export function mapVerifikasiItem(item: VerifikasiResponse): VerifikasiListItem {
  return {
    id: item.id,
    status: mapVerifikasiStatus(item),
    laporanId: item.laporan?.id ?? "-",
    laporanStatus: item.laporan?.status ?? "-",
    progress: item.laporan?.laporan_progress ?? "-",
    komentar: item.komentar ?? "",
    verifikator: getVerifikatorLabel(item),
    programmer: getProgrammerLabel(item),
    diajukanPada: item.created_at,
    diperbaruiPada: item.updated_at,
    tanggalDeadline: item.permintaan?.tanggal_deadline ?? "",
    pemdaName: item.permintaan?.pemda?.name ?? "-",
    pemdaLogo: item.permintaan?.pemda?.logo,
    aplikasiName: item.permintaan?.aplikasi?.name ?? "-",
    menu: item.permintaan?.menu ?? "",
    permintaanId: item.permintaan?.id ?? "",
  }
}

export function formatDateLabel(value?: string) {
  if (!value) return "-"

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "-"

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)
}

export function formatDateTimeLabel(value?: string) {
  if (!value) return "-"

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "-"

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function getDeadlineTime(value?: string) {
  if (!value) return Number.POSITIVE_INFINITY

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return Number.POSITIVE_INFINITY

  return date.getTime()
}

export function isNearDeadline(value?: string) {
  if (!value) return false

  const deadlineTime = getDeadlineTime(value)
  if (!Number.isFinite(deadlineTime)) return false

  return deadlineTime - Date.now() < 7 * 24 * 60 * 60 * 1000
}

export function getStatusMeta(status: VerifikasiStatus) {
  if (status === "terverifikasi") {
    return {
      label: "Terverifikasi",
      badgeClass: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
      textClass: "text-emerald-600",
    }
  }

  if (status === "revisi") {
    return {
      label: "Perlu Revisi",
      badgeClass: "bg-red-50 text-red-700 ring-red-600/10",
      textClass: "text-red-600",
    }
  }

  return {
    label: "Menunggu",
    badgeClass: "bg-amber-50 text-amber-700 ring-amber-600/20",
    textClass: "text-amber-600",
  }
}
