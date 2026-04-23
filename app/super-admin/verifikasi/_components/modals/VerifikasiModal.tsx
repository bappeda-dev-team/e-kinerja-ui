// app/super-admin/verifikasi/_components/modals/VerifikasiModal.tsx

"use client"

import { useState } from "react"
import { X, CheckCircle, RotateCcw } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import type { VerifikasiItem } from "../VerifikasiClient"
import { Textarea } from "@/components/ui/textarea"

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

export default function VerifikasiModal({ data, onClose, onSave }: {
  data: VerifikasiItem
  onClose: () => void
  onSave: (i: VerifikasiItem) => void
}) {
  const [komentar, setKomentar] = useState(data.komentar ?? "")
  const isVerified = data.status === "terverifikasi"

  const statusMeta = getStatusMeta(data.status)

  function handleSave(status: VerifikasiItem["status"]) {
    if (status === "revisi" && !komentar.trim()) return
    onSave({ ...data, status, komentar: komentar.trim() })
  }

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

          <div className="border-t border-dashed border-gray-200 pt-3 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
              Komentar <span className="normal-case font-medium text-gray-300">(wajib untuk revisi)</span>
            </p>
            <Textarea
              value={komentar}
              onChange={(event) => setKomentar(event.target.value)}
              rows={4}
              disabled={isVerified}
              placeholder="Tulis komentar atau catatan untuk programmer..."
              className="min-h-[104px] resize-none rounded-xl border-gray-200 bg-white text-sm text-[#202224] placeholder:text-gray-300"
            />
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
          {!isVerified ? (
            <>
              <button
                type="button"
                onClick={() => handleSave("revisi")}
                disabled={!komentar.trim()}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-amber-300 bg-amber-50 py-2.5 text-sm font-bold text-amber-700 transition hover:bg-amber-100 disabled:opacity-50"
              >
                <RotateCcw className="w-4 h-4" />
                Revisi
              </button>
              <button
                type="button"
                onClick={() => handleSave("terverifikasi")}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#4880FF] py-2.5 text-sm font-bold text-white hover:bg-blue-600 transition"
              >
                <CheckCircle className="w-4 h-4" />
                Verifikasi
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gray-100 py-2.5 text-sm font-bold text-gray-400"
            >
              <CheckCircle className="w-4 h-4" />
              Sudah Diverifikasi
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
