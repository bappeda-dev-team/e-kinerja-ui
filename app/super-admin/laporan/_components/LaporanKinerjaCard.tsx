// app/super-admin/laporan/_components/LaporanKinerjaCard.tsx

"use client"

import { MoreVertical, SendHorizonal, Download, Paperclip } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { LaporanKinerjaItem } from "../_types"

interface Props {
  item: LaporanKinerjaItem; onEdit: (item: LaporanKinerjaItem) => void; onDelete: (id: string) => void
  onSubmitVerifikasi: (item: LaporanKinerjaItem) => void; isSubmitting?: boolean
}

function formatDate(iso?: string) {
  return iso ? new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"
}

function entityLabel(value?: string | { name: string }) {
  if (!value) return "-"
  return typeof value === "string" ? value : value.name
}

export default function LaporanKinerjaCard({ item, onEdit, onDelete, onSubmitVerifikasi, isSubmitting }: Props) {
  const programmerName = item.programmer?.full_name ?? "Programmer"
  const initials = programmerName.slice(0, 2).toUpperCase()
  const lampiran = item.permintaan?.lampiran ?? []

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm flex flex-col gap-3 border border-gray-50">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-white border flex items-center justify-center shrink-0 overflow-hidden">
            {item.logo_pemda ? <img src={item.logo_pemda} className="w-full h-full object-contain p-1.5" /> : <span className="text-2xl">🏛️</span>}
          </div>
          <div>
            <p className="text-sm font-bold text-[#202224] leading-tight">{entityLabel(item.permintaan?.pemda)}</p>
            <p className="text-xs text-blue-500 font-semibold">{entityLabel(item.permintaan?.aplikasi) || "E-Kinerja"}</p>
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

      <div className="border-t pt-3 flex items-center gap-3">
        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-600 text-[10px] font-bold rounded-full">75%</span>
        <p className="text-sm text-gray-600 line-clamp-2">{item.laporan_progress}</p>
      </div>

      <p className="text-[11px] font-bold text-red-500">Deadline: {formatDate(item.permintaan?.tanggal_deadline)}</p>

      {lampiran.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {lampiran.map((url, idx) => (
            <a key={idx} href={url} target="_blank" className="flex items-center gap-1 px-2 py-1 bg-gray-50 border rounded text-[10px] font-bold hover:bg-blue-50">
              File {idx + 1} <Download size={10} />
            </a>
          ))}
        </div>
      )}

      <div className="border-t pt-3 flex items-center justify-between">
        <div className="text-[10px] text-gray-400">Dibuat: {formatDate(item.created_at)}</div>
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7"><AvatarFallback className="bg-pink-100 text-pink-600 text-[10px]">{initials}</AvatarFallback></Avatar>
          <span className="text-[11px] font-semibold text-gray-600">{programmerName}</span>
        </div>
      </div>

      <Button size="sm" className="w-full mt-2" disabled={isSubmitting || item.status === "hijau"} onClick={() => onSubmitVerifikasi(item)}>
        <SendHorizonal className="h-4 w-4 mr-2" />
        {isSubmitting ? "Mengajukan..." : item.status === "hijau" ? "Terverifikasi" : "Ajukan Verifikasi"}
      </Button>
    </div>
  )
}
