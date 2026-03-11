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

const PRESET_COLORS = [
  "#4ADE80", "#FCD34D", "#F87171", "#A78BFA",
  "#60A5FA", "#FB923C", "#34D399", "#F472B6",
]

interface Props {
  onClose: () => void
  onSave: (data: {
    name: string
    label: string
    description: string
    color: string
  }) => void
}

export default function AddMasterRoles({ onClose, onSave }: Props) {
  const [name, setName] = useState("")
  const [label, setLabel] = useState("")
  const [description, setDescription] = useState("")
  const [color, setColor] = useState(PRESET_COLORS[0])

  const handleSubmit = () => {
    if (!name.trim() || !label.trim() || !description.trim()) {
      toast.error("Semua field wajib diisi!")
      return
    }
    onSave({ name, label, description, color })
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Role</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <div>
            <Label className="uppercase text-xs font-semibold">Nama Role</Label>
            <Input
              className="mt-1.5"
              placeholder="contoh: super_admin"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label className="uppercase text-xs font-semibold">Label</Label>
            <Input
              className="mt-1.5"
              placeholder="contoh: Super Admin"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>

          <div>
            <Label className="uppercase text-xs font-semibold">Deskripsi</Label>
            <Input
              className="mt-1.5"
              placeholder="masukkan deskripsi role"
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
