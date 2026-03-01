"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X } from "lucide-react"
import type { DistribusiItem } from "../DistribusiClient"
import type { MasterPegawaiItem } from "../DistribusiClient"

interface Props {
  data: any
  masterPegawai: MasterPegawaiItem[]
  onClose: () => void
  onSave: (val: {
    programmer: string[]
    komentar_admin: string
  }) => void
  mode?: "assign" | "edit"
}

export default function AssignDistribusiModal({
  data,
  masterPegawai,
  onClose,
  onSave,
  mode = "assign",
}: Props) {
  const [selectedProgrammer, setSelectedProgrammer] = useState<string[]>([])
  const [komentar, setKomentar] = useState("")

  // 🔥 Filter Programmer Level 1
  const programmerOptions = useMemo(() => {
    return masterPegawai.filter(
      (p) => p.jabatan === "Programmer - Level 1"
    )
  }, [masterPegawai])

  // 🔥 Prefill saat edit
  useEffect(() => {
    if (mode === "edit") {
      const ids = programmerOptions
        .filter(p => data.pelaksana?.includes(p.nama_pegawai))
        .map(p => p.id)

      setSelectedProgrammer(ids)
      setKomentar(data.komentar_admin || "")
    }
  }, [data, mode, programmerOptions])

  const handleAddProgrammer = (id: string) => {
    if (!selectedProgrammer.includes(id)) {
      setSelectedProgrammer(prev => [...prev, id])
    }
  }

  const handleRemoveProgrammer = (id: string) => {
    setSelectedProgrammer(prev =>
      prev.filter(item => item !== id)
    )
  }

  const handleSubmit = () => {
    if (selectedProgrammer.length === 0) return
    onSave({
      programmer: selectedProgrammer,
      komentar_admin: komentar,
    })
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit"
              ? "Edit Distribusi"
              : "Distribusi ke Programmer"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Pilih Programmer Level 1
            </label>

            <Select onValueChange={handleAddProgrammer}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih programmer..." />
              </SelectTrigger>
              <SelectContent>
                {programmerOptions.map(item => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.nama_pegawai}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProgrammer.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedProgrammer.map(id => {
                const programmer = programmerOptions.find(p => p.id === id)
                if (!programmer) return null

                return (
                  <div
                    key={id}
                    className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full text-sm"
                  >
                    {programmer.nama_pegawai}
                    <button
                      onClick={() => handleRemoveProgrammer(id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Komentar Admin
            </label>
            <Textarea
              value={komentar}
              onChange={(e) => setKomentar(e.target.value)}
              placeholder="Masukkan komentar..."
            />
          </div>

        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
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