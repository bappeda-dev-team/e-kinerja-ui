
"use client"

import { useEffect, useState } from "react"
import { X, CheckCircle, RotateCcw, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { toast } from "sonner"
import type { VerifikasiItem } from "../VerifikasiClient"
import { Textarea } from "@/components/ui/textarea"
import { getPenilaianByDistribusiId, createPenilaian, updatePenilaian } from "@/services/penilaian.service"
import type { PenilaianResponse, KetepatanWaktu } from "@/types/penilaian"

function formatTanggal(value?: string) {
  if (!value) return "-"
  return new Date(value).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
}

function getStatusMeta(status: VerifikasiItem["status"]) {
  if (status === "terverifikasi") return { label: "Terverifikasi", cls: "bg-teal-100 text-teal-600 border-teal-200" }
  if (status === "revisi") return { label: "Revisi", cls: "bg-red-100 text-red-600 border-red-200" }
  return { label: "Menunggu", cls: "bg-amber-100 text-amber-700 border-amber-200" }
}

function PemdaAvatar({ nama, logo }: { nama: string; logo?: string }) {
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

function NilaiInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const options = Array.from({ length: 21 }, (_, i) => i * 5)
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Tingkat Keberhasilan</p>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-[#202224] focus:outline-none focus:ring-2 focus:ring-[#4880FF]/30"
      >
        {options.map((n) => (
          <option key={n} value={n}>{n}%</option>
        ))}
      </select>
    </div>
  )
}

export default function VerifikasiModal({ data, onClose, onSave }: {
  data: VerifikasiItem
  onClose: () => void
  onSave: (i: VerifikasiItem) => void
}) {
  const [komentar, setKomentar] = useState(data.komentar ?? "")
  const isVerified = data.status === "terverifikasi"

  const [existingPenilaian, setExistingPenilaian] = useState<PenilaianResponse | null>(null)
  const [loadingPenilaian, setLoadingPenilaian] = useState(false)
  const [savingPenilaian, setSavingPenilaian] = useState(false)
  const [tingkatKeberhasilan, setTingkatKeberhasilan] = useState(90)
  const [ketepatanWaktu, setKetepatanWaktu] = useState<KetepatanWaktu>("tepat_waktu")
  const [komentarPenilaian, setKomentarPenilaian] = useState("")
  const [tanggalSelesai, setTanggalSelesai] = useState(() => new Date().toISOString().slice(0, 10))

  const statusMeta = getStatusMeta(data.status)

  useEffect(() => {
    if (!isVerified || !data.distribusi_id) return
    const fetch = async () => {
      setLoadingPenilaian(true)
      try {
        const res = await getPenilaianByDistribusiId(data.distribusi_id)
        if (res.status === 200 && res.data?.data) {
          const p = res.data.data
          setExistingPenilaian(p)
          setTingkatKeberhasilan(p.tingkat_keberhasilan)
          setKetepatanWaktu(p.ketepatan_waktu ?? "tepat_waktu")
          setKomentarPenilaian(p.komentar ?? "")
          setTanggalSelesai(p.tanggal_selesai ? p.tanggal_selesai.slice(0, 10) : new Date().toISOString().slice(0, 10))
        }
      } catch {
        // no penilaian yet
      } finally {
        setLoadingPenilaian(false)
      }
    }
    fetch()
  }, [isVerified, data.distribusi_id])

  function handleSave(status: VerifikasiItem["status"]) {
    if (status === "revisi" && !komentar.trim()) return
    onSave({ ...data, status, komentar: komentar.trim() })
  }

  async function handleSavePenilaian() {
    if (!data.distribusi_id) {
      toast.error("Distribusi ID tidak tersedia")
      return
    }
    setSavingPenilaian(true)
    try {
      if (existingPenilaian) {
        await updatePenilaian(existingPenilaian.id, {
          tingkat_keberhasilan: tingkatKeberhasilan,
          ketepatan_waktu: ketepatanWaktu,
          komentar: komentarPenilaian.trim() || undefined,
          tanggal_selesai: tanggalSelesai,
        })
      } else {
        const res = await createPenilaian({
          distribusi_id: data.distribusi_id,
          tingkat_keberhasilan: tingkatKeberhasilan,
          ketepatan_waktu: ketepatanWaktu,
          komentar: komentarPenilaian.trim() || undefined,
          tanggal_selesai: tanggalSelesai,
        })
        if (res.data?.data) setExistingPenilaian(res.data.data)
      }
      toast.success("Penilaian berhasil disimpan!")
    } catch {
      toast.error("Gagal menyimpan penilaian")
    } finally {
      setSavingPenilaian(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl border-none shadow-2xl [&>button]:hidden">
        <VisuallyHidden>
          <DialogTitle>Detail Verifikasi</DialogTitle>
          <DialogDescription>Form verifikasi dan penilaian laporan programmer</DialogDescription>
        </VisuallyHidden>

        {/* Header */}
        <div className="px-5 pt-4 pb-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PemdaAvatar nama={data.pemda_name} logo={data.pemda_logo} />
              <div className="min-w-0">
                <p className="font-bold text-[15px] text-[#202224] leading-snug">{data.pemda_name}</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  <span className="font-semibold">{data.aplikasi_name || "-"}</span>
                  {data.menu && <><span className="mx-1.5">•</span>{data.menu}</>}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="rounded-full p-1.5 text-gray-400 hover:text-gray-600 transition">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-3 overflow-y-auto max-h-[65vh]">
          {/* Status + Programmer + Deadline */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Status</p>
              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusMeta.cls}`}>
                {statusMeta.label}
              </span>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Programmer</p>
              <div className="flex items-center gap-1.5">
                {data.programmer_avatar && (
                  <img src={data.programmer_avatar} alt={data.programmer} className="w-5 h-5 rounded-full object-cover shrink-0" />
                )}
                <p className="text-sm font-semibold text-[#202224] truncate">{data.programmer || "-"}</p>
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Deadline</p>
              <p className="text-sm font-semibold text-[#202224]">{formatTanggal(data.tanggal_deadline)}</p>
            </div>
          </div>

          {/* Progress laporan */}
          {data.progres_deskripsi && (
            <div className="rounded-xl bg-orange-50 px-3 py-2.5 space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-orange-400">Progress Laporan</p>
              <p className="text-sm text-[#202224] leading-relaxed">{data.progres_deskripsi}</p>
            </div>
          )}

          {/* Komentar verifikasi */}
          <div className="border-t border-dashed border-gray-200 pt-3 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
              Komentar <span className="normal-case font-medium text-gray-300">(wajib untuk revisi)</span>
            </p>
            <Textarea
              value={komentar}
              onChange={(e) => setKomentar(e.target.value)}
              rows={4}
              disabled={isVerified}
              placeholder="Tulis komentar atau catatan untuk programmer..."
              className="min-h-[104px] resize-none rounded-xl border-gray-200 bg-white text-sm text-[#202224] placeholder:text-gray-300"
            />
          </div>

          {/* Form penilaian — muncul langsung jika sudah terverifikasi */}
          {isVerified && (
            <div className="border-t border-dashed border-gray-200 pt-3 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                Penilaian {existingPenilaian && <span className="normal-case font-medium text-teal-500">(sudah dinilai)</span>}
              </p>

              {loadingPenilaian ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                </div>
              ) : (
                <div className="space-y-3">
                  <NilaiInput value={tingkatKeberhasilan} onChange={setTingkatKeberhasilan} />

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Tanggal Selesai</p>
                      <input
                        type="date"
                        value={tanggalSelesai}
                        onChange={(e) => setTanggalSelesai(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-[#202224] focus:outline-none focus:ring-2 focus:ring-[#4880FF]/30"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Ketepatan Waktu</p>
                      <select
                        value={ketepatanWaktu}
                        onChange={(e) => setKetepatanWaktu(e.target.value as KetepatanWaktu)}
                        className={`w-full rounded-xl border px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#4880FF]/30 ${
                          ketepatanWaktu === "terlambat"
                            ? "border-red-200 bg-red-50 text-red-600"
                            : ketepatanWaktu === "lebih_awal"
                              ? "border-blue-200 bg-blue-50 text-blue-600"
                              : "border-teal-200 bg-teal-50 text-teal-600"
                        }`}
                      >
                        <option value="tepat_waktu">Tepat Waktu</option>
                        <option value="lebih_awal">Lebih Awal</option>
                        <option value="terlambat">Terlambat</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                      Catatan <span className="normal-case font-medium text-gray-300">(opsional)</span>
                    </p>
                    <Textarea
                      value={komentarPenilaian}
                      onChange={(e) => setKomentarPenilaian(e.target.value)}
                      rows={2}
                      placeholder="Catatan tambahan untuk penilaian..."
                      className="resize-none rounded-xl border-gray-200 bg-white text-sm text-[#202224] placeholder:text-gray-300"
                    />
                  </div>

                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 flex gap-2">
          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl border border-gray-200 text-sm font-semibold text-[#202224] hover:bg-gray-50 transition"
          >
            Tutup
          </button>
          {!isVerified ? (
            <>
              <button
                type="button"
                onClick={() => handleSave("revisi")}
                disabled={!komentar.trim()}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-amber-300 bg-amber-50 py-2.5 text-sm font-bold text-amber-700 transition hover:bg-amber-100 disabled:opacity-50"
              >
                <RotateCcw className="w-4 h-4" />
                Revisi
              </button>
              <button
                type="button"
                onClick={() => handleSave("terverifikasi")}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#4880FF] py-2.5 text-sm font-bold text-white hover:bg-blue-600 transition"
              >
                <CheckCircle className="w-4 h-4" />
                Verifikasi
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleSavePenilaian}
              disabled={savingPenilaian || loadingPenilaian}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#4880FF] hover:bg-blue-600 py-2.5 text-sm font-bold text-white transition disabled:opacity-60"
            >
              {savingPenilaian ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              {existingPenilaian ? "Update Penilaian" : "Simpan Penilaian"}
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
