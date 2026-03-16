"use client"

import { useState } from "react"
import { MoreVertical, ArrowLeft } from "lucide-react"
import VerifikasiCard from "./VerifikasiCard"
import type { VerifikasiItem } from "./VerifikasiClient"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Props {
  data: VerifikasiItem[]
  showTable: boolean // ✅
  onVerify: (item: VerifikasiItem) => void
}

const COLUMNS: { key: VerifikasiItem["status"]; label: string; color: string; bg: string }[] = [
  { key: "menunggu", label: "Menunggu", color: "text-[#123F84]", bg: "bg-[#E4EBFA]" },
  { key: "revisi", label: "Revisi", color: "text-[#E14C8E]", bg: "bg-[#FDEDF5]" },
  { key: "terverifikasi", label: "Terverifikasi", color: "text-[#00B69B]", bg: "bg-[#CCF0EB]" },
]

type ViewAll = "menunggu" | "revisi" | "terverifikasi" | null

function formatTgl(d?: string) {
  if (!d) return "-"
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
}

// ✅ Tabel gabungan semua status
function TableView({ data, onVerify }: { data: VerifikasiItem[]; onVerify: (item: VerifikasiItem) => void }) {
  const statusBadge = (status: VerifikasiItem["status"]) => {
    if (status === "menunggu") return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#E4EBFA] text-[#123F84]">Menunggu</span>
    if (status === "revisi") return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FDEDF5] text-[#E14C8E]">Revisi</span>
    return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#CCF0EB] text-[#00B69B]">Terverifikasi</span>
  }

  return (
    <div className="bg-white rounded-2xl shadow-[6px_6px_54px_rgba(0,0,0,0.05)] overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <span className="text-sm font-bold text-[#202224]">Semua Verifikasi</span>
        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-[#202224]/60">{data.length}</span>
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
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#202224]/50">Progress</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#202224]/50">Verifikator</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#202224]/50">Komentar</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#202224]/50">Diajukan</th>
              <th className="px-4 py-3 w-8"></th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-12 text-sm text-[#202224]/40">Belum ada data.</td>
              </tr>
            ) : data.map((item, i) => (
              <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                <td className="px-4 py-3 text-xs text-[#202224]/40">{i + 1}</td>
                <td className="px-4 py-3">{statusBadge(item.status)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#CCF0EB]/50 border border-[#CCF0EB] flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-[#00B69B]">
                        {item.nama_pemda?.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-semibold text-xs text-[#202224] whitespace-nowrap">{item.nama_pemda}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-[#797A7C] whitespace-nowrap">{item.aplikasi}</td>
                <td className="px-4 py-3 text-xs text-[#797A7C]">{item.menu}</td>
                <td className="px-4 py-3 text-xs text-blue-600 italic max-w-[160px] truncate">
                  {item.progres_deskripsi ? `"${item.progres_deskripsi}"` : "-"}
                </td>
                <td className="px-4 py-3 text-xs text-[#797A7C] whitespace-nowrap">{item.verifikator || "-"}</td>
                <td className="px-4 py-3 text-xs text-[#797A7C] max-w-[160px] truncate">{item.komentar || "-"}</td>
                <td className="px-4 py-3 text-xs text-[#797A7C] whitespace-nowrap">{formatTgl(item.tanggal_diajukan)}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onVerify(item)}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold rounded-lg transition whitespace-nowrap"
                  >
                    Proses
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function VerifikasiBoard({ data, showTable, onVerify }: Props) {
  const [viewAll, setViewAll] = useState<ViewAll>(null)

  // ✅ Table view — semua status
  if (showTable) {
    return <TableView data={data} onVerify={onVerify} />
  }

  // ✅ View All per kategori (card grid)
  if (viewAll) {
    const col = COLUMNS.find((c) => c.key === viewAll)!
    const items = data.filter((d) => d.status === viewAll)

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewAll(null)}
            className="flex items-center gap-2 text-sm font-semibold text-[#202224]/60 hover:text-[#202224] transition"
          >
            <ArrowLeft className="size-4" />
            Kembali
          </button>
          <div className="flex items-center gap-2">
            <div className={`${col.bg} w-6 h-6 rounded-full flex items-center justify-center`}>
              <span className={`${col.color} text-xs font-bold`}>{items.length}</span>
            </div>
            <span className="text-lg font-bold text-[#202224]">{col.label}</span>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 text-sm text-[#202224]/40 bg-white rounded-2xl shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
            Kosong
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <VerifikasiCard key={item.id} item={item} onVerify={onVerify} />
            ))}
          </div>
        )}
      </div>
    )
  }

  // ✅ Normal board view
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {COLUMNS.map((col) => {
        const items = data.filter((d) => d.status === col.key)
        return (
          <div key={col.key} className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`${col.bg} w-7 h-7 rounded-full flex items-center justify-center`}>
                  <span className={`${col.color} text-xs font-bold`}>{items.length}</span>
                </div>
                <h3 className="text-xl font-bold text-black">{col.label}</h3>
              </div>
              {/* ✅ Titik tiga dengan Lihat Semua */}
              <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <button className="p-1 hover:bg-gray-100 rounded-full transition">
      <MoreVertical className="size-4 text-gray-400" />
    </button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-32">
    <DropdownMenuItem onClick={() => setViewAll(col.key)}>
      Lihat Semua
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
            </div>

            <div className="space-y-4 min-h-[400px]">
              {items.length === 0 ? (
                <div className="h-24 border-2 border-dashed border-gray-100 rounded-xl flex items-center justify-center text-gray-300 text-sm italic">
                  Kosong
                </div>
              ) : (
                items.map((item) => <VerifikasiCard key={item.id} item={item} onVerify={onVerify} />)
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}