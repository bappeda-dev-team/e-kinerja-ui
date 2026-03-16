"use client"

import { MoreVertical, SendHorizonal, Download, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import LaporanKinerjaCard from "./LaporanKinerjaCard"
import type { LaporanKinerjaItem } from "../_types"

interface Props {
  data: LaporanKinerjaItem[]
  loading?: boolean
  showTable: boolean
  onEdit: (item: LaporanKinerjaItem) => void
  onDelete: (id: string) => void
  onSubmitVerifikasi: (item: LaporanKinerjaItem) => void
  submittingId: string | null
}

function formatDate(iso?: string) {
  if (!iso) return "-"
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
}

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  hijau:   { label: "Terverifikasi", className: "bg-[#00B69B]/15 text-[#00B69B]" },
  putih:   { label: "Menunggu",      className: "bg-gray-100 text-gray-500" },
  merah:   { label: "Ditolak",       className: "bg-[#FD5454]/15 text-[#FD5454]" },
  kuning:  { label: "Revisi",        className: "bg-[#FFA756]/15 text-[#FFA756]" },
}

function StatusBadge({ status }: { status?: string }) {
  const key = (status ?? "").toLowerCase()
  const cfg = STATUS_MAP[key] ?? { label: status ?? "-", className: "bg-gray-100 text-gray-500" }
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${cfg.className}`}>
      {cfg.label}
    </span>
  )
}

export default function LaporanKinerjaGrid({
  data,
  loading,
  showTable,
  onEdit,
  onDelete,
  onSubmitVerifikasi,
  submittingId,
}: Props) {

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl bg-white p-12 text-[#202224]/40 shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
        Memuat data laporan...
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-2xl bg-white p-12 text-[#202224]/40 shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
        Belum ada laporan kinerja.
      </div>
    )
  }

  if (showTable) {
    return (
      <div className="rounded-2xl bg-white shadow-[6px_6px_54px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            <thead>
              <tr className="bg-[#F1F4F9] text-[#202224] font-bold text-left">
                <th className="rounded-tl-2xl px-5 py-3">No</th>
                <th className="px-5 py-3">Pemda</th>
                <th className="px-5 py-3">Aplikasi</th>
                <th className="px-5 py-3">Menu</th>
                <th className="px-5 py-3">Programmer</th>
                <th className="px-5 py-3">Progress</th>
                <th className="px-5 py-3">Deadline</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Lampiran</th>
                <th className="px-5 py-3">Dibuat</th>
                <th className="rounded-tr-2xl px-5 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => (
                <tr
                  key={item.id}
                  className={`border-b border-[#979797]/20 last:border-0 hover:bg-[#F5F6FA]/50 transition-colors ${i % 2 === 0 ? "" : "bg-[#FAFAFA]"}`}
                >
                  <td className="px-5 py-3 text-[#202224]/60 font-semibold text-center">{i + 1}</td>
                  <td className="px-5 py-3 font-semibold text-[#202224]">{item.permintaan?.pemda ?? "-"}</td>
                  <td className="px-5 py-3 text-[#202224]/80">{item.permintaan?.aplikasi ?? "-"}</td>
                  <td className="px-5 py-3 text-[#202224]/80">{item.permintaan?.menu ?? "-"}</td>
                  <td className="px-5 py-3 text-[#202224]/80">{item.programmer?.full_name ?? "-"}</td>
                  <td className="px-5 py-3 max-w-[220px]">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold bg-yellow-100 text-yellow-600 shrink-0">
                        75%
                      </span>
                      <p className="truncate text-[#202224]/80">{item.laporan_progress}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[11px] font-bold text-red-500">
                    {formatDate(item.permintaan?.tanggal_deadline)}
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={item.status} /></td>
                  <td className="px-5 py-3">
                    {(item.permintaan?.lampiran ?? []).length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {(item.permintaan?.lampiran ?? []).map((url, idx) => (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-2 py-0.5 bg-[#F5F6FA] hover:bg-[#4880FF]/10 border border-[#D5D5D5] rounded-md transition group"
                            style={{ borderWidth: "0.6px" }}
                          >
                            <span className="text-[10px] font-bold text-[#202224]">File {idx + 1}</span>
                            <Download size={9} className="text-gray-400 group-hover:text-[#4880FF]" />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[11px] italic text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-[#202224]/60">{formatDate(item.created_at)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 gap-1 text-xs"
                        disabled={submittingId === item.id || item.status === "hijau"}
                        onClick={() => onSubmitVerifikasi(item)}
                      >
                        <SendHorizonal className="h-3 w-3" />
                        {submittingId === item.id ? "..." : item.status === "hijau" ? "Terverifikasi" : "Verifikasi"}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 rounded hover:bg-gray-100">
                            <MoreVertical className="h-4 w-4 text-[#202224]/50" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(item)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => onDelete(item.id)}>Hapus</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {data.map((item) => (
        <LaporanKinerjaCard
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
          onSubmitVerifikasi={onSubmitVerifikasi}
          isSubmitting={submittingId === item.id}
        />
      ))}
    </div>
  )
}