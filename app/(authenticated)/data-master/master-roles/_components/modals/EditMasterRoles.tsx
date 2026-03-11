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

import type { MasterRolesItem } from "../../data"

const PRESET_COLORS = [
  "#4ADE80", "#FCD34D", "#F87171", "#A78BFA",
  "#60A5FA", "#FB923C", "#34D399", "#F472B6",
]

interface Props {
  data: MasterRolesItem
  onClose: () => void
  onSave: (data: MasterRolesItem) => void
}

export default function EditMasterRoles({ data, onClose, onSave }: Props) {
  const [name, setName] = useState(data.name)
  const [label, setLabel] = useState(data.label)
  const [description, setDescription] = useState(data.description)
  const [color, setColor] = useState(data.color)

  const handleSubmit = () => {
    if (!name.trim() || !label.trim() || !description.trim()) {
      toast.error("Semua field wajib diisi!")
      return
    }
    onSave({
      id: data.id,
      name,
      label,
      description,
      color,
      created_at: data.created_at,
      updated_at: new Date().toISOString(),
    })
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <div>
            <Label className="uppercase text-xs font-semibold">Nama Role</Label>
            <Input
              className="mt-1.5"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label className="uppercase text-xs font-semibold">Label</Label>
            <Input
              className="mt-1.5"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>

          <div>
            <Label className="uppercase text-xs font-semibold">Deskripsi</Label>
            <Input
              className="mt-1.5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <Label className="uppercase text-xs font-semibold">Warna Banner</Label>
            <div className="mt-1.5 flex gap-2 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="h-7 w-7 rounded-full border-2 transition-transform"
                  style={{
                    backgroundColor: c,
                    borderColor: color === c ? "#202224" : "transparent",
                    transform: color === c ? "scale(1.2)" : "scale(1)",
                  }}
                />
              ))}
            </div>
          </div>

        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleSubmit}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
