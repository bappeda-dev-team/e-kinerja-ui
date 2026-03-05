'use client'

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props {
  onClose: () => void
  onSave: (data: {
    nama_aplikasi: string
  }) => void
}

export default function AddMasterAplikasi({ onClose, onSave }: Props) {

  const [nama, setNama] = useState("")

  const handleSubmit = () => {

    if (!nama.trim()) {
      toast.error("Nama aplikasi wajib diisi!")
      return
    }

    onSave({
      nama_aplikasi: nama,
    })



    setNama("")
    onClose()
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>

        <DialogHeader>
          <DialogTitle>Tambah Aplikasi</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">

          <div>

            <Label className="uppercase text-xs font-semibold">
              Nama Aplikasi :
            </Label>

            <div className="mt-2">
              <Input
                placeholder="masukkan nama aplikasi"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />
            </div>

            <p className="text-xs text-muted-foreground mt-1">
              *Nama aplikasi harus terisi
            </p>

          </div>

        </div>

        <DialogFooter>

          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>

          <Button onClick={handleSubmit}>
            Simpan
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}