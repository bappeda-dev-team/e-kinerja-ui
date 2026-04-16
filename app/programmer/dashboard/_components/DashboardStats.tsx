import { AlertTriangle, BadgeCheck, Clock3, FileText } from "lucide-react"
import type { DashboardSummary } from "../types"

interface Props {
  summary: DashboardSummary
}

export function DashboardStats({ summary }: Props) {
  return (
    <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Laporan</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">{summary.total}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50/80">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-amber-600">Menunggu Verifikasi</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">{summary.menunggu}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
            <Clock3 className="h-6 w-6 text-amber-500" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-red-600">Perlu Revisi</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">{summary.revisi}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-600">Terverifikasi</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">{summary.terverifikasi}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
            <BadgeCheck className="h-6 w-6 text-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  )
}
