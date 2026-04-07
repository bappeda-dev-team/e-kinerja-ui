import { useState } from "react"
import { ClipboardList } from "lucide-react"
import type { AdminPermintaanItem } from "./types"
import { Pagination } from "@/app/programmer/dashboard/_components/Pagination"

const PER_PAGE = 4

interface Props {
  items: AdminPermintaanItem[]
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

function formatRelativeTime(value?: string) {
  if (!value) return "Waktu tidak diketahui"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Waktu tidak diketahui"
  const diffHours = Math.round((new Date().getTime() - date.getTime()) / (1000 * 60 * 60))
  if (diffHours < 1) return "Baru saja"
  if (diffHours < 24) return `${diffHours} jam lalu`
  const diffDays = Math.round(diffHours / 24)
  if (diffDays === 1) return "Kemarin"
  if (diffDays < 7) return `${diffDays} hari lalu`
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(date)
}

export function RecentDistribusiPanel({ items, loading }: Props) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(items.length / PER_PAGE))
  const paginated = items.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div className="lg:col-span-1 rounded-2xl border border-gray-100 bg-white shadow-sm flex flex-col">
      <div className="border-b border-gray-100 px-6 py-5">
        <h2 className="text-lg font-bold text-gray-900">Distribusi Terbaru</h2>
        <p className="mt-1 text-sm text-gray-500">Pekerjaan yang baru saja didistribusikan.</p>
      </div>

      <div className="flex-1 p-6">
        {loading ? (
          <EmptyState label="Memuat aktivitas..." />
        ) : items.length === 0 ? (
          <EmptyState label="Belum ada distribusi." />
        ) : (
          <div className="relative border-l-2 border-gray-100 ml-3 space-y-6">
            {paginated.map((item, index) => (
              <div key={`${item.id}-${index}`} className="relative pl-6">
                <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-4 border-white bg-emerald-500" />
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-bold text-gray-400">{formatRelativeTime(item.updatedAt)}</p>
                  <p className="text-sm font-semibold text-gray-900 leading-snug">{item.nama_pemda}</p>
                  <p className="text-sm text-gray-600">
                    {item.programmers.length > 0
                      ? `Ditugaskan ke ${item.programmers.join(", ")}`
                      : "Pekerjaan didistribusikan"}
                  </p>
                </div>
              </div>
            ))}
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
