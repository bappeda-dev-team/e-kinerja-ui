import { useState } from "react"
import { AlertCircle, ClipboardList } from "lucide-react"
import type { AdminPermintaanItem } from "@/types/dashboard"
import { Pagination } from "@/app/(authenticated)/dashboard/_roles/programmer/Pagination"

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

function formatDate(value?: string) {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "-"
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(date)
}

export function PendingPanel({ items, loading }: Props) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(items.length / PER_PAGE))
  const paginated = items.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div className="lg:col-span-2 xl:col-span-3 rounded-2xl border border-gray-100 bg-white shadow-sm flex flex-col">
      <div className="border-b border-gray-100 px-6 py-5">
        <div className="flex items-center gap-2 text-gray-900">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-bold">Belum Didistribusikan</h2>
        </div>
        <p className="mt-1 text-sm text-gray-500">Permintaan yang belum memiliki pelaksana.</p>
      </div>

      <div className="flex-1 p-4">
        {loading ? (
          <EmptyState label="Memuat data permintaan..." />
        ) : items.length === 0 ? (
          <EmptyState label="Semua permintaan sudah didistribusikan." />
        ) : (
          <div className="flex flex-col gap-2">
            {paginated.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-gray-50 bg-gray-50/50 p-4 transition-colors hover:bg-gray-100/50"
              >
                <div className="flex items-center gap-4">
                  <div className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-amber-400" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{item.nama_pemda}</h3>
                      <span className="rounded-md bg-gray-200/50 px-2 py-0.5 text-[10px] font-bold text-gray-600">
                        {item.aplikasi}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-1">{item.menu}</p>
                  </div>
                </div>
                <div className="shrink-0 text-left sm:text-right ml-6 sm:ml-0">
                  <p className="text-xs font-semibold text-gray-500">Deadline</p>
                  <p className="text-sm font-bold text-amber-600">{formatDate(item.deadline)}</p>
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
