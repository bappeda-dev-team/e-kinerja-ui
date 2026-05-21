import Link from "next/link"
import { ClipboardList, CheckCircle2, Clock } from "lucide-react"
import type { AdminDashboardSummary } from "@/types/dashboard"

interface Props {
  summary: AdminDashboardSummary
}

export function AdminDashboardStats({ summary }: Props) {
  const cards = [
    {
      label: "Total Permintaan",
      value: summary.total,
      href: "/permintaan",
      icon: ClipboardList,
      labelClass: "text-gray-500",
      iconBg: "bg-blue-50/80",
      iconClass: "text-blue-600",
    },
    {
      label: "Sudah Didistribusikan",
      value: summary.sudahDistribusi,
      href: "/distribusi",
      icon: CheckCircle2,
      labelClass: "text-emerald-600",
      iconBg: "bg-emerald-50",
      iconClass: "text-emerald-500",
    },
    {
      label: "Belum Didistribusikan",
      value: summary.belumDistribusi,
      href: "/permintaan",
      icon: Clock,
      labelClass: "text-amber-600",
      iconBg: "bg-amber-50",
      iconClass: "text-amber-500",
    },
  ]

  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon

        return (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-sm font-medium ${card.labelClass}`}>{card.label}</p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">{card.value}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${card.iconBg}`}>
                <Icon className={`h-6 w-6 ${card.iconClass}`} />
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
