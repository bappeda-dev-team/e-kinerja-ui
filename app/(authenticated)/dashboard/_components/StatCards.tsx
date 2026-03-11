import { TrendingUp, TrendingDown } from "lucide-react"
import { statCards } from "../data"


export default function StatCards() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className="rounded-2xl bg-white p-5 shadow-[6px_6px_54px_rgba(0,0,0,0.05)] flex items-center justify-between"
          >
            <div className="flex flex-col gap-1">
              <span className="text-sm text-[#202224]/70 font-semibold">
                {card.label}
              </span>
              <span className="text-3xl font-bold text-[#202224] leading-tight">
                {card.value}
              </span>
              {card.subUp === true && (
                <span className="flex items-center gap-1 text-xs text-green-500 font-semibold">
                  <TrendingUp className="h-3 w-3" />
                  {card.sub}
                </span>
              )}
              {card.subUp === false && (
                <span className="flex items-center gap-1 text-xs text-red-500 font-semibold">
                  <TrendingDown className="h-3 w-3" />
                  {card.sub}
                </span>
              )}
              {card.subUp === null && (
                <span
                  className={`text-xs font-semibold ${
                    card.subDanger ? "text-red-500" : "text-[#202224]/60"
                  }`}
                >
                  {card.sub}
                </span>
              )}
            </div>
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-full ${card.iconBg}`}
            >
              <Icon className={`h-6 w-6 ${card.iconColor}`} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
