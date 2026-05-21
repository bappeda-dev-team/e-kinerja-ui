
'use client'

import * as React from "react"
import { Fragment } from "react"
import { toast } from "sonner"
import { MoreHorizontal, Pencil, Trash2, AppWindow } from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription,
} from "@/components/ui/alert-dialog"
import {
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"
import type { MasterAplikasiItem } from "./MasterAplikasiClient"

interface Props {
  data: MasterAplikasiItem[]
  showTable?: boolean
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

function formatTanggal(dateStr: string) {
  if (!dateStr) return "-"
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
}

const PAGE_SIZE = 7

export default function MasterAplikasiTable({ data, showTable, onEdit, onDelete }: Props) {
  const [currentPage, setCurrentPage] = React.useState(1)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)

  const handleOpenLink = (link?: string) => {
    if (link) {
      window.open(link.startsWith('http') ? link : `https://${link}`, '_blank')
    } else {
      toast.error("Link belum ditambahkan", { icon: "🔗" })
    }
  }

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE))
  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return data.slice(start, start + PAGE_SIZE)
  }, [data, currentPage])

  const visiblePages = React.useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (currentPage <= 3) return [1, 2, 3, 4, totalPages]
    if (currentPage >= totalPages - 2) return [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [1, currentPage - 1, currentPage, currentPage + 1, totalPages]
  }, [currentPage, totalPages])

  return (
    <div className="space-y-6">

      {/* ✅ Table view */}
      {showTable ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-[6px_6px_54px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2">
            <span className="text-sm font-bold text-[#202224]">Semua Aplikasi</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-[#202224]/60">{data.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase font-semibold text-left">
                  <th className="px-4 py-3 w-8">No.</th>
                  <th className="px-4 py-3">Logo</th>
                  <th className="px-4 py-3">Nama Aplikasi</th>
                  <th className="px-4 py-3">Dibuat</th>
                  <th className="px-4 py-3">Diperbarui</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-sm text-[#202224]/40">Belum ada data.</td>
                  </tr>
                ) : paginatedData.map((item, i) => (
                  <tr 
                    key={item.id} 
                    onClick={() => handleOpenLink(item.link)}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 text-xs text-[#202224]/50 font-medium">{(currentPage - 1) * PAGE_SIZE + i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-gray-200 flex items-center justify-center shrink-0 p-1.5 shadow-sm">
                        {item.logo ? (
                          <img src={item.logo} alt={item.nama_aplikasi} className="w-full h-full object-contain" />
                        ) : (
                          <AppWindow className="size-5 text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-xs text-[#202224]">{item.nama_aplikasi}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#797A7C]">{formatTanggal(item.created_at)}</td>
                    <td className="px-4 py-3 text-xs text-[#797A7C]">{formatTanggal(item.updated_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onEdit(item.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-[#767676] hover:bg-gray-50 transition active:scale-95"
                        >
                          <Pencil className="size-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(item.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-xs font-semibold text-red-500 hover:bg-red-50 transition active:scale-95"
                        >
                          <Trash2 className="size-3" />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ✅ Card grid view */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {paginatedData.map((item) => (
            <div 
              key={item.id} 
              onClick={() => handleOpenLink(item.link)}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col items-center text-center relative hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded hover:bg-gray-100 transition">
                      <MoreHorizontal className="size-4 text-gray-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem onClick={() => onEdit(item.id)}>
                      <Pencil className="size-3.5 mr-2 text-gray-500" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDeleteId(item.id)} className="text-red-500 focus:text-red-500">
                      <Trash2 className="size-3.5 mr-2" />
                      Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Logo Container Card: BG White + Border + Padding + Contain */}
              <div className="w-20 h-20 rounded-full overflow-hidden bg-white border border-gray-100 flex items-center justify-center mb-4 shrink-0 p-3 shadow-inner">
                {item.logo ? (
                  <img src={item.logo} alt={item.nama_aplikasi} className="w-full h-full object-contain" />
                ) : (
                  <AppWindow className="size-9 text-gray-400" />
                )}
              </div>

              <p className="font-bold text-sm text-[#202224] leading-snug h-10 flex items-center">{item.nama_aplikasi}</p>
              <p className="text-[10px] uppercase tracking-wider text-[#202224]/40 mt-1 font-semibold">Dibuat {formatTanggal(item.created_at)}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-[#202224]/60">
          Menampilkan {data.length === 0 ? "0" : (currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, data.length)} dari {data.length} data
        </p>
        <Pagination className="mx-0 w-auto justify-start md:justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); if (currentPage > 1) setCurrentPage(currentPage - 1) }}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""} />
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
              <PaginationNext href="#" onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage(currentPage + 1) }}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Konfirmasi Hapus */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Yakin ingin menghapus aplikasi ini?</AlertDialogTitle>
            <AlertDialogDescription>Data yang sudah dihapus tidak dapat dikembalikan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { if (deleteId) { onDelete(deleteId); setDeleteId(null) } }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}