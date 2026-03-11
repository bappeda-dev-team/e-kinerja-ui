"use client"

import { useState } from "react"
import { toast } from "sonner"
import { X } from "lucide-react"

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
import { Badge } from "@/components/ui/badge"

import type { PermintaanItem } from "../DistribusiClient"

const PROGRAMMER_OPTIONS = ["Ilham", "Daniel", "Maura", "Zul", "Myko", "Agnar", "Reza", "Dimas"]

interface Props {
  item: PermintaanItem
  onClose: () => void
  onSave: (val: {
    admin: string
    programmer: string[]
    deadline: string
  }) => void
}

export default function AssignDistribusiModal({ item, onClose, onSave }: Props) {

  const [admin, setAdmin] = useState("Ilham")
  const [deadline, setDeadline] = useState(item.deadline)
  const [programmer, setProgrammer] = useState<string[]>([])
  const [progInput, setProgInput] = useState("")

  const handleAddProg = (name: string) => {
    if (name && !programmer.includes(name)) {
      setProgrammer(prev => [...prev, name])
    }
    setProgInput("")
  }

  const handleSubmit = () => {
    if (!admin.trim()) {
      toast.error("Admin harus diisi")
      return
    }
    if (programmer.length === 0) {
      toast.error("Programmer belum dipilih")
      return
    }
    onSave({ admin, programmer, deadline })
  }

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
            <Label>Admin</Label>
            <Input
              value={admin}
              onChange={(e) => setAdmin(e.target.value)}
              placeholder="Nama admin"
            />
          </div>

          <div className="space-y-1">
            <Label>Programmer</Label>
            <div className="flex gap-2">
              <select
                className="flex-1 border rounded-md px-3 py-2 text-sm"
                value={progInput}
                onChange={(e) => setProgInput(e.target.value)}
              >
                <option value="">Pilih programmer...</option>
                {PROGRAMMER_OPTIONS.filter(p => !programmer.includes(p)).map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleAddProg(progInput)}
              >
                Tambah
              </Button>
            </div>
            {programmer.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {programmer.map(p => (
                  <Badge key={p} variant="secondary" className="flex items-center gap-1">
                    {p}
                    <button onClick={() => setProgrammer(prev => prev.filter(x => x !== p))}>
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <Label>Deadline</Label>
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
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
