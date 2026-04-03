// app/super-admin/distribusi/_components/DistribusiTable.tsx

"use client"

import { Fragment, useMemo, useState } from "react"
import { MoreVertical } from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { DistribusiItem } from "./DistribusiClient"
import { getStatusMeta, formatTgl } from "./DistribusiUtils"

interface Props {
  distribusi: DistribusiItem[]
  onSelesai: (id: string) => void
  onDelete: (id: string) => void
  onShowKomentar: (text: string) => void
}

export function DistribusiTable({ distribusi, onSelesai, onDelete, onShowKomentar }: Props) {
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10
  const didistribusikan = distribusi.filter((d) => d.status === "didistribusikan" || d.status === "pending" || d.status === "revision")
  const selesai = distribusi.filter((d) => d.status === "approved")

  const allRows = [
    ...didistribusikan.map((item) => ({ ...item, _kategori: "distribusi" as const })),
    ...selesai.map((item) => ({ ...item, _kategori: "selesai" as const })),
  ]

  const totalPages = Math.max(1, Math.ceil(allRows.length / rowsPerPage))
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage
    return allRows.slice(startIndex, startIndex + rowsPerPage)
  }, [allRows, currentPage])

  const visiblePages = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1)
    }
    if (currentPage <= 3) return [1, 2, 3, 4, totalPages]
    if (currentPage >= totalPages - 2) return [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [1, currentPage - 1, currentPage, currentPage + 1, totalPages]
  }, [currentPage, totalPages])

  return (
    <div className="bg-white rounded-2xl shadow-[6px_6px_54px_rgba(0,0,0,0.05)] overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-100 bg-gray-50/50 hover:bg-gray-50/50">
            <TableHead className="px-4 py-3 text-xs font-semibold text-[#202224]/50">#</TableHead>
            <TableHead className="px-4 py-3 text-xs font-semibold text-[#202224]/50">Status</TableHead>
            <TableHead className="px-4 py-3 text-xs font-semibold text-[#202224]/50">Pemda</TableHead>
            <TableHead className="px-4 py-3 text-xs font-semibold text-[#202224]/50">Aplikasi</TableHead>
            <TableHead className="px-4 py-3 text-xs font-semibold text-[#202224]/50">Menu</TableHead>
            <TableHead className="px-4 py-3 text-xs font-semibold text-[#202224]/50">Programmer</TableHead>
            <TableHead className="px-4 py-3 text-xs font-semibold text-[#202224]/50">Komentar</TableHead>
            <TableHead className="px-4 py-3 text-xs font-semibold text-[#202224]/50">Deadline</TableHead>
            <TableHead className="px-4 py-3 text-xs font-semibold text-[#202224]/50">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedRows.map((row, i) => {
            const statusMeta = getStatusMeta(row.status)

            return (
              <TableRow key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                <TableCell className="px-4 py-3 text-xs text-[#202224]/40">{(currentPage - 1) * rowsPerPage + i + 1}</TableCell>
                <TableCell className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusMeta.badgeClass}`}>
                    {statusMeta.label}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {row.logo_pemda ? (
                      <div className="w-7 h-7 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                        <img src={row.logo_pemda} alt={row.nama_pemda} className="w-full h-full object-contain p-0.5" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-linear-to-br from-teal-400 to-blue-500 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-white">{row.nama_pemda.slice(0, 2).toUpperCase()}</span>
                      </div>
                    )}
                    <span className="font-semibold text-xs text-[#202224]">{row.nama_pemda}</span>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-xs text-[#797A7C]">{row.aplikasi}</TableCell>
                <TableCell className="px-4 py-3 text-xs text-[#797A7C]">{row.menu}</TableCell>
                <TableCell className="px-4 py-3 text-xs text-[#797A7C]">
                  {row.programmer.length === 0 ? "-" : row.programmer.map((p) => p.nama).join(", ")}
                </TableCell>
                <TableCell className="px-4 py-3 text-xs text-[#797A7C]">
                  {row.komentar ? (
                    <button onClick={() => onShowKomentar(row.komentar!)} className="font-medium text-blue-600 hover:underline">
                      Lihat komentar
                    </button>
                  ) : "-"}
                </TableCell>
                <TableCell className="px-4 py-3 text-xs font-semibold text-red-500">{formatTgl(row.deadline)}</TableCell>
                <TableCell className="px-4 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="rounded p-1 hover:bg-gray-100 transition">
                        <MoreVertical className="size-4 text-gray-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem onClick={() => onSelesai(row.id)}>Tandai Selesai</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={() => onDelete(row.id)}>Hapus</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-[#202224]/60">
          Menampilkan {(currentPage - 1) * rowsPerPage + 1}-{Math.min(currentPage * rowsPerPage, allRows.length)} dari {allRows.length} data
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
    </div>
  )
}
