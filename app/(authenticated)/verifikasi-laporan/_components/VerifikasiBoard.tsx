"use client"

import { Building2, MoreVertical } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { VerifikasiItem } from "./VerifikasiClient"

interface Props {
  data: VerifikasiItem[]
  onVerify: (item: VerifikasiItem) => void
}

function formatTgl(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function PemdaAvatar() {
  return (
    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
      <Building2 className="size-5 text-gray-400" />
    </div>
  )
}

function KanbanCard({
  item,
  onVerify,
}: {
  item: VerifikasiItem
  onVerify: (item: VerifikasiItem) => void
}) {

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">

      {/* Header: avatar + nama + kebab */}
      <div className="flex items-start gap-3">

        <PemdaAvatar />

        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-[#202224] leading-snug truncate">
            {item.nama_pemda}
          </p>
          <p className="text-xs text-[#797A7C] mt-0.5">
            {item.aplikasi}
            <span className="mx-1">·</span>
            {item.menu}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 rounded hover:bg-gray-100 transition shrink-0">
              <MoreVertical className="size-4 text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem onClick={() => onVerify(item)}>
              Verifikasi
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>

      <div className="border-t border-black/10" />

      {/* Status-specific content */}
      {item.status === "menunggu" && (
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-500 text-white text-xs font-semibold">
            Verifikasi
          </span>
          <span className="text-xs text-[#797A7C]">
            Diajukan : {formatTgl(item.tanggal_diajukan)}
          </span>
        </div>
      )}

      {item.status === "revisi" && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-orange-100 text-orange-500 text-xs font-semibold">
              Revisi
            </span>
          </div>
          {item.catatan_revisi && (
            <p className="text-xs text-[#797A7C] leading-relaxed">
              {item.catatan_revisi}
            </p>
          )}
          {item.deadline && (
            <p className="text-xs font-semibold text-red-500">
              Deadline: {formatTgl(item.deadline)}
            </p>
          )}
        </div>
      )}

      {item.status === "terverifikasi" && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            {item.verifikator && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-100 text-blue-600 text-xs font-semibold">
                Verifikator
              </span>
            )}
            {item.komentar && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-green-100 text-green-600 text-xs font-semibold">
                Komentar
              </span>
            )}
          </div>
          {item.verifikator && (
            <p className="text-xs text-[#797A7C]">
              {item.verifikator}
            </p>
          )}
          {item.komentar && (
            <p className="text-xs text-[#797A7C] leading-relaxed">
              {item.komentar}
            </p>
          )}
          <div className="border-t border-black/10" />
          {item.tanggal_verifikasi && (
            <p className="text-xs text-[#797A7C]">
              Terverifikasi pada {formatTgl(item.tanggal_verifikasi)}
            </p>
          )}
        </div>
      )}

    </div>
  )
}

const COLUMNS: {
  key: VerifikasiItem["status"]
  label: string
  color: string
  badgeClass: string
}[] = [
  {
    key: "menunggu",
    label: "Menunggu",
    color: "text-[#202224]",
    badgeClass: "bg-blue-500 text-white",
  },
  {
    key: "revisi",
    label: "Revisi",
    color: "text-[#202224]",
    badgeClass: "bg-orange-100 text-orange-500",
  },
  {
    key: "terverifikasi",
    label: "Terverifikasi",
    color: "text-[#202224]",
    badgeClass: "bg-green-100 text-green-600",
  },
]

export default function VerifikasiBoard({ data, onVerify }: Props) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

      {COLUMNS.map((col) => {

        const items = data.filter(d => d.status === col.key)

        return (
          <div key={col.key} className="space-y-3">

            {/* Column header */}
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-2">
                <span className={`text-lg font-bold ${col.color}`}>
                  {col.label}
                </span>
                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${col.badgeClass}`}>
                  {items.length}
                </span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 rounded hover:bg-gray-100 transition">
                    <MoreVertical className="size-4 text-gray-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuItem>Lihat Semua</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            </div>

            {/* Cards */}
            <div className="space-y-3">
              {items.map(item => (
                <KanbanCard
                  key={item.id}
                  item={item}
                  onVerify={onVerify}
                />
              ))}
            </div>

          </div>
        )
      })}

    </div>
  )
}
