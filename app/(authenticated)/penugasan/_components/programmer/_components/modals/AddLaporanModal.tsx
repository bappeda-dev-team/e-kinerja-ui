"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileText, UploadCloud, X } from "lucide-react"
import { toast } from "sonner"
import { MockLaporan, MockPermintaan } from "@/app/(authenticated)/laporan/_components/programmer/data"

interface Props {
  open: boolean
  onClose: () => void
  penugasanId: string
  permintaan: MockPermintaan | undefined
  onSave: (laporan: MockLaporan) => void
}

const PROGRESS_OPTIONS = [
  { value: 0,   label: "0%",   active: "bg-gray-200 text-gray-600",      inactive: "bg-[#F5F6FA] text-[#ABABAB]" },
  { value: 25,  label: "25%",  active: "bg-red-100 text-red-600",         inactive: "bg-[#F5F6FA] text-[#ABABAB]" },
  { value: 50,  label: "50%",  active: "bg-orange-100 text-orange-600",   inactive: "bg-[#F5F6FA] text-[#ABABAB]" },
  { value: 75,  label: "75%",  active: "bg-yellow-100 text-yellow-700",   inactive: "bg-[#F5F6FA] text-[#ABABAB]" },
  { value: 100, label: "100%", active: "bg-green-100 text-green-700",     inactive: "bg-[#F5F6FA] text-[#ABABAB]" },
]

const ff = { fontFamily: "'Nunito Sans', sans-serif" }

export default function AddLaporanModal({ open, onClose, penugasanId, permintaan, onSave }: Props) {
  const [progress, setProgress] = useState("")
  const [statusProgress, setStatusProgress] = useState<number | null>(null)
  const [attachments, setAttachments] = useState<File[]>([])
  const [loading, setLoading] = useState(false)

  const handleClose = () => {
    setProgress("")
    setStatusProgress(null)
    setAttachments([])
    onClose()
  }

  const handleAttachmentChange = (files: FileList | null) => {
    if (!files?.length) return
    setAttachments((prev) => {
      const next = Array.from(files).filter(
        (f) => !prev.some((e) => e.name === f.name && e.size === f.size && e.lastModified === f.lastModified)
      )
      return [...prev, ...next]
    })
  }

  const handleRemoveAttachment = (file: File) => {
    setAttachments((prev) =>
      prev.filter((f) => !(f.name === file.name && f.size === file.size && f.lastModified === file.lastModified))
    )
  }

  const handleSubmit = () => {
    if (!progress.trim()) { toast.error("Jelaskan progres pekerjaan yang sudah dilakukan"); return }
    if (statusProgress === null) { toast.error("Pilih persentase progres penyelesaian"); return }

    setLoading(true)
    const now = new Date().toISOString()
    const newLaporan: MockLaporan = {
      id: `laporan-${crypto.randomUUID()}`,
      penugasan_id: penugasanId,
      permintaan_id: permintaan?.id ?? "",
      laporan_progress: progress,
      status_progress: statusProgress,
      status: "pending",
      is_sent: false,
      created_at: now,
      updated_at: now,
    }

    setTimeout(() => {
      onSave(newLaporan)
      toast.success("Laporan berhasil ditambahkan")
      setLoading(false)
      handleClose()
    }, 400)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-[24px] border-none shadow-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0 border-b border-gray-100">
          <DialogTitle className="text-[18px] font-bold text-[#202224]" style={ff}>
            Tambah Laporan
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 pt-4 space-y-4 overflow-y-auto flex-1">

          {/* Permintaan — read only */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#202224]" style={ff}>
              Permintaan
            </label>
            <div
              className="w-full flex items-center px-3 py-2 bg-gray-100 border border-[#D5D5D5] rounded-xl text-[13px] text-[#606060] cursor-not-allowed select-none"
              style={ff}
            >
              {permintaan
                ? `${permintaan.pemda} — ${permintaan.aplikasi} (${permintaan.menu})`
                : "Tidak ada permintaan terkait"}
            </div>
            <p className="text-[11px] text-gray-400" style={ff}>
              Permintaan otomatis diisi dari penugasan ini
            </p>
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

          {/* Lampiran */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#202224]" style={ff}>
              Lampiran
            </label>
            <label
              htmlFor="add-laporan-attachments"
              className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-[#C4CDD5] bg-[#F5F6FA] px-4 py-3 transition hover:bg-[#F0F2F5]"
            >
              <div className="rounded-full bg-[#DFE3E8] p-2 shrink-0">
                <UploadCloud size={18} className="text-[#919EAB]" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#212B36]" style={ff}>Klik untuk unggah lampiran</p>
                <p className="text-[11px] text-[#637381]" style={ff}>PDF, DOCX, XLSX, JPG up to 10MB</p>
              </div>
              <input
                id="add-laporan-attachments"
                type="file"
                multiple
                className="hidden"
                onChange={(e) => { handleAttachmentChange(e.target.files); e.target.value = "" }}
              />
            </label>

            {attachments.length > 0 && (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {attachments.map((file) => (
                  <div
                    key={`${file.name}-${file.lastModified}`}
                    className="flex items-center justify-between rounded-lg border border-[#D5D5D5] bg-white p-2.5"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="shrink-0 rounded bg-blue-50 p-1.5 text-blue-600">
                        <FileText size={14} />
                      </div>
                      <div className="min-w-0">
                        <span className="block truncate text-[11px] font-semibold text-[#202224]" style={ff}>{file.name}</span>
                        <span className="block text-[10px] text-[#8F96A3]" style={ff}>{(file.size / 1024).toFixed(1)} KB</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(file)}
                      className="rounded-full p-1 text-red-400 hover:bg-red-50"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
