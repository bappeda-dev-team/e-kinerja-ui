import { ClipboardList, Share2, FileText, TrendingUp } from "lucide-react"

interface Props {
  totalPermintaan: number
  totalDistribusi: number
  totalLaporan: number
  loading?: boolean
}

export default function StatCards({ totalPermintaan, totalDistribusi, totalLaporan, loading }: Props) {

  const cards = [
    {
      label: "Total Permintaan",
      value: totalPermintaan,
      icon: ClipboardList,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      label: "Total Distribusi",
      value: totalDistribusi,
      icon: Share2,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
    },
    {
      label: "Total Laporan",
      value: totalLaporan,
      icon: FileText,
      iconBg: "bg-green-50",
      iconColor: "text-green-500",
    },
    {
      label: "Selesai",
      value: totalLaporan,
      icon: TrendingUp,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-500",
    },
  ]

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
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
                {loading ? "..." : card.value}
              </span>
            </div>
            <div className={`flex h-14 w-14 items-center justify-center rounded-full ${card.iconBg}`}>
              <Icon className={`h-6 w-6 ${card.iconColor}`} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
