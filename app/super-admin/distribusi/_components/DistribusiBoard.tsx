// app/super-admin/distribusi/_components/DistribusiBoard.tsx

"use client"

import { Fragment, useMemo, useState } from "react"
import { ListFilter, ChevronDown } from "lucide-react"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import type { DistribusiItem } from "./DistribusiClient"
import { DistribusiCard, DistribusiPermintaanCard, SelesaiCard } from "./DistribusiCard"
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
  const [activeView, setActiveView] = useState<"table" | "permintaan" | "distribusi" | "selesai">("table")
  const [currentPage, setCurrentPage] = useState(1)
  const [sort, setSort] = useState<SortKey>("deadline-asc")
  const [sortOpen, setSortOpen] = useState(false)
  const cardPerPage = 7

  const didistribusikan = distribusi.filter((d) => d.status === "didistribusikan" || d.status === "pending" || d.status === "revision")
  const selesai = distribusi.filter((d) => d.status === "approved")

  const tabs = [
    { key: "table" as const, label: "Semua", count: distribusi.length },
    { key: "permintaan" as const, label: "Permintaan", count: distribusi.length },
    { key: "distribusi" as const, label: "Didistribusikan", count: didistribusikan.length },
    { key: "selesai" as const, label: "Selesai", count: selesai.length },
  ]

  const activeItems = useMemo(() => {
    const base = activeView === "distribusi" ? didistribusikan : activeView === "selesai" ? selesai : distribusi
    return sortItems(base, sort)
  }, [activeView, didistribusikan, distribusi, selesai, sort])

  const totalPages = Math.max(1, Math.ceil(activeItems.length / cardPerPage))
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * cardPerPage
    return activeItems.slice(startIndex, startIndex + cardPerPage)
  }, [activeItems, currentPage])

  const visiblePages = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1)
    }

    if (currentPage <= 3) return [1, 2, 3, 4, totalPages]
    if (currentPage >= totalPages - 2) return [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [1, currentPage - 1, currentPage, currentPage + 1, totalPages]
  }, [currentPage, totalPages])

  const activeSortLabel = SORT_OPTIONS.find((o) => o.key === sort)?.label ?? ""

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="inline-flex items-center gap-0.5 rounded-xl border border-gray-200 bg-gray-100 p-1">
          {tabs.map((tab) => {
            const isActive = activeView === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => { setActiveView(tab.key); setCurrentPage(1) }}
                className={`flex items-center gap-2 rounded-[9px] px-3 py-1.5 text-[13px] font-semibold transition-colors whitespace-nowrap ${
                  isActive ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold transition-colors ${isActive ? "bg-gray-100 text-gray-700" : "text-gray-400"}`}>
                  {tab.count}
                </span>
              </button>
            )
          })}
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

      {activeView === "table" ? (
        <DistribusiTable
          distribusi={activeItems}
          onSelesai={onSelesai}
          onDelete={onDelete}
          onShowKomentar={onShowKomentar}
          onEdit={onEdit}
          onRowClick={onRowClick}
        />
      ) : (
        <>
          {paginatedItems.length === 0 ? (
            <div className="rounded-4xl border border-dashed border-[#D6D9E2] bg-white px-6 py-16 text-center text-sm text-[#202224]/50 shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
              Belum ada data pada tab ini.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {paginatedItems.map((item) => {
                if (activeView === "permintaan") {
                  return <DistribusiPermintaanCard key={item.id} item={item} />
                }

                if (activeView === "selesai") {
                  return <SelesaiCard key={item.id} item={item} onDelete={onDelete} />
                }

                return (
                  <DistribusiCard
                    key={item.id}
                    item={item}
                    onSelesai={onSelesai}
                    onDelete={onDelete}
                    onShowKomentar={onShowKomentar}
                    onEdit={onEdit}
                  />
                )
              })}
            </div>
          )}

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3 text-[15px] text-[#202224]">
              <span>Jumlah per halaman</span>
              <div className="inline-flex items-center rounded-md bg-white px-4 py-2 font-semibold shadow-[0_4px_18px_rgba(0,0,0,0.06)]">
                {cardPerPage}
              </div>
            </div>

            <p className="text-[15px] text-[#202224]/80">
              {activeItems.length === 0 ? "0-0" : `${(currentPage - 1) * cardPerPage + 1}-${Math.min(currentPage * cardPerPage, activeItems.length)}`} dari {activeItems.length}
            </p>

            <Pagination className="mx-0 w-auto justify-start md:justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(event) => {
                      event.preventDefault()
                      if (currentPage > 1) setCurrentPage(currentPage - 1)
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {visiblePages.map((page, index) => {
                  const previousPage = visiblePages[index - 1]
                  const showEllipsis = previousPage && page - previousPage > 1

                  return (
                    <Fragment key={page}>
                      {showEllipsis ? (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : null}
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === page}
                          onClick={(event) => {
                            event.preventDefault()
                            setCurrentPage(page)
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    </Fragment>
                  )
                })}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(event) => {
                      event.preventDefault()
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </div>
  )
}
