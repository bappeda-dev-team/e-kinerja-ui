// app/programmer/penugasan/_components/modals/LaporanDetailModal.tsx
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertTriangle, CheckCircle2, Clock, Pencil } from "lucide-react"
import { MockLaporan, MockPermintaan, LaporanStatus } from "@/app/programmer/laporan/data"
import EditLaporanModal from "./EditLaporanModal"

interface Props {
  open: boolean
  onClose: () => void
  laporan: MockLaporan | null
  permintaan: MockPermintaan | undefined
  onUpdate: (updated: MockLaporan) => void
}

const ff = { fontFamily: "'Nunito Sans', sans-serif" }

function formatDate(iso?: string) {
  if (!iso) return "-"
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
}

const PROGRESS_LABEL: Record<number, { label: string; bar: string; text: string }> = {
  0:   { label: "0%",   bar: "bg-gray-300",    text: "text-gray-600" },
  25:  { label: "25%",  bar: "bg-red-400",     text: "text-red-600" },
  50:  { label: "50%",  bar: "bg-orange-400",  text: "text-orange-600" },
  75:  { label: "75%",  bar: "bg-yellow-400",  text: "text-yellow-700" },
  100: { label: "100%", bar: "bg-green-500",   text: "text-green-700" },
}

const STATUS_CONFIG: Record<LaporanStatus, { label: string; badge: string; icon: React.ReactNode }> = {
  pending:  { label: "Menunggu Verifikasi", badge: "bg-amber-100 text-amber-700",   icon: <Clock className="w-3.5 h-3.5" /> },
  revision: { label: "Perlu Revisi",        badge: "bg-red-100 text-red-700",       icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  approved: { label: "Disetujui",           badge: "bg-green-100 text-green-700",   icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
}

export default function LaporanDetailModal({ open, onClose, laporan, permintaan, onUpdate }: Props) {
  const [showEdit, setShowEdit] = useState(false)

  if (!laporan) return null

  const progressInfo = PROGRESS_LABEL[laporan.status_progress] ?? PROGRESS_LABEL[0]
  const statusCfg = STATUS_CONFIG[laporan.status]

  // Tombol edit tampil jika: is_sent = false ATAU status = revision
  // Tombol edit tidak tampil jika: status = approved
  const canEdit = laporan.status !== "approved" && (!laporan.is_sent || laporan.status === "revision")

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-[24px] border-none shadow-2xl max-h-[90vh] flex flex-col">
          <DialogHeader className="px-6 pt-6 pb-4 flex flex-row items-center justify-between shrink-0 border-b border-gray-100">
            <div className="flex flex-col gap-1 min-w-0">
              <DialogTitle className="text-[17px] font-bold text-[#202224] truncate" style={ff}>
                {permintaan?.pemda ?? "Detail Laporan"}
              </DialogTitle>
              {permintaan && (
                <p className="text-[12px] text-gray-500 font-medium truncate" style={ff}>
                  {permintaan.aplikasi} — {permintaan.menu}
                </p>
              )}
            </div>
          </DialogHeader>

          <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">

            {/* Status badge */}
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-bold ${statusCfg.badge}`}
                style={ff}
              >
                {statusCfg.icon}
                {statusCfg.label}
              </span>
              {!laporan.is_sent && (
                <span className="inline-flex items-center rounded-full px-3 py-1 text-[12px] font-bold bg-gray-100 text-gray-500" style={ff}>
                  Draft
                </span>
              )}
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-gray-600" style={ff}>Progress Penyelesaian</span>
                <span className={`text-[13px] font-bold ${progressInfo.text}`} style={ff}>{progressInfo.label}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${progressInfo.bar}`}
                  style={{ width: progressInfo.label }}
                />
              </div>
            </div>

            {/* Tanggal */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
                <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400 mb-1" style={ff}>Dibuat</p>
                <p className="text-[13px] font-bold text-gray-900" style={ff}>{formatDate(laporan.created_at)}</p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
                <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400 mb-1" style={ff}>Diperbarui</p>
                <p className="text-[13px] font-bold text-gray-900" style={ff}>{formatDate(laporan.updated_at)}</p>
              </div>
              {permintaan?.tanggal_deadline && (
                <div className="col-span-2 rounded-xl border border-gray-100 bg-gray-50/60 p-3">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400 mb-1" style={ff}>Deadline Permintaan</p>
                  <p className="text-[13px] font-bold text-gray-900" style={ff}>{formatDate(permintaan.tanggal_deadline)}</p>
                </div>
              )}
            </div>

            {/* Deskripsi progress */}
            <div className="space-y-1.5">
              <p className="text-[12px] font-bold text-gray-700" style={ff}>Catatan Progress</p>
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3 text-[13px] text-gray-700 leading-relaxed" style={ff}>
                {laporan.laporan_progress || "Belum ada catatan progress."}
              </div>
            </div>

            {/* Catatan revisor — hanya jika revision */}
            {laporan.status === "revision" && laporan.catatan_revisor && (
              <div className="space-y-1.5">
                <p className="text-[12px] font-bold text-amber-700 flex items-center gap-1.5" style={ff}>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Catatan dari Verifikator
                </p>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[13px] text-amber-800 leading-relaxed" style={ff}>
                  {laporan.catatan_revisor}
                </div>
              </div>
            )}

            {/* Approved notice */}
            {laporan.status === "approved" && (
              <div className="rounded-xl border border-green-200 bg-green-50 p-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <p className="text-[12px] font-semibold text-green-700" style={ff}>
                  Laporan ini telah disetujui dan tidak dapat diubah.
                </p>
              </div>
            )}

            {/* Tombol aksi */}
            <div className="flex justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl border border-[#D5D5D5] text-[13px] font-bold text-[#202224] hover:bg-gray-50 transition active:scale-95"
                style={ff}
              >
                Tutup
              </button>
              {canEdit && (
                <button
                  type="button"
                  onClick={() => setShowEdit(true)}
                  className="px-5 py-2 rounded-xl text-[13px] font-bold text-white transition active:scale-95 flex items-center gap-2"
                  style={{ backgroundColor: "#4880FF", ...ff }}
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit Laporan
                </button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit modal — nested */}
      <EditLaporanModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        laporan={laporan}
        permintaan={permintaan}
        onSave={(updated) => {
          onUpdate(updated)
          setShowEdit(false)
        }}
      />
    </>
  )
}
