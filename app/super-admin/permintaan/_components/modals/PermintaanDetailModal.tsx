"use client"

import { useState } from "react"
import { X, FileText, Pencil, Trash2, ArrowRight, AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import type { PermintaanResponse } from "../../types"


function getStatusMeta(status?: string) {
  if (status === "terverifikasi" || status === "approved") return { label: status === "approved" ? "Approved" : "Terverifikasi", cls: "bg-green-100 text-green-700 border-green-200" }
  if (status === "revisi") return { label: "Revisi", cls: "bg-red-100 text-red-600 border-red-200" }
  if (status === "menunggu" || status === "pending") return { label: status === "pending" ? "Pending" : "Menunggu", cls: "bg-amber-100 text-amber-700 border-amber-200" }
  if (status === "proses") return { label: "Proses", cls: "bg-blue-100 text-blue-700 border-blue-200" }
  return { label: status ?? "—", cls: "bg-gray-100 text-gray-600 border-gray-200" }
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

function getFileName(url: string) {
  return decodeURIComponent(url.split("/").pop()?.split("_").slice(-1)[0] ?? url)
}

interface Props {
  item: PermintaanResponse | null
  onClose: () => void
  onEdit: (item: PermintaanResponse) => void
  onDelete: (id: string) => void
}

export default function PermintaanDetailModal({ item, onClose, onEdit, onDelete }: Props) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (!item) return null

  const statusMeta = getStatusMeta(item.status)
  const isDeadlineNear = item.tanggal_deadline
    ? new Date(item.tanggal_deadline).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000
    : false

  return (
    <Dialog open={!!item} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl border-none shadow-2xl [&>button]:hidden">
        <VisuallyHidden><DialogTitle>Detail Permintaan</DialogTitle></VisuallyHidden>

        {/* Header */}
        <div className="px-5 pt-4 pb-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PemdaAvatar nama={item.pemda?.name} logo={item.pemda?.logo} />
              <div className="min-w-0">
                <p className="font-bold text-[15px] text-[#202224] leading-snug">{item.pemda?.name}</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  <span className="font-semibold">{item.aplikasi?.name}</span>
                  {item.menu && <><span className="mx-1.5">•</span>{item.menu}</>}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => { onEdit(item); onClose() }}
                className="rounded-lg p-1.5 border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="rounded-lg p-1.5 border border-red-200 text-red-500 hover:bg-red-50 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button onClick={onClose} className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-3 overflow-y-auto max-h-[65vh]">
          <div className={`grid gap-3 ${item.pembuat ? "grid-cols-3" : "grid-cols-3"}`}>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Status</p>
              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusMeta.cls}`}>
                {statusMeta.label}
              </span>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Tanggal Pesanan</p>
              <p className="text-sm font-semibold text-[#202224]">{item.tanggal_pesanan ? new Date(item.tanggal_pesanan).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Deadline</p>
              <p className={`text-sm font-semibold ${isDeadlineNear ? "text-red-500" : "text-[#202224]"}`}>
                {item.tanggal_deadline ? new Date(item.tanggal_deadline).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"}
              </p>
            </div>
          </div>


          <div className="rounded-xl bg-orange-50 px-3 py-2.5 space-y-0.5">
            <p className="text-[10px] font-bold uppercase tracking-wide text-orange-400">Kondisi Awal</p>
            <p className="text-sm text-[#202224] leading-relaxed">{item.kondisi_awal || "-"}</p>
          </div>

          <div className="rounded-xl bg-purple-50 px-3 py-2.5 space-y-0.5">
            <p className="text-[10px] font-bold uppercase tracking-wide text-purple-400">Kondisi yang Diharapkan</p>
            <p className="text-sm text-[#202224] leading-relaxed">{item.kondisi_diharapkan || "-"}</p>
          </div>

          {/* Lampiran card — always shown */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/50 overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-blue-100 bg-blue-50">
              <FileText className="size-3.5 text-blue-400 shrink-0" />
              <p className="text-[10px] font-bold uppercase tracking-wide text-blue-400">
                Lampiran{item.lampiran && item.lampiran.length > 0 ? ` · ${item.lampiran.length} file` : ""}
              </p>
            </div>
            {item.lampiran && item.lampiran.length > 0 ? (
              <div className="divide-y divide-blue-100">
                {item.lampiran.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2 hover:bg-blue-100/60 transition group">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 group-hover:bg-blue-200 transition">
                      <FileText className="size-3.5 text-blue-500" />
                    </div>
                    <span className="text-sm font-medium text-blue-700 truncate">{getFileName(url)}</span>
                  </a>
                ))}
              </div>
            ) : (
              <p className="px-3 py-2.5 text-sm text-gray-400 italic">Tidak ada lampiran</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#4880FF] text-sm font-bold text-white hover:bg-blue-600 transition"
          >
            <ArrowRight className="w-4 h-4" />
            Distribusikan
          </button>
        </div>

        {/* Delete confirmation overlay */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center rounded-2xl z-10">
            <div className="bg-white rounded-2xl shadow-xl mx-4 p-6 w-full max-w-xs space-y-4">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="font-bold text-[#202224] text-base">Hapus Permintaan?</p>
                  <p className="text-sm text-gray-500 mt-1">Tindakan ini tidak dapat dibatalkan.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-[#202224] hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  onClick={() => { onDelete(item.id); setShowDeleteConfirm(false); onClose() }}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-sm font-semibold text-white hover:bg-red-600 transition"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
