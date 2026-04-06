// app/super-admin/verifikasi/_components/modals/VerifikasiModal.tsx

"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { VerifikasiItem } from "../VerifikasiClient"

function formatTanggal(value?: string) {
  if (!value) return "-"
  return new Date(value).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
}

export default function VerifikasiModal({ data, onClose, onSave }: {
  data: VerifikasiItem
  onClose: () => void
  onSave: (i: VerifikasiItem) => void
}) {
  const [komentar, setKomentar] = useState(data.komentar || "")
  const [status, setStatus] = useState(data.status)

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="font-nunito max-w-md">
        <DialogHeader>
          <DialogTitle>Verifikasi Laporan</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Info Permintaan */}
          <div className="rounded-xl bg-gray-50 p-4 space-y-2">
            <div className="flex items-center gap-3">
              {data.pemda_logo && (
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-gray-100 flex items-center justify-center shrink-0 p-1">
                  <img src={data.pemda_logo} alt={data.pemda_name} className="w-full h-full object-contain" />
                </div>
              )}
              <div className="min-w-0">
                <p className="font-bold text-sm text-[#202224] truncate">{data.pemda_name}</p>
                <p className="text-xs text-[#797A7C] truncate">
                  {data.aplikasi_name || "-"}
                  {data.menu && <> · {data.menu}</>}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-200 text-xs text-[#797A7C]">
              <div>
                <span className="font-semibold text-[#202224]">Programmer</span>
                <p className="flex items-center gap-1 mt-0.5">
                  {data.programmer_avatar && (
                    <img src={data.programmer_avatar} alt={data.programmer} className="w-4 h-4 rounded-full object-cover" />
                  )}
                  {data.programmer}
                </p>
              </div>
              <div>
                <span className="font-semibold text-[#202224]">Deadline</span>
                <p className="mt-0.5">{formatTanggal(data.tanggal_deadline)}</p>
              </div>
            </div>

            {data.progres_deskripsi && (
              <div className="pt-1 border-t border-gray-200 text-xs text-[#797A7C]">
                <span className="font-semibold text-[#202224]">Progress Laporan</span>
                <p className="mt-0.5 line-clamp-3">{data.progres_deskripsi}</p>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <Label>Status Verifikasi</Label>
            <Select value={status} onValueChange={(v: any) => setStatus(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="menunggu">Menunggu</SelectItem>
                <SelectItem value="revisi">Revisi</SelectItem>
                <SelectItem value="terverifikasi">Terverifikasi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Komentar</Label>
            <Textarea
              value={komentar}
              onChange={(e) => setKomentar(e.target.value)}
              placeholder="Catatan hasil verifikasi..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={() => onSave({ ...data, komentar, status })}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
