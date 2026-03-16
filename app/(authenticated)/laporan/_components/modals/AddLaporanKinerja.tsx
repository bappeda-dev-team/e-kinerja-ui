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
  { value: 0,   label: "0%",   active: "bg-gray-200 text-gray-500",   inactive: "bg-[#F5F6FA] text-[#ABABAB]" },
  { value: 25,  label: "25%",  active: "bg-red-100 text-red-500",     inactive: "bg-[#F5F6FA] text-[#ABABAB]" },
  { value: 50,  label: "50%",  active: "bg-orange-100 text-orange-500", inactive: "bg-[#F5F6FA] text-[#ABABAB]" },
  { value: 75,  label: "75%",  active: "bg-yellow-100 text-yellow-600", inactive: "bg-[#F5F6FA] text-[#ABABAB]" },
  { value: 100, label: "100%", active: "bg-green-100 text-green-600",  inactive: "bg-[#F5F6FA] text-[#ABABAB]" },
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

  // Filter hanya programmer (sesuaikan dengan jabatan di database kamu)
  const programmerOptions = useMemo(
    () => masterPegawai.filter((p) => p.jabatan.toLowerCase().includes("programmer")),
    [masterPegawai]
  )

  useEffect(() => {
    if (initialData && open) {
      setPermintaanId(initialData.permintaan.id)
      setProgress(initialData.laporan_progress)
      setSelectedProgrammer(initialData.programmer?.id ? [initialData.programmer.id] : [])
      // Mencoba parsing persentase dari teks laporan jika ada
      const foundProgress = PROGRESS_OPTIONS.find(opt => initialData.laporan_progress.includes(opt.label))
      setStatusProgress(foundProgress ? foundProgress.value : null)
    } else if (open) {
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
      onClose()
    } catch {
      toast.error("Gagal menyimpan data")
    } finally {
      setLoading(false)
    }
  }

  const selectedPermintaanLabel = permintaanList.find((p) => p.id === permintaanId)
  const ff = { fontFamily: "'Nunito Sans', sans-serif" }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-[24px] border-none shadow-2xl">
        <DialogHeader className="px-8 pt-8 pb-5 flex flex-row items-center justify-between">
          <DialogTitle className="text-[24px] font-bold text-[#202224]" style={ff}>
            {initialData ? "Edit Laporan Kinerja" : "Tambah Laporan Kinerja"}
          </DialogTitle>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="w-6 h-6" />
          </button>
        </DialogHeader>

        <div className="px-8 pb-8 space-y-6">
          {/* Permintaan */}
          <div className="space-y-2">
            <label className="text-[15px] font-bold text-[#202224]" style={ff}>
              Permintaan<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => { setPermintaanOpen(!permintaanOpen); setProgrammerOpen(false) }}
                className="w-full flex items-center justify-between px-4 py-3 bg-[#F5F6FA] border border-[#D5D5D5] rounded-xl text-[14px] text-left transition focus:border-[#4880FF]"
                style={ff}
              >
                <span className={selectedPermintaanLabel ? "text-[#202224]" : "text-[#ABABAB]"}>
                  {selectedPermintaanLabel
                    ? `${selectedPermintaanLabel.pemda} - ${selectedPermintaanLabel.menu}`
                    : "Pilih permintaan pekerjaan"}
                </span>
                <ChevronDown className={`w-5 h-5 text-[#606060] transition-transform ${permintaanOpen ? 'rotate-180' : ''}`} />
              </button>

              {permintaanOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-[#D5D5D5] rounded-xl shadow-xl max-h-52 overflow-y-auto">
                  {permintaanList.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => { setPermintaanId(p.id); setPermintaanOpen(false) }}
                      className="w-full text-left px-5 py-3 text-[14px] text-[#202224] hover:bg-[#F5F6FA] transition border-b last:border-none border-gray-100"
                      style={ff}
                    >
                      {p.pemda} - {p.menu}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {!permintaanId && <p className="text-[12px] text-red-500 font-medium" style={ff}>*Permintaan harus terisi</p>}
          </div>

          {/* Programmer */}
          <div className="space-y-2">
            <label className="text-[15px] font-bold text-[#202224]" style={ff}>
              Programmer<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => { setProgrammerOpen(!programmerOpen); setPermintaanOpen(false) }}
                className="w-full flex items-center justify-between px-4 py-3 bg-[#F5F6FA] border border-[#D5D5D5] rounded-xl text-[14px] text-left transition focus:border-[#4880FF]"
                style={ff}
              >
                <span className="text-[#ABABAB]">
                  Pilih satu atau lebih programmer yang mengerjakan tugas ini
                </span>
                <ChevronDown className={`w-5 h-5 text-[#606060] transition-transform ${programmerOpen ? 'rotate-180' : ''}`} />
              </button>

              {programmerOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-[#D5D5D5] rounded-xl shadow-xl max-h-52 overflow-y-auto">
                  {programmerOptions.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleAddProgrammer(p.id)}
                      className="w-full text-left px-5 py-3 text-[14px] text-[#202224] hover:bg-[#F5F6FA] transition border-b last:border-none border-gray-100"
                      style={ff}
                    >
                      {p.nama_pegawai}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Container (Grey Box as in Screenshot) */}
            <div className="min-h-[48px] p-3 bg-white border border-[#D5D5D5] rounded-xl flex flex-wrap gap-2">
              {selectedProgrammer.length === 0 ? (
                <span className="text-[14px] text-[#ABABAB] italic px-2">Tidak ada programmer</span>
              ) : (
                selectedProgrammer.map((id) => {
                  const p = masterPegawai.find((x) => x.id === id)
                  return (
                    <span key={id} className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F1F4F9] border border-[#D5D5D5] rounded-full text-[12px] font-bold text-[#202224]" style={ff}>
                      {p?.nama_pegawai}
                      <button type="button" onClick={() => handleRemoveProgrammer(id)} className="text-gray-400 hover:text-red-500"><X className="w-3 h-3" /></button>
                    </span>
                  )
                })
              )}
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <label className="text-[15px] font-bold text-[#202224]" style={ff}>
              Progress<span className="text-red-500">*</span>
            </label>
            <textarea
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              rows={3}
              placeholder="Tuliskan perkembangan pekerjaan saat ini..."
              className="w-full bg-white border border-[#D5D5D5] rounded-xl px-4 py-3 text-[14px] text-[#202224] placeholder:text-[#ABABAB] focus:ring-2 focus:ring-[#4880FF]/10 focus:border-[#4880FF] resize-none outline-none transition"
              style={ff}
            />
            <p className="text-[12px] text-red-500 font-medium" style={ff}>*Jelaskan progres pekerjaan yang sudah dilakukan</p>
          </div>

          {/* Status Progress Pills */}
          <div className="space-y-3">
            <label className="text-[15px] font-bold text-[#202224]" style={ff}>
              Status Progress<span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              {PROGRESS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatusProgress(opt.value)}
                  className={`px-6 py-2 rounded-full text-[14px] font-bold transition-all active:scale-95 ${
                    statusProgress === opt.value ? opt.active : opt.inactive
                  }`}
                  style={ff}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-[12px] text-red-500 font-medium" style={ff}>*Pilih persentase progres penyelesaian pekerjaan</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 rounded-xl border border-[#D5D5D5] text-[15px] font-bold text-[#202224] hover:bg-gray-50 transition active:scale-95"
              style={ff}
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-10 py-3 rounded-xl text-[15px] font-bold text-white transition active:scale-95 disabled:opacity-50"
              style={{ backgroundColor: "#4880FF", ...ff }}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}