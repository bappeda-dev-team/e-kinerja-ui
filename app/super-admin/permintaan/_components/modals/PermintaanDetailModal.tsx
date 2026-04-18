"use client"

import { useState } from "react"
import { X, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import type { PermintaanResponse } from "../../types"

function formatTgl(dateStr: string) {
  if (!dateStr) return "-"
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
}

function getStatusMeta(status?: string) {
  if (status === "terverifikasi") return { label: "Terverifikasi", cls: "bg-teal-100 text-teal-700 border-teal-200" }
  if (status === "revisi") return { label: "Revisi", cls: "bg-red-100 text-red-600 border-red-200" }
  if (status === "menunggu") return { label: "Menunggu", cls: "bg-amber-100 text-amber-700 border-amber-200" }
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
        <div className="px-6 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[17px] font-bold text-[#202224]">Detail Permintaan</p>
            <button onClick={onClose} className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition">
              <X className="w-4 h-4" />
            </button>
          </div>
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
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5 overflow-y-auto max-h-[65vh]">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Status</p>
              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusMeta.cls}`}>
                {statusMeta.label}
              </span>
            </div>
            {item.pembuat && (
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Programmer</p>
                <p className="text-sm font-semibold text-[#202224]">{item.pembuat.full_name || item.pembuat.username}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {item.tanggal_pesanan && (
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Tanggal Pesanan</p>
                <p className="text-sm font-semibold text-[#202224]">{formatTgl(item.tanggal_pesanan)}</p>
              </div>
            )}
            {item.tanggal_deadline && (
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Deadline</p>
                <p className={`text-sm font-semibold ${isDeadlineNear ? "text-red-500" : "text-[#202224]"}`}>
                  {formatTgl(item.tanggal_deadline)}
                </p>
              </div>
            )}
          </div>

          <div className="rounded-xl bg-orange-50 px-4 py-3 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wide text-orange-400">Kondisi Awal</p>
            <p className="text-sm text-[#202224] leading-relaxed">{item.kondisi_awal || "-"}</p>
          </div>

          <div className="rounded-xl bg-purple-50 px-4 py-3 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wide text-purple-400">Kondisi yang Diharapkan</p>
            <p className="text-sm text-[#202224] leading-relaxed">{item.kondisi_diharapkan || "-"}</p>
          </div>

          {item.lampiran && item.lampiran.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Lampiran Permintaan</p>
              <div className="flex flex-wrap gap-2">
                {item.lampiran.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold rounded-lg border border-blue-100 transition">
                    <FileText className="size-3.5 shrink-0" />
                    <span className="truncate max-w-[160px]">{getFileName(url)}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
          <button
            onClick={() => { onEdit(item); onClose() }}
            className="px-5 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-[#202224] hover:bg-gray-50 transition"
          >
            Edit
          </button>
          <button
            onClick={() => { onDelete(item.id); onClose() }}
            className="px-5 py-2 rounded-xl bg-red-500 text-sm font-semibold text-white hover:bg-red-600 transition"
          >
            Hapus
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
