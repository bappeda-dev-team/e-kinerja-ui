
"use client"

import { useMemo, useState, useRef, useEffect } from "react"
import { ListFilter, ChevronDown } from "lucide-react"

import type { VerifikasiItem } from "./VerifikasiClient"
import { VerifikasiTable } from "./VerifikasiTable"

interface Props {
  data: VerifikasiItem[]
  onVerify: (item: VerifikasiItem) => void
}

type ViewType = "table" | "selesai"
type SortKey = "deadline-asc" | "deadline-desc" | "newest" | "oldest"

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "deadline-asc", label: "Deadline terdekat" },
  { key: "deadline-desc", label: "Deadline terjauh" },
  { key: "newest", label: "Terbaru ditambahkan" },
  { key: "oldest", label: "Terlama ditambahkan" },
]

function sortItems(items: VerifikasiItem[], sort: SortKey) {
  return [...items].sort((a, b) => {
    if (sort === "deadline-asc") return new Date(a.tanggal_deadline || "9999-12-31").getTime() - new Date(b.tanggal_deadline || "9999-12-31").getTime()
    if (sort === "deadline-desc") return new Date(b.tanggal_deadline || "1970-01-01").getTime() - new Date(a.tanggal_deadline || "1970-01-01").getTime()
    if (sort === "newest") return new Date(b.tanggal_diajukan || "").getTime() - new Date(a.tanggal_diajukan || "").getTime()
    return new Date(a.tanggal_diajukan || "").getTime() - new Date(b.tanggal_diajukan || "").getTime()
  })
}

export default function VerifikasiBoard({ data, onVerify }: Props) {
  const [activeView, setActiveView] = useState<ViewType>("table")
  const [sort, setSort] = useState<SortKey>("deadline-asc")
  const [sortOpen, setSortOpen] = useState(false)
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, transform: "translateX(0px)" })
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([])

  const selesai = data.filter((item) => item.status === "terverifikasi")

  const tabs = [
    { key: "table" as const, label: "Lihat Semua", count: data.length },
    { key: "selesai" as const, label: "Selesai", count: selesai.length },
  ]

  useEffect(() => {
    const activeIndex = tabs.findIndex((t) => t.key === activeView)
    const activeButton = tabsRef.current[activeIndex]
    if (activeButton) {
      setIndicatorStyle({
        width: activeButton.offsetWidth,
        transform: `translateX(${activeButton.offsetLeft}px)`,
      })
    }
  }, [activeView])

  const activeItems = useMemo(() => {
    const base = activeView === "selesai" ? selesai : data
    return sortItems(base, sort)
  }, [activeView, data, selesai, sort])

  const activeSortLabel = SORT_OPTIONS.find((o) => o.key === sort)?.label ?? ""

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="inline-flex items-center gap-0.5 rounded-xl border border-gray-200 bg-gray-100 p-1 relative">
          {tabs.map((tab, idx) => {
            const isActive = activeView === tab.key
            return (
              <button
                key={tab.key}
                ref={(el) => { tabsRef.current[idx] = el }}
                type="button"
                onClick={() => setActiveView(tab.key)}
                className={`relative flex items-center gap-2 rounded-[9px] px-3 py-1.5 text-[13px] font-semibold transition-colors whitespace-nowrap z-10 ${
                  isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold transition-colors ${isActive ? "bg-gray-100 text-gray-700" : "text-gray-400"}`}>
                  {tab.count}
                </span>
              </button>
            )
          })}

          {/* Sliding white pill */}
          <div
            className="absolute top-1 bottom-1 rounded-[9px] bg-white shadow-sm pointer-events-none transition-all duration-300 ease-out"
            style={{ width: `${indicatorStyle.width}px`, transform: indicatorStyle.transform }}
          />
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setSortOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-gray-600 shadow-sm hover:bg-gray-50 transition"
          >
            <ListFilter className="size-4 text-gray-400" />
            {activeSortLabel}
            <ChevronDown className={`size-3.5 text-gray-400 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
          </button>
          {sortOpen && (
            <div className="absolute right-0 z-50 mt-2 w-52 rounded-2xl border border-gray-100 bg-white py-1.5 shadow-xl">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => { setSort(opt.key); setSortOpen(false) }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  <span className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition ${sort === opt.key ? "border-blue-500" : "border-gray-300"}`}>
                    {sort === opt.key && <span className="h-2 w-2 rounded-full bg-blue-500" />}
                  </span>
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <VerifikasiTable data={activeItems} onVerify={onVerify} />
    </div>
  )
}
