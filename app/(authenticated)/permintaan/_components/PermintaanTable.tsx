"use client"

import * as React from "react"
import { MoreVertical, Pencil, Trash2, Building2, Paperclip, Download } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"

import type { PermintaanResponse } from "../_types"

interface Props {
  data: PermintaanResponse[]
  onEdit: (item: PermintaanResponse) => void
  onDelete: (id: string) => void
}

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  proses:   { label: "Dalam Proses", className: "bg-[#FFA756]/15 text-[#FFA756]" },
  selesai:  { label: "Selesai",      className: "bg-[#00B69B]/15 text-[#00B69B]" },
  revisi:   { label: "Revisi",       className: "bg-[#FD5454]/15 text-[#FD5454]" },
  pending:  { label: "Pending",      className: "bg-gray-100 text-gray-500" },
}

function StatusBadge({ status }: { status?: string }) {
  const key = (status ?? "").toLowerCase()
  const cfg = STATUS_MAP[key] ?? { label: status ?? "-", className: "bg-gray-100 text-gray-500" }
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${cfg.className}`}
      style={{ fontFamily: "'Nunito Sans', sans-serif" }}
    >
      {cfg.label}
    </span>
  )
}

function formatTgl(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

const PAGE_SIZE_OPTIONS = [12, 24, 48]

export default function PermintaanTable({ data, onEdit, onDelete }: Props) {
  const [pageSize, setPageSize] = React.useState(12)
  const [pageIndex, setPageIndex] = React.useState(0)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize))

  const paginatedData = React.useMemo(() => {
    const start = pageIndex * pageSize
    return data.slice(start, start + pageSize)
  }, [data, pageIndex, pageSize])

  const start = pageIndex * pageSize + 1
  const end = Math.min((pageIndex + 1) * pageSize, data.length)

  return (
    <div className="space-y-6 font-['Nunito_Sans']">

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {paginatedData.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <Building2 className="size-5 text-gray-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-[#202224] leading-snug truncate">
                    {item.pemda?.name || "Pemda (Tidak diketahui)"}
                  </p>
                  <p className="text-xs text-[#797A7C] mt-0.5 truncate">
                    {item.aplikasi?.name || "Aplikasi (Tidak diketahui)"}
                    <span className="mx-1">·</span>
                    {item.menu || "-"}
                  </p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded hover:bg-gray-100 transition shrink-0">
                      <MoreVertical className="size-4 text-gray-400" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem onClick={() => onEdit(item)}>
                      <Pencil className="size-3.5 mr-2 text-gray-500" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeleteId(item.id!)}
                      className="text-red-500 focus:text-red-500"
                    >
                      <Trash2 className="size-3.5 mr-2" />
                      Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="border-t border-black/5" />

              {/* Kondisi Awal & Target */}
              <div className="space-y-1.5">
                <div className="flex items-start gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-purple-100 text-purple-600 text-[10px] font-bold shrink-0 mt-0.5">
                    AWAL
                  </span>
                  <p className="text-xs text-[#797A7C] leading-relaxed line-clamp-2">
                    {item.kondisi_awal || "-"}
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-teal-100 text-teal-600 text-[10px] font-bold shrink-0 mt-0.5">
                    TARGET
                  </span>
                  <p className="text-xs text-[#797A7C] leading-relaxed line-clamp-2">
                    {item.kondisi_diharapkan || "-"}
                  </p>
                </div>
              </div>

              <div className="border-t border-black/5" />

              {/* Deadline + Status */}
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold text-red-500">
                  Deadline: {item.tanggal_deadline ? formatTgl(item.tanggal_deadline) : "Belum ditentukan"}
                </p>
                <StatusBadge status={item.status} />
              </div>
            </div>

            {/* Lampiran Section */}
            <div className="pt-3 border-t border-black/5">
              <p className="text-[10px] font-bold text-[#606060] uppercase mb-2 flex items-center gap-1">
                <Paperclip size={10} /> Lampiran :
              </p>
              
              {item.lampiran && item.lampiran.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {item.lampiran.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-2 py-1 bg-[#F5F6FA] hover:bg-[#4880FF]/10 border border-[#D5D5D5] rounded-md transition-all group"
                    >
                      <span className="text-[10px] font-bold text-[#202224]">
                        File {index + 1}
                      </span>
                      <Download size={10} className="text-gray-400 group-hover:text-[#4880FF]" />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] italic text-gray-400">Tidak ada lampiran</p>
              )}
            </div>
          </div>
        ))}

      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-[#313131] pt-4 border-t">
        <div className="flex items-center gap-2">
          <span className="text-xs">Jumlah per halaman</span>
          <Select
            value={String(pageSize)}
            onValueChange={(val) => {
              setPageSize(Number(val))
              setPageIndex(0)
            }}
          >
            <SelectTrigger className="h-8 w-16 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((n) => (
                <SelectItem key={n} value={String(n)} className="text-xs">
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <span className="text-xs text-gray-500">{start}-{end} dari {data.length}</span>

        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8 text-xs" onClick={() => setPageIndex(0)} disabled={pageIndex === 0}>«</Button>
          <Button variant="outline" size="icon" className="h-8 w-8 text-xs" onClick={() => setPageIndex(p => Math.max(0, p - 1))} disabled={pageIndex === 0}>‹</Button>
          <Button variant="outline" size="icon" className="h-8 w-8 text-xs" onClick={() => setPageIndex(p => Math.min(totalPages - 1, p + 1))} disabled={pageIndex >= totalPages - 1}>›</Button>
          <Button variant="outline" size="icon" className="h-8 w-8 text-xs" onClick={() => setPageIndex(totalPages - 1)} disabled={pageIndex >= totalPages - 1}>»</Button>
        </div>
      </div>

      {/* Alert Hapus */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => { if (!open) setDeleteId(null) }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Yakin ingin menghapus permintaan ini?</AlertDialogTitle>
            <AlertDialogDescription>Data yang sudah dihapus tidak dapat dikembalikan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  onDelete(deleteId)
                  setDeleteId(null)
                }
              }}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}