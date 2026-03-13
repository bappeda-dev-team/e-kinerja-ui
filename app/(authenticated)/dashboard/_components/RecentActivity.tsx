import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { DistribusiResponse } from "../../distribusi/_types"

interface Props {
  data: DistribusiResponse[]
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
        <div className="flex flex-col gap-4">
          {data.map((act) => {
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
