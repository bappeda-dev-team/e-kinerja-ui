// app/super-admin/verifikasi/_components/VerifikasiTable.tsx

"use client"

import { Fragment, useMemo, useState } from "react"
import { MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
import type { VerifikasiItem } from "./VerifikasiClient"

interface Props {
  data: VerifikasiItem[]
  onVerify: (item: VerifikasiItem) => void
}

function formatTanggal(value?: string) {
  if (!value) return "-"
  return new Date(value).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
}

function getStatusMeta(status: VerifikasiItem["status"]) {
  if (status === "terverifikasi") return "bg-[#CCF0EB] text-[#00B69B]"
  if (status === "revisi") return "bg-[#FFE1E1] text-[#FD5454]"
  return "bg-[#D9E8FF] text-[#2F6FED]"
}

export function VerifikasiTable({ data, onVerify }: Props) {
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10
  const totalPages = Math.max(1, Math.ceil(data.length / rowsPerPage))

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage
    return data.slice(startIndex, startIndex + rowsPerPage)
  }, [currentPage, data])

  const visiblePages = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1)
    }
    if (currentPage <= 3) return [1, 2, 3, 4, totalPages]
    if (currentPage >= totalPages - 2) return [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [1, currentPage - 1, currentPage, currentPage + 1, totalPages]
  }, [currentPage, totalPages])

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-100 bg-gray-50/50 hover:bg-gray-50/50">
            <TableHead className="px-4 py-3 text-xs font-semibold text-[#202224]/50">No.</TableHead>
            <TableHead className="px-4 py-3 text-xs font-semibold text-[#202224]/50">Status</TableHead>
            <TableHead className="px-4 py-3 text-xs font-semibold text-[#202224]/50">Laporan</TableHead>
            <TableHead className="px-4 py-3 text-xs font-semibold text-[#202224]/50">Programmer</TableHead>
            <TableHead className="px-4 py-3 text-xs font-semibold text-[#202224]/50">Verifikator</TableHead>
            <TableHead className="px-4 py-3 text-xs font-semibold text-[#202224]/50">Progress</TableHead>
            <TableHead className="px-4 py-3 text-xs font-semibold text-[#202224]/50">Komentar</TableHead>
            <TableHead className="px-4 py-3 text-xs font-semibold text-[#202224]/50">Diajukan</TableHead>
            <TableHead className="px-4 py-3 text-xs font-semibold text-[#202224]/50">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedRows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="py-12 text-center text-sm text-[#202224]/40">
                Belum ada data verifikasi.
              </TableCell>
            </TableRow>
          ) : (
            paginatedRows.map((row, index) => (
              <TableRow key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                <TableCell className="px-4 py-3 text-xs text-[#202224]/40">{(currentPage - 1) * rowsPerPage + index + 1}</TableCell>
                <TableCell className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getStatusMeta(row.status)}`}>
                    {row.status === "terverifikasi" ? "Terverifikasi" : row.status === "revisi" ? "Revisi" : "Menunggu"}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-xs font-semibold text-[#202224]">{row.laporan_label}</TableCell>
                <TableCell className="px-4 py-3 text-xs text-[#797A7C]">{row.programmer}</TableCell>
                <TableCell className="px-4 py-3 text-xs text-[#797A7C]">{row.verifikator || "-"}</TableCell>
                <TableCell className="max-w-[240px] px-4 py-3 text-xs text-[#797A7C]">
                  <span className="line-clamp-2">{row.progres_deskripsi || "-"}</span>
                </TableCell>
                <TableCell className="max-w-[220px] px-4 py-3 text-xs text-[#797A7C]">
                  <span className="line-clamp-2">{row.komentar || "-"}</span>
                </TableCell>
                <TableCell className="px-4 py-3 text-xs text-[#797A7C]">{formatTanggal(row.tanggal_diajukan)}</TableCell>
                <TableCell className="px-4 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="rounded p-1 hover:bg-gray-100 transition">
                        <MoreVertical className="size-4 text-gray-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onVerify(row)}>Proses Verifikasi</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-[#202224]/60">
          Menampilkan {data.length === 0 ? "0-0" : `${(currentPage - 1) * rowsPerPage + 1}-${Math.min(currentPage * rowsPerPage, data.length)}`} dari {data.length} data
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
