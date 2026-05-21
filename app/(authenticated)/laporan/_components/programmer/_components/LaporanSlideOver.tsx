"use client"

import { useEffect, useRef } from "react"
import { X, Calendar, User, Clock, FileText, File, CheckCircle2, History, AlertCircle } from "lucide-react"
import { LaporanKinerjaItem } from "../types"

interface SlideOverProps {
  isOpen: boolean
  onClose: () => void
  item: LaporanKinerjaItem | null
}

function mapStatusToProgress(status?: string): number {
  if (status === "hijau") return 100
  if (status === "kuning") return 55
  if (status === "merah") return 20
  return 80
}

function formatDate(iso?: string) {
  if (!iso) return "-"
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function entityLabel(value?: string | { name: string }) {
  if (!value) return "-"
  return typeof value === "string" ? value : value.name
}

export default function LaporanSlideOver({ isOpen, onClose, item: itemProp }: SlideOverProps) {
  // Keep last item in ref so close animation can still render content
  const lastItemRef = useRef<LaporanKinerjaItem | null>(null)
  if (itemProp) lastItemRef.current = itemProp
  const item = itemProp ?? lastItemRef.current

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  if (!item) return null

  const progressValue = mapStatusToProgress(item.status)
  
  let statusText = "Menunggu Verifikasi"
  let badgeColor = "bg-amber-100 text-amber-700"
  let progressBarColor = "bg-amber-500"

  if (item.status === "hijau") {
    statusText = "Terverifikasi"
    badgeColor = "bg-emerald-100 text-emerald-700"
    progressBarColor = "bg-emerald-500"
  } else if (item.status === "merah" || item.status === "kuning") {
    statusText = "Perlu Revisi"
    badgeColor = "bg-red-100 text-red-700"
    progressBarColor = "bg-red-500"
  }

  const isRevisi = item.status === "merah" || item.status === "kuning"
  const isVerifikasi = item.status === "hijau"

  const pemdaName = entityLabel(item.permintaan?.pemda)
  const appName = entityLabel(item.permintaan?.aplikasi)

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed top-0 left-0 w-[100vw] h-[100vh] z-[100] bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Slide Panel */}
      <div
        className={`fixed top-0 right-0 h-[100vh] z-[110] w-[400px] max-w-[90vw] bg-white border-l border-gray-200 transition-transform duration-300 ease-in-out transform flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b px-6 py-5 bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">{pemdaName}</h2>
            <p className="text-sm font-medium text-gray-500 mt-0.5">{appName}</p>
            <div className={`mt-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold leading-none ${badgeColor}`}>
              {statusText}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Progress */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-bold text-gray-900">Progress</span>
              <span className="text-sm font-bold text-gray-700">{progressValue}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${progressBarColor}`}
                style={{ width: `${progressValue}%` }}
              />
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-100 p-3 bg-gray-50/50">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-xs font-medium">Deadline</span>
              </div>
              <p className={`text-sm font-bold ${isRevisi ? 'text-red-600' : 'text-gray-900'}`}>
                {formatDate(item.permintaan?.tanggal_deadline)}
              </p>
            </div>
            
            <div className="rounded-xl border border-gray-100 p-3 bg-gray-50/50">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <User className="h-4 w-4" />
                <span className="text-xs font-medium">Programmer</span>
              </div>
              <p className="text-sm font-bold text-gray-900 truncate">
                {item.programmer?.full_name || item.programmer?.username || "N/A"}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 p-3 bg-gray-50/50">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-xs font-medium">Dibuat</span>
              </div>
              <p className="text-sm font-bold text-gray-900">
                {formatDate(item.created_at)}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 p-3 bg-gray-50/50">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <History className="h-4 w-4" />
                <span className="text-xs font-medium">Diperbarui</span>
              </div>
              <p className="text-sm font-bold text-gray-900">
                {formatDate(item.updated_at)}
              </p>
            </div>
          </div>

          {/* Catatan / Keterangan */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              Catatan Progress
            </h3>
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-sm text-gray-700 leading-relaxed">
              {item.laporan_progress || "Belum ada catatan progress pada laporan ini."}
            </div>
          </div>

          {/* Files (Mocked) */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <File className="h-4 w-4 text-gray-500" />
              Lampiran File
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="rounded bg-blue-100 p-2 text-blue-600">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">dokumen-panduan.pdf</p>
                    <p className="text-xs text-gray-500">2.4 MB</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">Unduh</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="rounded bg-green-100 p-2 text-green-600">
                    <File className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">screenshot-hasil.png</p>
                    <p className="text-xs text-gray-500">1.1 MB</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">Unduh</span>
              </div>
            </div>
          </div>

          {/* Timeline Aktivitas */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <History className="h-4 w-4 text-gray-500" />
              Riwayat Aktivitas
            </h3>
            <div className="relative border-l-2 border-gray-100 ml-3 space-y-6">
              
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-1 bg-white">
                  <div className="h-4 w-4 rounded-full border-4 border-emerald-500" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-bold text-gray-400">{formatDate(item.updated_at)}</p>
                  <p className="text-sm font-semibold text-gray-900">Update Terakhir</p>
                  <p className="text-sm text-gray-600">{item.laporan_progress}</p>
                </div>
              </div>

              {item.verifikasi && (
                <div className="relative pl-6">
                  <div className="absolute -left-[9px] top-1 bg-white">
                    <div className="h-4 w-4 rounded-full border-4 border-blue-500" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-bold text-gray-400">{formatDate(item.created_at)}</p>
                    <p className="text-sm font-semibold text-gray-900">Laporan Diajukan</p>
                    <p className="text-sm text-gray-600">Laporan dikirim untuk verifikasi.</p>
                  </div>
                </div>
              )}

              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-1 bg-white">
                  <div className="h-4 w-4 rounded-full border-4 border-gray-300" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-bold text-gray-400">{formatDate(item.created_at)}</p>
                  <p className="text-sm font-semibold text-gray-900">Laporan Dibuat</p>
                  <p className="text-sm text-gray-600">Terdaftar di sistem.</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  )
}
