import { FileSearch, MessageSquareText } from "lucide-react"

import { formatDateTimeLabel, type VerifikasiListItem } from "@/app/verifikator/verifikasi/utils"
import EmptyState from "./EmptyState"

interface ActivityFeedProps {
  items: VerifikasiListItem[]
  loading: boolean
}

export default function ActivityFeed({ items, loading }: ActivityFeedProps) {
  return (
    <div className="rounded-[20px] bg-white p-6 shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF3FF]">
          <FileSearch className="h-6 w-6 text-[#5065F6]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#202224]">Aktivitas Terbaru</h2>
          <p className="text-sm text-[#202224]/55">Perubahan status terbaru dari data verifikasi.</p>
        </div>
      </div>

      {loading ? (
        <EmptyState label="Memuat aktivitas..." />
      ) : items.length === 0 ? (
        <EmptyState label="Belum ada aktivitas verifikasi." />
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-start gap-3 rounded-2xl border border-[#F0F1F5] p-4">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F5F6FA]">
                <MessageSquareText className="h-5 w-5 text-[#202224]/70" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-6 text-[#202224]">Laporan {item.laporanId}</p>
                <p className="text-sm text-[#202224]/65">
                  {item.status === "terverifikasi"
                    ? "Laporan sudah diverifikasi."
                    : item.status === "revisi"
                      ? "Laporan dikembalikan untuk revisi."
                      : "Laporan masih menunggu proses verifikasi."}
                </p>
                <p className="mt-1 text-sm text-[#202224]/65">
                  Programmer: {item.programmer} • Verifikator: {item.verifikator}
                </p>
                {item.komentar ? <p className="mt-1 line-clamp-2 text-sm italic text-[#5065F6]">"{item.komentar}"</p> : null}
                <p className="mt-2 text-xs text-[#202224]/45">{formatDateTimeLabel(item.diperbaruiPada)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
