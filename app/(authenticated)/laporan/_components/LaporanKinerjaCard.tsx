import { MoreVertical, SendHorizonal, Download, Paperclip } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { LaporanKinerjaItem } from "../_types"

interface Props {
  item: LaporanKinerjaItem
  onEdit: (item: LaporanKinerjaItem) => void
  onDelete: (id: string) => void
  onSubmitVerifikasi: (item: LaporanKinerjaItem) => void
  isSubmitting?: boolean
}

function formatDate(iso?: string) {
  if (!iso) return "-"
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
}

function getFileName(url: string) {
  const parts = url.split("/")
  const raw = parts[parts.length - 1] ?? "file"
  return raw.replace(/_\d+\.\w+$/, (m) => m.replace(/^_\d+/, ""))
}

export default function LaporanKinerjaCard({ item, onEdit, onDelete, onSubmitVerifikasi, isSubmitting }: Props) {
  const programmerName = item.programmer?.full_name ?? "Programmer"
  const initials = programmerName.slice(0, 2).toUpperCase()
  const deadline = item.permintaan?.tanggal_deadline
  const lampiran = item.permintaan?.lampiran ?? []

  return (
    <div className="rounded-2xl bg-white p-5 shadow-[6px_6px_54px_rgba(0,0,0,0.05)] flex flex-col gap-3">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-yellow-50 flex items-center justify-center shrink-0 border border-yellow-200">
            <span className="text-2xl">🏛️</span>
          </div>
          <div>
            <p className="text-sm font-bold text-[#202224] leading-tight">
              {item.permintaan?.pemda ?? "-"}
            </p>
            <p className="text-xs text-blue-500 font-semibold">
              {item.permintaan?.aplikasi ?? "E-Kinerja"}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 rounded hover:bg-gray-100">
              <MoreVertical className="h-4 w-4 text-[#202224]/50" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(item)}>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={() => onDelete(item.id)}>
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="border-t border-black/10" />

      {/* Progress */}
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold bg-yellow-100 text-yellow-600 shrink-0 min-w-[44px] justify-center">
          75%
        </span>
        <p className="text-sm text-[#202224]/80 leading-snug line-clamp-2">
          {item.laporan_progress}
        </p>
      </div>

      {/* Deadline */}
      <p className="text-[11px] font-bold text-red-500">
        Deadline: {formatDate(deadline)}
      </p>

      {/* Lampiran */}
      {lampiran.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-[#606060] uppercase mb-1.5 flex items-center gap-1">
            <Paperclip size={10} /> Lampiran
          </p>
          <div className="flex flex-wrap gap-1.5">
            {lampiran.map((url, idx) => (
              <a
                key={idx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2 py-1 bg-[#F5F6FA] hover:bg-[#4880FF]/10 border border-[#D5D5D5] rounded-md transition group"
                style={{ borderWidth: "0.6px" }}
              >
                <span className="text-[10px] font-bold text-[#202224]">File {idx + 1}</span>
                <Download size={10} className="text-gray-400 group-hover:text-[#4880FF]" />
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-black/10" />

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-[#202224]/60">
          <span className="font-semibold text-[#202224]/80">Dibuat:</span>{" "}
          {formatDate(item.created_at)}
        </div>

        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-pink-200 text-pink-700 text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-semibold text-[#202224]/70">
            {programmerName}
          </span>
        </div>
      </div>

      {/* Tombol Submit Verifikasi */}
      <Button
        size="sm"
        className="w-full gap-2 mt-1"
        disabled={isSubmitting || item.status === "hijau"}
        onClick={() => onSubmitVerifikasi(item)}
      >
        <SendHorizonal className="h-4 w-4" />
        {isSubmitting ? "Mengajukan..." : item.status === "hijau" ? "Sudah Diverifikasi" : "Ajukan Verifikasi"}
      </Button>

    </div>
  )
}
