"use client"

import * as React from "react"
import { MoreVertical, Pencil, Trash2, Building2 } from "lucide-react"

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
    <div className="space-y-6">

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {paginatedData.map((item) => (

          <div
            key={item.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3"
          >

            {/* Header */}
            <div className="flex items-start gap-3">

              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <Building2 className="size-5 text-gray-400" />
              </div>

              <div className="flex-1 min-w-0">

                <p className="font-bold text-sm text-[#202224] leading-snug">
                  {item.pemda || "Pemda (Tidak diketahui)"}
                </p>

                <p className="text-xs text-[#797A7C] mt-0.5">
                  {item.aplikasi || "Aplikasi (Tidak diketahui)"}
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

            <div className="border-t border-black/10" />

            {/* Kondisi Awal */}
            <div className="space-y-1.5">

              <div className="flex items-start gap-2">

                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-purple-100 text-purple-600 text-xs font-semibold shrink-0 mt-0.5">
                  Awal
                </span>

                <p className="text-xs text-[#797A7C] leading-relaxed">
                  {item.kondisi_awal || "-"}
                </p>

              </div>

              <div className="flex items-start gap-2">

                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-teal-100 text-teal-600 text-xs font-semibold shrink-0 mt-0.5">
                  Target
                </span>

                <p className="text-xs text-[#797A7C] leading-relaxed">
                  {item.kondisi_diharapkan || "-"}
                </p>

              </div>

            </div>

            <div className="border-t border-black/10" />

            {/* Deadline */}
            <p className="text-xs font-semibold text-red-500">
              Deadline: {item.tanggal_deadline ? formatTgl(item.tanggal_deadline) : "Belum ditentukan"}
            </p>

          </div>

        ))}

      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-[#313131]">

        <div className="flex items-center gap-2">

          <span>Jumlah per halaman</span>

          <Select
            value={String(pageSize)}
            onValueChange={(val) => {
              setPageSize(Number(val))
              setPageIndex(0)
            }}
          >

            <SelectTrigger className="h-8 w-16">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>

          </Select>

        </div>

        <span>{start}-{end} dari {data.length}</span>

        <div className="flex items-center gap-1">

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setPageIndex(0)}
            disabled={pageIndex === 0}
          >
            «
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setPageIndex(p => Math.max(0, p - 1))}
            disabled={pageIndex === 0}
          >
            ‹
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setPageIndex(p => Math.min(totalPages - 1, p + 1))}
            disabled={pageIndex >= totalPages - 1}
          >
            ›
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setPageIndex(totalPages - 1)}
            disabled={pageIndex >= totalPages - 1}
          >
            »
          </Button>

        </div>

      </div>

      {/* Alert Hapus */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => { if (!open) setDeleteId(null) }}
      >

        <AlertDialogContent>

          <AlertDialogHeader>

            <AlertDialogTitle>
              Yakin ingin menghapus permintaan ini?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Data yang sudah dihapus tidak dapat dikembalikan.
            </AlertDialogDescription>

          </AlertDialogHeader>

          <AlertDialogFooter>

            <AlertDialogCancel>
              Batal
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  onDelete(deleteId)
                  setDeleteId(null)
                }
              }}
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