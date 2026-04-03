// app/super-admin/distribusi/_components/DistribusiUtils.tsx

"use client"

import { useState } from "react"
import { FileText, X } from "lucide-react"
import type { DistribusiItem } from "./DistribusiClient"

export function getStatusMeta(status: DistribusiItem["status"]) {
  if (status === "approved") {
    return {
      label: "Terverifikasi",
      badgeClass: "bg-teal-100 text-teal-600",
    }
  }

  if (status === "revision") {
    return {
      label: "Revisi",
      badgeClass: "bg-amber-100 text-amber-600",
    }
  }

  if (status === "pending") {
    return {
      label: "Menunggu Verifikasi",
      badgeClass: "bg-blue-100 text-blue-700",
    }
  }

  return {
    label: "Didistribusikan",
    badgeClass: "bg-pink-100 text-pink-600",
  }
}

export function formatTgl(dateStr: string) {
  if (!dateStr) return "-"
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
}

export function PemdaAvatar({ nama, logo }: { nama: string; logo?: string }) {
  if (logo) {
    return (
      <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
        <img src={logo} alt={nama} className="w-full h-full object-contain p-1" />
      </div>
    )
  }
  const initials = nama?.slice(0, 2).toUpperCase() ?? "PE"
  return (
    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-teal-400 to-blue-500 flex items-center justify-center shrink-0 shadow-sm">
      <span className="text-sm font-bold text-white">{initials}</span>
    </div>
  )
}

export function MiniAvatar({ label }: { label: string }) {
  const colors = ["from-pink-400 to-rose-500", "from-blue-400 to-indigo-500", "from-green-400 to-teal-500", "from-orange-400 to-amber-500", "from-purple-400 to-violet-500"]
  const color = colors[label.charCodeAt(0) % colors.length]
  return (
    <div className={`w-8 h-8 rounded-full bg-linear-to-br ${color} border-2 border-white flex items-center justify-center text-xs font-bold text-white -ml-2 first:ml-0 shadow-sm`}>
      {label.charAt(0).toUpperCase()}
    </div>
  )
}

export function InlineBadge({ label, color }: { label: string; color: "purple" | "blue" | "orange" | "green" | "red" }) {
  const styles = {
    purple: "bg-purple-100/60 text-purple-600",
    blue: "bg-blue-100/60 text-blue-600",
    orange: "bg-orange-100/60 text-orange-500",
    green: "bg-green-100/60 text-green-600",
    red: "bg-red-100/60 text-red-500",
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold shrink-0 ${styles[color]}`}>
      {label}
    </span>
  )
}

function isImage(url: string) {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
}

function getFileName(url: string) {
  return decodeURIComponent(url.split("/").pop()?.split("_").slice(-1)[0] ?? url)
}

function LightboxModal({ urls, initialIndex, onClose }: { urls: string[]; initialIndex: number; onClose: () => void }) {
  const [current, setCurrent] = useState(initialIndex)
  const url = urls[current]
  return (
    <div className="fixed inset-0 bg-black/80 z-100 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-10 right-0 text-white hover:text-gray-300 transition">
          <X className="size-6" />
        </button>
        {isImage(url) ? (
          <img src={url} alt="Preview" className="w-full max-h-[80vh] object-contain rounded-xl" />
        ) : (
          <div className="bg-white rounded-xl p-8 text-center">
            <FileText className="size-16 text-gray-400 mx-auto mb-3" />
            <p className="font-semibold text-[#202224] mb-4">{getFileName(url)}</p>
            <a href={url} target="_blank" rel="noopener noreferrer"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition">
              Buka File
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export function LampiranSection({ lampiran }: { lampiran: string[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  if (!lampiran || lampiran.length === 0) return null
  return (
    <>
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-[#202224]/50">Lampiran</p>
        <div className="flex flex-wrap gap-1.5">
          {lampiran.map((url, i) =>
            isImage(url) ? (
              <button key={i} onClick={() => setLightboxIndex(i)}
                className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200 hover:border-blue-400 transition group">
                <img src={url} alt="lampiran" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
              </button>
            ) : (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold rounded-lg transition border border-blue-100">
                <FileText className="size-3.5" />
                <span className="max-w-[100px] truncate">{getFileName(url)}</span>
              </a>
            )
          )}
        </div>
      </div>
      {lightboxIndex !== null && (
        <LightboxModal urls={lampiran} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </>
  )
}
