import { useState } from "react"
import { ClipboardList } from "lucide-react"
import type { ProgrammerTaskItem } from "@/types/dashboard"
import { formatRelativeTime } from "./utils"

const PER_PAGE = 2

interface Props {
  items: ProgrammerTaskItem[]
  loading: boolean
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center rounded-[20px] border border-dashed border-[#D5D5D5] bg-gray-50/50 text-sm text-[#202224]/50">
      <ClipboardList className="h-8 w-8 text-gray-300 mb-3" />
      {label}
    </div>
  )
}

function getActivityLabel(statusLabel: ProgrammerTaskItem["statusLabel"]) {
  if (statusLabel === "approved") return "Laporan berhasil diverifikasi."
  if (statusLabel === "revision") return "Laporan dikembalikan untuk revisi."
  return "Laporan diajukan dan sedang menunggu verifikasi."
}

export function ActivityPanel({ items, loading }: Props) {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? items : items.slice(0, PER_PAGE)
  const hasMore = items.length > PER_PAGE

  return (
    <div className="lg:col-span-1 rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col">
      <div className="border-b border-gray-200 px-6 py-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Aktivitas Terbaru</h2>
          <p className="mt-1 text-sm text-gray-500">Timeline update terkini.</p>
        </div>
        {hasMore && (
          <button
            onClick={() => setShowAll((v) => !v)}
            className="text-xs font-semibold text-[#4880FF] hover:underline shrink-0"
          >
            {showAll ? "Sembunyikan" : "View All"}
          </button>
        )}
      </div>

      <div className="flex-1 p-6">
        {loading ? (
          <EmptyState label="Memuat aktivitas..." />
        ) : items.length === 0 ? (
          <EmptyState label="Belum ada aktivitas." />
        ) : (
          <div className="relative border-l-2 border-gray-100 ml-3 space-y-6">
            {visible.map((item, index) => {
              const isVerif = item.statusLabel === "approved"
              const isRevisi = item.statusLabel === "revision"
              const colorClass = isVerif ? "bg-emerald-500" : isRevisi ? "bg-red-500" : "bg-amber-500"

              return (
                <div key={`${item.id}-${item.updatedAt}-${index}`} className="relative pl-6">
                  <div className={`absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-4 border-white ${colorClass}`} />
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-bold text-gray-400">{formatRelativeTime(item.updatedAt)}</p>
                    <p className="text-sm font-semibold text-gray-900 leading-snug">{item.pemda}</p>
                    <p className="text-sm text-gray-600">{getActivityLabel(item.statusLabel)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
