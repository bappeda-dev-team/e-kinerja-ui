"use client"

import * as React from "react"
import { MoreHorizontal, Pencil, Trash2, User } from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import type { UserResponse } from "../_types"

const HybridLoader = () => {
  const [progress, setProgress] = React.useState(0)
  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? prev : prev + Math.floor(Math.random() * 10)))
    }, 200)
    return () => clearInterval(interval)
  }, [])
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4 min-h-[400px]">
      <div className="relative flex items-center justify-center">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-blue-100" />
          <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent"
            strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * progress) / 100}
            className="text-blue-600 transition-all duration-300 ease-out" strokeLinecap="round" />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-blue-600 animate-bounce text-xl">⏳</span>
          <span className="text-[10px] font-bold text-blue-600">{progress}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-[#202224]">Sedang memproses...</p>
        <p className="text-[11px] text-[#202224]/50">Mohon tunggu sebentar</p>
      </div>
    </div>
  )
}

interface Props {
  data: UserResponse[]
  loading?: boolean
  showTable?: boolean // ✅
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

const PAGE_SIZE_OPTIONS = [12, 24, 48]

export default function MasterUserTable({ data, loading, showTable, onEdit, onDelete }: Props) {
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

  if (loading) return <HybridLoader />

  return (
    <div className="space-y-6">

      {/* ✅ Table view */}
      {showTable ? (
        <div className="bg-white rounded-2xl shadow-[6px_6px_54px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <span className="text-sm font-bold text-[#202224]">Semua User</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-[#202224]/60">{data.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#202224]/50 w-8">#</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#202224]/50">Avatar</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#202224]/50">Nama</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#202224]/50">Username</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#202224]/50">Role</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#202224]/50">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#202224]/50 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-sm text-[#202224]/40">Belum ada data.</td>
                  </tr>
                ) : data.map((item, i) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                    <td className="px-4 py-3 text-xs text-[#202224]/40">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                        {item.profile_picture ? (
                          <img src={item.profile_picture} alt={item.full_name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="size-5 text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-xs text-[#202224]">{item.full_name}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#797A7C]">{item.username}</td>
                    <td className="px-4 py-3 text-xs text-[#797A7C]">{item.role_id}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        item.is_active
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-500"
                      }`}>
                        {item.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
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
        // ✅ Card grid view (original)
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {paginatedData.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col items-center text-center relative">
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
                    <DropdownMenuItem onClick={() => setDeleteId(item.id)} className="text-red-500 focus:text-red-500">
                      <Trash2 className="size-3.5 mr-2" />
                      Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center mb-3 shrink-0">
                {item.profile_picture ? (
                  <img src={item.profile_picture} alt={item.full_name} className="w-full h-full object-cover" />
                ) : (
                  <User className="size-9 text-gray-400" />
                )}
              </div>

              <p className="font-bold text-sm text-[#202224] leading-snug">{item.full_name}</p>
              <p className="text-xs text-[#202224]/60 mt-0.5">{item.role_id}</p>
              <p className="text-xs text-[#202224]/60 mt-0.5 break-all">{item.username}</p>
              <span className={`mt-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                item.is_active ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"
              }`}>
                {item.is_active ? "Aktif" : "Nonaktif"}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Pagination — hanya tampil di card view */}
      {!showTable && (
        <div className="flex items-center justify-between text-sm text-[#313131]">
          <div className="flex items-center gap-2">
            <span>Jumlah per halaman</span>
            <Select value={String(pageSize)} onValueChange={(val) => { setPageSize(Number(val)); setPageIndex(0) }}>
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
      )}

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