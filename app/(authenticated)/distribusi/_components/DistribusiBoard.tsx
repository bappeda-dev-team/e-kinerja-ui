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
  showTable: boolean // ✅
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

function PemdaAvatar({ nama }: { nama: string }) {
  const initials = nama?.slice(0, 2).toUpperCase() ?? "PE"
  return (
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center shrink-0 shadow-sm">
      <span className="text-sm font-bold text-white">{initials}</span>
    </div>
  )
}

function MiniAvatar({ label }: { label: string }) {
  const colors = ["from-pink-400 to-rose-500", "from-blue-400 to-indigo-500", "from-green-400 to-teal-500", "from-orange-400 to-amber-500", "from-purple-400 to-violet-500"]
  const color = colors[label.charCodeAt(0) % colors.length]
  return (
    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${color} border-2 border-white flex items-center justify-center text-xs font-bold text-white -ml-2 first:ml-0 shadow-sm`}>
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
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4" onClick={onClose}>
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
        {urls.length > 1 && (
          <>
            <button onClick={() => setCurrent((prev) => (prev - 1 + urls.length) % urls.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition">
              <ChevronLeft className="size-5" />
            </button>
            <button onClick={() => setCurrent((prev) => (prev + 1) % urls.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition">
              <ChevronRight className="size-5" />
            </button>
            <div className="flex justify-center gap-1.5 mt-3">
              {urls.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition ${i === current ? "bg-white" : "bg-white/40"}`} />
              ))}
            </div>
          </>
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
        <PemdaAvatar nama={item.nama_pemda} />
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
        <PemdaAvatar nama={item.nama_pemda} />
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
              <span>{item.jumlah_komentar ?? 1}</span>
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
        <PemdaAvatar nama={item.nama_pemda} />
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
          <span className="flex items-center gap-1">
            <MessageSquare className="size-3.5" />
            <span>{item.jumlah_komentar ?? 0}</span>
          </span>
        </div>
      </div>
    </div>
  )
}

// ✅ Tabel gabungan semua kategori
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
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <span className="text-sm font-bold text-[#202224]">Semua Data</span>
        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-[#202224]/60">{allRows.length}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#202224]/50 w-8">#</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#202224]/50">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#202224]/50">Pemda</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#202224]/50">Aplikasi</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#202224]/50">Menu</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#202224]/50">Admin</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#202224]/50">Programmer</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#202224]/50">Deadline</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#202224]/50">Lampiran</th>
              <th className="px-4 py-3 w-8"></th>
            </tr>
          </thead>
          <tbody>
            {allRows.map((row, i) => {
              const isPermintaan = row._kategori === "permintaan"
              const isDistribusi = row._kategori === "distribusi"
              const isSelesai = row._kategori === "selesai"
              const admin = isPermintaan ? "-" : (row as any).admin ?? "-"
              const programmer = isPermintaan ? [] : (row as any).programmer ?? []
              const lampiran = (row as any).lampiran ?? []

              return (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="px-4 py-3 text-xs text-[#202224]/40">{i + 1}</td>
                  <td className="px-4 py-3">
                    {isPermintaan && <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Menunggu</span>}
                    {isDistribusi && <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-pink-100 text-pink-600">Didistribusikan</span>}
                    {isSelesai && <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-600">Selesai</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-white">{row.nama_pemda.slice(0, 2).toUpperCase()}</span>
                      </div>
                      <span className="font-semibold text-xs text-[#202224] whitespace-nowrap">{row.nama_pemda}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#797A7C] whitespace-nowrap">{row.aplikasi}</td>
                  <td className="px-4 py-3 text-xs text-[#797A7C]">{row.menu}</td>
                  <td className="px-4 py-3 text-xs text-[#797A7C] whitespace-nowrap">{admin}</td>
                  <td className="px-4 py-3">
                    {programmer.length === 0 ? (
                      <span className="text-xs text-[#797A7C]/40">-</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {programmer.map((p: any) => (
                          <span key={p.pelaksana_id} className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded whitespace-nowrap">
                            {p.nama}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold text-red-500 whitespace-nowrap">{formatTgl(row.deadline)}</td>
                  <td className="px-4 py-3">
                    {lampiran.length > 0 ? (
                      <div className="flex gap-1 items-center">
                        {lampiran.slice(0, 2).map((url: string, j: number) =>
                          isImage(url) ? (
                            <a key={j} href={url} target="_blank" rel="noopener noreferrer">
                              <img src={url} className="w-8 h-8 rounded object-cover border border-gray-200" />
                            </a>
                          ) : (
                            <a key={j} href={url} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded border border-blue-100">
                              <FileText className="size-3" />
                            </a>
                          )
                        )}
                        {lampiran.length > 2 && <span className="text-xs text-[#797A7C]">+{lampiran.length - 2}</span>}
                      </div>
                    ) : <span className="text-xs text-[#797A7C]/40">-</span>}
                  </td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded hover:bg-gray-100 transition">
                          <MoreVertical className="size-4 text-gray-400" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        {isPermintaan && <DropdownMenuItem onClick={() => onAssign(row as PermintaanItem)}>Distribusikan</DropdownMenuItem>}
                        {isDistribusi && (
                          <>
                            <DropdownMenuItem onClick={() => onEditPelaksana(row as DistribusiItem)}>Edit Programmer</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onSelesai(row.id)}>Tandai Selesai</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={() => onDelete(row.id)}>Hapus</DropdownMenuItem>
                          </>
                        )}
                        {isSelesai && <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={() => onDelete(row.id)}>Hapus</DropdownMenuItem>}
                      </DropdownMenuContent>
                    </DropdownMenu>
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

  // ✅ Table view — semua kategori
  if (showTable) {
    return (
      <TableView
        permintaan={permintaan}
        distribusi={distribusi}
        onAssign={onAssign}
        onSelesai={onSelesai}
        onDelete={onDelete}
        onEditPelaksana={onEditPelaksana}
      />
    )
  }

  // ✅ View All per kategori (card grid)
  if (viewAll) {
    const col = columns.find((c) => c.key === viewAll)!
    const items = viewAll === "permintaan" ? permintaan : viewAll === "distribusi" ? didistribusikan : selesai

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setViewAll(null)}
            className="flex items-center gap-2 text-sm font-semibold text-[#202224]/60 hover:text-[#202224] transition">
            <ArrowLeft className="size-4" />
            Kembali
          </button>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${col.badgeClass}`}>
              {items.length}
            </span>
            <span className="text-lg font-bold text-[#202224]">{col.label}</span>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 text-sm text-[#202224]/40 bg-white rounded-2xl shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">Kosong</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {viewAll === "permintaan" && permintaan.map((item) => (
              <PermintaanCard key={item.id} item={item} onAssign={onAssign} />
            ))}
            {viewAll === "distribusi" && didistribusikan.map((item) => (
              <DistribusiCard key={item.id} item={item} onSelesai={onSelesai} onDelete={onDelete} onEditPelaksana={onEditPelaksana} onShowKomentar={onShowKomentar} />
            ))}
            {viewAll === "selesai" && selesai.map((item) => (
              <SelesaiCard key={item.id} item={item} onDelete={onDelete} />
            ))}
          </div>
        )}
      </div>
    )
  }

  // ✅ Normal board view
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((col) => (
        <div key={col.key} className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${col.badgeClass}`}>
                {col.count}
              </span>
              <span className="text-base font-bold text-[#202224]">{col.label}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 rounded hover:bg-gray-100 transition">
                  <MoreVertical className="size-4 text-gray-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem onClick={() => setViewAll(col.key)}>Lihat Semua</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="space-y-3">
            {col.key === "permintaan" && (
              permintaan.length === 0
                ? <div className="text-center py-8 text-sm text-[#202224]/40 bg-white rounded-2xl shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">Kosong</div>
                : permintaan.map((item) => <PermintaanCard key={item.id} item={item} onAssign={onAssign} />)
            )}
            {col.key === "distribusi" && (
              didistribusikan.length === 0
                ? <div className="text-center py-8 text-sm text-[#202224]/40 bg-white rounded-2xl shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">Kosong</div>
                : didistribusikan.map((item) => (
                  <DistribusiCard key={item.id} item={item} onSelesai={onSelesai} onDelete={onDelete} onEditPelaksana={onEditPelaksana} onShowKomentar={onShowKomentar} />
                ))
            )}
            {col.key === "selesai" && (
              selesai.length === 0
                ? <div className="text-center py-8 text-sm text-[#202224]/40 bg-white rounded-2xl shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">Kosong</div>
                : selesai.map((item) => <SelesaiCard key={item.id} item={item} onDelete={onDelete} />)
            )}
          </div>
        </div>
      ))}
    </div>
  )
}