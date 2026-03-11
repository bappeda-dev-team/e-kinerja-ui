"use client"

import { Building2, MoreVertical, MessageSquare, Users } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { PermintaanItem, DistribusiItem } from "./DistribusiClient"

interface Props {
  permintaan: PermintaanItem[]
  distribusi: DistribusiItem[]
  onAssign: (item: PermintaanItem) => void
  onSelesai: (id: string) => void
  onDelete: (id: string) => void
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

function MiniAvatar({ label }: { label: string }) {
  return (
    <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-bold text-white -ml-2 first:ml-0">
      {label.charAt(0).toUpperCase()}
    </div>
  )
}

function Badge({
  label,
  className,
}: {
  label: string
  className: string
}) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold shrink-0 ${className}`}>
      {label}
    </span>
  )
}

/* ─── Column 1: Daftar Permintaan ──────────────────────── */

function PermintaanCard({
  item,
  onAssign,
}: {
  item: PermintaanItem
  onAssign: (item: PermintaanItem) => void
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">

      <div className="flex items-start gap-3">
        <PemdaAvatar />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-[#202224] leading-snug">
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
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onAssign(item)}>
              Distribusikan
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="border-t border-black/10" />

      <div className="space-y-1.5">
        <div className="flex items-start gap-2">
          <Badge label="Awal" className="bg-purple-100 text-purple-600 mt-0.5" />
          <p className="text-xs text-[#797A7C] leading-relaxed">{item.awal}</p>
        </div>
        <div className="flex items-start gap-2">
          <Badge label="Target" className="bg-blue-100 text-blue-600 mt-0.5" />
          <p className="text-xs text-[#797A7C] leading-relaxed">{item.target}</p>
        </div>
      </div>

      <p className="text-xs font-semibold text-red-500">
        Deadline: {formatTgl(item.deadline)}
      </p>

    </div>
  )
}

/* ─── Column 2: Telah Didistribusikan ──────────────────── */

function DistribusiCard({
  item,
  onSelesai,
  onDelete,
}: {
  item: DistribusiItem
  onSelesai: (id: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">

      <div className="flex items-start gap-3">
        <PemdaAvatar />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-[#202224] leading-snug">
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
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onSelesai(item.id)}>
              Tandai Selesai
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(item.id)}
              className="text-red-500 focus:text-red-500"
            >
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="border-t border-black/10" />

      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <Badge label="Admin" className="bg-purple-100 text-purple-600" />
          <p className="text-xs text-[#797A7C]">{item.admin}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge label="Programmer" className="bg-orange-100 text-orange-500" />
          <p className="text-xs text-[#797A7C]">{item.programmer.join(", ")}</p>
        </div>
      </div>

      <p className="text-xs font-semibold text-red-500">
        Deadline: {formatTgl(item.deadline)}
      </p>

      <div className="border-t border-black/10" />

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {item.programmer.slice(0, 2).map((p, i) => (
            <MiniAvatar key={i} label={p} />
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs text-[#797A7C]">
          <span className="flex items-center gap-1">
            <Users className="size-3.5" />
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="size-3.5" />
            {item.jumlah_komentar ?? 0}
          </span>
        </div>
      </div>

    </div>
  )
}

/* ─── Column 3: Selesai ─────────────────────────────────── */

function SelesaiCard({
  item,
  onDelete,
}: {
  item: DistribusiItem
  onDelete: (id: string) => void
}) {
  const isLate = item.ketepatan === "Terlambat"

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">

      <div className="flex items-start gap-3">
        <PemdaAvatar />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-[#202224] leading-snug">
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
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem
              onClick={() => onDelete(item.id)}
              className="text-red-500 focus:text-red-500"
            >
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="border-t border-black/10" />

      <div className="space-y-1.5">
        <div className="flex items-start gap-2">
          <Badge label="Hasil" className="bg-green-100 text-green-600 mt-0.5" />
          <p className="text-xs text-[#797A7C] leading-relaxed">{item.hasil}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge label="Kualitas" className="bg-blue-100 text-blue-600" />
          <p className="text-xs text-[#797A7C]">{item.kualitas}</p>
        </div>
      </div>

      <p className={`text-xs font-semibold ${isLate ? "text-red-500" : "text-[#797A7C]"}`}>
        Status: {item.ketepatan}
      </p>

      <div className="border-t border-black/10" />

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {item.programmer.slice(0, 2).map((p, i) => (
            <MiniAvatar key={i} label={p} />
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs text-[#797A7C]">
          <span className="flex items-center gap-1">
            <Users className="size-3.5" />
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="size-3.5" />
            {item.jumlah_komentar ?? 0}
          </span>
        </div>
      </div>

    </div>
  )
}

/* ─── Board ─────────────────────────────────────────────── */

export default function DistribusiBoard({
  permintaan,
  distribusi,
  onAssign,
  onSelesai,
  onDelete,
}: Props) {

  const didistribusikan = distribusi.filter(d => d.status === "didistribusikan")
  const selesai = distribusi.filter(d => d.status === "selesai")

  const columns = [
    { key: "permintaan", label: "Daftar Permintaan", count: permintaan.length },
    { key: "distribusi", label: "Telah Didistribusikan", count: didistribusikan.length },
    { key: "selesai",    label: "Selesai",              count: selesai.length },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

      {columns.map((col) => (

        <div key={col.key} className="space-y-3">

          {/* Column Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-[#202224]">
                {col.label}
              </span>
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold bg-teal-500 text-white">
                {col.count}
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

            {col.key === "permintaan" &&
              permintaan.map(item => (
                <PermintaanCard
                  key={item.id}
                  item={item}
                  onAssign={onAssign}
                />
              ))
            }

            {col.key === "distribusi" &&
              didistribusikan.map(item => (
                <DistribusiCard
                  key={item.id}
                  item={item}
                  onSelesai={onSelesai}
                  onDelete={onDelete}
                />
              ))
            }

            {col.key === "selesai" &&
              selesai.map(item => (
                <SelesaiCard
                  key={item.id}
                  item={item}
                  onDelete={onDelete}
                />
              ))
            }

          </div>

        </div>

      ))}

    </div>
  )
}
