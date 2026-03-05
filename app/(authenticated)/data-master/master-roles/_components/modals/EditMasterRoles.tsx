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

import type { MasterRolesItem } from "../MasterRolesClient"

interface Props {
  data: MasterRolesItem
  onClose: () => void
  onSave: (data: MasterRolesItem) => void
}

export default function EditMasterRoles({
  data,
  onClose,
  onSave,
}: Props) {

  const [name, setName] = useState(data.name)
  const [description, setDescription] = useState(data.description)

  const handleSubmit = () => {

    if (!name.trim() || !description.trim()) {
      toast.error("Semua field wajib diisi!")
      return
    }

    onSave({
      id: data.id,
      name,
      description,
      created_at: data.created_at,
      updated_at: new Date().toISOString(),
    })

    toast.success("Role berhasil diperbarui")

    onClose()
  }

  return (

    <Dialog open onOpenChange={onClose}>

      <DialogContent>

        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">

          {/* NAMA ROLE */}
          <div>

            <Label className="uppercase text-xs font-semibold">
              Nama Role :
            </Label>

            <div className="mt-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <p className="text-xs text-muted-foreground mt-1">
              *Nama role harus terisi
            </p>

          </div>

          {/* DESKRIPSI */}
          <div>

            <Label className="uppercase text-xs font-semibold">
              Deskripsi :
            </Label>

            <div className="mt-2">
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <p className="text-xs text-muted-foreground mt-1">
              *Deskripsi role harus terisi
            </p>

          </div>

        </div>

        <DialogFooter>

          <Button
            variant="outline"
            onClick={onClose}
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