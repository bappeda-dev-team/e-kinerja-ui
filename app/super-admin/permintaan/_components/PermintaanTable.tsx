// app/super-admin/permintaan/_components/PermintaanTable.tsx

"use client"

import * as React from "react"
import { useState, useMemo, Fragment } from "react"
import { MoreVertical, Pencil, Trash2, X, FileText } from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog"
import {
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"
import type { PermintaanResponse } from "../types"

interface Props {
  data: PermintaanResponse[]
  showTable: boolean
  onEdit: (item: PermintaanResponse) => void
  onDelete: (id: string) => void
  onCardClick?: (item: PermintaanResponse) => void
}

function formatTgl(dateStr: string) {
  if (!dateStr) return "-"
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
}

function PemdaAvatar({ nama, logo }: { nama: string; logo?: string }) {
  if (logo) {
    return (
      <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
        <img src={logo} alt={nama} className="w-full h-full object-contain p-1" />
      </div>
    )
  }
  const initials = nama?.slice(0, 2).toUpperCase() ?? "PE"
  return (
    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-teal-400 to-blue-500 flex items-center justify-center shrink-0 shadow-sm">
      <span className="text-sm font-bold text-white">{initials}</span>
    </div>
  )
}

function InlineBadge({ label, color }: { label: string; color: "orange" | "green" }) {
  const styles = { orange: "bg-orange-100/60 text-orange-500", green: "bg-green-100/60 text-green-600" }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold shrink-0 ${styles[color]}`}>
      {label}
    </span>
  )
}

function isImage(url: string) {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
}

function getFileName(url: string) {
  return decodeURIComponent(url.split("/").pop()?.split("_").slice(-1)[0] ?? url)
}

function LightboxModal({ urls, initialIndex, onClose }: { urls: string[]; initialIndex: number; onClose: () => void }) {
  const [current] = useState(initialIndex)
  const url = urls[current]
  return (
    <div className="fixed inset-0 bg-black/80 z-200 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-10 right-0 text-white hover:text-gray-300 transition">
          <X className="size-6" />
        </button>
        {isImage(url) ? (
          <img src={url} alt="Preview" className="w-full max-h-[80vh] object-contain rounded-xl" />
        ) : (
          <div className="bg-white rounded-xl p-8 text-center">
            <FileText className="size-16 text-gray-400 mx-auto mb-3" />
            <p className="font-semibold text-[#202224] mb-4">{getFileName(url)}</p>
            <a href={url} target="_blank" rel="noopener noreferrer"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition">
              Buka File
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

function LampiranSection({ lampiran }: { lampiran: string[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  if (!lampiran || lampiran.length === 0) return null
  return (
    <>
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-[#202224]/50">Lampiran</p>
        <div className="flex flex-wrap gap-1.5">
          {lampiran.map((url, i) =>
            isImage(url) ? (
              <button key={i} onClick={() => setLightboxIndex(i)}
                className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200 hover:border-blue-400 transition group">
                <img src={url} alt="lampiran" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
              </button>
            ) : (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold rounded-lg transition border border-blue-100">
                <FileText className="size-3.5" />
                <span className="max-w-[100px] truncate">{getFileName(url)}</span>
              </a>
            )
          )}
        </div>
      </div>
      {lightboxIndex !== null && (
        <LightboxModal urls={lampiran} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </>
  )
}

function PermintaanCard({
  item, onEdit, onDelete, onClick,
}: {
  item: PermintaanResponse
  onEdit: (item: PermintaanResponse) => void
  onDelete: (id: string) => void
  onClick: () => void
}) {
  return (
    <div
      className="space-y-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-[6px_6px_54px_rgba(0,0,0,0.05)] sm:p-5 cursor-pointer hover:border-gray-200 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <PemdaAvatar nama={item.pemda?.name} logo={item.pemda?.logo} />
        <div className="flex-1 min-w-0">
          <p className="line-clamp-2 font-bold text-sm leading-snug text-[#202224] sm:text-[15px]">{item.pemda?.name}</p>
          <p className="mt-0.5 wrap-break-word text-xs leading-5 text-[#797A7C] sm:text-[13px]">
            <span className="font-semibold">{item.aplikasi?.name}</span>
            <span className="mx-1">·</span>
            <span>{item.menu}</span>
          </p>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded hover:bg-gray-100 transition shrink-0">
                <MoreVertical className="size-4 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={() => onEdit(item)}>
                <Pencil className="size-3.5 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(item.id)} className="text-red-500">
                <Trash2 className="size-3.5 mr-2" /> Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="border-t border-black/5" />

      <div className="space-y-2.5">
        <div className="flex items-start gap-2.5">
          <InlineBadge label="Awal" color="orange" />
          <p className="min-w-0 flex-1 wrap-break-word text-xs leading-6 text-[#797A7C] sm:text-sm">{item.kondisi_awal}</p>
        </div>
        <div className="flex items-start gap-2.5">
          <InlineBadge label="Target" color="green" />
          <p className="min-w-0 flex-1 wrap-break-word text-xs leading-6 text-[#797A7C] sm:text-sm">{item.kondisi_diharapkan}</p>
        </div>
      </div>

      {item.lampiran && item.lampiran.length > 0 && (
        <>
          <div className="border-t border-black/5" />
          <LampiranSection lampiran={item.lampiran} />
        </>
      )}

      <p className="text-sm font-bold text-red-500">
        Deadline: <span className="font-normal">{formatTgl(item.tanggal_deadline || "")}</span>
      </p>
    </div>
  )
}

export default function PermintaanTable({ data, onEdit, onDelete, onCardClick }: Props) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 6

  const totalPages = Math.max(1, Math.ceil(data.length / rowsPerPage))

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    return data.slice(start, start + rowsPerPage)
  }, [data, currentPage])

  const visiblePages = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (currentPage <= 3) return [1, 2, 3, 4, totalPages]
    if (currentPage >= totalPages - 2) return [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [1, currentPage - 1, currentPage, currentPage + 1, totalPages]
  }, [currentPage, totalPages])

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:gap-5 xl:grid-cols-3">
          {paginatedData.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-[#D6D9E2] bg-white px-6 py-16 text-center text-sm text-[#202224]/50">
              Belum ada data permintaan.
            </div>
          ) : paginatedData.map((item) => (
            <PermintaanCard
              key={item.id}
              item={item}
              onEdit={onEdit}
              onDelete={(id) => setDeleteId(id)}
              onClick={() => onCardClick?.(item)}
            />
          ))}
        </div>

        <div className="flex items-center justify-center gap-2">
          <p className="text-sm text-[#202224]/70 shrink-0">
            {data.length === 0 ? "0-0" : `${(currentPage - 1) * rowsPerPage + 1}-${Math.min(currentPage * rowsPerPage, data.length)}`} dari {data.length}
          </p>
          <Pagination className="mx-0 w-auto justify-start">
            <PaginationContent className="gap-1">
              <PaginationItem>
                <PaginationPrevious href="#"
                  onClick={(e) => { e.preventDefault(); if (currentPage > 1) setCurrentPage(currentPage - 1) }}
                  className={`rounded-xl border border-gray-200 bg-white shadow-sm px-2${currentPage === 1 ? " pointer-events-none opacity-50" : ""}`}
                />
              </PaginationItem>
              {visiblePages.map((page, index) => {
                const prev = visiblePages[index - 1]
                return (
                  <Fragment key={page}>
                    {prev && page - prev > 1 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                    <PaginationItem>
                      <PaginationLink href="#" isActive={currentPage === page}
                        onClick={(e) => { e.preventDefault(); setCurrentPage(page) }}
                        className={`rounded-xl border shadow-sm ${currentPage === page ? "border-[#4880FF] bg-[#4880FF] text-white hover:bg-[#4880FF] hover:text-white" : "border-gray-200 bg-white text-[#202224]"}`}>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  </Fragment>
                )
              })}
              <PaginationItem>
                <PaginationNext href="#"
                  onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage(currentPage + 1) }}
                  className={`rounded-xl border border-gray-200 bg-white shadow-sm px-2${currentPage === totalPages ? " pointer-events-none opacity-50" : ""}`}
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
