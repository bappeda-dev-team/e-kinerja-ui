import { ChevronRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { activities } from "../data"

export default function RecentActivity() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
      <h2 className="text-lg font-bold text-[#202224] mb-4">
        Aktivitas Terbaru
      </h2>

      <div className="flex flex-col gap-4">
        {activities.map((act, i) => (
          <div key={i} className="flex items-start gap-3">
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarImage src={act.avatar} />
              <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                {act.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm text-[#202224]">
                <span className="font-bold">{act.name}</span>{" "}
                {act.desc}
              </p>
              <span className="text-xs text-[#202224]/50 mt-0.5">
                {act.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-5 flex items-center gap-1 text-sm text-[#202224]/60 hover:text-[#202224]">
        View all
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}
