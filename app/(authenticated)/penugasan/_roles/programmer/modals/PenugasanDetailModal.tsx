"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import {
  AlertTriangle,
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  Layers3,
  MessageSquareText,
  Paperclip,
  Pencil,
  Plus,
  UploadCloud,
  UserRound,
  X,
} from "lucide-react"
import { toast } from "sonner"
import type { PenugasanItem } from "@/types/penugasan"
import type { LaporanResponse } from "@/types/laporan"
import { createPenugasanLaporan } from "@/services/penugasan.service"
import { ajukanVerifikasi, updateLaporan } from "@/services/laporan.service"
import { mapStatusToProgress } from "@/app/(authenticated)/laporan/_roles/programmer/utils"

interface Props {
  open: boolean
  onClose: () => void
  item: PenugasanItem | null
  laporanList: LaporanResponse[]
  onRefresh: () => void
}

const ff = { fontFamily: "'Nunito Sans', sans-serif" }

type LaporanStatus = "pending" | "revision" | "approved"

const STATUS_CONFIG: Record<LaporanStatus, { label: string; badge: string; dot: string; icon: React.ReactNode }> = {
  pending:  { label: "Menunggu",  badge: "bg-amber-100 text-amber-700",  dot: "bg-amber-400",  icon: <Clock className="w-3 h-3" /> },
  revision: { label: "Revisi",    badge: "bg-red-100 text-red-700",      dot: "bg-red-400",    icon: <AlertTriangle className="w-3 h-3" /> },
  approved: { label: "Disetujui", badge: "bg-green-100 text-green-700",  dot: "bg-green-500",  icon: <CheckCircle2 className="w-3 h-3" /> },
}

const PROGRESS_BAR: Record<number, string> = {
  0: "bg-gray-300", 25: "bg-red-400", 50: "bg-orange-400", 75: "bg-yellow-400", 100: "bg-green-500",
}

const PROGRESS_LABEL: Record<number, { label: string; bar: string; text: string }> = {
  0:   { label: "0%",   bar: "bg-gray-300",    text: "text-gray-600" },
  25:  { label: "25%",  bar: "bg-red-400",     text: "text-red-600" },
  50:  { label: "50%",  bar: "bg-orange-400",  text: "text-orange-600" },
  75:  { label: "75%",  bar: "bg-yellow-400",  text: "text-yellow-700" },
  100: { label: "100%", bar: "bg-green-500",   text: "text-green-700" },
}

const PROGRESS_OPTIONS = [
  { value: 0,   label: "0%",   active: "bg-gray-200 text-gray-600",     inactive: "bg-[#F5F6FA] text-[#ABABAB]" },
  { value: 25,  label: "25%",  active: "bg-red-100 text-red-600",        inactive: "bg-[#F5F6FA] text-[#ABABAB]" },
  { value: 50,  label: "50%",  active: "bg-orange-100 text-orange-600",  inactive: "bg-[#F5F6FA] text-[#ABABAB]" },
  { value: 75,  label: "75%",  active: "bg-yellow-100 text-yellow-700",  inactive: "bg-[#F5F6FA] text-[#ABABAB]" },
  { value: 100, label: "100%", active: "bg-green-100 text-green-700",    inactive: "bg-[#F5F6FA] text-[#ABABAB]" },
]

type View = "penugasan" | "laporan-detail" | "laporan-edit" | "laporan-add"

function mapProgressToApiStatus(progress: number) {
  if (progress >= 100) return "100"
  if (progress >= 75) return "75"
  if (progress >= 50) return "50"
  if (progress >= 25) return "25"
  return "0"
}

function getLaporanStatus(laporan: LaporanResponse): LaporanStatus {
  const verif = Array.isArray(laporan.verifikasi) ? laporan.verifikasi[0] : laporan.verifikasi
  if (verif?.status_verified === "approved") return "approved"
  if (verif?.status_verified === "revision") return "revision"
  return "pending"
}

function getCatatanRevisor(laporan: LaporanResponse): string | undefined {
  const verif = Array.isArray(laporan.verifikasi) ? laporan.verifikasi[0] : laporan.verifikasi
  if (verif?.status_verified === "revision" && verif?.komentar) return verif.komentar
  return undefined
}

function formatDate(iso?: string) {
  if (!iso) return "-"
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
}

function entityLabel(value?: string | { name?: string }) {
  if (!value) return "-"
  return typeof value === "string" ? value : value.name || "-"
}

export default function PenugasanDetailModal({ open, onClose, item, laporanList, onRefresh }: Props) {
  const [view, setView] = useState<View>("penugasan")
  const [selectedLaporan, setSelectedLaporan] = useState<LaporanResponse | null>(null)
  const [submitLoading, setSubmitLoading] = useState(false)

  const [editProgress, setEditProgress] = useState("")
  const [editStatusProgress, setEditStatusProgress] = useState<number | null>(null)
  const [editLoading, setEditLoading] = useState(false)

  const [addProgress, setAddProgress] = useState("")
  const [addStatusProgress, setAddStatusProgress] = useState<number | null>(null)
  const [addAttachments, setAddAttachments] = useState<File[]>([])
  const [addLoading, setAddLoading] = useState(false)

  if (!item) return null

  const permintaanId = item.permintaan_id || ""
  const hasKomentar = Boolean(item.komentar?.trim())

  // Filter laporan yang terkait dengan penugasan ini (via permintaan_id)
  const myLaporan = laporanList
    .filter((l) => l.permintaan?.id === permintaanId || (l as any).permintaan_id === permintaanId)
    .sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())

  function resetAddForm() {
    setAddProgress("")
    setAddStatusProgress(null)
    setAddAttachments([])
    setAddLoading(false)
  }

  function handleModalClose() {
    setView("penugasan")
    setSelectedLaporan(null)
    resetAddForm()
    onClose()
  }

  function handleHeaderBack() {
    if (view === "laporan-edit") {
      setView("laporan-detail")
      return
    }
    if (view === "laporan-add") {
      resetAddForm()
    }
    setView("penugasan")
  }

  function openLaporanDetail(laporan: LaporanResponse) {
    setSelectedLaporan(laporan)
    setView("laporan-detail")
  }

  function openLaporanEdit() {
    if (!selectedLaporan) return
    setEditProgress(selectedLaporan.laporan_progress)
    setEditStatusProgress(mapStatusToProgress(selectedLaporan.status))
    setView("laporan-edit")
  }

  async function handleEditSave() {
    if (!editProgress.trim()) { toast.error("Jelaskan progres pekerjaan"); return }
    if (editStatusProgress === null) { toast.error("Pilih persentase progres"); return }
    if (!selectedLaporan) return
    if (!permintaanId) { toast.error("Permintaan laporan tidak ditemukan"); return }

    try {
      setEditLoading(true)
      const response = await updateLaporan(selectedLaporan.id, {
        laporan_progress: editProgress.trim(),
        permintaan_id: permintaanId,
        status: mapProgressToApiStatus(editStatusProgress),
        is_submitted_to_verified: selectedLaporan.is_submitted_to_verified,
      })
      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.data?.message || "Gagal memperbarui laporan")
      }
      toast.success("Laporan berhasil diperbarui")
      onRefresh()
      // Update selectedLaporan dari response jika tersedia
      const updated = response.data?.data
      if (updated) setSelectedLaporan(updated)
      setView("laporan-detail")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal memperbarui laporan")
    } finally {
      setEditLoading(false)
    }
  }

  function handleAddAttachmentChange(files: FileList | null) {
    if (!files?.length) return
    setAddAttachments((prev) => {
      const next = Array.from(files).filter(
        (file) => !prev.some((e) => e.name === file.name && e.size === file.size && e.lastModified === file.lastModified)
      )
      return [...prev, ...next]
    })
  }

  function handleRemoveAddAttachment(file: File) {
    setAddAttachments((prev) =>
      prev.filter((e) => !(e.name === file.name && e.size === file.size && e.lastModified === file.lastModified))
    )
  }

  async function handleAddSave() {
    if (!addProgress.trim()) { toast.error("Jelaskan progres pekerjaan yang sudah dilakukan"); return }
    if (addStatusProgress === null) { toast.error("Pilih persentase progres penyelesaian"); return }
    if (!permintaanId) { toast.error("Permintaan untuk penugasan ini tidak ditemukan"); return }

    try {
      setAddLoading(true)
      const formData = new FormData()
      formData.append("permintaan_id", permintaanId)
      formData.append("laporan_progress", addProgress.trim())
      formData.append("status", mapProgressToApiStatus(addStatusProgress))
      addAttachments.forEach((file) => formData.append("lampiran", file))

      const response = await createPenugasanLaporan(formData)
      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.data?.message || "Gagal menambahkan laporan")
      }

      toast.success("Laporan berhasil ditambahkan")
      resetAddForm()
      onRefresh()
      setView("penugasan")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menambahkan laporan")
    } finally {
      setAddLoading(false)
    }
  }

  const selectedStatus = selectedLaporan ? getLaporanStatus(selectedLaporan) : "pending"
  const selectedProgress = selectedLaporan ? mapStatusToProgress(selectedLaporan.status) : 0
  const canEdit =
    !!selectedLaporan &&
    selectedStatus !== "approved" &&
    (!selectedLaporan.is_submitted_to_verified || selectedStatus === "revision")

  const canSubmitVerifikasi =
    !!selectedLaporan &&
    selectedStatus !== "approved" &&
    (!selectedLaporan.is_submitted_to_verified || selectedStatus === "revision")

  async function handleSubmitVerifikasi() {
    if (!selectedLaporan || !canSubmitVerifikasi) return
    try {
      setSubmitLoading(true)
      const response = await ajukanVerifikasi(selectedLaporan.id)
      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.data?.message || "Gagal mengajukan verifikasi")
      }
      toast.success("Laporan berhasil diajukan ke verifikator")
      onRefresh()
      // Optimistically update selectedLaporan
      setSelectedLaporan({ ...selectedLaporan, is_submitted_to_verified: true })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal mengajukan verifikasi")
    } finally {
      setSubmitLoading(false)
    }
  }

  let headerTitle = item.nama_pemda
  let headerSub: string | null = item.aplikasi

  if (view === "laporan-detail" && selectedLaporan) {
    headerTitle = entityLabel(selectedLaporan.permintaan?.pemda) || item.nama_pemda
    const appName = entityLabel(selectedLaporan.permintaan?.aplikasi)
    const menu = selectedLaporan.permintaan?.menu
    headerSub = `${appName}${menu && menu !== "-" ? ` — ${menu}` : ""}`
  } else if (view === "laporan-edit") {
    headerTitle = "Edit Laporan"
    headerSub = null
  } else if (view === "laporan-add") {
    headerTitle = "Tambah Laporan"
    headerSub = null
  }

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) handleModalClose() }}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-[24px] border-none shadow-2xl max-h-[90vh] flex flex-col [&>button]:hidden">
        <VisuallyHidden><DialogTitle>{headerTitle}</DialogTitle></VisuallyHidden>

        {/* Header */}
        <div className="px-6 pt-6 pb-4 shrink-0 border-b border-gray-100">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              {view !== "penugasan" && (
                <button type="button" onClick={handleHeaderBack}
                  className="shrink-0 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition active:scale-95">
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div className="min-w-0">
                <p className="text-[18px] font-bold text-[#202224] leading-tight truncate" style={ff}>{headerTitle}</p>
                {headerSub && <p className="text-[13px] text-gray-500 font-medium mt-0.5 truncate" style={ff}>{headerSub}</p>}
              </div>
            </div>
            <button type="button" onClick={handleModalClose}
              className="shrink-0 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition active:scale-95">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── VIEW: Penugasan ─────────────────────────────────────────────── */}
        {view === "penugasan" && (
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
                <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                  <UserRound className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-medium uppercase tracking-wide">Programmer</span>
                </div>
                <p className="text-[13px] font-bold text-gray-900" style={ff}>{item.programmer_nama}</p>
                <p className="text-[11px] text-gray-500" style={ff}>{item.programmer_username}</p>
              </div>

              <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
                <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-medium uppercase tracking-wide">Ditugaskan</span>
                </div>
                <p className="text-[13px] font-bold text-gray-900" style={ff}>{formatDate(item.created_at)}</p>
              </div>

              {item.tanggal_deadline && (
                <div className="col-span-2 rounded-xl border border-red-100 bg-red-50/50 p-3">
                  <div className="flex items-center gap-1.5 text-red-400 mb-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-medium uppercase tracking-wide">Deadline</span>
                  </div>
                  <p className="text-[13px] font-bold text-red-700" style={ff}>{formatDate(item.tanggal_deadline)}</p>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-blue-50 p-2 text-blue-600 shrink-0"><Building2 className="h-4 w-4" /></div>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400" style={ff}>Pemda</p>
                    <p className="text-[13px] font-bold text-gray-900" style={ff}>{item.nama_pemda}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600 shrink-0"><Layers3 className="h-4 w-4" /></div>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400" style={ff}>Aplikasi</p>
                    <p className="text-[13px] font-bold text-gray-900" style={ff}>{item.aplikasi}</p>
                  </div>
                </div>
              </div>
            </div>

            {hasKomentar && (
              <div className="space-y-1.5">
                <p className="text-[12px] font-bold text-gray-700 flex items-center gap-1.5" style={ff}>
                  <MessageSquareText className="w-3.5 h-3.5 text-blue-500" />
                  Catatan Atasan
                </p>
                <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3 text-[13px] text-gray-700 leading-relaxed" style={ff}>
                  {item.komentar}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <p className="text-[13px] font-bold text-gray-900" style={ff}>
                History Laporan
                <span className="ml-2 text-[11px] font-semibold text-gray-400">({myLaporan.length})</span>
              </p>
              <button type="button" onClick={() => setView("laporan-add")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold text-white transition active:scale-95"
                style={{ backgroundColor: "#4880FF", ...ff }}>
                <Plus className="w-3.5 h-3.5" />
                Tambah Laporan
              </button>
            </div>

            {myLaporan.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-6 text-center">
                <p className="text-[13px] text-gray-400 font-medium" style={ff}>Belum ada laporan untuk penugasan ini.</p>
                <p className="text-[12px] text-gray-400 mt-1" style={ff}>Klik &quot;Tambah Laporan&quot; untuk membuat laporan pertama.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {myLaporan.map((laporan, idx) => {
                  const status = getLaporanStatus(laporan)
                  const cfg = STATUS_CONFIG[status]
                  const progress = mapStatusToProgress(laporan.status)
                  const barColor = PROGRESS_BAR[progress] ?? PROGRESS_BAR[0]

                  return (
                    <button key={laporan.id} type="button" onClick={() => openLaporanDetail(laporan)}
                      className="w-full text-left rounded-xl border border-gray-100 bg-white p-3.5 hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className="text-[11px] font-semibold text-gray-400" style={ff}>Laporan #{myLaporan.length - idx}</span>
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${cfg.badge}`} style={ff}>
                              {cfg.icon}
                              {cfg.label}
                            </span>
                            {!laporan.is_submitted_to_verified && (
                              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold bg-gray-100 text-gray-500" style={ff}>
                                Draft
                              </span>
                            )}
                          </div>
                          <p className="text-[12px] text-gray-700 leading-relaxed line-clamp-2" style={ff}>{laporan.laporan_progress}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                              <div className={`h-full rounded-full ${barColor}`} style={{ width: `${progress}%` }} />
                            </div>
                            <span className="text-[10px] font-bold text-gray-500 shrink-0" style={ff}>{progress}%</span>
                          </div>
                        </div>
                        <div className="text-[10px] text-gray-400 shrink-0 text-right pt-0.5" style={ff}>
                          {formatDate(laporan.created_at)}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── VIEW: Laporan Detail ───────────────────────────────────────── */}
        {view === "laporan-detail" && selectedLaporan && (() => {
          const progressInfo = PROGRESS_LABEL[selectedProgress] ?? PROGRESS_LABEL[0]
          const statusCfg = STATUS_CONFIG[selectedStatus]
          const catatanRevisor = getCatatanRevisor(selectedLaporan)
          const lampiran = selectedLaporan.lampiran ?? []
          const komentars = selectedLaporan.komentars ?? []

          return (
            <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-bold ${statusCfg.badge}`} style={ff}>
                  {statusCfg.icon}
                  {statusCfg.label}
                </span>
                {!selectedLaporan.is_submitted_to_verified && (
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-[12px] font-bold bg-gray-100 text-gray-500" style={ff}>
                    Draft
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-gray-600" style={ff}>Progress Penyelesaian</span>
                  <span className={`text-[13px] font-bold ${progressInfo.text}`} style={ff}>{progressInfo.label}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${progressInfo.bar}`} style={{ width: progressInfo.label }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400 mb-1" style={ff}>Dibuat</p>
                  <p className="text-[13px] font-bold text-gray-900" style={ff}>{formatDate(selectedLaporan.created_at)}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400 mb-1" style={ff}>Diperbarui</p>
                  <p className="text-[13px] font-bold text-gray-900" style={ff}>{formatDate(selectedLaporan.updated_at)}</p>
                </div>
                {selectedLaporan.permintaan?.tanggal_deadline && (
                  <div className="col-span-2 rounded-xl border border-gray-100 bg-gray-50/60 p-3">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400 mb-1" style={ff}>Deadline Permintaan</p>
                    <p className="text-[13px] font-bold text-gray-900" style={ff}>{formatDate(selectedLaporan.permintaan.tanggal_deadline)}</p>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <p className="text-[12px] font-bold text-gray-700" style={ff}>Catatan Progress</p>
                <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3 text-[13px] text-gray-700 leading-relaxed" style={ff}>
                  {selectedLaporan.laporan_progress || "Belum ada catatan progress."}
                </div>
              </div>

              {lampiran.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[12px] font-bold text-gray-700 flex items-center gap-1.5" style={ff}>
                    <Paperclip className="w-3.5 h-3.5 text-gray-500" />
                    Lampiran
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {lampiran.map((url, i) => (
                      <a key={i} href={url} target="_blank"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-[12px] font-semibold text-gray-700 hover:bg-blue-50 hover:border-blue-200 transition">
                        <FileText className="w-3.5 h-3.5" />
                        File {i + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {selectedStatus === "revision" && catatanRevisor && (
                <div className="space-y-1.5">
                  <p className="text-[12px] font-bold text-amber-700 flex items-center gap-1.5" style={ff}>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Catatan dari Verifikator
                  </p>
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[13px] text-amber-800 leading-relaxed" style={ff}>
                    {catatanRevisor}
                  </div>
                </div>
              )}

              {komentars.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[12px] font-bold text-gray-700 flex items-center gap-1.5" style={ff}>
                    <MessageSquareText className="w-3.5 h-3.5 text-blue-500" />
                    Komentar ({komentars.length})
                  </p>
                  <div className="space-y-2">
                    {komentars.map((k) => (
                      <div key={k.id} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                        {k.user?.full_name && (
                          <p className="text-[11px] font-bold text-gray-600 mb-1" style={ff}>{k.user.full_name}</p>
                        )}
                        <p className="text-[13px] text-gray-700 leading-relaxed" style={ff}>{k.komentar}</p>
                        {k.created_at && (
                          <p className="text-[10px] text-gray-400 mt-1" style={ff}>{formatDate(k.created_at)}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedStatus === "approved" && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  <p className="text-[12px] font-semibold text-green-700" style={ff}>
                    Laporan ini telah disetujui dan tidak dapat diubah.
                  </p>
                </div>
              )}

              {(canEdit || canSubmitVerifikasi) && (
                <div className="flex justify-end gap-3 pt-1">
                  {canSubmitVerifikasi && (
                    <button type="button" onClick={() => void handleSubmitVerifikasi()} disabled={submitLoading}
                      className="px-5 py-2 rounded-xl border border-emerald-200 bg-emerald-50 text-[13px] font-bold text-emerald-700 transition hover:bg-emerald-100 active:scale-95 disabled:opacity-50"
                      style={ff}>
                      {submitLoading ? "Mengajukan..." : "Ajukan Verifikasi"}
                    </button>
                  )}
                  {canEdit && (
                    <button type="button" onClick={openLaporanEdit}
                      className="px-5 py-2 rounded-xl text-[13px] font-bold text-white transition active:scale-95 flex items-center gap-2"
                      style={{ backgroundColor: "#4880FF", ...ff }}>
                      <Pencil className="w-3.5 h-3.5" />
                      {selectedStatus === "revision" ? "Perbaiki Laporan" : "Edit Laporan"}
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })()}

        {/* ── VIEW: Laporan Edit ─────────────────────────────────────────── */}
        {view === "laporan-edit" && selectedLaporan && (
          <div className="px-6 pb-6 pt-4 space-y-4 overflow-y-auto flex-1">
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#202224]" style={ff}>Permintaan</label>
              <div className="w-full flex items-center px-3 py-2 bg-gray-100 border border-[#D5D5D5] rounded-xl text-[13px] text-[#606060] cursor-not-allowed select-none" style={ff}>
                {`${entityLabel(selectedLaporan.permintaan?.pemda)} — ${entityLabel(selectedLaporan.permintaan?.aplikasi)}`}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#202224]" style={ff}>
                Progress <span className="text-red-500">*</span>
              </label>
              <textarea
                value={editProgress}
                onChange={(e) => setEditProgress(e.target.value)}
                rows={3}
                placeholder="Tuliskan perkembangan pekerjaan saat ini..."
                className="w-full bg-white border border-[#D5D5D5] rounded-xl px-3 py-2 text-[13px] text-[#202224] placeholder:text-[#ABABAB] focus:ring-2 focus:ring-[#4880FF]/10 focus:border-[#4880FF] resize-none outline-none transition"
                style={ff}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#202224]" style={ff}>
                Status Progress <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {PROGRESS_OPTIONS.map((opt) => (
                  <button key={opt.value} type="button" onClick={() => setEditStatusProgress(opt.value)}
                    className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all active:scale-95 ${editStatusProgress === opt.value ? opt.active : opt.inactive}`}
                    style={ff}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-1">
              <button type="button" onClick={() => setView("laporan-detail")}
                className="px-5 py-2 rounded-xl border border-[#D5D5D5] text-[13px] font-bold text-[#202224] hover:bg-gray-50 transition active:scale-95"
                style={ff}>
                Batal
              </button>
              <button type="button" onClick={handleEditSave} disabled={editLoading}
                className="px-7 py-2 rounded-xl text-[13px] font-bold text-white transition active:scale-95 disabled:opacity-50"
                style={{ backgroundColor: "#4880FF", ...ff }}>
                {editLoading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        )}

        {/* ── VIEW: Laporan Add ──────────────────────────────────────────── */}
        {view === "laporan-add" && (
          <div className="px-6 pb-6 pt-4 space-y-4 overflow-y-auto flex-1">
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#202224]" style={ff}>Permintaan</label>
              <div className="w-full flex items-center px-3 py-2 bg-gray-100 border border-[#D5D5D5] rounded-xl text-[13px] text-[#606060] cursor-not-allowed select-none" style={ff}>
                {`${item.nama_pemda} — ${item.aplikasi}`}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#202224]" style={ff}>
                Progress <span className="text-red-500">*</span>
              </label>
              <textarea
                value={addProgress}
                onChange={(e) => setAddProgress(e.target.value)}
                rows={3}
                placeholder="Tuliskan perkembangan pekerjaan saat ini..."
                className="w-full bg-white border border-[#D5D5D5] rounded-xl px-3 py-2 text-[13px] text-[#202224] placeholder:text-[#ABABAB] focus:ring-2 focus:ring-[#4880FF]/10 focus:border-[#4880FF] resize-none outline-none transition"
                style={ff}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#202224]" style={ff}>
                Status Progress <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {PROGRESS_OPTIONS.map((opt) => (
                  <button key={opt.value} type="button" onClick={() => setAddStatusProgress(opt.value)}
                    className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all active:scale-95 ${addStatusProgress === opt.value ? opt.active : opt.inactive}`}
                    style={ff}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#202224]" style={ff}>Lampiran (opsional)</label>
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer bg-gray-50 hover:bg-blue-50 hover:border-blue-300 transition group">
                <UploadCloud className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition mb-1" />
                <span className="text-[12px] font-semibold text-gray-500 group-hover:text-blue-600 transition" style={ff}>
                  Klik untuk pilih file
                </span>
                <input type="file" multiple className="hidden" onChange={(e) => handleAddAttachmentChange(e.target.files)} />
              </label>
              {addAttachments.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {addAttachments.map((file) => (
                    <div key={`${file.name}-${file.size}`}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-100 text-[11px] font-semibold text-blue-700">
                      <FileText className="w-3 h-3" />
                      <span className="max-w-[120px] truncate">{file.name}</span>
                      <button type="button" onClick={() => handleRemoveAddAttachment(file)}
                        className="ml-0.5 text-blue-400 hover:text-red-500 transition">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-1">
              <button type="button" onClick={() => { resetAddForm(); setView("penugasan") }}
                className="px-5 py-2 rounded-xl border border-[#D5D5D5] text-[13px] font-bold text-[#202224] hover:bg-gray-50 transition active:scale-95"
                style={ff}>
                Batal
              </button>
              <button type="button" onClick={handleAddSave} disabled={addLoading}
                className="px-7 py-2 rounded-xl text-[13px] font-bold text-white transition active:scale-95 disabled:opacity-50"
                style={{ backgroundColor: "#4880FF", ...ff }}>
                {addLoading ? "Menyimpan..." : "Simpan Laporan"}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
