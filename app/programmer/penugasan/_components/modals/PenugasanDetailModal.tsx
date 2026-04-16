// app/programmer/penugasan/_components/modals/PenugasanDetailModal.tsx
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertTriangle,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  Layers3,
  MessageSquareText,
  Plus,
  UserRound,
} from "lucide-react"
import { PenugasanItem } from "../../types"
import {
  MockLaporan,
  MockPermintaan,
  LaporanStatus,
  getLaporanByPenugasan,
  getPermintaanByPenugasan,
} from "@/app/programmer/laporan/data"
import AddLaporanModal from "./AddLaporanModal"
import LaporanDetailModal from "./LaporanDetailModal"

interface Props {
  open: boolean
  onClose: () => void
  item: PenugasanItem | null
  mockLaporan: MockLaporan[]
  onAddLaporan: (laporan: MockLaporan) => void
  onUpdateLaporan: (updated: MockLaporan) => void
}

const ff = { fontFamily: "'Nunito Sans', sans-serif" }

function formatDate(iso?: string) {
  if (!iso) return "-"
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
}

const STATUS_CONFIG: Record<LaporanStatus, { label: string; badge: string; dot: string; icon: React.ReactNode }> = {
  pending:  { label: "Menunggu",  badge: "bg-amber-100 text-amber-700",  dot: "bg-amber-400",  icon: <Clock className="w-3 h-3" /> },
  revision: { label: "Revisi",    badge: "bg-red-100 text-red-700",      dot: "bg-red-400",    icon: <AlertTriangle className="w-3 h-3" /> },
  approved: { label: "Disetujui", badge: "bg-green-100 text-green-700",  dot: "bg-green-500",  icon: <CheckCircle2 className="w-3 h-3" /> },
}

const PROGRESS_BAR: Record<number, string> = {
  0: "bg-gray-300", 25: "bg-red-400", 50: "bg-orange-400", 75: "bg-yellow-400", 100: "bg-green-500",
}

export default function PenugasanDetailModal({
  open,
  onClose,
  item,
  mockLaporan,
  onAddLaporan,
  onUpdateLaporan,
}: Props) {
  const [showAddLaporan, setShowAddLaporan] = useState(false)
  const [selectedLaporan, setSelectedLaporan] = useState<MockLaporan | null>(null)

  if (!item) return null

  const permintaan: MockPermintaan | undefined = getPermintaanByPenugasan(item.id)
  const laporanList = getLaporanByPenugasan(item.id, mockLaporan)
  const hasKomentar = Boolean(item.komentar?.trim())

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-[24px] border-none shadow-2xl max-h-[90vh] flex flex-col">

          {/* Header */}
          <DialogHeader className="px-6 pt-6 pb-4 shrink-0 border-b border-gray-100">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <DialogTitle className="text-[18px] font-bold text-[#202224] leading-tight truncate" style={ff}>
                  {item.nama_pemda}
                </DialogTitle>
                <p className="text-[13px] text-gray-500 font-medium mt-0.5 truncate" style={ff}>{item.aplikasi}</p>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      hasKomentar ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
                    }`}
                    style={ff}
                  >
                    <MessageSquareText className="w-3 h-3" />
                    {hasKomentar ? "Ada Catatan Atasan" : "Tanpa Catatan"}
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

            {/* Info grid */}
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

              {(item.tanggal_deadline ?? permintaan?.tanggal_deadline) && (
                <div className="col-span-2 rounded-xl border border-red-100 bg-red-50/50 p-3">
                  <div className="flex items-center gap-1.5 text-red-400 mb-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-medium uppercase tracking-wide">Deadline</span>
                  </div>
                  <p className="text-[13px] font-bold text-red-700" style={ff}>{formatDate(item.tanggal_deadline ?? permintaan?.tanggal_deadline)}</p>
                </div>
              )}
            </div>

            {/* Ringkasan tugas */}
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-blue-50 p-2 text-blue-600 shrink-0">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400" style={ff}>Pemda</p>
                    <p className="text-[13px] font-bold text-gray-900" style={ff}>{item.nama_pemda}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600 shrink-0">
                    <Layers3 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400" style={ff}>Aplikasi</p>
                    <p className="text-[13px] font-bold text-gray-900" style={ff}>{item.aplikasi}</p>
                  </div>
                </div>
              </div>
              {permintaan && (
                <div className="flex items-start gap-3 mt-3 pt-3 border-t border-gray-100">
                  <div className="rounded-lg bg-purple-50 p-2 text-purple-600 shrink-0">
                    <BriefcaseBusiness className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400" style={ff}>Menu / Permintaan</p>
                    <p className="text-[13px] font-bold text-gray-900" style={ff}>{permintaan.menu}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Catatan atasan */}
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

            {/* Divider + Tombol tambah laporan */}
            <div className="flex items-center justify-between pt-1">
              <p className="text-[13px] font-bold text-gray-900" style={ff}>
                History Laporan
                <span className="ml-2 text-[11px] font-semibold text-gray-400">({laporanList.length})</span>
              </p>
              <button
                type="button"
                onClick={() => setShowAddLaporan(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold text-white transition active:scale-95"
                style={{ backgroundColor: "#4880FF", ...ff }}
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Laporan
              </button>
            </div>

            {/* List laporan */}
            {laporanList.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-6 text-center">
                <p className="text-[13px] text-gray-400 font-medium" style={ff}>Belum ada laporan untuk penugasan ini.</p>
                <p className="text-[12px] text-gray-400 mt-1" style={ff}>Klik "Tambah Laporan" untuk membuat laporan pertama.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {laporanList.map((laporan, idx) => {
                  const cfg = STATUS_CONFIG[laporan.status]
                  const barColor = PROGRESS_BAR[laporan.status_progress] ?? PROGRESS_BAR[0]

                  return (
                    <button
                      key={laporan.id}
                      type="button"
                      onClick={() => setSelectedLaporan(laporan)}
                      className="w-full text-left rounded-xl border border-gray-100 bg-white p-3.5 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className="text-[11px] font-semibold text-gray-400" style={ff}>Laporan #{laporanList.length - idx}</span>
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${cfg.badge}`} style={ff}>
                              {cfg.icon}
                              {cfg.label}
                            </span>
                            {!laporan.is_sent && (
                              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold bg-gray-100 text-gray-500" style={ff}>
                                Draft
                              </span>
                            )}
                          </div>
                          <p className="text-[12px] text-gray-700 leading-relaxed line-clamp-2" style={ff}>
                            {laporan.laporan_progress}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${barColor}`}
                                style={{ width: `${laporan.status_progress}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-bold text-gray-500 shrink-0" style={ff}>{laporan.status_progress}%</span>
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
        </DialogContent>
      </Dialog>

      {/* Tambah laporan modal */}
      <AddLaporanModal
        open={showAddLaporan}
        onClose={() => setShowAddLaporan(false)}
        penugasanId={item.id}
        permintaan={permintaan}
        onSave={(laporan) => {
          onAddLaporan(laporan)
          setShowAddLaporan(false)
        }}
      />

      {/* Detail laporan modal */}
      <LaporanDetailModal
        open={!!selectedLaporan}
        onClose={() => setSelectedLaporan(null)}
        laporan={selectedLaporan}
        permintaan={selectedLaporan ? getPermintaanByPenugasan(selectedLaporan.penugasan_id) : undefined}
        onUpdate={(updated) => {
          onUpdateLaporan(updated)
          setSelectedLaporan(updated)
        }}
      />
    </>
  )
}
