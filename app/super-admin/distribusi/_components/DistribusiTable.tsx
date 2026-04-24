// app/super-admin/distribusi/_components/DistribusiTable.tsx

"use client"

import { Fragment, useMemo, useState } from "react"
import { MoreVertical, Pencil } from "lucide-react"
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

function initials(nama: string) {
  return nama.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()
}

function stringToColor(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  const h = Math.abs(hash) % 360
  return `hsl(${h}, 55%, 48%)`
}

interface Props {
  distribusi: DistribusiItem[]
  onSelesai: (id: string) => void
  onDelete: (id: string) => void
  onShowKomentar: (item: DistribusiItem) => void
  onEdit: (item: DistribusiItem) => void
  onRowClick: (item: DistribusiItem) => void
}

export function DistribusiTable({ distribusi, onSelesai, onDelete, onShowKomentar, onEdit, onRowClick }: Props) {
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 7
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
    <div className="bg-white rounded-2xl border border-gray-200 shadow-[6px_6px_54px_rgba(0,0,0,0.05)] overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 border-b border-gray-200 hover:bg-gray-50">
            <TableHead className="px-4 py-3 text-xs uppercase font-semibold text-gray-500">No.</TableHead>
            <TableHead className="px-4 py-3 text-xs uppercase font-semibold text-gray-500">Status</TableHead>
            <TableHead className="px-4 py-3 text-xs uppercase font-semibold text-gray-500">Pemda</TableHead>
            <TableHead className="px-4 py-3 text-xs uppercase font-semibold text-gray-500">Aplikasi</TableHead>
            <TableHead className="px-4 py-3 text-xs uppercase font-semibold text-gray-500">Menu</TableHead>
            <TableHead className="px-4 py-3 text-xs uppercase font-semibold text-gray-500">Programmer</TableHead>
            <TableHead className="px-4 py-3 text-xs uppercase font-semibold text-gray-500">Komentar</TableHead>
            <TableHead className="px-4 py-3 text-xs uppercase font-semibold text-gray-500">Deadline</TableHead>
            <TableHead className="px-4 py-3 text-xs uppercase font-semibold text-gray-500">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedRows.map((row, i) => {
            const statusMeta = getStatusMeta(row.status)

            return (
              <TableRow key={row.id} onClick={() => onRowClick(row)} className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
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
                <TableCell className="px-4 py-3">
                  {row.programmer.length === 0 ? (
                    <span className="text-xs text-[#797A7C]">-</span>
                  ) : row.programmer.length === 1 ? (
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: stringToColor(row.programmer[0].nama) }}>
                        {initials(row.programmer[0].nama)}
                      </div>
                      <span className="text-xs font-medium text-[#202224]">{row.programmer[0].nama}</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      {row.programmer.slice(0, 3).map((p, i) => (
                        <div
                          key={p.id}
                          title={p.nama}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white shrink-0"
                          style={{ background: stringToColor(p.nama), marginLeft: i === 0 ? 0 : -8 }}
                        >
                          {initials(p.nama)}
                        </div>
                      ))}
                      {row.programmer.length > 3 && (
                        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600 border-2 border-white shrink-0" style={{ marginLeft: -8 }}>
                          +{row.programmer.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell className="px-4 py-3 text-xs text-[#797A7C]">
                  <button
                    onClick={(event) => { event.stopPropagation(); onShowKomentar(row) }}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {row.komentars.length > 0 ? `Lihat komentar (${row.komentars.length})` : "Tambah komentar"}
                  </button>
                </TableCell>
                <TableCell className="px-4 py-3">
                  {row.deadline ? (() => {
                    const daysLeft = Math.ceil((new Date(row.deadline).getTime() - Date.now()) / 86400000)
                    const color = daysLeft < 3 ? "text-red-500" : daysLeft < 6 ? "text-amber-500" : "text-[#202224]"
                    return (
                      <div className={`text-xs font-semibold leading-tight ${color}`}>
                        <div>{formatTgl(row.deadline)}</div>
                        <div className="font-normal text-[11px] mt-0.5 text-gray-400">{daysLeft > 0 ? `${daysLeft} hari lagi` : daysLeft === 0 ? "Hari ini" : "Lewat deadline"}</div>
                      </div>
                    )
                  })() : "-"}
                </TableCell>
                <TableCell className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="rounded p-1 hover:bg-gray-100 transition">
                        <MoreVertical className="size-4 text-gray-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem onClick={() => onEdit(row)}>
                        <Pencil className="size-3.5 mr-2" /> Edit Programmer
                      </DropdownMenuItem>
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

      <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-4 md:flex-row md:items-center md:justify-between">
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
