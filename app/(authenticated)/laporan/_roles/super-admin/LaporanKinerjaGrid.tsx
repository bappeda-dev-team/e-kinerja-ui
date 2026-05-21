
"use client"

import { MoreVertical, SendHorizonal, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import LaporanKinerjaCard from "./LaporanKinerjaCard"
import type { LaporanKinerjaItem } from "@/types/laporan"

interface Props {
  data: LaporanKinerjaItem[]; loading?: boolean; showTable: boolean
  onEdit: (item: LaporanKinerjaItem) => void; onDelete: (id: string) => void
  onSubmitVerifikasi: (item: LaporanKinerjaItem) => void; submittingId: string | null
}

function formatDate(iso?: string) {
  return iso ? new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"
}

function entityLabel(value?: string | { name: string }) {
  if (!value) return "-"
  return typeof value === "string" ? value : value.name
}

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  hijau: { label: "Terverifikasi", className: "bg-[#00B69B]/15 text-[#00B69B]" },
  putih: { label: "Menunggu", className: "bg-orange-50 text-orange-700" },
  merah: { label: "Ditolak", className: "bg-red-50 text-red-700" },
  kuning: { label: "Revisi", className: "bg-[#FFA756]/15 text-[#FFA756]" },
}

export default function LaporanKinerjaGrid({ data, loading, showTable, onEdit, onDelete, onSubmitVerifikasi, submittingId }: Props) {
  if (loading) return <div className="p-12 text-center bg-white rounded-2xl shadow-sm">Memuat data...</div>
  if (data.length === 0) return <div className="p-12 text-center bg-white rounded-2xl shadow-sm">Belum ada laporan.</div>

  if (showTable) {
    return (
      <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase font-semibold text-left">
                <th className="px-3 py-3 w-10 text-center">No.</th>
                <th className="px-4 py-3">Pemda</th>
                <th className="px-4 py-3">Aplikasi</th>
                <th className="px-4 py-3">Progress</th>
                <th className="px-4 py-3">Deadline</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => {
                const limitDate = item.permintaan?.tanggal_deadline ? new Date(item.permintaan.tanggal_deadline) : null;
                const isOverdue = limitDate && limitDate < new Date();
                const deadlineClass = isOverdue ? "text-red-600" : "text-[#202224]";
                return (
                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-4 text-center text-[#202224]/50">{i + 1}</td>
                  <td className="px-4 py-4">
                    <span className="font-semibold text-[#202224]">{entityLabel(item.permintaan?.pemda)}</span>
                  </td>
                  <td className="px-4 py-4">{entityLabel(item.permintaan?.aplikasi)}</td>
                  <td className="px-4 py-4 max-w-[200px] truncate">{item.laporan_progress}</td>
                  <td className={`px-4 py-4 font-semibold ${deadlineClass}`}>{formatDate(item.permintaan?.tanggal_deadline)}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${STATUS_MAP[item.status?.toLowerCase() || ""]?.className || "bg-gray-100"}`}>
                      {STATUS_MAP[item.status?.toLowerCase() || ""]?.label || item.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-2">
                      <Button size="sm" variant="outline" className="h-7 text-xs" disabled={submittingId === item.id || item.status === "hijau"} onClick={() => onSubmitVerifikasi(item)}>
                        {submittingId === item.id ? "..." : <SendHorizonal className="h-3 w-3" />}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><button className="p-1 hover:bg-gray-200 rounded"><MoreVertical className="h-4 w-4 text-gray-400" /></button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(item)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => onDelete(item.id)}>Hapus</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {data.map((item) => (
        <LaporanKinerjaCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} onSubmitVerifikasi={onSubmitVerifikasi} isSubmitting={submittingId === item.id} />
      ))}
    </div>
  )
}
