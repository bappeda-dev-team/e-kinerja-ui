
"use client"

import { useState } from "react"
import { toast } from "sonner"
import { X } from "lucide-react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface PermintaanItem {
  id: string
  nama_pemda: string
  aplikasi: string
  menu: string
}

interface UserItem {
  id: string
  full_name: string
}

interface Props {
  item: PermintaanItem
  users: UserItem[]
  onClose: () => void
  onSave: (val: { programmer_ids: string[]; komentar: string }) => void
}

export default function AssignDistribusiModal({ item, users, onClose, onSave }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [komentar, setKomentar] = useState("")

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleSubmit = () => {
    if (selectedIds.length === 0) {
      toast.error("Pilih minimal satu programmer")
      return
    }
    onSave({ programmer_ids: selectedIds, komentar })
  }

  const selectedUsers = users.filter((u) => selectedIds.includes(u.id))
  const unselectedUsers = users.filter((u) => !selectedIds.includes(u.id))

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Distribusi Pekerjaan</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div className="rounded-md bg-muted px-3 py-2 text-muted-foreground">
            <span className="font-semibold text-foreground">{item.nama_pemda}</span>
            {" — "}
            {item.aplikasi} · {item.menu}
          </div>

          <div className="space-y-1">
            <Label>Programmer</Label>
            <select
              className="w-full border rounded-md px-3 py-2 text-sm"
              value=""
              onChange={(e) => { if (e.target.value) handleToggle(e.target.value) }}
            >
              <option value="">Pilih programmer...</option>
              {unselectedUsers.map((u) => (
                <option key={u.id} value={u.id}>{u.full_name}</option>
              ))}
            </select>
            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {selectedUsers.map((u) => (
                  <Badge key={u.id} variant="secondary" className="flex items-center gap-1">
                    {u.full_name}
                    <button onClick={() => handleToggle(u.id)}>
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <Label>Komentar (opsional)</Label>
            <Textarea
              value={komentar}
              onChange={(e) => setKomentar(e.target.value)}
              placeholder="Tambahkan catatan untuk programmer..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleSubmit}>Distribusikan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
