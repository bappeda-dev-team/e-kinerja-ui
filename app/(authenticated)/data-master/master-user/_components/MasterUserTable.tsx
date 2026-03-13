"use client"

import * as React from "react"
import { MoreHorizontal, Pencil, Trash2, User } from "lucide-react"

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

import type { UserResponse } from "../_types"

interface Props {
  data: UserResponse[]
  loading?: boolean
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

const PAGE_SIZE_OPTIONS = [12, 24, 48]

export default function MasterUserTable({ data, loading, onEdit, onDelete }: Props) {

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

  if (loading) {
    return <p className="text-sm text-[#202224]/40 py-8 text-center">Memuat data...</p>
  }

  return (
    <div className="space-y-6">

      {/* Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">

        {paginatedData.map((item) => (

          <div
            key={item.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col items-center text-center relative"
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

            {/* Avatar */}
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center mb-3 shrink-0">
              {item.profile_picture ? (
                <img
                  src={item.profile_picture}
                  alt={item.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="size-9 text-gray-400" />
              )}
            </div>

            {/* Name */}
            <p className="font-bold text-sm text-[#202224] leading-snug">
              {item.full_name}
            </p>

            {/* Role */}
            <p className="text-xs text-[#202224]/60 mt-0.5">
              {item.role_id}
            </p>

            {/* Email */}
            <p className="text-xs text-[#202224]/60 mt-0.5 break-all">
              {item.username}
            </p>

          </div>

        ))}

      </div>

      {/* Pagination Footer */}
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
                <SelectItem key={n} value={String(n)}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <span>{start}-{end} dari {data.length}</span>

        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPageIndex(0)} disabled={pageIndex === 0}>«</Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPageIndex(p => Math.max(0, p - 1))} disabled={pageIndex === 0}>‹</Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPageIndex(p => Math.min(totalPages - 1, p + 1))} disabled={pageIndex >= totalPages - 1}>›</Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPageIndex(totalPages - 1)} disabled={pageIndex >= totalPages - 1}>»</Button>
        </div>

      </div>

      {/* Konfirmasi Hapus */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus user ini?</AlertDialogTitle>
            <AlertDialogDescription>Data tidak bisa dikembalikan.</AlertDialogDescription>
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
