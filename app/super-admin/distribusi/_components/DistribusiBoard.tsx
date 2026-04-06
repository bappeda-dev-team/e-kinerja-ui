// app/super-admin/distribusi/_components/DistribusiBoard.tsx

"use client"

import { Fragment, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { LayoutGrid, Table2, AlignJustify, Inbox, ClipboardList, Check } from "lucide-react"

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
}

export default function DistribusiBoard({ distribusi, onSelesai, onDelete, onShowKomentar }: Props) {
  const [activeView, setActiveView] = useState<"table" | "permintaan" | "distribusi" | "selesai">("table")
  const [currentPage, setCurrentPage] = useState(1)
  const cardPerPage = 7

  const didistribusikan = distribusi.filter((d) => d.status === "didistribusikan" || d.status === "pending" || d.status === "revision")
  const selesai = distribusi.filter((d) => d.status === "approved")

  const tabs = [
    { key: "table" as const, label: "Lihat Semua", count: distribusi.length, icon: AlignJustify },
    { key: "permintaan" as const, label: "Permintaan", count: distribusi.length, icon: Inbox },
    { key: "distribusi" as const, label: "Didistribusikan", count: didistribusikan.length, icon: ClipboardList },
    { key: "selesai" as const, label: "Selesai", count: selesai.length, icon: Check },
  ]

  const activeItems = useMemo(() => {
    if (activeView === "distribusi") return didistribusikan
    if (activeView === "selesai") return selesai
    return distribusi
  }, [activeView, didistribusikan, distribusi, selesai])

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

  return (
    <div className="space-y-6">
      <div className="inline-flex items-center gap-1 overflow-x-auto rounded-full bg-gray-100 p-1.5 max-w-full">
        {tabs.map((tab) => {
          const isActive = activeView === tab.key
          const Icon = tab.icon ?? LayoutGrid
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setActiveView(tab.key)
                setCurrentPage(1)
              }}
              className={`relative inline-flex items-center justify-center whitespace-nowrap rounded-full px-5 py-2.5 text-[13px] font-semibold transition-colors duration-200 ${
                isActive
                  ? "text-gray-900"
                  : "text-gray-500 hover:bg-gray-200/50 hover:text-gray-900"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 z-0 rounded-full bg-white shadow-sm"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span>{tab.key === "table" ? tab.label : `${tab.label} (${tab.count})`}</span>
              </span>
            </button>
          )
        })}
      </div>

      {activeView === "table" ? (
        <DistribusiTable distribusi={distribusi} onSelesai={onSelesai} onDelete={onDelete} onShowKomentar={onShowKomentar} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {paginatedItems.map((item) => {
              if (activeView === "permintaan") {
                return <DistribusiPermintaanCard key={item.id} item={item} />
              }

              if (activeView === "selesai") {
                return <SelesaiCard key={item.id} item={item} onDelete={onDelete} />
              }

              return <DistribusiCard key={item.id} item={item} onSelesai={onSelesai} onDelete={onDelete} onShowKomentar={onShowKomentar} />
            })}
          </div>

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
