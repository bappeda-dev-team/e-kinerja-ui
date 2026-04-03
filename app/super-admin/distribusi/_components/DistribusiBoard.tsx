"use client"

import { useState } from "react"
import { MoreVertical, MessageSquare, Users, X, ChevronLeft, ChevronRight, FileText, ArrowLeft } from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { PermintaanItem, DistribusiItem } from "./DistribusiClient"

interface Props {
  permintaan: PermintaanItem[]
  distribusi: DistribusiItem[]
  showTable: boolean
  onAssign: (item: PermintaanItem) => void
  onSelesai: (id: string) => void
  onDelete: (id: string) => void
  onEditPelaksana: (item: DistribusiItem) => void
  onShowKomentar: (text: string) => void
}

type ViewAll = "permintaan" | "distribusi" | "selesai" | null

function formatTgl(dateStr: string) {
  if (!dateStr) return "-"
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
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

function MiniAvatar({ label }: { label: string }) {
  const colors = ["from-pink-400 to-rose-500", "from-blue-400 to-indigo-500", "from-green-400 to-teal-500", "from-orange-400 to-amber-500", "from-purple-400 to-violet-500"]
  const color = colors[label.charCodeAt(0) % colors.length]
  return (
    <div className={`w-8 h-8 rounded-full bg-linear-to-br ${color} border-2 border-white flex items-center justify-center text-xs font-bold text-white -ml-2 first:ml-0 shadow-sm`}>
      {label.charAt(0).toUpperCase()}
    </div>
  )
}

function InlineBadge({ label, color }: { label: string; color: "purple" | "blue" | "orange" | "green" | "red" }) {
  const styles = {
    purple: "bg-purple-100/60 text-purple-600",
    blue: "bg-blue-100/60 text-blue-600",
    orange: "bg-orange-100/60 text-orange-500",
    green: "bg-green-100/60 text-green-600",
    red: "bg-red-100/60 text-red-500",
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold shrink-0 ${styles[color]}`}>
      {label}
    </span>
  )
}

function isImage(url: string) {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
}

function getFileName(url: string) {
  return decodeURIComponent(url.split("/").pop()?.split("_").slice(-1)[0] ?? url)
}

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

function PermintaanCard({ item, onAssign }: { item: PermintaanItem; onAssign: (item: PermintaanItem) => void }) {
  return (
    <div className="bg-white rounded-2xl shadow-[6px_6px_54px_rgba(0,0,0,0.05)] p-4 space-y-3 border border-gray-50">
      <div className="flex items-start gap-3">
        <PemdaAvatar nama={item.nama_pemda} logo={item.logo_pemda} />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-[#202224] leading-snug">{item.nama_pemda}</p>
          <p className="text-xs text-[#797A7C] mt-0.5">
            <span className="font-semibold">{item.aplikasi}</span>
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
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onAssign(item)}>Distribusikan</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="border-t border-black/5" />
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <InlineBadge label="Awal" color="orange" />
          <p className="text-xs text-[#797A7C] leading-relaxed">{item.awal}</p>
        </div>
        <div className="flex items-start gap-2">
          <InlineBadge label="Target" color="green" />
          <p className="text-xs text-[#797A7C] leading-relaxed">{item.target}</p>
        </div>
      </div>
      {item.lampiran?.length > 0 && (
        <>
          <div className="border-t border-black/5" />
          <LampiranSection lampiran={item.lampiran} />
        </>
      )}
      <p className="text-xs font-bold text-red-500">
        Deadline: <span className="font-normal">{formatTgl(item.deadline)}</span>
      </p>
    </div>
  )
}

function DistribusiCard({ item, onSelesai, onDelete, onEditPelaksana, onShowKomentar }: {
  item: DistribusiItem
  onSelesai: (id: string) => void
  onDelete: (id: string) => void
  onEditPelaksana: (item: DistribusiItem) => void
  onShowKomentar: (text: string) => void
}) {
  return (
    <div className="bg-white rounded-2xl shadow-[6px_6px_54px_rgba(0,0,0,0.05)] p-4 space-y-3 border border-gray-50">
      <div className="flex items-start gap-3">
        <PemdaAvatar nama={item.nama_pemda} logo={item.logo_pemda} />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-[#202224] leading-snug">{item.nama_pemda}</p>
          <p className="text-xs text-[#797A7C] mt-0.5">
            <span className="font-semibold">{item.aplikasi}</span>
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
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => onEditPelaksana(item)}>Edit Programmer</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSelesai(item.id)}>Tandai Selesai</DropdownMenuItem>
            <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={() => onDelete(item.id)}>Hapus</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="border-t border-black/5" />
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <InlineBadge label="Admin" color="purple" />
          <p className="text-xs text-[#797A7C] font-semibold">{item.admin}</p>
        </div>
        <div className="flex items-center gap-2">
          <InlineBadge label="Programmer" color="blue" />
          <p className="text-xs text-[#797A7C] font-semibold">
            {item.programmer.length === 0 ? "-" : item.programmer.map((p) => p.nama).join(", ")}
          </p>
        </div>
      </div>
      {item.lampiran?.length > 0 && (
        <>
          <div className="border-t border-black/5" />
          <LampiranSection lampiran={item.lampiran} />
        </>
      )}
      <p className="text-xs font-bold text-red-500">
        Deadline: <span className="font-normal">{formatTgl(item.deadline)}</span>
      </p>
      <div className="border-t border-black/5" />
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {item.programmer.slice(0, 3).map((p) => (
            <MiniAvatar key={p.pelaksana_id} label={p.nama} />
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs text-[#797A7C]">
          <span className="flex items-center gap-1">
            <Users className="size-3.5" />
            <span>{item.programmer.length}</span>
          </span>
          {item.komentar && (
            <button onClick={() => onShowKomentar(item.komentar!)} className="flex items-center gap-1 hover:text-blue-500 transition">
              <MessageSquare className="size-3.5" />
              <span>1</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function SelesaiCard({ item, onDelete }: { item: DistribusiItem; onDelete: (id: string) => void }) {
  const isLate = item.ketepatan === "Terlambat"
  return (
    <div className="bg-white rounded-2xl shadow-[6px_6px_54px_rgba(0,0,0,0.05)] p-4 space-y-3 border border-gray-50">
      <div className="flex items-start gap-3">
        <PemdaAvatar nama={item.nama_pemda} logo={item.logo_pemda} />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-[#202224] leading-snug">{item.nama_pemda}</p>
          <p className="text-xs text-[#797A7C] mt-0.5">
            <span className="font-semibold">{item.aplikasi}</span>
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
            <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={() => onDelete(item.id)}>Hapus</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="border-t border-black/5" />
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <InlineBadge label="Hasil" color="green" />
          <p className="text-xs text-[#797A7C] leading-relaxed font-semibold">{item.hasil ?? "-"}</p>
        </div>
        <div className="flex items-center gap-2">
          <InlineBadge label="Kualitas" color="orange" />
          <p className="text-xs text-[#797A7C] font-semibold">{item.kualitas ?? "-"}</p>
        </div>
      </div>
      <p className={`text-xs font-bold ${isLate ? "text-red-500" : "text-[#797A7C]"}`}>
        Status: <span className="font-normal">{item.ketepatan ?? "Tepat waktu"}</span>
      </p>
      <div className="border-t border-black/5" />
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {item.programmer.slice(0, 3).map((p) => (
            <MiniAvatar key={p.pelaksana_id} label={p.nama} />
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs text-[#797A7C]">
          <span className="flex items-center gap-1">
            <Users className="size-3.5" />
            <span>{item.programmer.length}</span>
          </span>
        </div>
      </div>
    </div>
  )
}

function TableView({ permintaan, distribusi, onAssign, onSelesai, onDelete, onEditPelaksana }: {
  permintaan: PermintaanItem[]
  distribusi: DistribusiItem[]
  onAssign: (item: PermintaanItem) => void
  onSelesai: (id: string) => void
  onDelete: (id: string) => void
  onEditPelaksana: (item: DistribusiItem) => void
}) {
  const didistribusikan = distribusi.filter((d) => d.status === "didistribusikan")
  const selesai = distribusi.filter((d) => d.status === "selesai")

  const allRows = [
    ...permintaan.map((item) => ({ ...item, _kategori: "permintaan" as const })),
    ...didistribusikan.map((item) => ({ ...item, _kategori: "distribusi" as const })),
    ...selesai.map((item) => ({ ...item, _kategori: "selesai" as const })),
  ]

  return (
    <div className="bg-white rounded-2xl shadow-[6px_6px_54px_rgba(0,0,0,0.05)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#202224]/50 w-8">#</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#202224]/50">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#202224]/50">Pemda</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#202224]/50">Aplikasi</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#202224]/50">Deadline</th>
              <th className="px-4 py-3 w-8"></th>
            </tr>
          </thead>
          <tbody>
            {allRows.map((row, i) => {
              const isPermintaan = row._kategori === "permintaan"
              const isDistribusi = row._kategori === "distribusi"
              const isSelesai = row._kategori === "selesai"

              return (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="px-4 py-3 text-xs text-[#202224]/40">{i + 1}</td>
                  <td className="px-4 py-3">
                    {isPermintaan && <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Menunggu</span>}
                    {isDistribusi && <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-pink-100 text-pink-600">Proses</span>}
                    {isSelesai && <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-600">Selesai</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {row.logo_pemda ? (
                        <div className="w-7 h-7 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                          <img src={row.logo_pemda} className="w-full h-full object-contain p-0.5" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-linear-to-br from-teal-400 to-blue-500 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-white">{row.nama_pemda.slice(0, 2).toUpperCase()}</span>
                        </div>
                      )}
                      <span className="font-semibold text-xs text-[#202224]">{row.nama_pemda}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#797A7C]">{row.aplikasi}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-red-500">{formatTgl(row.deadline)}</td>
                  <td className="px-4 py-3 text-right">
                      {/* Dropdown Menu logic here */}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function DistribusiBoard({ permintaan, distribusi, showTable, onAssign, onSelesai, onDelete, onEditPelaksana, onShowKomentar }: Props) {
  const [viewAll, setViewAll] = useState<ViewAll>(null)
  const didistribusikan = distribusi.filter((d) => d.status === "didistribusikan")
  const selesai = distribusi.filter((d) => d.status === "selesai")

  const columns = [
    { key: "permintaan" as const, label: "Daftar Permintaan", count: permintaan.length, badgeClass: "bg-blue-100 text-blue-700" },
    { key: "distribusi" as const, label: "Telah Didistribusikan", count: didistribusikan.length, badgeClass: "bg-pink-100 text-pink-600" },
    { key: "selesai" as const, label: "Selesai", count: selesai.length, badgeClass: "bg-teal-100 text-teal-600" },
  ]

  if (showTable) {
    return <TableView permintaan={permintaan} distribusi={distribusi} onAssign={onAssign} onSelesai={onSelesai} onDelete={onDelete} onEditPelaksana={onEditPelaksana} />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((col) => (
        <div key={col.key} className="space-y-3">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${col.badgeClass}`}>
              {col.count}
            </span>
            <span className="text-base font-bold text-[#202224]">{col.label}</span>
          </div>
          <div className="space-y-3">
            {col.key === "permintaan" && permintaan.map((item) => <PermintaanCard key={item.id} item={item} onAssign={onAssign} />)}
            {col.key === "distribusi" && didistribusikan.map((item) => <DistribusiCard key={item.id} item={item} onSelesai={onSelesai} onDelete={onDelete} onEditPelaksana={onEditPelaksana} onShowKomentar={onShowKomentar} />)}
            {col.key === "selesai" && selesai.map((item) => <SelesaiCard key={item.id} item={item} onDelete={onDelete} />)}
          </div>
        </div>
      ))}
    </div>
  )
}