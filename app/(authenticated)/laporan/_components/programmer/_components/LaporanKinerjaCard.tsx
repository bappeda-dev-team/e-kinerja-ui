
"use client"

import { MoreVertical, SendHorizonal, Download } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { LaporanKinerjaItem } from "../types"
import { getProgressBadgeClass, mapStatusToProgress } from "../utils"

interface Props {
  item: LaporanKinerjaItem; onEdit: (item: LaporanKinerjaItem) => void; onDelete: (id: string) => void
  onSubmitVerifikasi: (item: LaporanKinerjaItem) => void; isSubmitting?: boolean; isAlreadySubmitted?: boolean
}

function formatDate(iso?: string) {
  return iso ? new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"
}

function entityLabel(value?: string | { name: string }) {
  if (!value) return "-"
  return typeof value === "string" ? value : value.name
}

export default function LaporanKinerjaCard({ item, onEdit, onDelete, onSubmitVerifikasi, isSubmitting, isAlreadySubmitted }: Props) {
  const programmerName = item.programmer?.full_name ?? "Programmer"
  const initials = programmerName.slice(0, 2).toUpperCase()
  const lampiran = item.permintaan?.lampiran ?? []
  const isVerifikasiDisabled = Boolean(isSubmitting || item.status === "hijau" || isAlreadySubmitted)
  const progressValue = mapStatusToProgress(item.status)
  const progressBadgeClass = getProgressBadgeClass(progressValue)

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-50 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-white">
            {item.logo_pemda ? <img src={item.logo_pemda} className="w-full h-full object-contain p-1.5" /> : <span className="text-2xl">🏛️</span>}
          </div>
          <div className="min-w-0">
            <p className="line-clamp-2 text-base font-bold leading-tight text-[#202224] sm:text-sm">{entityLabel(item.permintaan?.pemda)}</p>
            <p className="line-clamp-2 break-words text-sm font-semibold text-blue-500 sm:text-xs">{entityLabel(item.permintaan?.aplikasi) || "E-Kinerja"}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild><button className="p-1 hover:bg-gray-100 rounded"><MoreVertical className="h-4 w-4 text-gray-400" /></button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(item)}>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={() => onDelete(item.id)}>Hapus</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-start gap-3 border-t pt-3">
        <span className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-bold ${progressBadgeClass}`}>{progressValue}%</span>
        <p className="line-clamp-3 text-base leading-7 text-gray-600 sm:text-sm sm:leading-6">{item.laporan_progress}</p>
      </div>

      <p className="text-sm font-bold text-red-500">Deadline: {formatDate(item.permintaan?.tanggal_deadline)}</p>

      {lampiran.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {lampiran.map((url, idx) => (
            <a key={idx} href={url} target="_blank" className="flex items-center gap-1 px-2 py-1 bg-gray-50 border rounded text-[10px] font-bold hover:bg-blue-50">
              File {idx + 1} <Download size={10} />
            </a>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3 border-t pt-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-gray-400">Dibuat: {formatDate(item.created_at)}</div>
        <div className="flex min-w-0 items-center gap-2">
          <Avatar className="h-7 w-7"><AvatarFallback className="bg-pink-100 text-pink-600 text-[10px]">{initials}</AvatarFallback></Avatar>
          <span className="truncate text-xs font-semibold text-gray-600">{programmerName}</span>
        </div>
      </div>

      <Button size="sm" className="mt-2 w-full py-5 text-sm" disabled={isVerifikasiDisabled} onClick={() => onSubmitVerifikasi(item)}>
        <SendHorizonal className="h-4 w-4 mr-2" />
        {isSubmitting ? "Mengajukan..." : isAlreadySubmitted ? "Sudah Diajukan" : item.status === "hijau" ? "Terverifikasi" : "Ajukan Verifikasi"}
      </Button>
    </div>
  )
}
