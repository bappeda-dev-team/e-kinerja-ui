"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

import {
  formatDateLabel,
  getStatusMeta,
  type VerifikasiListItem,
  type VerifikasiStatus,
} from "../utils"

interface VerifikasiModalProps {
  data: VerifikasiListItem
  open: boolean
  saving?: boolean
  onClose: () => void
  onSave: (item: VerifikasiListItem) => void
}

export default function VerifikasiModal({
  data,
  open,
  saving = false,
  onClose,
  onSave,
}: VerifikasiModalProps) {
  const [komentar, setKomentar] = useState(data.komentar || "")
  const [status, setStatus] = useState<VerifikasiStatus>(data.status)

  useEffect(() => {
    setKomentar(data.komentar || "")
    setStatus(data.status)
  }, [data])

  const isVerified = data.status === "terverifikasi"
  const statusMeta = getStatusMeta(data.status)

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tinjau Verifikasi</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-3 rounded-2xl bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              {data.pemdaLogo ? (
                <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-gray-100 bg-white p-1">
                  <img src={data.pemdaLogo} alt={data.pemdaName} className="h-full w-full object-contain" />
                </div>
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">
                  {data.pemdaName.slice(0, 1)}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[#202224]">{data.pemdaName}</p>
                <p className="truncate text-xs text-[#797A7C]">
                  {data.aplikasiName}
                  {data.menu ? ` · ${data.menu}` : ""}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-gray-200 pt-3 text-xs text-[#797A7C]">
              <div>
                <span className="font-semibold text-[#202224]">Programmer</span>
                <p className="mt-1">{data.programmer}</p>
              </div>
              <div>
                <span className="font-semibold text-[#202224]">Deadline</span>
                <p className="mt-1">{formatDateLabel(data.tanggalDeadline)}</p>
              </div>
              <div>
                <span className="font-semibold text-[#202224]">Status Saat Ini</span>
                <p className={`mt-1 font-semibold ${statusMeta.textClass}`}>{statusMeta.label}</p>
              </div>
              <div>
                <span className="font-semibold text-[#202224]">Laporan</span>
                <p className="mt-1">{data.laporanId}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-3 text-xs text-[#797A7C]">
              <span className="font-semibold text-[#202224]">Progress Laporan</span>
              <p className="mt-1 line-clamp-4">{data.progress || "-"}</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Status Verifikasi</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as VerifikasiStatus)} disabled={isVerified}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="menunggu">Menunggu</SelectItem>
                <SelectItem value="revisi">Revisi</SelectItem>
                <SelectItem value="terverifikasi">Terverifikasi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Komentar</Label>
            <Textarea
              value={komentar}
              onChange={(event) => setKomentar(event.target.value)}
              placeholder="Tambahkan catatan hasil verifikasi..."
              rows={4}
              disabled={isVerified}
            />
          </div>

          {isVerified && (
            <p className="text-xs text-emerald-600 font-medium">
              Verifikasi ini sudah disetujui dan tidak dapat diubah.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            {isVerified ? "Tutup" : "Batal"}
          </Button>
          {!isVerified && (
            <Button onClick={() => onSave({ ...data, status, komentar })} disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
