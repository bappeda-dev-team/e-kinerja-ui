// app/super-admin/verifikasi/_components/VerifikasiCard.tsx

"use client"

import { MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { VerifikasiItem } from "./VerifikasiClient"

function formatTanggal(value?: string) {
  if (!value) return "-"
  return new Date(value).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
}

function getStatusMeta(status: VerifikasiItem["status"]) {
  if (status === "terverifikasi") {
    return {
      label: "Terverifikasi",
      badgeClass: "bg-[#CCF0EB] text-[#00B69B]",
    }
  }

  if (status === "revisi") {
    return {
      label: "Revisi",
      badgeClass: "bg-[#FFE1E1] text-[#FD5454]",
    }
  }

  return {
    label: "Menunggu",
    badgeClass: "bg-[#D9E8FF] text-[#2F6FED]",
  }
}

function InitialAvatar({ label }: { label: string }) {
  const initials = label
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "VL"

  return (
    <div className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-[14px] bg-linear-to-br from-[#58D5C9] to-[#4E7CF3] text-sm font-bold text-white">
      {initials}
    </div>
  )
}

function CardMenu({ onVerify }: { onVerify: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="rounded p-1 text-[#7B7D7F] transition hover:bg-gray-100">
          <MoreVertical className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onVerify}>Proses Verifikasi</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function VerifikasiPermintaanCard({ item, onVerify }: { item: VerifikasiItem; onVerify: (item: VerifikasiItem) => void }) {
  return (
    <div className="rounded-[22px] border border-[#F0F1F5] bg-white p-6 shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
      <div className="flex items-start gap-4">
        <InitialAvatar label={item.programmer} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-bold text-[#202224]">{item.programmer}</p>
          <p className="mt-1 truncate text-sm text-[#7B7D7F]">
            <span className="font-semibold">{item.laporan_label}</span>
            <span className="mx-1.5">·</span>
            {item.verifikator || "Belum ada verifikator"}
          </p>
        </div>
        <CardMenu onVerify={() => onVerify(item)} />
      </div>

      <div className="my-4 border-t border-[#D9D9D9]" />

      <div className="space-y-2.5">
        <div className="flex items-start gap-3">
          <span className="inline-flex rounded-md bg-[#FFE9DA] px-4 py-1 text-xs font-medium text-[#FF8A38]">
            Progress
          </span>
          <p className="line-clamp-2 text-sm leading-6 text-[#7B7D7F]">{item.progres_deskripsi || "Belum ada progress laporan."}</p>
        </div>
        <div className="flex items-start gap-3">
          <span className="inline-flex rounded-md bg-[#CFF4EF] px-3.5 py-1 text-xs font-medium text-[#00B69B]">
            Catatan
          </span>
          <p className="line-clamp-2 text-sm leading-6 text-[#7B7D7F]">{item.komentar || "Belum ada komentar verifikasi."}</p>
        </div>
      </div>

      <div className="my-4 border-t border-[#D9D9D9]" />

      <p className="text-[15px] font-semibold text-[#FF4D4F]">
        Diajukan: <span className="font-medium">{formatTanggal(item.tanggal_diajukan)}</span>
      </p>
    </div>
  )
}

export function VerifikasiCard({ item, onVerify }: { item: VerifikasiItem; onVerify: (item: VerifikasiItem) => void }) {
  const statusMeta = getStatusMeta(item.status)

  return (
    <div className="rounded-2xl border border-gray-50 bg-white p-4 shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
      <div className="flex items-start gap-3">
        <InitialAvatar label={item.programmer} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold leading-snug text-[#202224]">{item.programmer}</p>
          <p className="mt-0.5 text-xs text-[#797A7C]">
            <span className="font-semibold">{item.laporan_label}</span>
            <span className="mx-1">·</span>
            {item.verifikator || "Belum ada verifikator"}
          </p>
        </div>
        <CardMenu onVerify={() => onVerify(item)} />
      </div>

      <div className="my-3 border-t border-black/5" />

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex rounded-md bg-[#EAF1FF] px-2.5 py-1 text-[11px] font-semibold text-[#2F6FED]">
            Status
          </span>
          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${statusMeta.badgeClass}`}>
            {statusMeta.label}
          </span>
        </div>
        <div className="flex items-start gap-2">
          <span className="inline-flex rounded-md bg-[#F4E9FF] px-2.5 py-1 text-[11px] font-semibold text-[#8C52FF]">
            Progress
          </span>
          <p className="flex-1 text-xs font-semibold leading-relaxed text-[#797A7C]">{item.progres_deskripsi || "-"}</p>
        </div>
        <div className="flex items-start gap-2">
          <span className="inline-flex rounded-md bg-[#FFF1E8] px-2.5 py-1 text-[11px] font-semibold text-[#FF8A38]">
            Komentar
          </span>
          <p className="flex-1 text-xs font-semibold leading-relaxed text-[#797A7C]">{item.komentar || "-"}</p>
        </div>
      </div>

      {item.status === "menunggu" ? (
        <button
          type="button"
          onClick={() => onVerify(item)}
          className="mt-4 rounded-md bg-[#4379EE] px-5 py-2 text-[12px] font-bold text-white transition hover:bg-blue-700"
        >
          Verifikasi Sekarang
        </button>
      ) : null}

      <div className="mt-4 border-t border-black/5 pt-3 text-xs">
        <p className="font-semibold text-[#202224]/70">
          Diperbarui: <span className="font-normal">{formatTanggal(item.tanggal_verifikasi || item.tanggal_diajukan)}</span>
        </p>
      </div>
    </div>
  )
}

export function VerifikasiSelesaiCard({ item, onVerify }: { item: VerifikasiItem; onVerify: (item: VerifikasiItem) => void }) {
  const statusMeta = getStatusMeta(item.status)

  return (
    <div className="rounded-2xl border border-gray-50 bg-white p-4 shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
      <div className="flex items-start gap-3">
        <InitialAvatar label={item.programmer} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold leading-snug text-[#202224]">{item.programmer}</p>
          <p className="mt-0.5 text-xs text-[#797A7C]">
            <span className="font-semibold">{item.laporan_label}</span>
            <span className="mx-1">·</span>
            {item.verifikator || "Belum ada verifikator"}
          </p>
        </div>
        <CardMenu onVerify={() => onVerify(item)} />
      </div>

      <div className="my-3 border-t border-black/5" />

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex rounded-md bg-[#E8FBF5] px-2.5 py-1 text-[11px] font-semibold text-[#00B69B]">
            Hasil
          </span>
          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${statusMeta.badgeClass}`}>
            {statusMeta.label}
          </span>
        </div>
        <div className="flex items-start gap-2">
          <span className="inline-flex rounded-md bg-[#FFF1E8] px-2.5 py-1 text-[11px] font-semibold text-[#FF8A38]">
            Komentar
          </span>
          <p className="flex-1 text-xs font-semibold leading-relaxed text-[#797A7C]">{item.komentar || "Sudah diverifikasi tanpa catatan."}</p>
        </div>
      </div>

      <div className="mt-4 border-t border-black/5 pt-3 text-xs">
        <p className="font-semibold text-[#202224]/70">
          Diverifikasi: <span className="font-normal">{formatTanggal(item.tanggal_verifikasi || item.tanggal_diajukan)}</span>
        </p>
      </div>
    </div>
  )
}
