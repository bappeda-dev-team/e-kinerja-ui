"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

import type { VerifikasiItem } from "../VerifikasiClient"

interface Props {
  data: VerifikasiItem
  onClose: () => void
  onSave: (item: VerifikasiItem) => void
}

export default function VerifikasiModal({
  data,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<VerifikasiItem>(data)

  const handleChange = (key: keyof VerifikasiItem, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    onSave(form)
    onClose()
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verifikasi Laporan</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Komentar Verifikator</Label>
            <Textarea
              value={form.komentar_verifikator || ""}
              onChange={(e) =>
                handleChange("komentar_verifikator", e.target.value)
              }
            />
          </div>

          <div>
            <Label>Ketepatan Waktu (%)</Label>
            <Input
              type="number"
              value={form.ketepatan_waktu || ""}
              onChange={(e) =>
                handleChange("ketepatan_waktu", Number(e.target.value))
              }
            />
          </div>

          <div>
            <Label>Kualitas</Label>
            <select
              className="w-full border rounded-md p-2"
              value={form.kualitas || ""}
              onChange={(e) =>
                handleChange("kualitas", e.target.value)
              }
            >
              <option value="">Pilih</option>
              <option value="sangat baik">Sangat Baik</option>
              <option value="baik">Baik</option>
              <option value="cukup">Cukup</option>
            </select>
          </div>

          <div>
            <Label>Saran</Label>
            <Textarea
              value={form.saran || ""}
              onChange={(e) =>
                handleChange("saran", e.target.value)
              }
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button onClick={handleSubmit}>
              Simpan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}