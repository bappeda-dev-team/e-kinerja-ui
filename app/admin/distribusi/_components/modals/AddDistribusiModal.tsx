"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { X, Loader2 } from "lucide-react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { getPermintaan, getUsers } from "@/services/distribusi.service"
import type { PermintaanResponse, UserResponse } from "@/app/super-admin/distribusi/types"

interface Props {
  onClose: () => void
  onSave: (val: { permintaan_id: string; komentar: string; programmer_ids: string[] }) => void
  loading?: boolean
}

export default function AddDistribusiModal({ onClose, onSave, loading }: Props) {
  const [permintaans, setPermintaans] = useState<PermintaanResponse[]>([])
  const [users, setUsers] = useState<UserResponse[]>([])
  const [fetching, setFetching] = useState(true)

  const [selectedPermintaan, setSelectedPermintaan] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [komentar, setKomentar] = useState("")

  useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      try {
        const [permRes, usersRes] = await Promise.all([getPermintaan(), getUsers()])
        if (mounted) {
          setPermintaans(permRes.data?.data ?? [])
          setUsers((usersRes.data?.data ?? []).filter((u: UserResponse) => u.is_active))
        }
      } catch {
        toast.error("Gagal memuat data")
      } finally {
        if (mounted) setFetching(false)
      }
    }
    fetchData()
    return () => { mounted = false }
  }, [])

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleSubmit = () => {
    if (!selectedPermintaan) {
      toast.error("Pilih permintaan terlebih dahulu")
      return
    }
    if (selectedIds.length === 0) {
      toast.error("Pilih minimal satu programmer")
      return
    }
    onSave({ permintaan_id: selectedPermintaan, komentar: komentar.trim(), programmer_ids: selectedIds })
  }

  const selectedUsers = users.filter((u) => selectedIds.includes(u.id))
  const unselectedUsers = users.filter((u) => !selectedIds.includes(u.id))

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white p-0 overflow-hidden border-[#B9B9B9] rounded-2xl">
        <DialogHeader className="px-6 py-4 border-b border-[#E0E0E0]">
          <DialogTitle className="text-xl font-bold text-[#202224]">Tambah Distribusi Pekerjaan</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-[#202224]">Pilih Permintaan*</Label>
            {fetching ? (
              <div className="w-full flex items-center gap-2 border rounded-md px-3 py-2 text-sm text-gray-500 bg-gray-50">
                <Loader2 className="size-4 animate-spin" /> Memuat...
              </div>
            ) : (
              <select
                className="w-full border rounded-lg bg-[#F5F6FA] border-[#D5D5D5] px-4 py-2.5 text-sm focus:ring-[#4880FF] focus:border-[#4880FF] outline-none"
                value={selectedPermintaan}
                onChange={(e) => setSelectedPermintaan(e.target.value)}
              >
                <option value="">Pilih permintaan...</option>
                {permintaans.map((p) => {
                  const pemdaName = typeof p.pemda === "object" ? p.pemda?.name : p.pemda || "Pemda"
                  const aplikasiName = typeof p.aplikasi === "object" ? p.aplikasi?.name : p.aplikasi || "Aplikasi"
                  return (
                    <option key={p.id} value={p.id}>
                      {pemdaName} — {aplikasiName} ({p.menu})
                    </option>
                  )
                })}
              </select>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-[#202224]">Programmer*</Label>
            {fetching ? (
              <div className="w-full flex items-center gap-2 border rounded-md px-3 py-2 text-sm text-gray-500 bg-gray-50">
                <Loader2 className="size-4 animate-spin" /> Memuat...
              </div>
            ) : (
              <>
                <select
                  className="w-full border rounded-lg bg-[#F5F6FA] border-[#D5D5D5] px-4 py-2.5 text-sm focus:ring-[#4880FF] focus:border-[#4880FF] outline-none"
                  value=""
                  onChange={(e) => { if (e.target.value) handleToggle(e.target.value) }}
                >
                  <option value="">Pilih programmer...</option>
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
              </>
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
            disabled={loading || fetching}
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
