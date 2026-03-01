"use client"

import { useEffect, useState } from "react"
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

import type { LaporanKinerjaItem } from "../LaporanKinerjaClient"

interface Props {
  open: boolean
  onClose: () => void
  onSave: (item: LaporanKinerjaItem) => void
  initialData?: LaporanKinerjaItem | null
}

export default function AddLaporanKinerja({
  open,
  onClose,
  onSave,
  initialData = null,
}: Props) {
  const emptyForm: Omit<LaporanKinerjaItem, "id"> = {
  pemda: "",
  nama_aplikasi: "",
  menu: "",
  pelaksana: "",
  status: 0,
  laporan_progress: "",
  attachments: [],
}

  const [form, setForm] = useState(emptyForm)

  // 🔥 PREFILL OTOMATIS
  useEffect(() => {
    if (initialData) {
      const { id, ...rest } = initialData
      setForm(rest)
    } else {
      setForm(emptyForm)
    }
  }, [initialData, open])

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    const newItem: LaporanKinerjaItem = {
      id: initialData?.id ?? Date.now().toString(),
      ...form,
    }

    onSave(newItem)
    onClose()
  }

  const wajibText = (
    <p className="text-xs text-muted-foreground mt-1">
      *Wajib diisi
    </p>
  )

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Laporan Kinerja" : "Tambah Laporan Kinerja"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <div>
            <Label>Pemda</Label>
            <Input
              value={form.pemda}
              onChange={(e) => handleChange("pemda", e.target.value)}
            />
            {wajibText}
          </div>

          <div>
            <Label>Nama Aplikasi</Label>
            <Input
              value={form.nama_aplikasi}
              onChange={(e) => handleChange("nama_aplikasi", e.target.value)}
            />
            {wajibText}
          </div>

          <div>
            <Label>Menu</Label>
            <Input
              value={form.menu}
              onChange={(e) => handleChange("menu", e.target.value)}
            />
            {wajibText}
          </div>

          <div>
            <Label>Pelaksana</Label>
            <Input
              value={form.pelaksana}
              onChange={(e) => handleChange("pelaksana", e.target.value)}
            />
            {wajibText}
          </div>

          {/* STATUS */}
<div>
  <Label>Status</Label>

  <div className="grid grid-cols-5 gap-2 mt-2">
    {[0, 25, 50, 75, 100].map((value) => {
      const colorMap: Record<number, string> = {
        0: "bg-gray-400",
        25: "bg-red-500",
        50: "bg-orange-500",
        75: "bg-yellow-400",
        100: "bg-green-500",
      }

      const isActive = form.status === value

      return (
        <button
          key={value}
          type="button"
          onClick={() => handleChange("status", value)}
          className={`text-white text-sm rounded-md py-2 transition 
            ${colorMap[value]} 
            ${isActive ? "ring-2 ring-black" : "opacity-80 hover:opacity-100"}
          `}
        >
          {value}%
        </button>
      )
    })}
  </div>

  <p className="text-xs text-muted-foreground mt-1">
    *Wajib diisi
  </p>
</div>

          <div>
            <Label>Laporan Progress Oleh Pelaksana</Label>
            <Textarea
              value={form.laporan_progress}
              onChange={(e) =>
                handleChange("laporan_progress", e.target.value)
              }
            />
            {wajibText}
          </div>

          <div>
            <Label>Attachment</Label>
            <Input
              type="file"
              multiple
              onChange={(e) => {
                if (!e.target.files) return
                const files = Array.from(e.target.files).map((file) => ({
                  name: file.name,
                  url: "#",
                }))
                handleChange("attachments", files)
              }}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Opsional
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
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