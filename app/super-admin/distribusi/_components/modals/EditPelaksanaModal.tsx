"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Loader2, X } from "lucide-react"
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import type { DistribusiItem } from "../DistribusiClient"
import type { UserResponse } from "../../types"

interface Props {
  item: DistribusiItem
  users: UserResponse[]
  onClose: () => void
  onSave: (id: string, val: { komentar: string; pelaksana: string[]; deadline?: string }) => void
  loading?: boolean
}

export default function EditPelaksanaModal({ item, users, onClose, onSave, loading }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>(item.programmer.map((programmer) => programmer.id))
  const [komentar, setKomentar] = useState(item.komentar ?? "")
  const [deadline, setDeadline] = useState(item.deadline ?? "")

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]
    )
  }

  const handleSubmit = () => {
    if (selectedIds.length === 0) {
      toast.error("Pilih minimal satu programmer")
      return
    }

    onSave(item.id, { komentar: komentar.trim(), pelaksana: selectedIds, deadline: deadline || undefined })
  }

  const selectedUsers = users.filter((user) => selectedIds.includes(user.id))
  const availableUsers = users.filter((user) => !selectedIds.includes(user.id))

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white p-0 overflow-hidden border-[#B9B9B9] rounded-2xl">
        <DialogHeader className="px-6 py-4 border-b border-[#E0E0E0]">
          <DialogTitle className="text-xl font-bold text-[#202224]">Edit Programmer</DialogTitle>
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
              onChange={(event) => {
                if (event.target.value) handleToggle(event.target.value)
              }}
              disabled={loading}
            >
              <option value="">Tambah programmer...</option>
              {availableUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.full_name || user.username}
                </option>
              ))}
            </select>

            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {selectedUsers.map((user) => (
                  <Badge
                    key={user.id}
                    variant="secondary"
                    className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1"
                  >
                    {user.full_name || user.username}
                    <button
                      type="button"
                      onClick={() => handleToggle(user.id)}
                      disabled={loading}
                      className="ml-0.5 hover:text-red-500 transition-colors"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-[#202224]">Deadline (opsional)</Label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full border rounded-lg bg-[#F5F6FA] border-[#D5D5D5] px-4 py-2.5 text-sm focus:ring-[#4880FF] focus:border-[#4880FF] outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-[#202224]">Komentar (opsional)</Label>
            <Textarea
              value={komentar}
              onChange={(event) => setKomentar(event.target.value)}
              placeholder="Tambahkan catatan untuk programmer..."
              className="w-full bg-[#F5F6FA] border-[#D5D5D5] rounded-lg px-4 py-3 text-sm focus-visible:ring-[#4880FF]"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-xl border-[#D5D5D5] text-sm font-bold text-[#313131] hover:bg-gray-50"
          >
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
