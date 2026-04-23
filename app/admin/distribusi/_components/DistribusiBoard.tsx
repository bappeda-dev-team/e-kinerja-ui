// app/admin/distribusi/_components/DistribusiBoard.tsx

"use client"

import { useMemo, useState, useRef, useEffect } from "react"
import { ListFilter, ChevronDown } from "lucide-react"

import type { DistribusiItem } from "./DistribusiClient"
import { DistribusiTable } from "./DistribusiTable"

interface Props {
  distribusi: DistribusiItem[]
  onSelesai: (id: string) => void
  onDelete: (id: string) => void
  onShowKomentar: (text: string) => void
  onEdit: (item: DistribusiItem) => void
  onRowClick: (item: DistribusiItem) => void
}

type SortKey = "deadline-asc" | "deadline-desc" | "newest" | "oldest"
type ViewType = "table" | "distribusi" | "selesai"

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "deadline-asc", label: "Deadline terdekat" },
  { key: "deadline-desc", label: "Deadline terjauh" },
  { key: "newest", label: "Terbaru ditambahkan" },
  { key: "oldest", label: "Terlama ditambahkan" },
]

function sortItems(items: DistribusiItem[], sort: SortKey) {
  return [...items].sort((a, b) => {
    if (sort === "deadline-asc") return new Date(a.deadline || "9999-12-31").getTime() - new Date(b.deadline || "9999-12-31").getTime()
    if (sort === "deadline-desc") return new Date(b.deadline || "1970-01-01").getTime() - new Date(a.deadline || "1970-01-01").getTime()
    if (sort === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  })
}

export default function DistribusiBoard({ distribusi, onSelesai, onDelete, onShowKomentar, onEdit, onRowClick }: Props) {
  const [activeView, setActiveView] = useState<ViewType>("table")
  const [sort, setSort] = useState<SortKey>("deadline-asc")
  const [sortOpen, setSortOpen] = useState(false)
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, transform: "translateX(0)" })
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([])

  const didistribusikan = distribusi.filter((d) => d.status === "didistribusikan" || d.status === "pending" || d.status === "revision")
  const selesai = distribusi.filter((d) => d.status === "approved")

  const tabs = [
    { key: "table" as const, label: "Semua", count: distribusi.length },
    { key: "distribusi" as const, label: "Didistribusikan", count: didistribusikan.length },
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
    const base = activeView === "distribusi" ? didistribusikan : activeView === "selesai" ? selesai : distribusi
    return sortItems(base, sort)
  }, [activeView, didistribusikan, distribusi, selesai, sort])

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
                ref={(el) => { if (el) tabsRef.current[idx] = el }}
                type="button"
                onClick={() => setActiveView(tab.key)}
                className={`flex items-center gap-2 rounded-[9px] px-3 py-1.5 text-[13px] font-semibold whitespace-nowrap relative z-10 transition-colors duration-300 ${
                  isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold transition-all duration-300 ${isActive ? "bg-gray-100 text-gray-700" : "text-gray-400"}`}>
                  {tab.count}
                </span>
              </button>
            )
          })}
          <div
            className="absolute top-1 bottom-1 rounded-[9px] bg-white shadow-sm pointer-events-none transition-all duration-300 ease-out"
            style={{ width: `${indicatorStyle.width}px`, transform: indicatorStyle.transform }}
          />
        </div>

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

      <DistribusiTable
        distribusi={activeItems}
        onSelesai={onSelesai}
        onDelete={onDelete}
        onShowKomentar={onShowKomentar}
        onEdit={onEdit}
        onRowClick={onRowClick}
      />
    </div>
  )
}
