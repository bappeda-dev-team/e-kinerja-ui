import { MoreVertical } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
}

export default function LaporanKinerjaCard({ item, onEdit, onDelete }: Props) {

  const programmerName = item.programmer?.full_name ?? "Programmer"
  const initials = programmerName.slice(0, 2).toUpperCase()

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

            <DropdownMenuItem onClick={() => onEdit(item)}>
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onDelete(item.id)}
            >
              Hapus
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>

      </div>

      <div className="border-t border-black/10" />

      {/* Progress */}
      <div className="flex items-start gap-2">

        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold bg-blue-100 text-blue-600">
          Progress
        </span>

        <p className="text-sm text-[#202224]/80 leading-snug">
          {item.laporan_progress}
        </p>

      </div>

      <div className="border-t border-black/10" />

      {/* Footer */}
      <div className="flex items-center justify-between">

        <div className="flex flex-col gap-0.5 text-xs text-[#202224]/60">
          <span>
            <span className="font-semibold text-[#202224]/80">
              Dibuat:
            </span>{" "}
            {item.created_at ?? "-"}
          </span>
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

    </div>
  )
}