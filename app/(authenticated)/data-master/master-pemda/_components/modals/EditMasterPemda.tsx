'use client'

import { useEffect, useState } from "react"
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

import type { MasterPemdaItem } from "../MasterPemdaClient"

interface Props {
  open: boolean
  idPemda: string | null
  data: MasterPemdaItem[]
  onOpenChange: (open: boolean) => void
  onSubmit: (data: MasterPemdaItem) => void
}

export default function EditMasterPemda({
  open,
  idPemda,
  data,
  onOpenChange,
  onSubmit,
}: Props) {

  const [nama, setNama] = useState("")

  useEffect(() => {

    if (!idPemda) return

    const selected = data.find(item => item.id === idPemda)

    if (selected) {
      setNama(selected.name)
    }

  }, [idPemda, data])

  const handleSubmit = () => {

    if (!nama.trim()) {
      toast.error("Nama Pemda wajib diisi!")
      return
    }

    onSubmit({
      id: idPemda!,
      name: nama,
      created_at: "",
      updated_at: "",
    })

   

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>

      <DialogContent>

        <DialogHeader>
          <DialogTitle>Edit Pemda</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">

          <div>

            <Label className="uppercase text-xs font-semibold">
              Nama Pemda :
            </Label>

            <div className="mt-2">
              <Input
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