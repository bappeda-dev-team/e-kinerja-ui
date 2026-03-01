"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import type { PermintaanItem } from "../PermintaanClient"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Calendar } from "@/components/ui/calendar"

interface Props {
  initialData?: PermintaanItem
  onClose: () => void
  onSave: (val: PermintaanItem) => void
}

export default function AddPermintaan({
  initialData,
  onClose,
  onSave,
}: Props) {

  const [form, setForm] = useState({
    pemda: initialData?.pemda || "",
    nama_aplikasi: initialData?.nama_aplikasi || "",
    menu: initialData?.menu || "",
    kondisi_awal: initialData?.kondisi_awal || "",
    kondisi_diharapkan: initialData?.kondisi_diharapkan || "",
  })

  const [tanggalPesanan, setTanggalPesanan] = useState<Date | undefined>(
    initialData?.tanggal_pesanan
      ? new Date(initialData.tanggal_pesanan)
      : undefined
  )

  const [tanggalDeadline, setTanggalDeadline] = useState<Date | undefined>(
    initialData?.tanggal_deadline
      ? new Date(initialData.tanggal_deadline)
      : undefined
  )

  const [jamDeadline, setJamDeadline] = useState(
    initialData?.jam_deadline || ""
  )

  const [attachments, setAttachments] = useState<File[]>(
    initialData?.attachments || []
  )

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files
    if (!files) return
    setAttachments(prev => [...prev, ...Array.from(files)])
  }

  const handleSubmit = () => {
    onSave({
      id: initialData?.id || crypto.randomUUID(),
      ...form,
      tanggal_pesanan: tanggalPesanan
        ? format(tanggalPesanan, "yyyy-MM-dd")
        : "",
      jam_pesanan: "", // dihapus
      tanggal_deadline: tanggalDeadline
        ? format(tanggalDeadline, "yyyy-MM-dd")
        : "",
      jam_deadline: jamDeadline,
      attachments,
    })
  }

  const FieldNote = () => (
    <p className="text-[11px] text-muted-foreground">
      * Wajib diisi
    </p>
  )

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">

        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Permintaan" : "Tambah Permintaan"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">

          {/* PEMDA */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Pemda</label>
            <Input
              className="h-9"
              value={form.pemda}
              onChange={e =>
                setForm({ ...form, pemda: e.target.value })
              }
            />
            <FieldNote />
          </div>

          {/* NAMA APLIKASI */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Nama Aplikasi</label>
            <Input
              className="h-9"
              value={form.nama_aplikasi}
              onChange={e =>
                setForm({ ...form, nama_aplikasi: e.target.value })
              }
            />
            <FieldNote />
          </div>

          {/* MENU */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Menu</label>
            <Input
              className="h-9"
              value={form.menu}
              onChange={e =>
                setForm({ ...form, menu: e.target.value })
              }
            />
            <FieldNote />
          </div>

          {/* KONDISI AWAL */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Kondisi Awal</label>
            <Textarea
              className="min-h-[70px]"
              value={form.kondisi_awal}
              onChange={e =>
                setForm({ ...form, kondisi_awal: e.target.value })
              }
            />
            <FieldNote />
          </div>

          {/* KONDISI DIHARAPKAN */}
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Kondisi yang Diharapkan
            </label>
            <Textarea
              className="min-h-[70px]"
              value={form.kondisi_diharapkan}
              onChange={e =>
                setForm({
                  ...form,
                  kondisi_diharapkan: e.target.value,
                })
              }
            />
            <FieldNote />
          </div>

          {/* TANGGAL PESANAN */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Tanggal Pesanan</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-9 justify-start text-left font-normal",
                    !tanggalPesanan && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {tanggalPesanan
                    ? format(tanggalPesanan, "PPP")
                    : "Pilih tanggal"}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={tanggalPesanan}
                  onSelect={setTanggalPesanan}
                />
              </PopoverContent>
            </Popover>
            <FieldNote />
          </div>

          {/* TANGGAL DEADLINE */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Tanggal Deadline</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-9 justify-start text-left font-normal",
                    !tanggalDeadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {tanggalDeadline
                    ? format(tanggalDeadline, "PPP")
                    : "Pilih tanggal"}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={tanggalDeadline}
                  onSelect={setTanggalDeadline}
                />
              </PopoverContent>
            </Popover>
            <FieldNote />
          </div>

          {/* JAM DEADLINE */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Jam Deadline</label>
            <Input
              className="h-9"
              type="time"
              value={jamDeadline}
              onChange={e => setJamDeadline(e.target.value)}
            />
            <FieldNote />
          </div>

          {/* ATTACHMENT */}
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Attachment (Opsional)
            </label>
            <Input
              type="file"
              multiple
              onChange={handleFileChange}
            />
          </div>

        </div>

        <DialogFooter className="pt-4">
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