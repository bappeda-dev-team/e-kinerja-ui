// app/super-admin/verifikasi/_components/VerifikasiBoard.tsx

"use client"

import { Fragment, useMemo, useState } from "react"
import { LayoutGrid, AlignJustify, Inbox, ClipboardList, Check } from "lucide-react"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import type { VerifikasiItem } from "./VerifikasiClient"
import { VerifikasiCard, VerifikasiPermintaanCard, VerifikasiSelesaiCard } from "./VerifikasiCard"
import { VerifikasiTable } from "./VerifikasiTable"

interface Props {
  data: VerifikasiItem[]
  onVerify: (item: VerifikasiItem) => void
}

export default function VerifikasiBoard({ data, onVerify }: Props) {
  const [activeView, setActiveView] = useState<"table" | "permintaan" | "distribusi" | "selesai">("table")
  const [currentPage, setCurrentPage] = useState(1)
  const cardPerPage = 7

  const didistribusikan = data.filter((item) => item.status === "menunggu" || item.status === "revisi")
  const selesai = data.filter((item) => item.status === "terverifikasi")

  const tabs = [
    { key: "table" as const, label: "Lihat Semua", count: data.length, icon: AlignJustify },
    { key: "permintaan" as const, label: "Permintaan", count: data.length, icon: Inbox },
    { key: "distribusi" as const, label: "Didistribusikan", count: didistribusikan.length, icon: ClipboardList },
    { key: "selesai" as const, label: "Selesai", count: selesai.length, icon: Check },
  ]

  const activeItems = useMemo(() => {
    if (activeView === "distribusi") return didistribusikan
    if (activeView === "selesai") return selesai
    return data
  }, [activeView, data, didistribusikan, selesai])

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
      <div className="inline-flex items-center gap-0.5 rounded-xl border border-gray-200 bg-gray-100 p-1">
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
              className={`relative flex items-center gap-2 rounded-[9px] px-3 py-1.5 text-[13px] font-semibold transition-colors whitespace-nowrap ${
                isActive ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.key === "table" ? tab.label : tab.label}</span>
              <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold transition-colors ${isActive ? "bg-gray-100 text-gray-700" : "text-gray-400"}`}>
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>

      {activeView === "table" ? (
        <VerifikasiTable data={data} onVerify={onVerify} />
      ) : (
        <>
          {paginatedItems.length === 0 ? (
            <div className="rounded-[22px] border border-dashed border-[#D6D9E2] bg-white px-6 py-16 text-center text-sm text-[#202224]/50 shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
              Belum ada data pada tab ini.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {paginatedItems.map((item) => {
                if (activeView === "permintaan") {
                  return <VerifikasiPermintaanCard key={item.id} item={item} onVerify={onVerify} />
                }

                if (activeView === "selesai") {
                  return <VerifikasiSelesaiCard key={item.id} item={item} onVerify={onVerify} />
                }

                return <VerifikasiCard key={item.id} item={item} onVerify={onVerify} />
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
