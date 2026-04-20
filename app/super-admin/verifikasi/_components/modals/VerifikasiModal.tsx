// app/super-admin/verifikasi/_components/modals/VerifikasiModal.tsx

"use client"

import { useState } from "react"
import { X, CheckCircle, RotateCcw, Clock, MessageSquare } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import type { VerifikasiItem } from "../VerifikasiClient"
import KomentarModal from "./KomentarModal"

function formatTanggal(value?: string) {
  if (!value) return "-"
  return new Date(value).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
}

function getStatusMeta(status: VerifikasiItem["status"]) {
  if (status === "terverifikasi") return { label: "Terverifikasi", cls: "bg-teal-100 text-teal-600 border-teal-200" }
  if (status === "revisi") return { label: "Revisi", cls: "bg-red-100 text-red-600 border-red-200" }
  return { label: "Menunggu", cls: "bg-amber-100 text-amber-700 border-amber-200" }
}

function PemdaAvatar({ nama, logo }: { nama: string; logo?: string }) {
  if (logo) {
    return (
      <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
        <img src={logo} alt={nama} className="w-full h-full object-contain p-1" />
      </div>
    )
  }
  const initials = nama?.slice(0, 2).toUpperCase() ?? "PE"
  return (
    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-teal-400 to-blue-500 flex items-center justify-center shrink-0 shadow-sm">
      <span className="text-sm font-bold text-white">{initials}</span>
    </div>
  )
}


const STATUS_OPTIONS: { value: VerifikasiItem["status"]; label: string; icon: typeof CheckCircle; activeClass: string; ringClass: string }[] = [
  { value: "terverifikasi", label: "Terverifikasi", icon: CheckCircle, activeClass: "bg-teal-50 border-teal-400 text-teal-700", ringClass: "border-teal-400 bg-teal-400" },
  { value: "revisi", label: "Revisi", icon: RotateCcw, activeClass: "bg-red-50 border-red-400 text-red-600", ringClass: "border-red-400 bg-red-400" },
  { value: "menunggu", label: "Menunggu", icon: Clock, activeClass: "bg-amber-50 border-amber-400 text-amber-700", ringClass: "border-amber-400 bg-amber-400" },
]

export default function VerifikasiModal({ data, onClose, onSave }: {
  data: VerifikasiItem
  onClose: () => void
  onSave: (i: VerifikasiItem) => void
}) {
  const [status, setStatus] = useState(data.status)
  const [komentarOpen, setKomentarOpen] = useState(false)

  const statusMeta = getStatusMeta(data.status)

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl border-none shadow-2xl [&>button]:hidden">
        <VisuallyHidden><DialogTitle>Detail Verifikasi</DialogTitle></VisuallyHidden>

        {/* Header */}
        <div className="px-5 pt-4 pb-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PemdaAvatar nama={data.pemda_name} logo={data.pemda_logo} />
              <div className="min-w-0">
                <p className="font-bold text-[15px] text-[#202224] leading-snug">{data.pemda_name}</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  <span className="font-semibold">{data.aplikasi_name || "-"}</span>
                  {data.menu && <><span className="mx-1.5">•</span>{data.menu}</>}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setKomentarOpen(true)}
                className="relative rounded-xl border border-gray-200 p-2.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#4880FF] text-[10px] font-bold text-white">
                  3
                </span>
              </button>
              <button onClick={onClose} className="rounded-full p-1.5 text-gray-400 hover:text-gray-600 transition">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-3 overflow-y-auto max-h-[65vh]">
          {/* Status + Programmer + Deadline */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Status</p>
              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusMeta.cls}`}>
                {statusMeta.label}
              </span>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Programmer</p>
              <div className="flex items-center gap-1.5">
                {data.programmer_avatar && (
                  <img src={data.programmer_avatar} alt={data.programmer} className="w-5 h-5 rounded-full object-cover shrink-0" />
                )}
                <p className="text-sm font-semibold text-[#202224] truncate">{data.programmer || "-"}</p>
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Deadline</p>
              <p className="text-sm font-semibold text-[#202224]">{formatTanggal(data.tanggal_deadline)}</p>
            </div>
          </div>

          {/* Progress laporan */}
          {data.progres_deskripsi && (
            <div className="rounded-xl bg-orange-50 px-3 py-2.5 space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-orange-400">Progress Laporan</p>
              <p className="text-sm text-[#202224] leading-relaxed">{data.progres_deskripsi}</p>
            </div>
          )}

          {/* Tindakan verifikasi */}
          <div className="border-t border-dashed border-gray-200 pt-3 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Tindakan Verifikasi</p>
            <div className="grid grid-cols-3 gap-2">
              {STATUS_OPTIONS.map((opt) => {
                const Icon = opt.icon
                const isActive = status === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStatus(opt.value)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-2 py-2.5 text-xs font-semibold transition ${
                      isActive ? opt.activeClass : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 flex gap-2">
          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl border border-gray-200 text-sm font-semibold text-[#202224] hover:bg-gray-50 transition"
          >
            Batal
          </button>
          <button
            onClick={() => onSave({ ...data, status })}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#4880FF] text-sm font-bold text-white hover:bg-blue-600 transition"
          >
            <CheckCircle className="w-4 h-4" />
            Simpan
          </button>
        </div>

        {komentarOpen && <KomentarModal onClose={() => setKomentarOpen(false)} />}
      </DialogContent>
    </Dialog>
  )
}
