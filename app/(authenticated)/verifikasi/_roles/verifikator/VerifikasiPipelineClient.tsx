"use client"

import type { ReactNode } from "react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { CalendarDays, CheckCircle2, Clock, Layers, RotateCcw, User, Target, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

import { getVerifikasi, updateVerifikasi } from "@/services/verifikasi.service"
import type { VerifikasiRequest, VerifikasiResponse } from "@/types/verifikasi"
import { formatDateLabel, getStatusMeta, mapVerifikasiStatus, type VerifikasiStatus } from "./utils"

interface PipelineJob {
  id: string
  pemdaId: string
  pemdaName: string
  pemdaLogo?: string
  aplikasi: string
  menu: string
  deadline: string
  createdAt: string
  updatedAt: string
  programmer: string
  programmerId: string
  laporanProgress: string
  statusProgress: number
  status: VerifikasiStatus
  komentarVerifikator: string
  laporanId: string
  permintaanId: string
  laporanStatus?: string
  kondisiAwal?: string
  kondisiDiharapkan?: string
}

interface PipelinePemda {
  id: string
  nama: string
  logo?: string
  latestLaporanAt: string
  pekerjaan: PipelineJob[]
}

function getPemdaInitials(nama: string) {
  return nama
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("")
}

function getUserLabel(user?: { id?: string; username?: string; full_name?: string }) {
  if (user?.full_name?.trim()) return user.full_name
  if (user?.username?.trim()) return user.username
  if (user?.id?.trim()) return `User ${user.id.slice(0, 8)}`
  return "-"
}

function getProgressFromStatus(item: VerifikasiResponse, status: VerifikasiStatus) {
  const laporanStatus = item.laporan?.status?.trim().toLowerCase()
  if (laporanStatus === "hijau") return 100
  if (laporanStatus === "kuning") return 75
  if (laporanStatus === "merah") return 25

  const extractedProgress = item.laporan?.laporan_progress?.match(/(\d{1,3})\s*%/)
  const progressValue = extractedProgress?.[1] ? Number(extractedProgress[1]) : Number.NaN
  if (Number.isFinite(progressValue) && progressValue >= 0 && progressValue <= 100) {
    return progressValue
  }

  if (status === "terverifikasi") return 100
  if (status === "revisi") return 45
  return 75
}

function getProgressBarClass(progress: number) {
  if (progress >= 100) return "bg-emerald-500"
  if (progress >= 75) return "bg-yellow-500"
  if (progress >= 50) return "bg-orange-500"
  if (progress >= 25) return "bg-red-500"
  return "bg-slate-300"
}

function buildPipeline(items: VerifikasiResponse[]) {
  const grouped = new Map<string, PipelinePemda>()

  for (const item of items) {
    const status = mapVerifikasiStatus(item)
    const pemdaId = item.permintaan?.pemda?.id ?? item.permintaan?.id ?? item.id
    const pemdaName = item.permintaan?.pemda?.name ?? "Tanpa Pemda"
    const updatedAt = item.updated_at ?? item.created_at ?? ""
    const pekerjaan: PipelineJob = {
      id: item.id,
      pemdaId,
      pemdaName,
      pemdaLogo: item.permintaan?.pemda?.logo ?? "",
      aplikasi: item.permintaan?.aplikasi?.name ?? "Tanpa Aplikasi",
      menu: item.permintaan?.menu ?? "-",
      deadline: item.permintaan?.tanggal_deadline ?? "",
      createdAt: item.created_at ?? "",
      updatedAt,
      programmer: getUserLabel(item.laporan?.programmer),
      programmerId: item.laporan?.programmer?.id ?? "",
      laporanProgress: item.laporan?.laporan_progress ?? "-",
      statusProgress: getProgressFromStatus(item, status),
      status,
      komentarVerifikator: item.komentar ?? "",
      laporanId: item.laporan?.id ?? "",
      permintaanId: item.permintaan?.id ?? "",
      laporanStatus: item.laporan?.status,
      kondisiAwal: item.permintaan?.kondisi_awal ?? "",
      kondisiDiharapkan: item.permintaan?.kondisi_diharapkan ?? "",
    }

    const currentGroup = grouped.get(pemdaId)

    if (!currentGroup) {
      grouped.set(pemdaId, {
        id: pemdaId,
        nama: pemdaName,
        logo: item.permintaan?.pemda?.logo ?? "",
        latestLaporanAt: updatedAt,
        pekerjaan: [pekerjaan],
      })
      continue
    }

    currentGroup.pekerjaan.push(pekerjaan)
    if (new Date(updatedAt).getTime() > new Date(currentGroup.latestLaporanAt).getTime()) {
      currentGroup.latestLaporanAt = updatedAt
    }
  }

  return Array.from(grouped.values())
    .map((pemda) => ({
      ...pemda,
      pekerjaan: [...pemda.pekerjaan].sort(
        (a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
      ),
    }))
    .sort((a, b) => new Date(b.latestLaporanAt).getTime() - new Date(a.latestLaporanAt).getTime())
}

function getPendingCount(pemda: PipelinePemda) {
  return pemda.pekerjaan.filter((job) => job.status !== "terverifikasi").length
}

function HybridLoader() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center space-y-4">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
      <p className="text-sm font-medium text-slate-500">Memuat data verifikasi...</p>
    </div>
  )
}

function StatusBadge({ status }: { status: VerifikasiStatus }) {
  const meta = getStatusMeta(status)
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset", meta.badgeClass)}>
      {meta.label}
    </span>
  )
}

function EmptyPanel({
  title,
  message,
  icon,
}: {
  title: string
  message: string
  icon: ReactNode
}) {
  return (
    <div className="flex h-full min-h-[220px] flex-col">
      <div className="border-b border-slate-100 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{title}</p>
      </div>
      <div className="flex flex-1 items-center justify-center px-6 py-8 text-slate-300">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-50">
            {icon}
          </div>
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  )
}

function PemdaPanel({
  pemda,
  selectedId,
  onSelect,
}: {
  pemda: PipelinePemda[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  if (pemda.length === 0) {
    return <EmptyPanel title="Pemda" message="Belum ada data verifikasi." icon={<Layers className="h-5 w-5" />} />
  }

  return (
    <div className="flex h-full min-h-[220px] flex-col">
      <div className="border-b border-slate-100 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Pemda</p>
      </div>
      <div className="flex-1 divide-y divide-slate-50 overflow-y-auto">
        {pemda.map((item) => {
          const pendingCount = getPendingCount(item)
          const isSelected = item.id === selectedId

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={cn(
                "flex w-full items-center gap-3 border-r-2 px-4 py-3 text-left transition-colors",
                isSelected ? "border-r-blue-500 bg-blue-50" : "border-r-transparent hover:bg-slate-50"
              )}
            >
              <Avatar className="h-10 w-10 shrink-0">
                {item.logo ? <AvatarImage src={item.logo} alt={item.nama} className="object-cover" /> : null}
                <AvatarFallback className={cn("text-xs font-bold", isSelected ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600")}>
                  {getPemdaInitials(item.nama)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <p className={cn("truncate text-sm font-semibold", isSelected ? "text-blue-700" : "text-slate-800")}>
                  {item.nama}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">{formatDateLabel(item.latestLaporanAt)}</p>
              </div>

              {pendingCount > 0 ? (
                <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-amber-100 px-1.5 text-xs font-bold text-amber-700">
                  {pendingCount}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function PekerjaanPanel({
  pekerjaan,
  selectedId,
  onSelect,
}: {
  pekerjaan: PipelineJob[] | null
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  if (!pekerjaan?.length) {
    return <EmptyPanel title="Pekerjaan" message="Pilih pemda untuk melihat daftar pekerjaan." icon={<FileText className="h-5 w-5" />} />
  }

  return (
    <div className="flex h-full min-h-[220px] flex-col">
      <div className="border-b border-slate-100 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Pekerjaan</p>
      </div>
      <div className="flex-1 divide-y divide-slate-50 overflow-y-auto">
        {pekerjaan.map((item) => {
          const isSelected = item.id === selectedId
          const statusMeta = getStatusMeta(item.status)

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={cn(
                "flex w-full flex-col gap-2 border-r-2 px-4 py-3 text-left transition-colors",
                isSelected ? "border-r-blue-500 bg-blue-50" : "border-r-transparent hover:bg-slate-50"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className={cn("truncate text-sm font-semibold", isSelected ? "text-blue-700" : "text-slate-800")}>
                    {item.aplikasi}
                  </p>
                  <p className="truncate text-xs text-slate-500">{item.menu}</p>
                </div>
                <StatusBadge status={item.status} />
              </div>

              <div className="flex items-center gap-1 text-xs text-slate-400">
                <User className="h-3.5 w-3.5" />
                <span className="truncate">{item.programmer}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={cn("h-full rounded-full transition-all", getProgressBarClass(item.statusProgress))}
                    style={{ width: `${item.statusProgress}%` }}
                  />
                </div>
                <span className={cn("shrink-0 text-xs font-semibold", statusMeta.textClass)}>{item.statusProgress}%</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function DetailPanel({
  pekerjaan,
  komentar,
  saving,
  onKomentarChange,
  onApprove,
  onRevisi,
}: {
  pekerjaan: PipelineJob | null
  komentar: string
  saving: boolean
  onKomentarChange: (value: string) => void
  onApprove: () => void
  onRevisi: () => void
}) {
  if (!pekerjaan) {
    return <EmptyPanel title="Detail" message="Pilih pekerjaan untuk melihat detail verifikasi." icon={<CheckCircle2 className="h-5 w-5" />} />
  }

  const isVerified = pekerjaan.status === "terverifikasi"
  const statusMeta = getStatusMeta(pekerjaan.status)

  return (
    <div className="flex h-full min-h-[320px] flex-col">
      <div className="border-b border-slate-100 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Detail</p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-2xl font-bold text-slate-800">{pekerjaan.aplikasi}</h2>
              <p className="text-base text-slate-500">{pekerjaan.menu}</p>
            </div>
            <StatusBadge status={pekerjaan.status} />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
          <div className="flex items-start gap-3 border-b border-slate-100 px-4 py-3">
            <User className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <div className="min-w-0">
              <p className="text-xs text-slate-400">Programmer</p>
              <p className="truncate text-sm font-semibold text-slate-700">{pekerjaan.programmer}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 border-b border-slate-100 px-4 py-3">
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <div>
              <p className="text-xs text-slate-400">Deadline</p>
              <p className="text-sm font-semibold text-slate-700">{formatDateLabel(pekerjaan.deadline)}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 px-4 py-3">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <div>
              <p className="text-xs text-slate-400">Diajukan</p>
              <p className="text-sm font-semibold text-slate-700">{formatDateLabel(pekerjaan.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Progress</p>
            <span className={cn("text-sm font-bold", statusMeta.textClass)}>{pekerjaan.statusProgress}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className={cn("h-full rounded-full transition-all", getProgressBarClass(pekerjaan.statusProgress))}
              style={{ width: `${pekerjaan.statusProgress}%` }}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Laporan Progress</p>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-700">
            {pekerjaan.laporanProgress || "-"}
          </div>
        </div>

        {pekerjaan.kondisiAwal || pekerjaan.kondisiDiharapkan ? (
          <div className="grid gap-3 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <FileText className="h-4 w-4" />
                Kondisi Awal
              </div>
              <p className="text-sm leading-relaxed text-slate-700">{pekerjaan.kondisiAwal || "-"}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <Target className="h-4 w-4" />
                Kondisi Diharapkan
              </div>
              <p className="text-sm leading-relaxed text-slate-700">{pekerjaan.kondisiDiharapkan || "-"}</p>
            </div>
          </div>
        ) : null}

        {isVerified ? (
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <p className="text-sm font-medium text-emerald-700">Laporan ini sudah terverifikasi.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Komentar <span className="normal-case font-normal text-slate-400">(wajib untuk revisi)</span>
              </label>
              <Textarea
                value={komentar}
                onChange={(event) => onKomentarChange(event.target.value)}
                rows={5}
                disabled={saving}
                placeholder="Tulis komentar atau catatan untuk programmer..."
                className="min-h-[120px] resize-none rounded-2xl border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-300 focus-visible:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={onRevisi}
                disabled={saving}
                className="h-14 flex-1 rounded-2xl border-amber-300 bg-amber-50 text-base font-semibold text-amber-700 hover:bg-amber-100"
              >
                <RotateCcw className="h-4 w-4" />
                Revisi
              </Button>
              <Button
                type="button"
                onClick={onApprove}
                disabled={saving}
                className="h-14 flex-1 rounded-2xl bg-emerald-600 text-base font-semibold text-white hover:bg-emerald-700"
              >
                <CheckCircle2 className="h-4 w-4" />
                {saving ? "Menyimpan..." : "Verifikasi"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function VerifikasiPipelineClient() {
  const [items, setItems] = useState<VerifikasiResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedPemdaId, setSelectedPemdaId] = useState<string | null>(null)
  const [selectedPekerjaanId, setSelectedPekerjaanId] = useState<string | null>(null)
  const [komentar, setKomentar] = useState("")

  const pemdaList = useMemo(() => buildPipeline(items), [items])
  const selectedPemda = useMemo(
    () => pemdaList.find((item) => item.id === selectedPemdaId) ?? null,
    [pemdaList, selectedPemdaId]
  )
  const selectedPekerjaan = useMemo(
    () => selectedPemda?.pekerjaan.find((item) => item.id === selectedPekerjaanId) ?? null,
    [selectedPemda, selectedPekerjaanId]
  )

  const fetchData = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true)
      const response = await getVerifikasi()
      if (response.status !== 200) {
        throw new Error(response.data?.message || "Gagal memuat data verifikasi")
      }

      setItems(response.data?.data ?? [])
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan sistem")
      setItems([])
    } finally {
      if (showLoader) setLoading(false)
    }
  }

  useEffect(() => {
    void fetchData()
  }, [])

  useEffect(() => {
    if (!pemdaList.length) {
      setSelectedPemdaId(null)
      return
    }

    setSelectedPemdaId((current) => (current && pemdaList.some((item) => item.id === current) ? current : pemdaList[0].id))
  }, [pemdaList])

  useEffect(() => {
    if (!selectedPemda?.pekerjaan.length) {
      setSelectedPekerjaanId(null)
      return
    }

    setSelectedPekerjaanId((current) => (
      current && selectedPemda.pekerjaan.some((item) => item.id === current)
        ? current
        : selectedPemda.pekerjaan[0].id
    ))
  }, [selectedPemda])

  useEffect(() => {
    setKomentar(selectedPekerjaan?.komentarVerifikator ?? "")
  }, [selectedPekerjaan])

  const handleSelectPemda = (id: string) => {
    setSelectedPemdaId(id)
    setSelectedPekerjaanId(null)
  }

  const handleSelectPekerjaan = (id: string) => {
    setSelectedPekerjaanId(id)
  }

  const handleSubmit = async (status: Exclude<VerifikasiStatus, "menunggu">) => {
    if (!selectedPekerjaan) return
    if (!selectedPekerjaan.laporanId || !selectedPekerjaan.permintaanId) {
      toast.error("Data laporan belum lengkap untuk diproses")
      return
    }

    if (status === "revisi" && !komentar.trim()) {
      toast.error("Komentar wajib diisi untuk mengirim revisi")
      return
    }

    const payload: VerifikasiRequest = {
      laporan_id: selectedPekerjaan.laporanId,
      status_verified: status === "terverifikasi" ? "approved" : "revision",
      komentar: komentar.trim(),
    }

    try {
      setSaving(true)

      const response = await updateVerifikasi(selectedPekerjaan.id, payload)
      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.data?.message || "Gagal memperbarui verifikasi")
      }

      setItems((currentItems) =>
        currentItems.map((item) =>
          item.id === selectedPekerjaan.id
            ? {
                ...item,
                status_verified: payload.status_verified,
                komentar: payload.komentar ?? item.komentar,
                updated_at: new Date().toISOString(),
              }
            : item
        )
      )
      toast.success(status === "terverifikasi" ? "Laporan berhasil diverifikasi" : "Permintaan revisi berhasil dikirim")
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan perubahan")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex h-full flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[#202224]">Verifikasi Laporan Kinerja</h1>
        <p className="mt-1 text-sm text-slate-500">Semua data detail ditarik dari satu endpoint verifikasi dan ditampilkan per pemda.</p>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <HybridLoader />
        ) : (
          <div className="grid min-h-[680px] grid-cols-1 divide-y divide-slate-100 xl:grid-cols-[280px_340px_minmax(0,1fr)] xl:divide-x xl:divide-y-0">
            <PemdaPanel pemda={pemdaList} selectedId={selectedPemdaId} onSelect={handleSelectPemda} />
            <PekerjaanPanel pekerjaan={selectedPemda?.pekerjaan ?? null} selectedId={selectedPekerjaanId} onSelect={handleSelectPekerjaan} />
            <DetailPanel
              pekerjaan={selectedPekerjaan}
              komentar={komentar}
              saving={saving}
              onKomentarChange={setKomentar}
              onApprove={() => void handleSubmit("terverifikasi")}
              onRevisi={() => void handleSubmit("revisi")}
            />
          </div>
        )}
      </div>
    </div>
  )
}
