"use client"

import { useState } from "react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type { VerifikasiItem } from "../VerifikasiClient"

interface Props {
  data: VerifikasiItem
  onClose: () => void
  onSave: (item: VerifikasiItem) => void
}

export default function VerifikasiModal({ data, onClose, onSave }: Props) {

  const [verifikator, setVerifikator] = useState(data.verifikator || "")
  const [komentar, setKomentar] = useState(data.komentar || "")
  const [status, setStatus] = useState<VerifikasiItem["status"]>(data.status)
  const [deadline, setDeadline] = useState(data.deadline || "")
  const [catatan, setCatatan] = useState(data.catatan_revisi || "")

  const handleSubmit = () => {

    if (!komentar.trim()) {
      toast.error("Komentar harus diisi")
      return
    }

    const now = new Date().toISOString().slice(0, 10)

    const updated: VerifikasiItem = {
      ...data,
      verifikator,
      komentar,
      status,
      deadline: status === "revisi" ? deadline : undefined,
      catatan_revisi: status === "revisi" ? catatan : undefined,
      tanggal_verifikasi: status === "terverifikasi" ? now : undefined,
    }

    onSave(updated)
    onClose()
  }

  return (
    <Dialog open onOpenChange={onClose}>

      <DialogContent className="max-w-md">

        <DialogHeader>
          <DialogTitle>Verifikasi Laporan</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">

          <div className="rounded-md bg-muted px-3 py-2 text-muted-foreground">
            <span className="font-semibold text-foreground">{data.nama_pemda}</span>
            {" — "}
            {data.aplikasi} · {data.menu}
          </div>

          <div className="space-y-1">
            <Label>Status Verifikasi</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as VerifikasiItem["status"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="menunggu">Menunggu</SelectItem>
                <SelectItem value="revisi">Revisi</SelectItem>
                <SelectItem value="terverifikasi">Terverifikasi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Verifikator</Label>
            <Input
              value={verifikator}
              onChange={(e) => setVerifikator(e.target.value)}
              placeholder="Nama verifikator"
            />
          </div>

          <div className="space-y-1">
            <Label>Komentar</Label>
            <Textarea
              value={komentar}
              onChange={(e) => setKomentar(e.target.value)}
              placeholder="Tuliskan hasil verifikasi..."
              rows={3}
            />
          </div>

          {status === "revisi" && (
            <>
              <div className="space-y-1">
                <Label>Catatan Revisi</Label>
                <Textarea
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Detail yang perlu direvisi..."
                  rows={2}
                />
              </div>
              <div className="space-y-1">
                <Label>Deadline</Label>
                <Input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
            </>
          )}

        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleSubmit}>Simpan</Button>
        </DialogFooter>

      </DialogContent>

    </Dialog>
  )
}
