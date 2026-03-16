"use client"

import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X, ChevronDown } from "lucide-react"
import { toast } from "sonner"
import type { LaporanKinerjaItem } from "../../_types"

interface Props {
  open: boolean
  onClose: () => void
  onSave: (item: LaporanKinerjaItem) => Promise<void>
  initialData?: LaporanKinerjaItem | null
  permintaanList: { id: string; pemda: string; menu: string }[]
  masterPegawai: { id: string; nama_pegawai: string; jabatan: string }[]
}

const PROGRESS_OPTIONS = [
  { value: 0,   label: "0%",   active: "bg-gray-200 text-gray-500",   inactive: "bg-gray-100 text-gray-400" },
  { value: 25,  label: "25%",  active: "bg-red-100 text-red-500",     inactive: "bg-gray-100 text-gray-400" },
  { value: 50,  label: "50%",  active: "bg-orange-100 text-orange-500", inactive: "bg-gray-100 text-gray-400" },
  { value: 75,  label: "75%",  active: "bg-yellow-100 text-yellow-600", inactive: "bg-gray-100 text-gray-400" },
  { value: 100, label: "100%", active: "bg-green-100 text-green-600",  inactive: "bg-gray-100 text-gray-400" },
]

export default function AddLaporanKinerja({
  open,
  onClose,
  onSave,
  initialData = null,
  permintaanList,
  masterPegawai,
}: Props) {
  const [permintaanId, setPermintaanId] = useState("")
  const [selectedProgrammer, setSelectedProgrammer] = useState<string[]>([])
  const [progress, setProgress] = useState("")
  const [statusProgress, setStatusProgress] = useState<number | null>(null)
  const [permintaanOpen, setPermintaanOpen] = useState(false)
  const [programmerOpen, setProgrammerOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const programmerOptions = useMemo(
    () => masterPegawai.filter((p) => p.jabatan === "Programmer - Level 1"),
    [masterPegawai]
  )

  useEffect(() => {
    if (initialData) {
      setPermintaanId(initialData.permintaan.id)
      setProgress(initialData.laporan_progress)
      setSelectedProgrammer(initialData.programmer?.id ? [initialData.programmer.id] : [])
      setStatusProgress(null)
    } else {
      setPermintaanId("")
      setProgress("")
      setSelectedProgrammer([])
      setStatusProgress(null)
    }
    setPermintaanOpen(false)
    setProgrammerOpen(false)
  }, [initialData, open])

  const handleAddProgrammer = (id: string) => {
    if (!selectedProgrammer.includes(id)) {
      setSelectedProgrammer((prev) => [...prev, id])
    }
    setProgrammerOpen(false)
  }

  const handleRemoveProgrammer = (id: string) => {
    setSelectedProgrammer((prev) => prev.filter((p) => p !== id))
  }

  const handleSubmit = async () => {
    if (!permintaanId) { toast.error("Permintaan harus terisi"); return }
    if (selectedProgrammer.length === 0) { toast.error("Programmer harus terisi"); return }
    if (!progress.trim()) { toast.error("Jelaskan progres pekerjaan yang sudah dilakukan"); return }
    if (statusProgress === null) { toast.error("Pilih persentase progres penyelesaian pekerjaan"); return }

    const now = new Date().toISOString()
    const selectedPermintaan = permintaanList.find((p) => p.id === permintaanId)
    const selectedProgrammerData = masterPegawai.find((p) => p.id === selectedProgrammer[0])

    const newItem: LaporanKinerjaItem = {
      id: initialData?.id ?? crypto.randomUUID(),
      permintaan: {
        id: permintaanId,
        pemda: selectedPermintaan?.pemda ?? "",
        aplikasi: selectedPermintaan?.menu ?? "",
        menu: selectedPermintaan?.menu ?? "",
      },
      programmer: {
        id: selectedProgrammer[0] ?? "",
        username: selectedProgrammerData?.nama_pegawai ?? "",
        full_name: selectedProgrammerData?.nama_pegawai ?? "",
      },
      laporan_progress: progress,
      created_at: initialData?.created_at ?? now,
    }

    try {
      setLoading(true)
      await onSave(newItem)
      toast.success(initialData ? "Laporan berhasil diperbarui" : "Laporan berhasil ditambahkan")
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const selectedPermintaanLabel = permintaanList.find((p) => p.id === permintaanId)
  const ff = { fontFamily: "'Nunito Sans', sans-serif" }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-lg p-0 overflow-hidden rounded-2xl border border-[#E0E0E0]"
        style={{ borderWidth: "0.3px" }}
      >
        {/* Header */}
        <DialogHeader className="px-7 pt-6 pb-4 border-b border-[#E0E0E0]" style={{ borderBottomWidth: "0.3px" }}>
          <DialogTitle
            className="text-[22px] font-bold text-[#202224] leading-tight"
            style={ff}
          >
            {initialData ? "Edit Laporan Kinerja" : "Tambah Laporan Kinerja"}
          </DialogTitle>
        </DialogHeader>

        {/* Body */}
        <div className="px-7 py-5 space-y-5">

          {/* Permintaan */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-[#202224]" style={ff}>
              Permintaan<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => { setPermintaanOpen(!permintaanOpen); setProgrammerOpen(false) }}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-[#F5F6FA] border border-[#D5D5D5] rounded-lg text-sm text-left focus:outline-none focus:ring-2 focus:ring-[#4880FF]/20"
                style={{ borderWidth: "0.6px", fontFamily: "'Nunito Sans', sans-serif" }}
              >
                <span className={selectedPermintaanLabel ? "text-[#202224]" : "text-[#ABABAB]"}>
                  {selectedPermintaanLabel
                    ? `${selectedPermintaanLabel.pemda} - ${selectedPermintaanLabel.menu}`
                    : "Pilih permintaan pekerjaan yang akan dilaporkan progresnya"}
                </span>
                <ChevronDown className="w-4 h-4 text-[#606060] shrink-0 ml-2" />
              </button>

              {permintaanOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-[#D5D5D5] rounded-lg shadow-lg max-h-48 overflow-y-auto" style={{ borderWidth: "0.6px" }}>
                  {permintaanList.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-gray-400 italic" style={ff}>Tidak ada data</p>
                  ) : (
                    permintaanList.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => { setPermintaanId(p.id); setPermintaanOpen(false) }}
                        className="w-full text-left px-4 py-2.5 text-sm text-[#202224] hover:bg-[#F5F6FA] transition"
                        style={ff}
                      >
                        {p.pemda} - {p.menu}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            <p className="text-[11px] text-red-400" style={ff}>*Permintaan harus terisi</p>
          </div>

          {/* Programmer */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-[#202224]" style={ff}>
              Programmer<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => { setProgrammerOpen(!programmerOpen); setPermintaanOpen(false) }}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-[#F5F6FA] border border-[#D5D5D5] rounded-lg text-sm text-left focus:outline-none focus:ring-2 focus:ring-[#4880FF]/20"
                style={{ borderWidth: "0.6px", fontFamily: "'Nunito Sans', sans-serif" }}
              >
                <span className="text-[#ABABAB]">
                  Pilih satu atau lebih programmer yang mengerjakan tugas ini
                </span>
                <ChevronDown className="w-4 h-4 text-[#606060] shrink-0 ml-2" />
              </button>

              {programmerOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-[#D5D5D5] rounded-lg shadow-lg max-h-48 overflow-y-auto" style={{ borderWidth: "0.6px" }}>
                  {programmerOptions.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-gray-400 italic" style={ff}>Tidak ada programmer</p>
                  ) : (
                    programmerOptions.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleAddProgrammer(p.id)}
                        className="w-full text-left px-4 py-2.5 text-sm text-[#202224] hover:bg-[#F5F6FA] transition"
                        style={ff}
                      >
                        {p.nama_pegawai}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            <p className="text-[11px] text-red-400" style={ff}>*Programmer harus terisi</p>

            {/* Selected programmer tags */}
            {selectedProgrammer.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedProgrammer.map((id) => {
                  const p = masterPegawai.find((x) => x.id === id)
                  if (!p) return null
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F1F4F9] border border-[#D5D5D5] rounded-full text-xs font-semibold text-[#202224]"
                      style={{ borderWidth: "0.6px", fontFamily: "'Nunito Sans', sans-serif" }}
                    >
                      {p.nama_pegawai.toUpperCase()}
                      <button
                        type="button"
                        onClick={() => handleRemoveProgrammer(id)}
                        className="text-[#606060] hover:text-red-500 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )
                })}
              </div>
            )}
          </div>

          {/* Progress textarea */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-[#202224]" style={ff}>
              Progress<span className="text-red-500">*</span>
            </label>
            <textarea
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              rows={3}
              placeholder="Tuliskan perkembangan pekerjaan saat ini..."
              className="w-full bg-[#F5F6FA] border border-[#D5D5D5] rounded-lg px-4 py-2.5 text-sm text-[#202224] placeholder:text-[#ABABAB] focus:outline-none focus:ring-2 focus:ring-[#4880FF]/20 focus:border-[#4880FF] resize-none"
              style={{ borderWidth: "0.6px", fontFamily: "'Nunito Sans', sans-serif" }}
            />
            <p className="text-[11px] text-red-400" style={ff}>*Jelaskan progres pekerjaan yang sudah dilakukan</p>
          </div>

          {/* Status Progress pills */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#202224]" style={ff}>
              Status Progress<span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {PROGRESS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatusProgress(opt.value)}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold transition ${
                    statusProgress === opt.value ? opt.active : opt.inactive
                  }`}
                  style={ff}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-red-400" style={ff}>*Pilih persentase progres penyelesaian pekerjaan</p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-7 pb-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border border-[#D5D5D5] text-sm font-semibold text-[#202224] hover:bg-gray-50 transition"
            style={{ fontFamily: "'Nunito Sans', sans-serif", borderWidth: "0.6px" }}
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition active:scale-95 disabled:opacity-70"
            style={{ backgroundColor: "#4880FF", fontFamily: "'Nunito Sans', sans-serif" }}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
