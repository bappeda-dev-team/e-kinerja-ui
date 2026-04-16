// app/verifikator/verifikasi/_components/VerifikasiPipelineClient.tsx

"use client"

import { useState } from "react"
import { toast } from "sonner"
import { CheckCircle2, Clock, RotateCcw, ChevronRight, User, CalendarDays, Layers } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { MOCK_PIPELINE, type MockPemda, type MockPekerjaan } from "../mock-data"
import { getStatusMeta, formatDateLabel, type VerifikasiStatus } from "../utils"

function getPemdaInitials(nama: string) {
  return nama
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
}

function getPendingCount(pemda: MockPemda) {
  return pemda.pekerjaan.filter((p) => p.status !== "terverifikasi").length
}

function getProgressBarClass(progress: number) {
  if (progress === 100) return "bg-emerald-500"
  if (progress >= 75) return "bg-yellow-500"
  if (progress >= 50) return "bg-orange-500"
  if (progress >= 25) return "bg-red-500"
  return "bg-slate-400"
}

function StatusBadge({ status }: { status: VerifikasiStatus }) {
  const meta = getStatusMeta(status)
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset", meta.badgeClass)}>
      {meta.label}
    </span>
  )
}

// ─── Panel Kiri: List Pemda ───────────────────────────────────────────────────

function PemdaPanel({
  pemda,
  selectedId,
  onSelect,
}: {
  pemda: MockPemda[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const sorted = [...pemda].sort(
    (a, b) => new Date(b.latest_laporan_at).getTime() - new Date(a.latest_laporan_at).getTime()
  )

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-slate-100">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Pemda</p>
      </div>
      <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
        {sorted.map((p) => {
          const pending = getPendingCount(p)
          const isSelected = p.id === selectedId
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                isSelected
                  ? "bg-blue-50 border-r-2 border-blue-500"
                  : "hover:bg-slate-50 border-r-2 border-transparent"
              )}
            >
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarFallback className={cn("text-xs font-bold", isSelected ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600")}>
                  {getPemdaInitials(p.nama)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-semibold truncate", isSelected ? "text-blue-700" : "text-slate-800")}>
                  {p.nama}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {formatDateLabel(p.latest_laporan_at)}
                </p>
              </div>
              {pending > 0 && (
                <span className="shrink-0 inline-flex items-center justify-center h-5 min-w-5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold px-1.5">
                  {pending}
                </span>
              )}
              <ChevronRight className={cn("h-4 w-4 shrink-0", isSelected ? "text-blue-400" : "text-slate-300")} />
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Panel Tengah: List Pekerjaan ─────────────────────────────────────────────

function PekerjaanPanel({
  pekerjaan,
  selectedId,
  onSelect,
}: {
  pekerjaan: MockPekerjaan[] | null
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  if (!pekerjaan) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b border-slate-100">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Pekerjaan</p>
        </div>
        <div className="flex-1 flex items-center justify-center text-slate-300">
          <div className="text-center space-y-2">
            <Layers className="h-8 w-8 mx-auto opacity-50" />
            <p className="text-sm">Pilih Pemda terlebih dahulu</p>
          </div>
        </div>
      </div>
    )
  }

  const sorted = [...pekerjaan].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-slate-100">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Pekerjaan</p>
      </div>
      <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
        {sorted.map((p) => {
          const isSelected = p.id === selectedId
          const meta = getStatusMeta(p.status)
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className={cn(
                "w-full flex flex-col gap-1.5 px-4 py-3 text-left transition-colors",
                isSelected
                  ? "bg-blue-50 border-r-2 border-blue-500"
                  : "hover:bg-slate-50 border-r-2 border-transparent"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className={cn("text-sm font-semibold truncate", isSelected ? "text-blue-700" : "text-slate-800")}>
                    {p.aplikasi}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{p.menu}</p>
                </div>
                <StatusBadge status={p.status} />
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <User className="h-3 w-3" />
                <span className="truncate">{p.programmer.nama}</span>
              </div>
              {/* Progress bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", getProgressBarClass(p.status_progress))}
                    style={{ width: `${p.status_progress}%` }}
                  />
                </div>
                <span className={cn("text-xs font-medium shrink-0", meta.textClass)}>{p.status_progress}%</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Panel Kanan: Detail + Aksi ───────────────────────────────────────────────

function DetailPanel({
  pekerjaan,
  komentar,
  saving,
  onKomentarChange,
  onApprove,
  onRevisi,
}: {
  pekerjaan: MockPekerjaan | null
  komentar: string
  saving: boolean
  onKomentarChange: (v: string) => void
  onApprove: () => void
  onRevisi: () => void
}) {
  if (!pekerjaan) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b border-slate-100">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Detail</p>
        </div>
        <div className="flex-1 flex items-center justify-center text-slate-300">
          <div className="text-center space-y-2">
            <CheckCircle2 className="h-8 w-8 mx-auto opacity-50" />
            <p className="text-sm">Pilih pekerjaan untuk melihat detail</p>
          </div>
        </div>
      </div>
    )
  }

  const isVerified = pekerjaan.status === "terverifikasi"
  const meta = getStatusMeta(pekerjaan.status)

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-slate-100">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Detail</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Header info */}
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-slate-800 text-base leading-tight">{pekerjaan.aplikasi}</h3>
            <StatusBadge status={pekerjaan.status} />
          </div>
          <p className="text-sm text-slate-500">{pekerjaan.menu}</p>
        </div>

        {/* Info rows */}
        <div className="rounded-xl bg-slate-50 border border-slate-100 divide-y divide-slate-100">
          <div className="flex items-center gap-3 px-3 py-2.5">
            <User className="h-4 w-4 text-slate-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-slate-400">Programmer</p>
              <p className="text-sm font-medium text-slate-700 truncate">{pekerjaan.programmer.nama}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-3 py-2.5">
            <CalendarDays className="h-4 w-4 text-slate-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-slate-400">Deadline</p>
              <p className="text-sm font-medium text-slate-700">{formatDateLabel(pekerjaan.deadline)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-3 py-2.5">
            <Clock className="h-4 w-4 text-slate-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-slate-400">Diajukan</p>
              <p className="text-sm font-medium text-slate-700">{formatDateLabel(pekerjaan.created_at)}</p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Progress</p>
            <span className={cn("text-sm font-bold", meta.textClass)}>{pekerjaan.status_progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", getProgressBarClass(pekerjaan.status_progress))}
              style={{ width: `${pekerjaan.status_progress}%` }}
            />
          </div>
        </div>

        {/* Laporan progress description */}
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Laporan Progress</p>
          <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
            {pekerjaan.laporan_progress}
          </p>
        </div>

        {/* Komentar verifikator (if any) */}
        {pekerjaan.komentar_verifikator && (
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Komentar Verifikator</p>
            <p className="text-sm text-slate-700 leading-relaxed bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
              {pekerjaan.komentar_verifikator}
            </p>
          </div>
        )}

        {/* Aksi */}
        {isVerified ? (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <p className="text-sm text-emerald-700 font-medium">Laporan ini sudah terverifikasi</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Komentar <span className="normal-case text-slate-400 font-normal">(wajib untuk revisi)</span>
              </label>
              <textarea
                value={komentar}
                onChange={(e) => onKomentarChange(e.target.value)}
                disabled={saving}
                rows={3}
                placeholder="Tulis komentar atau catatan untuk programmer..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all disabled:opacity-50"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={onRevisi}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw className="h-4 w-4" />
                Revisi
              </button>
              <button
                onClick={onApprove}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle2 className="h-4 w-4" />
                Verifikasi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function VerifikasiPipelineClient() {
  const [items, setItems] = useState<MockPemda[]>(MOCK_PIPELINE)
  const [selectedPemdaId, setSelectedPemdaId] = useState<string | null>(null)
  const [selectedPekerjaanId, setSelectedPekerjaanId] = useState<string | null>(null)
  const [komentar, setKomentar] = useState("")
  const [saving, setSaving] = useState(false)

  const selectedPemda = items.find((p) => p.id === selectedPemdaId) ?? null
  const selectedPekerjaan = selectedPemda?.pekerjaan.find((p) => p.id === selectedPekerjaanId) ?? null

  const handleSelectPemda = (id: string) => {
    setSelectedPemdaId(id)
    setSelectedPekerjaanId(null)
    setKomentar("")
  }

  const handleSelectPekerjaan = (id: string) => {
    setSelectedPekerjaanId(id)
    setKomentar("")
  }

  const updatePekerjaan = (pemdaId: string, pekerjaanId: string, patch: Partial<MockPekerjaan>) => {
    setItems((prev) =>
      prev.map((pemda) => {
        if (pemda.id !== pemdaId) return pemda
        return {
          ...pemda,
          latest_laporan_at: new Date().toISOString(),
          pekerjaan: pemda.pekerjaan.map((pek) =>
            pek.id === pekerjaanId ? { ...pek, ...patch } : pek
          ),
        }
      })
    )
  }

  const handleApprove = async () => {
    if (!selectedPemda || !selectedPekerjaan) return
    setSaving(true)
    await new Promise((r) => setTimeout(r, 500)) // simulate network
    updatePekerjaan(selectedPemda.id, selectedPekerjaan.id, {
      status: "terverifikasi",
      komentar_verifikator: komentar.trim() || undefined,
    })
    setKomentar("")
    setSaving(false)
    toast.success("Laporan berhasil diverifikasi")
  }

  const handleRevisi = async () => {
    if (!selectedPemda || !selectedPekerjaan) return
    if (!komentar.trim()) {
      toast.error("Komentar wajib diisi untuk mengirim revisi")
      return
    }
    setSaving(true)
    await new Promise((r) => setTimeout(r, 500))
    updatePekerjaan(selectedPemda.id, selectedPekerjaan.id, {
      status: "revisi",
      komentar_verifikator: komentar.trim(),
    })
    setKomentar("")
    setSaving(false)
    toast.success("Permintaan revisi berhasil dikirim")
  }

  return (
    <div className="flex flex-col h-full gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[#202224]">Verifikasi Laporan Kinerja</h1>
        <p className="text-sm text-slate-500 mt-1">Pilih pemda dan pekerjaan untuk melakukan verifikasi</p>
      </div>

      <div className="flex-1 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden min-h-0">
        <div className="grid grid-cols-[280px_320px_1fr] h-full divide-x divide-slate-100" style={{ minHeight: 520 }}>

          {/* Panel 1 — Pemda */}
          <PemdaPanel
            pemda={items}
            selectedId={selectedPemdaId}
            onSelect={handleSelectPemda}
          />

          {/* Panel 2 — Pekerjaan */}
          <PekerjaanPanel
            pekerjaan={selectedPemda?.pekerjaan ?? null}
            selectedId={selectedPekerjaanId}
            onSelect={handleSelectPekerjaan}
          />

          {/* Panel 3 — Detail + Aksi */}
          <DetailPanel
            pekerjaan={selectedPekerjaan}
            komentar={komentar}
            saving={saving}
            onKomentarChange={setKomentar}
            onApprove={handleApprove}
            onRevisi={handleRevisi}
          />

        </div>
      </div>
    </div>
  )
}
