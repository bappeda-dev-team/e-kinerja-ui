"use client"

import * as React from "react"
import { useState, useMemo, Fragment } from "react"
import { MoreVertical, Pencil, Trash2, Send, CheckCircle2 } from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog"
import {
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import type { PermintaanResponse } from "@/app/super-admin/permintaan/types"

export interface PermintaanRow extends PermintaanResponse {
  sudahDistribusi?: boolean
  distribusiId?: string
  programmerIds?: string[]
  komentarDistribusi?: string
}

interface Props {
  data: PermintaanRow[]
  onEdit: (item: PermintaanRow) => void
  onDelete: (id: string) => void
  onCardClick?: (item: PermintaanRow) => void
  onDistribusi: (item: PermintaanRow) => void
}

function formatTgl(dateStr: string) {
  if (!dateStr) return "-"
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
}

function PemdaAvatar({ nama, logo, compact = false }: { nama: string; logo?: string; compact?: boolean }) {
  const sizeClass = compact ? "w-7 h-7" : "w-12 h-12"
  const textClass = compact ? "text-[10px]" : "text-sm"
  if (logo) {
    return (
      <div className={`${sizeClass} rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm overflow-hidden`}>
        <img src={logo} alt={nama} className="w-full h-full object-contain p-0.5" />
      </div>
    )
  }
  const initials = nama?.slice(0, 2).toUpperCase() ?? "PE"
  return (
    <div className={`${sizeClass} rounded-lg bg-linear-to-br from-teal-400 to-blue-500 flex items-center justify-center shrink-0 shadow-sm`}>
      <span className={`${textClass} font-bold text-white`}>{initials}</span>
    </div>
  )
}

function DistribusiBadge({ done }: { done?: boolean }) {
  if (done) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-700 border border-green-200">
        <CheckCircle2 className="size-3" /> Terdistribusi
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-700 border border-amber-200">
      Belum Didistribusi
    </span>
  )
}

export default function AdminPermintaanTable({ data, onEdit, onDelete, onCardClick, onDistribusi }: Props) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 7

  const totalPages = Math.max(1, Math.ceil(data.length / rowsPerPage))

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    return data.slice(start, start + rowsPerPage)
  }, [data, currentPage, rowsPerPage])

  const visiblePages = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (currentPage <= 3) return [1, 2, 3, 4, totalPages]
    if (currentPage >= totalPages - 2) return [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [1, currentPage - 1, currentPage, currentPage + 1, totalPages]
  }, [currentPage, totalPages])

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-[6px_6px_54px_rgba(0,0,0,0.05)] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 border-b border-gray-200 hover:bg-gray-50">
              <TableHead className="px-4 py-3 text-xs uppercase font-semibold text-gray-500">No.</TableHead>
              <TableHead className="px-4 py-3 text-xs uppercase font-semibold text-gray-500">Pemda</TableHead>
              <TableHead className="px-4 py-3 text-xs uppercase font-semibold text-gray-500">Aplikasi</TableHead>
              <TableHead className="px-4 py-3 text-xs uppercase font-semibold text-gray-500">Menu</TableHead>
              <TableHead className="px-4 py-3 text-xs uppercase font-semibold text-gray-500">Kondisi Awal</TableHead>
              <TableHead className="px-4 py-3 text-xs uppercase font-semibold text-gray-500">Target</TableHead>
              <TableHead className="px-4 py-3 text-xs uppercase font-semibold text-gray-500">Deadline</TableHead>
              <TableHead className="px-4 py-3 text-xs uppercase font-semibold text-gray-500">Status</TableHead>
              <TableHead className="px-4 py-3 text-xs uppercase font-semibold text-gray-500">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="px-4 py-8 text-center text-sm text-[#202224]/50">
                  Belum ada data permintaan.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, i) => (
                <TableRow key={item.id} onClick={() => onCardClick?.(item)} className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                  <TableCell className="px-4 py-3 text-xs text-[#202224]/40">{(currentPage - 1) * rowsPerPage + i + 1}</TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <PemdaAvatar nama={item.pemda?.name} logo={item.pemda?.logo} compact />
                      <span className="font-semibold text-xs text-[#202224]">{item.pemda?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs text-[#797A7C]">{item.aplikasi?.name || "-"}</TableCell>
                  <TableCell className="px-4 py-3 text-xs text-[#797A7C]">{item.menu || "-"}</TableCell>
                  <TableCell className="px-4 py-3 text-xs text-[#797A7C] max-w-xs truncate">{item.kondisi_awal || "-"}</TableCell>
                  <TableCell className="px-4 py-3 text-xs text-[#797A7C] max-w-xs truncate">{item.kondisi_diharapkan || "-"}</TableCell>
                  <TableCell className="px-4 py-3 text-xs font-semibold text-[#202224]">
                    {formatTgl(item.tanggal_deadline || "")}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <DistribusiBadge done={item.sudahDistribusi} />
                  </TableCell>
                  <TableCell className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="rounded p-1 hover:bg-gray-100 transition">
                          <MoreVertical className="size-4 text-gray-400" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDistribusi(item) }}>
                          <Send className="size-3.5 mr-2" /> Distribusikan
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(item) }}>
                          <Pencil className="size-3.5 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setDeleteId(item.id) }} className="text-red-500">
                          <Trash2 className="size-3.5 mr-2" /> Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-[#202224]/60">
            Menampilkan {data.length === 0 ? "0" : (currentPage - 1) * rowsPerPage + 1}-{Math.min(currentPage * rowsPerPage, data.length)} dari {data.length} data
          </p>
          <Pagination className="mx-0 w-auto justify-start md:justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#"
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
                <PaginationNext href="#"
                  onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage(currentPage + 1) }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data?</AlertDialogTitle>
            <AlertDialogDescription>Data tidak dapat dikembalikan setelah dihapus.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600"
              onClick={() => { if (deleteId) { onDelete(deleteId); setDeleteId(null) } }}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
