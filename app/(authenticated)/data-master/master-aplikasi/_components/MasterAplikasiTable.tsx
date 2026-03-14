'use client'

import * as React from "react"
import { MoreHorizontal, Pencil, Trash2, AppWindow } from "lucide-react"

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

import type { MasterAplikasiItem } from "./MasterAplikasiClient"

interface Props {
  data: MasterAplikasiItem[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  loading?: boolean
}

/* --- Hybrid Loader Component --- */
const HybridLoader = () => {
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev =>
        prev >= 90 ? prev : prev + Math.floor(Math.random() * 10)
      )
    }, 200)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="relative flex items-center justify-center">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-blue-100"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={251.2}
            strokeDashoffset={251.2 - (251.2 * progress) / 100}
            className="text-blue-600 transition-all duration-300 ease-out"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-blue-600 animate-bounce">⏳</span>
          <span className="text-[10px] font-bold text-blue-600">{progress}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-[#202224]">Sedang memproses...</p>
        <p className="text-[11px] text-[#202224]/50">Mohon tunggu sebentar</p>
      </div>
    </div>
  )
}

function formatTanggal(dateStr: string) {
  if (!dateStr) return "-"
  const date = new Date(dateStr)
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

const PAGE_SIZE_OPTIONS = [12, 24, 48]

export default function MasterAplikasiTable({
  data,
  onEdit,
  onDelete,
  loading,
}: Props) {
  // --- 1. Deklarasi SEMUA Hooks (Wajib di Paling Atas) ---
  const [pageSize, setPageSize] = React.useState(12)
  const [pageIndex, setPageIndex] = React.useState(0)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)

  const paginatedData = React.useMemo(() => {
    if (!data) return []
    const start = pageIndex * pageSize
    return data.slice(start, start + pageSize)
  }, [data, pageIndex, pageSize])

  // --- 2. Logika Variabel Pembantu ---
  const totalPages = Math.max(1, Math.ceil((data?.length || 0) / pageSize))
  const startEntry = pageIndex * pageSize + 1
  const endEntry = Math.min((pageIndex + 1) * pageSize, data?.length || 0)

  // --- 3. Return Loading (Setelah Hooks) ---
  if (loading) {
    return <HybridLoader />
  }

  // --- 4. Render UI Utama ---
  return (
    <div className="space-y-6">
      {data.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center border border-dashed border-gray-200">
          <p className="text-gray-400 text-sm">Belum ada data aplikasi.</p>
        </div>
      ) : (
        <>
          {/* Card Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {paginatedData.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col items-center text-center relative hover:shadow-md transition-shadow"
              >
                {/* 3-dot menu */}
                <div className="absolute top-3 right-3">
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
                      <DropdownMenuItem
                        onClick={() => setDeleteId(item.id)}
                        className="text-red-500 focus:text-red-500"
                      >
                        <Trash2 className="size-3.5 mr-2" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Avatar / Icon */}
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center mb-3 shrink-0">
                  {item.logo ? (
                    <img
                      src={item.logo}
                      alt={item.nama_aplikasi}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <AppWindow className="size-9 text-gray-300" />
                  )}
                </div>

                {/* Nama Aplikasi */}
                <p className="font-bold text-sm text-[#202224] leading-snug line-clamp-2 min-h-[2.5rem]">
                  {item.nama_aplikasi}
                </p>

                {/* Tanggal */}
                <p className="text-[10px] text-[#202224]/50 mt-2">
                  Dibuat {formatTanggal(item.created_at)}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#313131] pt-4">
            {/* Jumlah per halaman */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Baris per halaman:</span>
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

            <div className="flex items-center gap-4">
              {/* Info halaman */}
              <span className="text-gray-500">
                {startEntry}-{endEntry} dari {data.length}
              </span>

              {/* Navigasi */}
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
                  onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                  disabled={pageIndex === 0}
                >
                  ‹
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
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
          </div>
        </>
      )}

      {/* Konfirmasi Hapus */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Yakin ingin menghapus aplikasi ini?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Data yang sudah dihapus tidak dapat dikembalikan.
            </AlertDialogDescription>
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