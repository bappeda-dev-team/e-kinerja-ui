import { Pencil, Trash2 } from "lucide-react"
import TopographicBanner from "./TopographicBanner"
import type { MasterRolesItem } from "../data"

interface Props {
  item: MasterRolesItem
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function MasterRolesCard({ item, onEdit, onDelete }: Props) {
  return (
    <div className="rounded-2xl bg-white border border-[#B9B9B9]/50 shadow-[6px_6px_54px_rgba(0,0,0,0.03)] overflow-hidden">

      <TopographicBanner color={item.color} />

      <div className="flex flex-col items-center gap-1 px-6 py-4">
        <p className="text-base font-bold text-[#202224]">{item.label}</p>
        <p className="text-sm text-[#202224]/60">{item.description}</p>
      </div>

      <div className="flex items-center gap-3 px-6 pb-5">
        <button
          onClick={() => onEdit(item.id)}
          className="flex items-center gap-1.5 rounded-md border border-gray-200 px-4 py-1.5 text-sm font-medium text-[#202224] hover:bg-gray-50"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-4 py-1.5 text-sm font-medium text-red-500 hover:bg-red-100"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Hapus
        </button>
      </div>

    </div>
  )
}
