"use client"

import * as React from "react"
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

/* --- Hybrid Loader Component --- */
const HybridLoader = () => {
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev =>
        prev >= 90 ? prev : prev + Math.floor(Math.random() * 10)
      )
    }, 200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-20 w-full col-span-full space-y-4">
      <div className="relative flex items-center justify-center">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-blue-50"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={251.2}
            strokeDashoffset={251.2 - (251.2 * progress) / 100}
            className="text-blue-600 transition-all duration-300 ease-out"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-blue-600 animate-bounce">⏳</span>
          <span className="text-[10px] font-bold text-blue-600">{progress}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-[#202224]">Menyinkronkan data verifikasi...</p>
        <p className="text-[11px] text-[#202224]/50">Mohon tunggu sebentar</p>
      </div>
    </div>
  )
}

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
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <PemdaAvatar />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-[#202224] leading-snug truncate">
            Laporan ID: {item.laporan_id?.substring(0, 8)}...
          </p>
          <p className="text-[10px] text-[#797A7C] mt-0.5 uppercase tracking-wider font-medium">
            Status: {item.status}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 rounded hover:bg-gray-100 transition shrink-0">
              <MoreVertical className="size-4 text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onVerify(item)}>
              Edit Verifikasi
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="border-t border-black/10" />

      {item.status === "menunggu" && (
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold">
            PERLU CEK
          </span>
          <span className="text-[10px] text-[#797A7C]">
            Diajukan: {formatTgl(item.tanggal_diajukan)}
          </span>
        </div>
      )}

      {item.status === "revisi" && (
        <div className="space-y-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-orange-50 text-orange-500 text-[10px] font-bold">
            BUTUH REVISI
          </span>
          {item.komentar && (
            <div className="bg-orange-50/30 p-2 rounded-md border border-orange-100/50">
              <p className="text-[11px] text-[#797A7C] italic line-clamp-2">"{item.komentar}"</p>
            </div>
          )}
        </div>
      )}

      {item.status === "terverifikasi" && (
        <div className="space-y-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-green-50 text-green-600 text-[10px] font-bold">
            APPROVED
          </span>
          {item.komentar && (
            <div className="bg-gray-50 p-2 rounded-md">
              <p className="text-[11px] text-[#797A7C] italic line-clamp-2">"{item.komentar}"</p>
            </div>
          )}
          <div className="flex justify-between items-center pt-1 text-[9px] text-[#797A7C] font-medium">
             <span>Oleh: {item.verifikator?.substring(0, 8)}...</span>
             <span>{formatTgl(item.tanggal_verifikasi)}</span>
          </div>
        </div>
      )}
    </div>
  )
}

const COLUMNS: { key: VerifikasiItem["status"]; label: string; badgeClass: string }[] = [
  { key: "menunggu", label: "Menunggu", badgeClass: "bg-blue-500 text-white" },
  { key: "revisi", label: "Revisi", badgeClass: "bg-orange-500 text-white" },
  { key: "terverifikasi", label: "Terverifikasi", badgeClass: "bg-green-500 text-white" },
]

export default function VerifikasiBoard({ data, loading, onVerify }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {loading ? (
        <HybridLoader />
      ) : (
        COLUMNS.map((col) => {
          const items = data.filter((d) => d.status === col.key)
          return (
            <div key={col.key} className="space-y-4">
              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#202224]">{col.label}</span>
                  <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold ${col.badgeClass}`}>
                    {items.length}
                  </span>
                </div>
                <MoreVertical className="size-4 text-gray-400" />
              </div>

              <div className="space-y-3 min-h-[200px] p-1">
                {items.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-100 rounded-xl h-24 flex items-center justify-center bg-gray-50/30">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Kosong</span>
                  </div>
                ) : (
                  items.map((item) => <KanbanCard key={item.id} item={item} onVerify={onVerify} />)
                )}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}