// app/super-admin/verifikasi/_components/modals/VerifikasiModal.tsx

"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { VerifikasiItem } from "../VerifikasiClient"

export default function VerifikasiModal({ data, onClose, onSave }: { data: VerifikasiItem, onClose: () => void, onSave: (i: VerifikasiItem) => void }) {
  const [komentar, setKomentar] = useState(data.komentar || "")
  const [status, setStatus] = useState(data.status)

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="font-nunito">
        <DialogHeader><DialogTitle>Verifikasi Laporan</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="bg-gray-50 p-3 rounded text-xs">
            <p className="font-bold">{data.programmer}</p>
            <p>{data.laporan_label} • {data.verifikator || "Belum ada verifikator"}</p>
          </div>
          <div className="space-y-1">
            <Label>Status</Label>
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
            <Textarea value={komentar} onChange={(e) => setKomentar(e.target.value)} placeholder="Input hasil cek..." rows={3} />
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
