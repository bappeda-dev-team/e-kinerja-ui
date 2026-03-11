import { MoreVertical } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { LaporanKinerjaItem } from "../data"

interface Props {
  item: LaporanKinerjaItem
  onEdit: (item: LaporanKinerjaItem) => void
  onDelete: (id: string) => void
}

const statusConfig: Record<number, { color: string; bg: string }> = {
  0:   { color: "text-gray-400",   bg: "bg-gray-100" },
  25:  { color: "text-red-500",    bg: "bg-red-100" },
  50:  { color: "text-orange-500", bg: "bg-orange-100" },
  75:  { color: "text-yellow-500", bg: "bg-yellow-100" },
  100: { color: "text-green-600",  bg: "bg-green-100" },
}

function getStatusStyle(status: number) {
  const exact = statusConfig[status]
  if (exact) return exact
  if (status >= 75) return statusConfig[75]
  if (status >= 50) return statusConfig[50]
  if (status >= 25) return statusConfig[25]
  return statusConfig[0]
}

export default function LaporanKinerjaCard({ item, onEdit, onDelete }: Props) {
  const style = getStatusStyle(item.status)

  // Split "Pemda Kota Bandung - Dashboard" → pemda & menu
  const parts = item.permintaan.split(" - ")
  const pemda = parts[0] ?? item.permintaan
  const menu = parts[1] ?? ""

  const initials = item.programmer
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="rounded-2xl bg-white p-5 shadow-[6px_6px_54px_rgba(0,0,0,0.05)] flex flex-col gap-3">

      {/* Header: logo + nama + kebab menu */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Logo placeholder (coat of arms style) */}
          <div className="h-12 w-12 rounded-lg bg-yellow-50 flex items-center justify-center shrink-0 border border-yellow-200">
            <span className="text-2xl">🏛️</span>
          </div>
          <div>
            <p className="text-sm font-bold text-[#202224] leading-tight">
              {pemda}
            </p>
            <p className="text-xs text-blue-500 font-semibold">
              E-Kinerja
              <span className="text-[#202224]/50 font-normal"> · {menu}</span>
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
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onDelete(item.id)}
            >
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Divider */}
      <div className="border-t border-black/10" />

      {/* Progress badge + description */}
      <div className="flex items-start gap-2">
        <span
          className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${style.bg} ${style.color}`}
        >
          {item.status}%
        </span>
        <p className="text-sm text-[#202224]/80 leading-snug">
          {item.progress}
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-black/10" />

      {/* Footer: tanggal + avatar programmer */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5 text-xs text-[#202224]/60">
          <span>
            <span className="font-semibold text-[#202224]/80">Dibuat:</span>{" "}
            {item.created_at}
          </span>
          <span>
            <span className="font-semibold text-[#202224]/80">Diperbarui:</span>{" "}
            {item.updated_at}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-pink-200 text-pink-700 text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-semibold text-[#202224]/70">
            {item.programmer.split(" ")[0]}
          </span>
        </div>
      </div>

    </div>
  )
}
