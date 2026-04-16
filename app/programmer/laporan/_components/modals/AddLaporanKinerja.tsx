// app/programmer/laporan/_components/modals/AddLaporanKinerja.tsx

"use client"

import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronDown, FileText, UploadCloud, X } from "lucide-react"
import { toast } from "sonner"
import type { LaporanKinerjaItem } from "../../types"
import { mapProgressToStatus, mapStatusToProgress } from "../../utils"

interface Props {
  open: boolean
  onClose: () => void
  onSave: (item: LaporanKinerjaItem) => Promise<void>
  initialData?: LaporanKinerjaItem | null
  permintaanList: { id: string; pemda: string; menu: string }[]
  masterPegawai: { id: string; nama_pegawai: string; jabatan: string }[]
}

const PROGRESS_OPTIONS = [
  {
    value: 0,
    label: "0%",
    activeClassName: "border border-slate-300 bg-white text-slate-600 shadow-sm",
    barClassName: "bg-slate-400",
  },
  {
    value: 25,
    label: "25%",
    activeClassName: "bg-red-100 text-red-600 shadow-sm",
    barClassName: "bg-red-500",
  },
  {
    value: 50,
    label: "50%",
    activeClassName: "bg-orange-100 text-orange-500 shadow-sm",
    barClassName: "bg-orange-500",
  },
  {
    value: 75,
    label: "75%",
    activeClassName: "bg-yellow-100 text-yellow-600 shadow-sm",
    barClassName: "bg-yellow-500",
  },
  {
    value: 100,
    label: "100%",
    activeClassName: "bg-green-100 text-green-600 shadow-sm",
    barClassName: "bg-green-500",
  },
]

function getPemdaInitial(label?: string) {
  if (!label) return "PM"
  return label
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export default function AddLaporanKinerja({
  open,
  onClose,
  onSave,
  initialData = null,
  permintaanList,
  masterPegawai,
}: Props) {
  const [permintaanId, setPermintaanId] = useState("")
  const [progress, setProgress] = useState("")
  const [statusProgress, setStatusProgress] = useState<number | null>(null)
  const [permintaanOpen, setPermintaanOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [touched, setTouched] = useState({
    permintaan: false,
    progress: false,
    status: false,
  })

  const activeProgrammer = useMemo(
    () => masterPegawai.find((p) => p.jabatan.toLowerCase().includes("programmer")) ?? masterPegawai[0],
    [masterPegawai]
  )

  useEffect(() => {
    if (initialData && open) {
      setPermintaanId(initialData.permintaan.id)
      setProgress(initialData.laporan_progress)
      setStatusProgress(mapStatusToProgress(initialData.status))
    } else if (open) {
      setPermintaanId("")
      setProgress("")
      setStatusProgress(null)
    }
    setAttachments([])
    setPermintaanOpen(false)
    setSubmitAttempted(false)
    setTouched({
      permintaan: false,
      progress: false,
      status: false,
    })
  }, [initialData, open, masterPegawai])

  const handleSubmit = async () => {
    setSubmitAttempted(true)

    if (!permintaanId) { toast.error("Permintaan harus terisi"); return }
    if (!progress.trim()) { toast.error("Jelaskan progres pekerjaan yang sudah dilakukan"); return }
    if (statusProgress === null) { toast.error("Pilih persentase progres penyelesaian pekerjaan"); return }
    if (!activeProgrammer?.id) { toast.error("Data programmer aktif tidak ditemukan"); return }

    const now = new Date().toISOString()
    const selectedPermintaan = permintaanList.find((p) => p.id === permintaanId)

    const newItem: LaporanKinerjaItem = {
      id: initialData?.id ?? crypto.randomUUID(),
      permintaan: {
        id: permintaanId,
        pemda: selectedPermintaan?.pemda ?? "",
        aplikasi: selectedPermintaan?.menu ?? "",
        menu: selectedPermintaan?.menu ?? "",
      },
      programmer: {
        id: activeProgrammer.id ?? "",
        username: activeProgrammer.nama_pegawai ?? "",
        full_name: activeProgrammer.nama_pegawai ?? "",
      },
      laporan_progress: progress,
      status: mapProgressToStatus(statusProgress),
      verifikasi: initialData?.verifikasi,
      is_submitted_to_verified: initialData?.is_submitted_to_verified ?? false,
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

  const handleAttachmentChange = (files: FileList | null) => {
    if (!files?.length) return

    setAttachments((prev) => {
      const nextFiles = Array.from(files).filter(
        (file) =>
          !prev.some(
            (existing) =>
              existing.name === file.name &&
              existing.size === file.size &&
              existing.lastModified === file.lastModified
          )
      )

      return [...prev, ...nextFiles]
    })
  }

  const handleRemoveAttachment = (fileToRemove: File) => {
    setAttachments((prev) =>
      prev.filter(
        (file) =>
          !(
            file.name === fileToRemove.name &&
            file.size === fileToRemove.size &&
            file.lastModified === fileToRemove.lastModified
          )
      )
    )
  }

  const selectedPermintaan = useMemo(
    () => permintaanList.find((item) => item.id === permintaanId) ?? null,
    [permintaanId, permintaanList]
  )

  const ff = { fontFamily: "'Nunito Sans', sans-serif" }
  const showPermintaanError = submitAttempted && !permintaanId
  const showProgressError = (submitAttempted || touched.progress) && !progress.trim()
  const showStatusError = (submitAttempted || touched.status) && statusProgress === null
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent aria-describedby={undefined} className="sm:max-w-lg p-0 overflow-hidden rounded-[24px] border-none shadow-2xl [&>button]:hidden">
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
            <Popover open={permintaanOpen} onOpenChange={setPermintaanOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "group flex h-[56px] w-full items-center justify-between rounded-xl border bg-white px-4 text-left shadow-sm transition-all outline-none data-[state=open]:ring-2 data-[state=open]:ring-blue-500",
                    showPermintaanError
                      ? "border-red-300 bg-red-50/40"
                      : "border-[#E2E8F0] hover:border-slate-300",
                    permintaanOpen && !showPermintaanError && "border-blue-500 ring-2 ring-blue-500"
                  )}
                  style={ff}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {selectedPermintaan ? (
                      <>
                        <span className="inline-flex h-7 items-center rounded-full bg-blue-100 px-2.5 text-xs font-bold text-blue-700">
                          {getPemdaInitial(selectedPermintaan.pemda)}
                        </span>
                        <span className="truncate text-[14px] font-semibold text-slate-800">
                          {selectedPermintaan.pemda} - {selectedPermintaan.menu}
                        </span>
                      </>
                    ) : (
                      <span className="truncate text-[14px] italic text-slate-400">
                        Pilih permintaan pekerjaan
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-slate-500 transition-transform duration-150",
                      permintaanOpen && "rotate-180"
                    )}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                sideOffset={8}
                className="w-(--radix-popover-trigger-width) rounded-2xl border border-slate-200 bg-white p-2 shadow-lg transition-all duration-150 data-[state=closed]:scale-95 data-[state=open]:scale-100"
              >
                <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
                  {permintaanList.map((item) => {
                    const isSelected = item.id === permintaanId
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setPermintaanId(item.id)
                          setTouched((prev) => ({ ...prev, permintaan: true }))
                          setPermintaanOpen(false)
                        }}
                        className={cn(
                          "flex w-full items-center justify-between rounded-[8px] px-3 py-3 text-left transition-colors",
                          isSelected
                            ? "bg-blue-600 text-white"
                            : "text-slate-700 hover:bg-slate-50"
                        )}
                        style={ff}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className={cn(
                              "inline-flex h-7 items-center rounded-full px-2.5 text-xs font-bold",
                              isSelected ? "bg-white/15 text-white" : "bg-blue-100 text-blue-700"
                            )}
                          >
                            {getPemdaInitial(item.pemda)}
                          </span>
                          <span className="truncate text-[14px] font-semibold">
                            {item.pemda} - {item.menu}
                          </span>
                        </div>
                        <Check className={cn("h-4 w-4 shrink-0", isSelected ? "opacity-100" : "opacity-0")} />
                      </button>
                    )
                  })}
                </div>
              </PopoverContent>
            </Popover>
            {showPermintaanError && (
              <p className="text-[12px] font-medium text-red-500" style={ff}>
                *Permintaan harus terisi
              </p>
            )}
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <label className="text-[15px] font-bold text-[#202224]" style={ff}>
              Progress<span className="text-red-500">*</span>
            </label>
            <textarea
              value={progress}
              onChange={(e) => {
                setProgress(e.target.value)
                if (!touched.progress) {
                  setTouched((prev) => ({ ...prev, progress: true }))
                }
              }}
              onBlur={() => setTouched((prev) => ({ ...prev, progress: true }))}
              rows={3}
              placeholder="Tuliskan perkembangan pekerjaan saat ini..."
              className={`w-full resize-none rounded-xl border px-4 py-3 text-[14px] text-[#202224] placeholder:text-[#ABABAB] outline-none transition focus:border-[#4880FF] focus:ring-2 focus:ring-[#4880FF]/10 ${
                showProgressError ? "border-red-300 bg-red-50/40" : "border-[#D5D5D5] bg-white"
              }`}
              style={ff}
            />
            <p className={`text-[12px] font-medium ${showProgressError ? "text-red-500" : "text-[#8F96A3]"}`} style={ff}>
              *Jelaskan progres pekerjaan yang sudah dilakukan
            </p>
          </div>

          {/* Status Progress Pills */}
          <div className="space-y-3">
            <label className="text-[15px] font-bold text-[#202224]" style={ff}>
              Status Progress<span className="text-red-500">*</span>
            </label>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2">
              <div className="grid grid-cols-5 gap-2">
              {PROGRESS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setStatusProgress(opt.value)
                    setTouched((prev) => ({ ...prev, status: true }))
                  }}
                    className={cn(
                      "rounded-xl px-4 py-2.5 text-[14px] font-bold transition-all duration-300 active:scale-95",
                      statusProgress === opt.value
                        ? cn("scale-[1.05]", opt.activeClassName)
                        : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                    )}
                  style={ff}
                >
                  {opt.label}
                </button>
              ))}
              </div>
            </div>
            <p className={`text-[12px] font-medium ${showStatusError ? "text-red-500" : "text-[#8F96A3]"}`} style={ff}>
              *Pilih persentase progres penyelesaian pekerjaan
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-[15px] font-bold text-[#202224]" style={ff}>
              Lampiran<span className="text-red-500">*</span>
            </label>

            <label
              htmlFor="programmer-laporan-attachments"
              className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#C4CDD5] bg-[#F5F6FA] p-8 transition hover:bg-[#F0F2F5]"
            >
              <div className="rounded-full bg-[#DFE3E8] p-3">
                <UploadCloud size={28} className="text-[#919EAB]" />
              </div>
              <div className="text-center">
                <p className="font-bold text-[#212B36]" style={ff}>Klik untuk unggah lampiran</p>
                <p className="text-xs text-[#637381]" style={ff}>PDF, DOCX, XLSX, JPG up to 10MB</p>
              </div>
              <input
                id="programmer-laporan-attachments"
                type="file"
                multiple
                className="hidden"
                onChange={(event) => {
                  handleAttachmentChange(event.target.files)
                  event.target.value = ""
                }}
              />
            </label>

            {attachments.length > 0 && (
              <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {attachments.map((file) => (
                  <div
                    key={`${file.name}-${file.lastModified}-${file.size}`}
                    className="flex items-center justify-between rounded-lg border border-[#D5D5D5] bg-white p-3 shadow-sm"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="shrink-0 rounded bg-blue-50 p-2 text-blue-600">
                        <FileText size={18} />
                      </div>
                      <div className="min-w-0">
                        <span className="block truncate text-xs font-semibold text-[#202224]" style={ff}>
                          {file.name}
                        </span>
                        <span className="block text-[11px] text-[#8F96A3]" style={ff}>
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(file)}
                      className="rounded-full p-1 text-red-500 transition hover:bg-red-50"
                      aria-label={`Hapus ${file.name}`}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
