// app/admin/distribusi/_components/DistribusiCard.tsx

"use client"

import { MoreVertical, MessageSquare, Users, Pencil } from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { DistribusiItem } from "./DistribusiClient"
import {
  PemdaAvatar, MiniAvatar, InlineBadge, LampiranSection, getStatusMeta, formatTgl,
} from "@/app/super-admin/distribusi/_components/DistribusiUtils"

interface Props {
  item: DistribusiItem
  onSelesai: (id: string) => void
  onDelete: (id: string) => void
  onShowKomentar: (text: string) => void
  onEdit: (item: DistribusiItem) => void
}

export function DistribusiPermintaanCard({ item }: { item: DistribusiItem }) {
  return (
    <div className="rounded-[22px] border border-[#F0F1F5] bg-white p-6 shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
      <div className="flex items-start gap-4">
        <PemdaAvatar nama={item.nama_pemda} logo={item.logo_pemda} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-bold text-[#202224]">{item.nama_pemda}</p>
          <p className="mt-1 truncate text-sm text-[#7B7D7F]">
            <span className="font-semibold">{item.aplikasi}</span>
            <span className="mx-1.5">·</span>
            {item.menu}
          </p>
        </div>
      </div>

      <div className="my-4 border-t border-[#D9D9D9]" />

      <div className="space-y-2.5">
        <div className="flex items-start gap-3">
          <span className="inline-flex rounded-md bg-[#FFE9DA] px-4 py-1 text-xs font-medium text-[#FF8A38]">Awal</span>
          <p className="line-clamp-2 text-sm leading-6 text-[#7B7D7F]">{item.awal}</p>
        </div>
        <div className="flex items-start gap-3">
          <span className="inline-flex rounded-md bg-[#CFF4EF] px-3.5 py-1 text-xs font-medium text-[#00B69B]">Target</span>
          <p className="line-clamp-2 text-sm leading-6 text-[#7B7D7F]">{item.target}</p>
        </div>
      </div>

      <div className="my-4 border-t border-[#D9D9D9]" />
      <p className="text-[15px] font-semibold text-[#FF4D4F]">
        Deadline: <span className="font-medium">{formatTgl(item.deadline)}</span>
      </p>
    </div>
  )
}

export function DistribusiCard({ item, onSelesai, onDelete, onShowKomentar, onEdit }: Props) {
  const statusMeta = getStatusMeta(item.status)

  return (
    <div className="bg-white rounded-2xl shadow-[6px_6px_54px_rgba(0,0,0,0.05)] p-4 space-y-3 border border-gray-50">
      <div className="flex items-start gap-3">
        <PemdaAvatar nama={item.nama_pemda} logo={item.logo_pemda} />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-[#202224] leading-snug">{item.nama_pemda}</p>
          <p className="text-xs text-[#797A7C] mt-0.5">
            <span className="font-semibold">{item.aplikasi}</span>
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
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => onEdit(item)}>
              <Pencil className="size-3.5 mr-2" /> Edit Programmer
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSelesai(item.id)}>Tandai Selesai</DropdownMenuItem>
            <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={() => onDelete(item.id)}>Hapus</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="border-t border-black/5" />
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <InlineBadge label="Status" color="green" />
          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${statusMeta.badgeClass}`}>
            {statusMeta.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <InlineBadge label="Admin" color="purple" />
          <p className="text-xs text-[#797A7C] font-semibold">{item.admin}</p>
        </div>
        <div className="flex items-center gap-2">
          <InlineBadge label="Programmer" color="blue" />
          <p className="text-xs text-[#797A7C] font-semibold">
            {item.programmer.length === 0 ? "-" : item.programmer.map((p) => p.nama).join(", ")}
          </p>
        </div>
      </div>
      {item.lampiran?.length > 0 && (
        <>
          <div className="border-t border-black/5" />
          <LampiranSection lampiran={item.lampiran} />
        </>
      )}
      <p className="text-xs font-bold text-red-500">
        Deadline: <span className="font-normal">{formatTgl(item.deadline)}</span>
      </p>
      <div className="border-t border-black/5" />
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {item.programmer.slice(0, 3).map((p) => (
            <MiniAvatar key={p.pelaksana_id} label={p.nama} />
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs text-[#797A7C]">
          <span className="flex items-center gap-1">
            <Users className="size-3.5" />
            <span>{item.programmer.length}</span>
          </span>
          {item.komentar && (
            <button onClick={() => onShowKomentar(item.komentar!)} className="flex items-center gap-1 hover:text-blue-500 transition">
              <MessageSquare className="size-3.5" />
              <span>1</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function SelesaiCard({ item, onDelete }: { item: DistribusiItem; onDelete: (id: string) => void }) {
  const statusMeta = getStatusMeta(item.status)
  return (
    <div className="bg-white rounded-2xl shadow-[6px_6px_54px_rgba(0,0,0,0.05)] p-4 space-y-3 border border-gray-50">
      <div className="flex items-start gap-3">
        <PemdaAvatar nama={item.nama_pemda} logo={item.logo_pemda} />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-[#202224] leading-snug">{item.nama_pemda}</p>
          <p className="text-xs text-[#797A7C] mt-0.5">
            <span className="font-semibold">{item.aplikasi}</span>
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
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={() => onDelete(item.id)}>Hapus</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="border-t border-black/5" />
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <InlineBadge label="Hasil" color="green" />
          <p className="text-xs text-[#797A7C] leading-relaxed font-semibold">{item.hasil ?? "-"}</p>
        </div>
        <div className="flex items-center gap-2">
          <InlineBadge label="Kualitas" color="orange" />
          <p className="text-xs text-[#797A7C] font-semibold">{item.kualitas ?? "-"}</p>
        </div>
      </div>
      <p className="text-xs font-bold text-[#797A7C]">
        Status: <span className="font-normal">{statusMeta.label}</span>
      </p>
      <div className="border-t border-black/5" />
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {item.programmer.slice(0, 3).map((p) => (
            <MiniAvatar key={p.pelaksana_id} label={p.nama} />
          ))}
        </div>
        <div className="flex items-center gap-1 text-xs text-[#797A7C]">
          <Users className="size-3.5" />
          <span>{item.programmer.length}</span>
        </div>
      </div>
    </div>
  )
}
