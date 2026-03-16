import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

interface Props {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export default function MasterRolesPagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: Props) {
  const totalPages = Math.ceil(total / pageSize)
  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div className="flex items-center justify-between text-sm text-[#202224]">

      {/* Left: jumlah per halaman */}
      <div className="flex items-center gap-2">
        <span className="text-black">Jumlah per halaman</span>
        <select
          value={pageSize}
          onChange={(e) => {
            onPageSizeChange(Number(e.target.value))
            onPageChange(1)
          }}
          className="rounded border border-gray-200 bg-white px-3 py-1.5 text-sm focus:outline-none"
        >
          {[4, 8, 12, 24].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Right: result info + nav */}
      <div className="flex items-center gap-2">
        <span className="text-[#313131]">
          {from}-{to} dari {total}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(1)}
            disabled={page === 1}
            className="flex h-9 w-10 items-center justify-center rounded bg-white border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="flex h-9 w-10 items-center justify-center rounded bg-white border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="flex h-9 w-10 items-center justify-center rounded bg-white border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={page >= totalPages}
            className="flex h-9 w-10 items-center justify-center rounded bg-white border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      </div>

    </div>
  )
}
