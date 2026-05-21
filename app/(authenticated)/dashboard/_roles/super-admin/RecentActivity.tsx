
import { useState } from "react"
import { Download, BookOpen } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { DashboardDistribusi } from "@/types/dashboard"

const PANDUAN_URL = "https://drive.google.com/drive/folders/1b7OQHVz00rMGBS3reA5fjEbBGBCnyIgO"

function PanduanCard() {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-[6px_6px_54px_rgba(0,0,0,0.05)] flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50">
          <BookOpen className="h-5 w-5 text-orange-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#202224]">Download Panduan Website</p>
          <p className="text-xs text-[#202224]/50">(Manual User)</p>
        </div>
      </div>
      <a
        href={PANDUAN_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 rounded-xl bg-[#4880FF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3a6de0] transition-colors w-full"
      >
        <Download className="h-4 w-4" />
        Download
      </a>
    </div>
  )
}

const PREVIEW_COUNT = 2

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

export { PanduanCard }

export default function RecentActivity({ data, loading }: Props) {
  const [showAll, setShowAll] = useState(false)

  const visible = showAll ? data : data.slice(0, PREVIEW_COUNT)
  const hasMore = data.length > PREVIEW_COUNT

  return (
    <div className="rounded-2xl bg-white p-6 shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#202224]">Aktivitas Terbaru</h2>
        {hasMore && (
          <button
            onClick={() => setShowAll((v) => !v)}
            className="text-xs font-semibold text-[#4880FF] hover:underline"
          >
            {showAll ? "Sembunyikan" : "View All"}
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-[#202224]/40 text-center">Memuat...</p>
      ) : data.length === 0 ? (
        <p className="text-sm text-[#202224]/40 text-center">Belum ada aktivitas.</p>
      ) : (
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
      )}
    </div>
  )
}
