'use client'

import { useState, useEffect } from "react"
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

import type { MasterAplikasiItem } from "../MasterAplikasiClient"

interface Props {
  data: MasterAplikasiItem
  onClose: () => void
  onSave: (data: MasterAplikasiItem) => void
}

export default function EditMasterAplikasi({
  data,
  onClose,
  onSave,
}: Props) {

  // selalu string (tidak pernah undefined)
  const [nama, setNama] = useState<string>("")

  // sync ketika data berubah / modal dibuka
  useEffect(() => {
    if (data?.nama_aplikasi) {
      setNama(data.nama_aplikasi)
    } else {
      setNama("")
    }
  }, [data])

  const handleSubmit = () => {

    if (!nama.trim()) {
      toast.error("Nama aplikasi wajib diisi!")
      return
    }

    onSave({
      id: data.id,
      nama_aplikasi: nama,
      logo: data.logo,
      created_at: data.created_at,
      updated_at: new Date().toISOString(),
    })

    onClose()
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>

        <DialogHeader>
          <DialogTitle>Edit Aplikasi</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">

          <div>

            <Label className="uppercase text-xs font-semibold">
              Nama Aplikasi :
            </Label>

            <div className="mt-2">
              <Input
                value={nama ?? ""}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama aplikasi"
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