import { Pencil, Trash2 } from "lucide-react"
import type { MasterRolesItem } from "./MasterRolesClient"

interface Props {
  item: MasterRolesItem
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function MasterRolesCard({ item, onEdit, onDelete }: Props) {
  const getFixedColor = (name: string, savedColor?: string) => {
    if (savedColor && savedColor !== "" && savedColor !== "#00B69B") return savedColor;
    const role = name.toLowerCase();
    if (role.includes("super")) return "#FCBE2D"; 
    if (role.includes("programmer")) return "#8280FF"; 
    if (role.includes("verifikator")) return "#FD5454"; 
    if (role.includes("admin")) return "#00B69B";
    return "#4880FF"; 
  }

  // @ts-ignore
  const displayColor = getFixedColor(item.name, item.color);

  return (
    <div className="rounded-2xl bg-white border border-[#B9B9B9]/30 shadow-[4px_4px_20px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col h-full transition-all hover:shadow-md">
      {/* Banner Warna Ramping: dari 171px -> 100px */}
      <div 
        className="h-[100px] w-full transition-colors duration-500" 
        style={{ backgroundColor: displayColor }} 
      />

      {/* Padding konten dikurangi: py-8 -> py-4 */}
      <div className="flex flex-col items-center gap-0.5 px-4 py-4 grow">
        <p className="text-[15px] font-bold text-[#202224] text-center capitalize">
          {item.name.replace("_", " ")}
        </p>
        <p className="text-[12px] text-[#202224] opacity-60 text-center line-clamp-1">
          {item.description}
        </p>
      </div>

      {/* Button Section Ramping: pb-8 -> pb-4, h-50px -> h-40px */}
      <div className="flex items-center justify-center gap-3 px-4 pb-4">
        <button
          onClick={() => onEdit(item.id)}
          className="flex items-center justify-center gap-2 rounded-lg border border-[#979797] w-[90px] h-[40px] transition hover:bg-gray-50 active:scale-95"
        >
          <Pencil className="h-4 w-4 text-[#787882]" />
          <span className="text-[13px] font-bold text-[#767676]">Edit</span>
        </button>

        <button
          onClick={() => onDelete(item.id)}
          className="flex items-center justify-center gap-2 rounded-lg border border-[#DC6262] w-[110px] h-[40px] transition hover:bg-red-50 active:scale-95"
        >
          <Trash2 className="h-4 w-4 text-[#DC6262]" />
          <span className="text-[13px] font-bold text-[#DB6262]">Hapus</span>
        </button>
      </div>
    </div>
  )
}