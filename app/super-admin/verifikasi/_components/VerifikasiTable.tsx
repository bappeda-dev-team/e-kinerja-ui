// app/super-admin/verifikasi/_components/VerifikasiTable.tsx

"use client"

import { Fragment, useMemo, useState } from "react"
import { MoreVertical, User } from "lucide-react"
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
  if (status === "terverifikasi") return { label: "Terverifikasi", cls: "bg-[#CCF0EB] text-[#00B69B]" }
  if (status === "revisi") return { label: "Revisi", cls: "bg-[#FFE1E1] text-[#FD5454]" }
  return { label: "Menunggu", cls: "bg-[#D9E8FF] text-[#2F6FED]" }
}

function OrgCell({ logo, name }: { logo?: string; name: string }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      {logo ? (
        <div className="w-7 h-7 rounded-full overflow-hidden bg-white border border-gray-100 flex items-center justify-center shrink-0 p-0.5">
          <img src={logo} alt={name} className="w-full h-full object-contain" />
        </div>
      ) : (
        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
          <User className="size-3.5 text-gray-400" />
        </div>
      )}
      <span className="truncate font-semibold text-[#202224]">{name}</span>
    </div>
  )
}

export function VerifikasiTable({ data, onVerify }: Props) {
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 7
  const totalPages = Math.max(1, Math.ceil(data.length / rowsPerPage))

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage
    return data.slice(startIndex, startIndex + rowsPerPage)
  }, [currentPage, data])

  const visiblePages = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (currentPage <= 3) return [1, 2, 3, 4, totalPages]
    if (currentPage >= totalPages - 2) return [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [1, currentPage - 1, currentPage, currentPage + 1, totalPages]
  }, [currentPage, totalPages])

  return (
    <div className="overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 border-b border-gray-200 hover:bg-gray-50">
            <TableHead className="px-4 py-3 text-xs uppercase font-semibold text-gray-500">No.</TableHead>
            <TableHead className="px-4 py-3 text-xs uppercase font-semibold text-gray-500">Status</TableHead>
            <TableHead className="px-4 py-3 text-xs uppercase font-semibold text-gray-500">Pemda</TableHead>
            <TableHead className="px-4 py-3 text-xs uppercase font-semibold text-gray-500">Aplikasi</TableHead>
            <TableHead className="px-4 py-3 text-xs uppercase font-semibold text-gray-500">Menu</TableHead>
            <TableHead className="px-4 py-3 text-xs uppercase font-semibold text-gray-500">Programmer</TableHead>
            <TableHead className="px-4 py-3 text-xs uppercase font-semibold text-gray-500">Progress</TableHead>
            <TableHead className="px-4 py-3 text-xs uppercase font-semibold text-gray-500">Deadline</TableHead>
            <TableHead className="px-4 py-3 text-xs uppercase font-semibold text-gray-500">Aksi</TableHead>
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
            paginatedRows.map((row, index) => {
              const sm = getStatusMeta(row.status)
              return (
                <TableRow key={row.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <TableCell className="px-4 py-3 text-xs text-[#202224]/40">
                    {(currentPage - 1) * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${sm.cls}`}>{sm.label}</span>
                  </TableCell>
                  <TableCell className="px-4 py-3 max-w-[160px]">
                    <OrgCell logo={row.pemda_logo} name={row.pemda_name} />
                  </TableCell>
                  <TableCell className="px-4 py-3 max-w-[140px]">
                    <OrgCell logo={row.aplikasi_logo} name={row.aplikasi_name || "-"} />
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs text-[#797A7C] max-w-[120px]">
                    <span className="line-clamp-1">{row.menu || "-"}</span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs text-[#797A7C]">
                    <div className="flex items-center gap-1.5">
                      {row.programmer_avatar && (
                        <img src={row.programmer_avatar} alt={row.programmer} className="w-5 h-5 rounded-full object-cover shrink-0" />
                      )}
                      {row.programmer}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] px-4 py-3 text-xs text-[#797A7C]">
                    <span className="line-clamp-2">{row.progres_deskripsi || "-"}</span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs text-[#797A7C] whitespace-nowrap">
                    {formatTanggal(row.tanggal_deadline)}
                  </TableCell>
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
              )
            })
          )}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-[#202224]/60">
          Menampilkan {data.length === 0 ? "0-0" : `${(currentPage - 1) * rowsPerPage + 1}-${Math.min(currentPage * rowsPerPage, data.length)}`} dari {data.length} data
        </p>

        <Pagination className="mx-0 w-auto justify-start md:justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => { e.preventDefault(); if (currentPage > 1) setCurrentPage(currentPage - 1) }}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {visiblePages.map((page, index) => {
              const prev = visiblePages[index - 1]
              return (
                <Fragment key={page}>
                  {prev && page - prev > 1 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                  <PaginationItem>
                    <PaginationLink href="#" isActive={currentPage === page}
                      onClick={(e) => { e.preventDefault(); setCurrentPage(page) }}>
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                </Fragment>
              )
            })}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage(currentPage + 1) }}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
