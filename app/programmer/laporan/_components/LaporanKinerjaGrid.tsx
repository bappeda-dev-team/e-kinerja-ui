// app/programmer/laporan/_components/LaporanKinerjaGrid.tsx

"use client"

import { MoreVertical, SendHorizonal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import LaporanKinerjaCard from "./LaporanKinerjaCard"
import type { LaporanKinerjaItem } from "../types"
import { getProgressBadgeClass, mapStatusToProgress } from "../utils"

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

export default function LaporanKinerjaGrid({ data, loading, showTable, onEdit, onDelete, onSubmitVerifikasi, submittingId }: Props) {
  if (loading) return <div className="p-12 text-center bg-white rounded-2xl shadow-sm">Memuat data...</div>
  if (data.length === 0) return <div className="p-12 text-center bg-white rounded-2xl shadow-sm">Belum ada laporan.</div>

  if (showTable) {
    return (
      <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F1F4F9] text-[#202224] font-bold text-left">
                <th className="px-5 py-3 w-8">No</th>
                <th className="px-5 py-3">Pemda</th>
                <th className="px-5 py-3">Aplikasi</th>
                <th className="px-5 py-3">Progress</th>
                <th className="px-5 py-3">Deadline</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => {
                const isAlreadySubmitted = Boolean(item.verifikasi)
                const isDisabled = submittingId === item.id || item.status === "hijau" || isAlreadySubmitted
                const progressValue = mapStatusToProgress(item.status)
                const progressBadgeClass = getProgressBadgeClass(progressValue)

                return (
                  <tr key={item.id} className={`border-b last:border-0 hover:bg-gray-50/50 ${i % 2 === 0 ? "" : "bg-[#FAFAFA]"}`}>
                  <td className="px-5 py-3 text-center font-semibold">{i + 1}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-white border flex items-center justify-center overflow-hidden shrink-0">
                        {item.logo_pemda ? <img src={item.logo_pemda} className="w-full h-full object-contain p-0.5" /> : <span>🏛️</span>}
                      </div>
                      <span className="font-semibold">{entityLabel(item.permintaan?.pemda)}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">{entityLabel(item.permintaan?.aplikasi)}</td>
                  <td className="px-5 py-3 max-w-[200px] truncate">{item.laporan_progress}</td>
                  <td className="px-5 py-3 text-red-500 font-bold">{formatDate(item.permintaan?.tanggal_deadline)}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${progressBadgeClass}`}>
                      {progressValue}%
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-center gap-2">
                      <Button size="sm" variant="outline" className="h-7 text-xs" disabled={isDisabled} onClick={() => onSubmitVerifikasi(item)}>
                        {submittingId === item.id ? "..." : isAlreadySubmitted ? "Sudah Diajukan" : <SendHorizonal className="h-3 w-3" />}
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
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2 xl:grid-cols-3">
      {data.map((item) => (
        <LaporanKinerjaCard
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
          onSubmitVerifikasi={onSubmitVerifikasi}
          isSubmitting={submittingId === item.id}
          isAlreadySubmitted={Boolean(item.verifikasi)}
        />
      ))}
    </div>
  )
}
