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
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: {
    nama_pemda: string
  }) => void
}

export default function AddMasterPemda({
  open,
  onOpenChange,
  onSubmit,
}: Props) {

  const [nama, setNama] = useState("")

  const handleSubmit = () => {

    if (!nama.trim()) {
      toast.error("Nama Pemda wajib diisi!")
      return
    }

    onSubmit({
      nama_pemda: nama,
    })

  

    setNama("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>

      <DialogContent>

        <DialogHeader>
          <DialogTitle>Tambah Pemda</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">

          <div>

            <Label className="uppercase text-xs font-semibold">
              Nama Pemda :
            </Label>

            <div className="mt-2">
              <Input
                placeholder="masukkan nama pemda"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />
            </div>

            <p className="text-xs text-muted-foreground mt-1">
              *Nama Pemda harus terisi
            </p>

          </div>

        </div>

        <DialogFooter>

          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
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