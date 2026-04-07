import { ClipboardList, CheckCircle2, Clock } from "lucide-react"
import type { AdminDashboardSummary } from "./types"

interface Props {
  summary: AdminDashboardSummary
}

export function AdminDashboardStats({ summary }: Props) {
  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-3">
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Permintaan</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">{summary.total}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50/80">
            <ClipboardList className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-600">Sudah Didistribusikan</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">{summary.sudahDistribusi}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-amber-600">Belum Didistribusikan</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">{summary.belumDistribusi}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
            <Clock className="h-6 w-6 text-amber-500" />
          </div>
        </div>
      </div>
    </div>
  )
}
