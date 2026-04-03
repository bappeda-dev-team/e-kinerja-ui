"use client"

import { useState } from "react"
import { toast } from "sonner"
import { X } from "lucide-react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import type { DistribusiItem } from "../DistribusiClient"

interface UserItem {
  id: string
  full_name: string
}

interface Props {
  item: DistribusiItem
  users: UserItem[]
  onClose: () => void
  onAddPelaksana: (distribusi_id: string, programmer_id: string) => Promise<void>
  onDeletePelaksana: (pelaksana_id: string, distribusi_id: string) => Promise<void>
}

export default function EditPelaksanaModal({ item, users, onClose, onAddPelaksana, onDeletePelaksana }: Props) {
  const [selectedId, setSelectedId] = useState("")
  const [loading, setLoading] = useState(false)

  const assignedIds = item.programmer.map((p) => p.id)
  const availableUsers = users.filter((u) => !assignedIds.includes(u.id))

  const handleAdd = async () => {
    if (!selectedId) { toast.error("Pilih programmer dulu"); return }
    setLoading(true)
    try {
      await onAddPelaksana(item.id, selectedId)
      setSelectedId("")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (pelaksana_id: string) => {
    setLoading(true)
    try {
      await onDeletePelaksana(pelaksana_id, item.id)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Programmer</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div className="rounded-md bg-muted px-3 py-2 text-muted-foreground">
            <span className="font-semibold text-foreground">{item.nama_pemda}</span>
            {" — "}
            {item.aplikasi} · {item.menu}
          </div>

          {/* Programmer yang sudah assigned */}
          <div className="space-y-1.5">
            <Label>Programmer Saat Ini</Label>
            {item.programmer.length === 0 ? (
              <p className="text-xs text-muted-foreground">Belum ada programmer</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {item.programmer.map((p) => (
                  <Badge key={p.pelaksana_id} variant="secondary" className="flex items-center gap-1 px-2 py-1">
                    {p.nama}
                    <button
                      onClick={() => handleDelete(p.pelaksana_id)}
                      disabled={loading}
                      className="text-gray-400 hover:text-red-500 transition ml-1"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-black/10" />

          {/* Tambah programmer baru */}
          <div className="space-y-1.5">
            <Label>Tambah Programmer</Label>
            <div className="flex gap-2">
<select
  className="flex-1 border rounded-md px-3 py-2 text-sm bg-background"
  value={selectedId}
  onChange={(e) => {
    e.stopPropagation()
    setSelectedId(e.target.value)
  }}
  disabled={loading}
  size={1}
>
  <option value="" disabled>Pilih programmer...</option>
  {availableUsers.map((u) => (
    <option key={u.id} value={u.id}>{u.full_name}</option>
  ))}
</select>
              <Button onClick={handleAdd} disabled={loading || !selectedId} size="sm">
                Tambah
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Tutup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
