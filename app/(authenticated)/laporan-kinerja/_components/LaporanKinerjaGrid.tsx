import LaporanKinerjaCard from "./LaporanKinerjaCard"
import type { LaporanKinerjaItem } from "../data"

interface Props {
  data: LaporanKinerjaItem[]
  onEdit: (item: LaporanKinerjaItem) => void
  onDelete: (id: string) => void
}

export default function LaporanKinerjaGrid({ data, onEdit, onDelete }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-2xl bg-white p-12 text-[#202224]/40 shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
        Belum ada laporan kinerja.
      </div>
    )
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {data.map((item) => (
        <LaporanKinerjaCard
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
