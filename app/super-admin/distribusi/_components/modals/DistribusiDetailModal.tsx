// app/super-admin/distribusi/_components/modals/DistribusiDetailModal.tsx

"use client"

import { useState } from "react"
import { X, Pencil, Trash2, AlertTriangle, FileText, MessageCircle, CheckCircle } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import type { DistribusiItem } from "../DistribusiClient"
import { getStatusMeta, formatTgl, PemdaAvatar } from "../DistribusiUtils"

function getFileName(url: string) {
  return decodeURIComponent(url.split("/").pop()?.split("_").slice(-1)[0] ?? url)
}

function stringToColor(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return `hsl(${Math.abs(hash) % 360}, 55%, 48%)`
}

function initials(nama: string) {
  return nama.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()
}

interface Props {
  item: DistribusiItem | null
  onClose: () => void
  onEdit: (item: DistribusiItem) => void
  onDelete: (id: string) => void
  onShowKomentar: (item: DistribusiItem) => void
  onSelesai: (id: string) => void
}

export default function DistribusiDetailModal({ item, onClose, onEdit, onDelete, onShowKomentar, onSelesai }: Props) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [now] = useState(() => Date.now())

  if (!item) return null

  const statusMeta = getStatusMeta(item.status)
  const isDeadlineNear = item.deadline
    ? new Date(item.deadline).getTime() - now < 3 * 24 * 60 * 60 * 1000
    : false

  return (
    <Dialog open={!!item} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl border-none shadow-2xl [&>button]:hidden">
        <VisuallyHidden><DialogTitle>Detail Distribusi</DialogTitle></VisuallyHidden>

        {/* Header */}
        <div className="px-5 pt-4 pb-3 border-b border-gray-100">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-bold text-base text-[#202224]">Detail Distribusi</h2>
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

        {/* Pemda info */}
        <div className="px-5 pt-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <PemdaAvatar nama={item.nama_pemda} logo={item.logo_pemda} />
            <div className="min-w-0">
              <p className="font-bold text-[15px] text-[#202224] leading-snug">{item.nama_pemda}</p>
              <p className="text-sm text-gray-500 mt-0.5">
                <span className="font-semibold">{item.aplikasi}</span>
                {item.menu && <><span className="mx-1.5">·</span>{item.menu}</>}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-3 overflow-y-auto max-h-[55vh]">
          {/* Status + Programmer */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Status</p>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.badgeClass}`}>
                {statusMeta.label}
              </span>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Programmer</p>
              {item.programmer.length === 0 ? (
                <p className="text-sm font-semibold text-[#202224]">-</p>
              ) : item.programmer.length === 1 ? (
                <p className="text-sm font-semibold text-[#202224]">{item.programmer[0].nama}</p>
              ) : (
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center">
                    {item.programmer.slice(0, 3).map((p, i) => (
                      <div
                        key={p.id}
                        title={p.nama}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white border-2 border-white shrink-0"
                        style={{ background: stringToColor(p.nama), marginLeft: i === 0 ? 0 : -6 }}
                      >
                        {initials(p.nama)}
                      </div>
                    ))}
                    {item.programmer.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[9px] font-bold text-gray-600 border-2 border-white shrink-0" style={{ marginLeft: -6 }}>
                        +{item.programmer.length - 3}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{item.programmer.length} orang</span>
                </div>
              )}
            </div>
          </div>

          {/* Tanggal Pesanan + Deadline */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Tanggal Pesanan</p>
              <p className="text-sm font-semibold text-[#202224]">{item.created_at ? formatTgl(item.created_at) : "-"}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Deadline</p>
              <p className={`text-sm font-semibold ${isDeadlineNear ? "text-red-500" : "text-[#202224]"}`}>
                {item.deadline ? formatTgl(item.deadline) : "-"}
              </p>
            </div>
          </div>

          {/* Kondisi Awal */}
          <div className="rounded-xl bg-orange-50 px-3 py-2.5 space-y-0.5">
            <p className="text-[10px] font-bold uppercase tracking-wide text-orange-400">Kondisi Awal</p>
            <p className="text-sm text-[#202224] leading-relaxed">{item.awal || "-"}</p>
          </div>

          {/* Kondisi yang Diharapkan */}
          <div className="rounded-xl bg-purple-50 px-3 py-2.5 space-y-0.5">
            <p className="text-[10px] font-bold uppercase tracking-wide text-purple-400">Kondisi yang Diharapkan</p>
            <p className="text-sm text-[#202224] leading-relaxed">{item.target || "-"}</p>
          </div>

          {/* Lampiran Permintaan */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/50 overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-blue-100 bg-blue-50">
              <FileText className="size-3.5 text-blue-400 shrink-0" />
              <p className="text-[10px] font-bold uppercase tracking-wide text-blue-400">
                Lampiran Permintaan{item.lampiran.length > 0 ? ` · ${item.lampiran.length} file` : ""}
              </p>
            </div>
            {item.lampiran.length > 0 ? (
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
        <div className="px-5 py-3 border-t border-gray-100 flex gap-2">
          <button
            onClick={() => { onShowKomentar(item); onClose() }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-[#202224] hover:bg-gray-50 transition"
          >
            <MessageCircle className="w-4 h-4" />
            {item.komentars.length > 0 ? "Lihat Komentar" : "Tambah Komentar"}
          </button>
          <button
            onClick={() => { onSelesai(item.id); onClose() }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#4880FF] text-sm font-bold text-white hover:bg-blue-600 transition"
          >
            <CheckCircle className="w-4 h-4" />
            Tandai Selesai
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
                  <p className="font-bold text-[#202224] text-base">Hapus Distribusi?</p>
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
