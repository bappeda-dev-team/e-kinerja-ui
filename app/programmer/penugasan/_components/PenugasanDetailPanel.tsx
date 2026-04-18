"use client"

import { useEffect } from "react"
import { X, BriefcaseBusiness, CalendarDays, History, UserRound, MessageSquareText, Building2, Layers3 } from "lucide-react"
import { PenugasanItem } from "../types"

interface PenugasanDetailPanelProps {
  isOpen: boolean
  onClose: () => void
  item: PenugasanItem | null
}

function formatDateTime(iso?: string) {
  if (!iso) return "-"
  return new Date(iso).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function PenugasanDetailPanel({ isOpen, onClose, item: itemProp }: PenugasanDetailPanelProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  if (!itemProp) return null

  const hasKomentar = Boolean(itemProp.komentar.trim())

  return (
    <>
      <div
        className={`fixed top-0 left-0 z-100 h-screen w-screen bg-black/30 backdrop-blur-sm ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 z-110 flex h-screen w-96 max-w-[92vw] transform-gpu flex-col border-l border-gray-200 bg-white will-change-transform transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-start justify-between border-b bg-gray-50/60 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold leading-tight text-gray-900">{itemProp.nama_pemda}</h2>
            <p className="mt-0.5 text-sm font-medium text-gray-500">{itemProp.aplikasi}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
              <div className="mb-2 flex items-center gap-2 text-gray-500">
                <UserRound className="h-4 w-4" />
                <span className="text-xs font-medium">Programmer</span>
              </div>
              <p className="text-sm font-bold text-gray-900">{itemProp.programmer_nama}</p>
              <p className="mt-1 text-xs text-gray-500">{itemProp.programmer_username}</p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
              <div className="mb-2 flex items-center gap-2 text-gray-500">
                <BriefcaseBusiness className="h-4 w-4" />
                <span className="text-xs font-medium">ID Penugasan</span>
              </div>
              <p className="break-all text-sm font-bold text-gray-900">{itemProp.id}</p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
              <div className="mb-2 flex items-center gap-2 text-gray-500">
                <CalendarDays className="h-4 w-4" />
                <span className="text-xs font-medium">Ditugaskan</span>
              </div>
              <p className="text-sm font-bold text-gray-900">{formatDateTime(itemProp.created_at)}</p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
              <div className="mb-2 flex items-center gap-2 text-gray-500">
                <History className="h-4 w-4" />
                <span className="text-xs font-medium">Diperbarui</span>
              </div>
              <p className="text-sm font-bold text-gray-900">{formatDateTime(itemProp.updated_at)}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900">
              <MessageSquareText className="h-4 w-4 text-blue-500" />
              Catatan Atasan
            </h3>
            <div className={`rounded-xl border p-4 text-sm leading-relaxed ${hasKomentar ? "border-blue-100 bg-blue-50/60 text-gray-700" : "border-gray-200 bg-gray-50 text-gray-500"}`}>
              {hasKomentar ? itemProp.komentar : "Belum ada catatan tambahan pada penugasan ini."}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900">Ringkasan Tugas</h3>
            <div className="space-y-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Pemda</p>
                  <p className="text-sm font-bold text-gray-900">{itemProp.nama_pemda}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                  <Layers3 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Aplikasi</p>
                  <p className="text-sm font-bold text-gray-900">{itemProp.aplikasi}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                  <BriefcaseBusiness className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Distribusi</p>
                  <p className="break-all text-sm font-bold text-gray-900">{itemProp.distribusi_id || "-"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
