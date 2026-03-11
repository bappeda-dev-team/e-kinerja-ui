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

import type { LaporanKinerjaItem } from "../../data"

interface Props {
  open: boolean
  onClose: () => void
  onSave: (item: LaporanKinerjaItem) => void
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

  const [permintaan, setPermintaan] = useState("")

  const [selectedProgrammer, setSelectedProgrammer] =
    useState<string[]>([])

  const [progress, setProgress] = useState("")

  const [status, setStatus] = useState(0)

  const programmerOptions = useMemo(() => {

    return masterPegawai.filter(
      (p) => p.jabatan === "Programmer - Level 1"
    )

  }, [masterPegawai])

  useEffect(() => {

    if (initialData) {

      setPermintaan(initialData.permintaan)

      setProgress(initialData.progress)

      setStatus(initialData.status)

      const ids = programmerOptions
        .filter((p) =>
          initialData.programmer?.includes(p.nama_pegawai)
        )
        .map((p) => p.id)

      setSelectedProgrammer(ids)

    } else {

      setPermintaan("")
      setProgress("")
      setStatus(0)
      setSelectedProgrammer([])

    }

  }, [initialData, open, programmerOptions])

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

  const handleSubmit = () => {

    if (!permintaan) {

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

    const programmerNames = selectedProgrammer.map((id) => {

      const pegawai =
        programmerOptions.find((p) => p.id === id)

      return pegawai?.nama_pegawai || ""

    })

    const now = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ")

    const newItem: LaporanKinerjaItem = {

      id: initialData?.id ?? crypto.randomUUID(),

      permintaan,

      programmer: programmerNames.join(", "),

      progress,

      status,

      created_at: initialData?.created_at ?? now,

      updated_at: now,
    }

    onSave(newItem)

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
              value={permintaan}
              onValueChange={setPermintaan}
            >

              <SelectTrigger>
                <SelectValue placeholder="Pilih permintaan..." />
              </SelectTrigger>

              <SelectContent>

                {permintaanList.map((p) => (

                  <SelectItem
                    key={p.id}
                    value={`${p.pemda} - ${p.menu}`}
                  >
                    {p.pemda} - {p.menu}
                  </SelectItem>

                ))}

              </SelectContent>

            </Select>

            <p className="text-xs text-muted-foreground">
              Pilih permintaan pekerjaan yang akan dilaporkan progresnya
            </p>

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

                  <SelectItem
                    key={p.id}
                    value={p.id}
                  >
                    {p.nama_pegawai}
                  </SelectItem>

                ))}

              </SelectContent>

            </Select>

            <p className="text-xs text-muted-foreground">
              Pilih satu atau lebih programmer yang mengerjakan tugas ini
            </p>

          </div>

          {selectedProgrammer.length > 0 && (

            <div className="flex flex-wrap gap-2">

              {selectedProgrammer.map((id) => {

                const programmer =
                  programmerOptions.find(
                    (p) => p.id === id
                  )

                if (!programmer) return null

                return (

                  <Badge
                    key={id}
                    variant="secondary"
                    className="flex items-center gap-2"
                  >

                    {programmer.nama_pegawai}

                    <button
                      onClick={() =>
                        handleRemoveProgrammer(id)
                      }
                    >
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
              onChange={(e) =>
                setProgress(e.target.value)
              }
              placeholder="Tuliskan perkembangan pekerjaan saat ini..."
            />

            <p className="text-xs text-muted-foreground">
              Jelaskan progres pekerjaan yang sudah dilakukan
            </p>

          </div>

          {/* STATUS */}

          <div className="space-y-1">

            <Label>Status Progress</Label>

            <div className="grid grid-cols-5 gap-2 mt-2">

              {[0,25,50,75,100].map((value) => {

                const colorMap: Record<number,string> = {
                  0:"bg-gray-400",
                  25:"bg-red-500",
                  50:"bg-orange-500",
                  75:"bg-yellow-400",
                  100:"bg-green-500",
                }

                const active = status === value

                return (

                  <button
                    key={value}
                    type="button"
                    onClick={() => setStatus(value)}
                    className={`text-white text-sm rounded-md py-2 ${colorMap[value]} ${active ? "ring-2 ring-black" : ""}`}
                  >
                    {value}%
                  </button>

                )
              })}

            </div>

            <p className="text-xs text-muted-foreground">
              Pilih persentase progres penyelesaian pekerjaan
            </p>

          </div>

          <div className="flex justify-end gap-2 pt-4">

            <Button
              variant="outline"
              onClick={onClose}
            >
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