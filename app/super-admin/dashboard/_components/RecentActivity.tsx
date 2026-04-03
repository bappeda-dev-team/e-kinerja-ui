// app/super-admin/dashboard/_components/RecentActivity.tsx

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { DashboardDistribusi } from "../types"

const PREVIEW_COUNT = 5

interface Props {
  data: DashboardDistribusi[]
  loading?: boolean
}

function timeAgo(iso?: string) {
  if (!iso) return ""
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins} menit lalu`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} jam lalu`
  return `${Math.floor(hours / 24)} hari lalu`
}

export default function RecentActivity({ data, loading }: Props) {
  const [showAll, setShowAll] = useState(false)

  const visible = showAll ? data : data.slice(0, PREVIEW_COUNT)
  const hasMore = data.length > PREVIEW_COUNT

  return (
    <div className="rounded-2xl bg-white p-6 shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
      <h2 className="text-lg font-bold text-[#202224] mb-4">
        Aktivitas Terbaru
      </h2>

      {loading ? (
        <p className="text-sm text-[#202224]/40 text-center">Memuat...</p>
      ) : data.length === 0 ? (
        <p className="text-sm text-[#202224]/40 text-center">Belum ada aktivitas.</p>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {visible.map((act) => {
              const name = act.admin?.full_name ?? act.admin?.username ?? "Admin"
              return (
                <div key={act.id} className="flex items-start gap-3">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                      {name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm text-[#202224]">
                      <span className="font-bold">{name}</span>{" "}
                      mendistribusikan pekerjaan
                    </p>
                    <span className="text-xs text-[#202224]/50 mt-0.5">
                      {timeAgo(act.created_at)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {hasMore && (
            <button
              onClick={() => setShowAll((v) => !v)}
              className="mt-4 w-full rounded-xl border border-[#202224]/15 py-2 text-sm font-semibold text-[#202224]/70 hover:bg-[#F1F4F9] transition-colors"
            >
              {showAll ? "Sembunyikan" : `Lihat Semua (${data.length - PREVIEW_COUNT} lainnya)`}
            </button>
          )}
        </>
      )}
    </div>
  )
}
