"use client"

import { Building2, MoreVertical } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { VerifikasiItem } from "./VerifikasiClient"

interface Props {
  data: VerifikasiItem[]
  loading?: boolean
  onVerify: (item: VerifikasiItem) => void
}

// 💡 Tambahkan pengecekan jika dateStr kosong/tidak valid
function formatTgl(dateStr?: string) {
  if (!dateStr) return "-"
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  } catch (error) {
    return "-"
  }
}

function PemdaAvatar() {
  return (
    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
      <Building2 className="size-5 text-gray-400" />
    </div>
  )
}

function KanbanCard({
  item,
  onVerify,
}: {
  item: VerifikasiItem
  onVerify: (item: VerifikasiItem) => void
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
      {/* Header: avatar + ID/Laporan Info + kebab */}
      <div className="flex items-start gap-3">
        <PemdaAvatar />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-[#202224] leading-snug truncate">
            {/* Karena dari API kita cuma dapat laporan_id, tampilkan ID-nya untuk sementara.
                Kalau API ngirim relasi data pemda, tinggal ganti ke item.nama_pemda */}
            Laporan ID: {item.laporan_id?.substring(0, 8)}...
          </p>
          <p className="text-xs text-[#797A7C] mt-0.5">
            Status: {item.status.toUpperCase()}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 rounded hover:bg-gray-100 transition shrink-0">
              <MoreVertical className="size-4 text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem onClick={() => onVerify(item)}>
              Edit Verifikasi
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="border-t border-black/10" />

      {/* Konten Spesifik per Status */}
      {item.status === "menunggu" && (
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-semibold">
            Perlu Cek
          </span>
          <span className="text-xs text-[#797A7C]">
            Diajukan: {formatTgl(item.tanggal_diajukan)}
          </span>
        </div>
      )}

      {item.status === "revisi" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-orange-50 text-orange-500 text-xs font-semibold">
              Butuh Revisi
            </span>
          </div>
          {item.komentar && (
            <div className="bg-orange-50/50 p-2 rounded-md">
              <p className="text-xs text-[#797A7C] italic">
                "{item.komentar}"
              </p>
            </div>
          )}
          <p className="text-xs text-[#797A7C]">
            Update Terakhir: {formatTgl(item.tanggal_verifikasi)}
          </p>
        </div>
      )}

      {item.status === "terverifikasi" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
             <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-green-50 text-green-600 text-xs font-semibold">
              Approved
            </span>
          </div>
          
          {item.komentar && (
            <div className="bg-gray-50 p-2 rounded-md">
              <p className="text-xs text-[#797A7C] italic">
                "{item.komentar}"
              </p>
            </div>
          )}

          <div className="flex justify-between items-center pt-1">
             <p className="text-[10px] text-[#797A7C]">
              Oleh: {item.verifikator?.substring(0, 8)}...
            </p>
            <p className="text-[10px] text-[#797A7C]">
              {formatTgl(item.tanggal_verifikasi)}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

const COLUMNS: {
  key: VerifikasiItem["status"]
  label: string
  headerColor: string
  badgeClass: string
}[] = [
  {
    key: "menunggu",
    label: "Menunggu",
    headerColor: "text-[#202224]",
    badgeClass: "bg-blue-100 text-blue-600", // Soft blue
  },
  {
    key: "revisi",
    label: "Revisi",
    headerColor: "text-[#202224]",
    badgeClass: "bg-orange-100 text-orange-600", // Soft orange
  },
  {
    key: "terverifikasi",
    label: "Terverifikasi",
    headerColor: "text-[#202224]",
    badgeClass: "bg-green-100 text-green-600", // Soft green
  },
]

export default function VerifikasiBoard({ data, loading, onVerify }: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        Memuat data papan verifikasi...
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {COLUMNS.map((col) => {
        // Filter data berdasarkan status kolom
        const items = data.filter((d) => d.status === col.key)

        return (
          <div key={col.key} className="space-y-4">
            {/* Column Header */}
            <div className="flex items-center justify-between bg-gray-50/50 p-2 rounded-lg border border-transparent">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${col.headerColor}`}>
                  {col.label}
                </span>
                <span
                  className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold ${col.badgeClass}`}
                >
                  {items.length}
                </span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 rounded-md hover:bg-gray-200 transition">
                    <MoreVertical className="size-4 text-gray-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuItem>Urutkan Terlama</DropdownMenuItem>
                  <DropdownMenuItem>Urutkan Terbaru</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Kanban Cards Container */}
            <div className="space-y-3 min-h-[150px] p-1">
              {items.length === 0 ? (
                <div className="border-2 border-dashed border-gray-100 rounded-xl h-24 flex items-center justify-center">
                  <span className="text-xs text-gray-400 font-medium">Kosong</span>
                </div>
              ) : (
                items.map((item) => (
                  <KanbanCard key={item.id} item={item} onVerify={onVerify} />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}