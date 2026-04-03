"use client"

import type { DistribusiItem } from "./DistribusiClient"
import { DistribusiCard, SelesaiCard } from "./DistribusiCard"
import { DistribusiTable } from "./DistribusiTable"

interface Props {
  distribusi: DistribusiItem[]
  showTable: boolean
  onSelesai: (id: string) => void
  onDelete: (id: string) => void
  onShowKomentar: (text: string) => void
}

export default function DistribusiBoard({ distribusi, showTable, onSelesai, onDelete, onShowKomentar }: Props) {
  const didistribusikan = distribusi.filter((d) => d.status === "didistribusikan" || d.status === "pending" || d.status === "revision")
  const selesai = distribusi.filter((d) => d.status === "approved")

  const columns = [
    { key: "distribusi" as const, label: "Telah Didistribusikan", count: didistribusikan.length, badgeClass: "bg-pink-100 text-pink-600" },
    { key: "selesai" as const, label: "Selesai", count: selesai.length, badgeClass: "bg-teal-100 text-teal-600" },
  ]

  if (showTable) {
    return <DistribusiTable distribusi={distribusi} onSelesai={onSelesai} onDelete={onDelete} onShowKomentar={onShowKomentar} />
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {columns.map((col) => (
        <div key={col.key} className="space-y-3">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${col.badgeClass}`}>
              {col.count}
            </span>
            <span className="text-base font-bold text-[#202224]">{col.label}</span>
          </div>
          <div className="space-y-3">
            {col.key === "distribusi" && didistribusikan.map((item) => <DistribusiCard key={item.id} item={item} onSelesai={onSelesai} onDelete={onDelete} onShowKomentar={onShowKomentar} />)}
            {col.key === "selesai" && selesai.map((item) => <SelesaiCard key={item.id} item={item} onDelete={onDelete} />)}
          </div>
        </div>
      ))}
    </div>
  )
}
