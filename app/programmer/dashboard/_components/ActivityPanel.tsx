import { useState } from "react"
import { ClipboardList } from "lucide-react"
import type { ProgrammerTaskItem } from "./types"
import { formatRelativeTime } from "./utils"
import { Pagination } from "./Pagination"

const PER_PAGE = 4

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
  if (statusLabel === "terverifikasi") return "Laporan berhasil diverifikasi."
  if (statusLabel === "revisi") return "Laporan dikembalikan untuk revisi."
  return "Laporan diajukan dan sedang menunggu verifikasi."
}

export function ActivityPanel({ items, loading }: Props) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(items.length / PER_PAGE))
  const paginated = items.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div className="lg:col-span-1 rounded-2xl border border-gray-100 bg-white shadow-sm flex flex-col">
      <div className="border-b border-gray-100 px-6 py-5">
        <h2 className="text-lg font-bold text-gray-900">Aktivitas Terbaru</h2>
        <p className="mt-1 text-sm text-gray-500">Timeline update terkini.</p>
      </div>

      <div className="flex-1 p-6">
        {loading ? (
          <EmptyState label="Memuat aktivitas..." />
        ) : items.length === 0 ? (
          <EmptyState label="Belum ada aktivitas." />
        ) : (
          <div className="relative border-l-2 border-gray-100 ml-3 space-y-6">
            {paginated.map((item, index) => {
              const isVerif = item.statusLabel === "terverifikasi"
              const isRevisi = item.statusLabel === "revisi"
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
        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={items.length}
          perPage={PER_PAGE}
          onPageChange={setPage}
        />
      </div>
    </div>
  )
}
