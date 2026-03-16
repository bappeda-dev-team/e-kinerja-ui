"use client"

import * as React from "react"
import { useState } from "react"
import { MoreVertical, Pencil, Trash2, X, FileText, ChevronLeft, ChevronRight } from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog"
import type { PermintaanResponse } from "../_types"

interface Props {
  data: PermintaanResponse[]
  showTable: boolean
  onEdit: (item: PermintaanResponse) => void
  onDelete: (id: string) => void
}

function formatTgl(dateStr: string) {
  if (!dateStr) return "-"
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
}

// ✅ Avatar dengan Logic Fallback yang sama dengan Distribusi
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

function InlineBadge({ label, color }: { label: string; color: "orange" | "green" }) {
  const styles = {
    orange: "bg-orange-100/60 text-orange-500",
    green: "bg-green-100/60 text-green-600",
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold shrink-0 ${styles[color]}`}>
      {label}
    </span>
  )
}

// ✅ Helpers untuk Lampiran
function isImage(url: string) {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
}

function getFileName(url: string) {
  return decodeURIComponent(url.split("/").pop()?.split("_").slice(-1)[0] ?? url)
}

// ✅ Lightbox Modal yang identik
function LightboxModal({ urls, initialIndex, onClose }: { urls: string[]; initialIndex: number; onClose: () => void }) {
  const [current, setCurrent] = useState(initialIndex)
  const url = urls[current]
  return (
    <div className="fixed inset-0 bg-black/80 z-100 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-10 right-0 text-white hover:text-gray-300 transition">
          <X className="size-6" />
        </button>
        {isImage(url) ? (
          <img src={url} alt="Preview" className="w-full max-h-[80vh] object-contain rounded-xl" />
        ) : (
          <div className="bg-white rounded-xl p-8 text-center">
            <FileText className="size-16 text-gray-400 mx-auto mb-3" />
            <p className="font-semibold text-[#202224] mb-4">{getFileName(url)}</p>
            <a href={url} target="_blank" rel="noopener noreferrer"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition">
              Buka File
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

// ✅ Lampiran Section yang identik
function LampiranSection({ lampiran }: { lampiran: string[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  if (!lampiran || lampiran.length === 0) return null
  return (
    <>
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-[#202224]/50">Lampiran</p>
        <div className="flex flex-wrap gap-1.5">
          {lampiran.map((url, i) =>
            isImage(url) ? (
              <button key={i} onClick={() => setLightboxIndex(i)}
                className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200 hover:border-blue-400 transition group">
                <img src={url} alt="lampiran" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
              </button>
            ) : (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold rounded-lg transition border border-blue-100">
                <FileText className="size-3.5" />
                <span className="max-w-[100px] truncate">{getFileName(url)}</span>
              </a>
            )
          )}
        </div>
      </div>
      {lightboxIndex !== null && (
        <LightboxModal urls={lampiran} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </>
  )
}

function PermintaanCard({ item, onEdit, onDelete }: { item: PermintaanResponse; onEdit: any; onDelete: any }) {
  return (
    <div className="bg-white rounded-2xl shadow-[6px_6px_54px_rgba(0,0,0,0.05)] p-4 space-y-3 border border-gray-50">
      <div className="flex items-start gap-3">
        <PemdaAvatar nama={item.pemda?.name} logo={item.pemda?.logo} />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-[#202224] leading-snug">{item.pemda?.name}</p>
          <p className="text-xs text-[#797A7C] mt-0.5">
            <span className="font-semibold">{item.aplikasi?.name}</span>
            <span className="mx-1">·</span>
            {item.menu}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 rounded hover:bg-gray-100 transition shrink-0">
              <MoreVertical className="size-4 text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={() => onEdit(item)}>
              <Pencil className="size-3.5 mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(item.id)} className="text-red-500">
              <Trash2 className="size-3.5 mr-2" /> Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="border-t border-black/5" />
      
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <InlineBadge label="Awal" color="orange" />
          <p className="text-xs text-[#797A7C] leading-relaxed">{item.kondisi_awal}</p>
        </div>
        <div className="flex items-start gap-2">
          <InlineBadge label="Target" color="green" />
          <p className="text-xs text-[#797A7C] leading-relaxed">{item.kondisi_diharapkan}</p>
        </div>
      </div>

      {item.lampiran && item.lampiran.length > 0 && (
        <>
          <div className="border-t border-black/5" />
          <LampiranSection lampiran={item.lampiran} />
        </>
      )}

      <p className="text-xs font-bold text-red-500">
        Deadline: <span className="font-normal">{formatTgl(item.tanggal_deadline || "")}</span>
      </p>
    </div>
  )
}

export default function PermintaanTable({ data, showTable, onEdit, onDelete }: Props) {
  const [deleteId, setDeleteId] = useState<string | null>(null)

  if (showTable) {
    return (
      <div className="bg-white rounded-2xl shadow-[6px_6px_54px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#202224]/50 w-8">#</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#202224]/50">Pemda</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#202224]/50">Aplikasi</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#202224]/50">Menu</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#202224]/50">Deadline</th>
                <th className="px-4 py-3 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="px-4 py-3 text-xs text-[#202224]/40">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {row.pemda?.logo ? (
                        <div className="w-7 h-7 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                          <img src={row.pemda.logo} className="w-full h-full object-contain p-0.5" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-linear-to-br from-teal-400 to-blue-500 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-white">{row.pemda?.name?.slice(0, 2).toUpperCase()}</span>
                        </div>
                      )}
                      <span className="font-semibold text-xs text-[#202224]">{row.pemda?.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#797A7C]">{row.aplikasi?.name}</td>
                  <td className="px-4 py-3 text-xs text-[#797A7C]">{row.menu}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-red-500">{formatTgl(row.tanggal_deadline || "")}</td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded hover:bg-gray-100 transition">
                          <MoreVertical className="size-4 text-gray-400" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(row)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeleteId(row.id)} className="text-red-500">Hapus</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {data.map((item) => (
        <PermintaanCard key={item.id} item={item} onEdit={onEdit} onDelete={setDeleteId} />
      ))}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data?</AlertDialogTitle>
            <AlertDialogDescription>Data tidak dapat dikembalikan setelah dihapus.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={() => { if(deleteId) { onDelete(deleteId); setDeleteId(null); } }}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}