"use client"

import { useEffect, useMemo, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"

import { Badge } from "@/components/ui/badge"

import { X } from "lucide-react"

import { toast } from "sonner"

import type { LaporanKinerjaItem } from "../../_types"

interface Props {
  open: boolean
  onClose: () => void
  onSave: (item: LaporanKinerjaItem) => Promise<void>
  initialData?: LaporanKinerjaItem | null

  permintaanList: {
    id: string
    pemda: string
    menu: string
  }[]

  masterPegawai: {
    id: string
    nama_pegawai: string
    jabatan: string
  }[]
}

export default function AddLaporanKinerja({
  open,
  onClose,
  onSave,
  initialData = null,
  permintaanList,
  masterPegawai,
}: Props) {

  const [permintaanId, setPermintaanId] = useState("")
  const [selectedProgrammer, setSelectedProgrammer] = useState<string[]>([])
  const [progress, setProgress] = useState("")

  const programmerOptions = useMemo(() => {
    return masterPegawai.filter(
      (p) => p.jabatan === "Programmer - Level 1"
    )
  }, [masterPegawai])

  useEffect(() => {

    if (initialData) {

      setPermintaanId(initialData.permintaan.id)
      setProgress(initialData.laporan_progress)
      setSelectedProgrammer(
        initialData.programmer?.id ? [initialData.programmer.id] : []
      )

    } else {

      setPermintaanId("")
      setProgress("")
      setSelectedProgrammer([])

    }

  }, [initialData, open])

  const handleAddProgrammer = (id: string) => {

    if (!selectedProgrammer.includes(id)) {
      setSelectedProgrammer((prev) => [...prev, id])
    }

  }

  const handleRemoveProgrammer = (id: string) => {

    setSelectedProgrammer((prev) =>
      prev.filter((p) => p !== id)
    )

  }

  const handleSubmit = async () => {

    if (!permintaanId) {
      toast.error("Silakan pilih permintaan terlebih dahulu")
      return
    }

    if (selectedProgrammer.length === 0) {
      toast.error("Minimal pilih satu programmer")
      return
    }

    if (!progress) {
      toast.error("Progress pekerjaan belum diisi")
      return
    }

    const now = new Date().toISOString()

    const selectedPermintaan = permintaanList.find(p => p.id === permintaanId)
    const selectedProgrammerData = masterPegawai.find(p => p.id === selectedProgrammer[0])

    const newItem: LaporanKinerjaItem = {

      id: initialData?.id ?? crypto.randomUUID(),

      permintaan: {
        id: permintaanId,
        pemda: selectedPermintaan?.pemda ?? "",
        aplikasi: selectedPermintaan?.menu ?? "",
        menu: selectedPermintaan?.menu ?? "",
      },

      programmer: {
        id: selectedProgrammer[0] ?? "",
        username: selectedProgrammerData?.nama_pegawai ?? "",
        full_name: selectedProgrammerData?.nama_pegawai ?? "",
      },

      laporan_progress: progress,

      created_at: initialData?.created_at ?? now,

    }

    await onSave(newItem)

    toast.success(
      initialData
        ? "Laporan berhasil diperbarui"
        : "Laporan berhasil ditambahkan"
    )

    onClose()

  }

  return (

    <Dialog open={open} onOpenChange={onClose}>

      <DialogContent className="sm:max-w-lg">

        <DialogHeader>

          <DialogTitle>
            {initialData
              ? "Edit Laporan Kinerja"
              : "Tambah Laporan Kinerja"}
          </DialogTitle>

        </DialogHeader>

        <div className="space-y-4">

          {/* PERMINTAAN */}

          <div className="space-y-1">

            <Label>Permintaan</Label>

            <Select
              value={permintaanId}
              onValueChange={setPermintaanId}
            >

              <SelectTrigger>
                <SelectValue placeholder="Pilih permintaan..." />
              </SelectTrigger>

              <SelectContent>

                {permintaanList.map((p) => (

                  <SelectItem key={p.id} value={p.id}>
                    {p.pemda} - {p.menu}
                  </SelectItem>

                ))}

              </SelectContent>

            </Select>

          </div>

          {/* PROGRAMMER */}

          <div className="space-y-1">

            <Label>Programmer</Label>

            <Select onValueChange={handleAddProgrammer}>

              <SelectTrigger>
                <SelectValue placeholder="Pilih programmer..." />
              </SelectTrigger>

              <SelectContent>

                {programmerOptions.map((p) => (

                  <SelectItem key={p.id} value={p.id}>
                    {p.nama_pegawai}
                  </SelectItem>

                ))}

              </SelectContent>

            </Select>

          </div>

          {selectedProgrammer.length > 0 && (

            <div className="flex flex-wrap gap-2">

              {selectedProgrammer.map((id) => {

                const programmer =
                  programmerOptions.find((p) => p.id === id)

                if (!programmer) return null

                return (

                  <Badge
                    key={id}
                    variant="secondary"
                    className="flex items-center gap-2"
                  >

                    {programmer.nama_pegawai}

                    <button onClick={() => handleRemoveProgrammer(id)}>
                      <X size={14} />
                    </button>

                  </Badge>

                )
              })}

            </div>

          )}

          {/* PROGRESS */}

          <div className="space-y-1">

            <Label>Progress</Label>

            <Textarea
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              placeholder="Tuliskan perkembangan pekerjaan saat ini..."
            />

          </div>

          <div className="flex justify-end gap-2 pt-4">

            <Button variant="outline" onClick={onClose}>
              Batal
            </Button>

            <Button onClick={handleSubmit}>
              Simpan
            </Button>

          </div>

        </div>

      </DialogContent>

    </Dialog>

  )
}