"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { MockLaporan, MockPermintaan } from "@/app/(authenticated)/laporan/_components/programmer/data"

interface Props {
  open: boolean
  onClose: () => void
  laporan: MockLaporan | null
  permintaan: MockPermintaan | undefined
  onSave: (updated: MockLaporan) => void
}

const PROGRESS_OPTIONS = [
  { value: 0,   label: "0%",   active: "bg-gray-200 text-gray-600",     inactive: "bg-[#F5F6FA] text-[#ABABAB]" },
  { value: 25,  label: "25%",  active: "bg-red-100 text-red-600",        inactive: "bg-[#F5F6FA] text-[#ABABAB]" },
  { value: 50,  label: "50%",  active: "bg-orange-100 text-orange-600",  inactive: "bg-[#F5F6FA] text-[#ABABAB]" },
  { value: 75,  label: "75%",  active: "bg-yellow-100 text-yellow-700",  inactive: "bg-[#F5F6FA] text-[#ABABAB]" },
  { value: 100, label: "100%", active: "bg-green-100 text-green-700",    inactive: "bg-[#F5F6FA] text-[#ABABAB]" },
]

const ff = { fontFamily: "'Nunito Sans', sans-serif" }

export default function EditLaporanModal({ open, onClose, laporan, permintaan, onSave }: Props) {
  const [progress, setProgress] = useState("")
  const [statusProgress, setStatusProgress] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (laporan && open) {
      setProgress(laporan.laporan_progress)
      setStatusProgress(laporan.status_progress)
    }
  }, [laporan, open])

  const handleClose = () => {
    setProgress("")
    setStatusProgress(null)
    onClose()
  }

  const handleSubmit = () => {
    if (!progress.trim()) { toast.error("Jelaskan progres pekerjaan"); return }
    if (statusProgress === null) { toast.error("Pilih persentase progres"); return }
    if (!laporan) return

    setLoading(true)
    setTimeout(() => {
      const updated: MockLaporan = {
        ...laporan,
        laporan_progress: progress,
        status_progress: statusProgress,
        updated_at: new Date().toISOString(),
      }
      onSave(updated)
      toast.success("Laporan berhasil diperbarui")
      setLoading(false)
      handleClose()
    }, 400)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-[24px] border-none shadow-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0 border-b border-gray-100">
          <DialogTitle className="text-[18px] font-bold text-[#202224]" style={ff}>
            Edit Laporan
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 pt-4 space-y-4 overflow-y-auto flex-1">

          {/* Permintaan — read only */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#202224]" style={ff}>Permintaan</label>
            <div
              className="w-full flex items-center px-3 py-2 bg-gray-100 border border-[#D5D5D5] rounded-xl text-[13px] text-[#606060] cursor-not-allowed select-none"
              style={ff}
            >
              {permintaan
                ? `${permintaan.pemda} — ${permintaan.aplikasi} (${permintaan.menu})`
                : "Tidak ada permintaan terkait"}
            </div>
          </div>

          {/* Progress deskripsi */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#202224]" style={ff}>
              Progress <span className="text-red-500">*</span>
            </label>
            <textarea
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              rows={3}
              placeholder="Tuliskan perkembangan pekerjaan saat ini..."
              className="w-full bg-white border border-[#D5D5D5] rounded-xl px-3 py-2 text-[13px] text-[#202224] placeholder:text-[#ABABAB] focus:ring-2 focus:ring-[#4880FF]/10 focus:border-[#4880FF] resize-none outline-none transition"
              style={ff}
            />
          </div>

          {/* Status Progress pills */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#202224]" style={ff}>
              Status Progress <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {PROGRESS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatusProgress(opt.value)}
                  className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all active:scale-95 ${
                    statusProgress === opt.value ? opt.active : opt.inactive
                  }`}
                  style={ff}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tombol aksi */}
          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2 rounded-xl border border-[#D5D5D5] text-[13px] font-bold text-[#202224] hover:bg-gray-50 transition active:scale-95"
              style={ff}
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-7 py-2 rounded-xl text-[13px] font-bold text-white transition active:scale-95 disabled:opacity-50"
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
