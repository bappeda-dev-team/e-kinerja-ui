"use client"

import { useState } from "react"
import { toast } from "sonner"
import { X, Loader2 } from "lucide-react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import type { DistribusiItem } from "../DistribusiClient"
import type { UserResponse } from "@/types/distribusi"

interface Props {
  item: DistribusiItem
  users: UserResponse[]
  onClose: () => void
  onSave: (id: string, val: { komentar: string; programmer_ids: string[] }) => void
  loading?: boolean
}

export default function EditDistribusiModal({ item, users, onClose, onSave, loading }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>(item.programmer.map((p) => p.id))
  const [komentar, setKomentar] = useState(item.komentar ?? "")

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
    onSave(item.id, { komentar: komentar.trim(), programmer_ids: selectedIds })
  }

  const selectedUsers = users.filter((u) => selectedIds.includes(u.id))
  const unselectedUsers = users.filter((u) => !selectedIds.includes(u.id))

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white p-0 overflow-hidden border-[#B9B9B9] rounded-2xl">
        <DialogHeader className="px-6 py-4 border-b border-[#E0E0E0]">
          <DialogTitle className="text-xl font-bold text-[#202224]">Edit Distribusi</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5 space-y-4">
          <div className="rounded-xl bg-blue-50/60 border border-blue-100 px-4 py-3 text-sm">
            <p className="font-bold text-[#202224]">{item.nama_pemda}</p>
            <p className="text-[#797A7C] mt-0.5">{item.aplikasi} · {item.menu}</p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-[#202224]">Programmer*</Label>
            <select
              className="w-full border rounded-lg bg-[#F5F6FA] border-[#D5D5D5] px-4 py-2.5 text-sm focus:ring-[#4880FF] focus:border-[#4880FF] outline-none"
              value=""
              onChange={(e) => { if (e.target.value) handleToggle(e.target.value) }}
            >
              <option value="">Tambah programmer...</option>
              {unselectedUsers.map((u) => (
                <option key={u.id} value={u.id}>{u.full_name || u.username}</option>
              ))}
            </select>
            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {selectedUsers.map((u) => (
                  <Badge
                    key={u.id}
                    variant="secondary"
                    className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1"
                  >
                    {u.full_name || u.username}
                    <button onClick={() => handleToggle(u.id)} className="ml-0.5 hover:text-red-500 transition-colors">
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-[#202224]">Komentar (opsional)</Label>
            <Textarea
              value={komentar}
              onChange={(e) => setKomentar(e.target.value)}
              placeholder="Tambahkan catatan untuk programmer..."
              className="w-full bg-[#F5F6FA] border-[#D5D5D5] rounded-lg px-4 py-3 text-sm focus-visible:ring-[#4880FF]"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="rounded-xl border-[#D5D5D5] text-sm font-bold text-[#313131] hover:bg-gray-50">
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-xl bg-[#4880FF] text-sm font-bold text-white hover:bg-blue-600 active:scale-95 transition-all gap-2"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
