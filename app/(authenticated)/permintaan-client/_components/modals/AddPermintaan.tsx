"use client"

import React, { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { getMasterPemda } from "../../../data-master/master-pemda/_services"
import { getMasterAplikasi } from "../../../data-master/master-aplikasi/_services"
import type { MasterPemda } from "../../../data-master/master-pemda/_types"
import type { MasterAplikasi } from "../../../data-master/master-aplikasi/_types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import type { PermintaanResponse, PermintaanRequest } from "../../_types"

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
import { Label } from "@/components/ui/label"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Calendar } from "@/components/ui/calendar"

interface Props {
  initialData?: PermintaanResponse
  onClose: () => void
  onSave: (val: PermintaanRequest, id?: string) => void
}

export default function AddPermintaan({
  initialData,
  onClose,
  onSave,
}: Props) {

  const [form, setForm] = useState({
    pemda_id: initialData?.pemda?.id || "",
    aplikasi_id: initialData?.aplikasi?.id || "",
    menu: initialData?.menu || "",
    kondisi_awal: initialData?.kondisi_awal || "",
    kondisi_diharapkan: initialData?.kondisi_diharapkan || "",
  })

  const [pemdas, setPemdas] = useState<MasterPemda[]>([])
  const [aplikasis, setAplikasis] = useState<MasterAplikasi[]>([])

  useEffect(() => {
    getMasterPemda().then((res: any) => setPemdas(res.data?.data || []))
    getMasterAplikasi().then((res: any) => setAplikasis(res.data?.data || []))
  }, [])

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

  const FieldNote = ({ label }: { label: string }) => (
    <p className="text-xs text-muted-foreground mt-1">
      * {label} harus diisi
    </p>
  )

  const handleSubmit = () => {

    if (!form.pemda_id) return toast.error("Pemda harus dipilih")
    if (!form.aplikasi_id) return toast.error("Aplikasi harus dipilih")
    if (!form.menu) return toast.error("Menu harus diisi")
    if (!form.kondisi_awal) return toast.error("Kondisi awal harus diisi")
    if (!form.kondisi_diharapkan) return toast.error("Kondisi yang diharapkan harus diisi")
    if (!tanggalPesanan) return toast.error("Tanggal pesanan harus diisi")
    if (!tanggalDeadline) return toast.error("Deadline harus diisi")

    onSave({
      ...form,
      tanggal_pesanan: format(tanggalPesanan, "yyyy-MM-dd"),
      tanggal_deadline: format(tanggalDeadline, "yyyy-MM-dd"),
    }, initialData?.id)

  }

  return (

    <Dialog open onOpenChange={onClose}>

      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">

        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Permintaan" : "Tambah Permintaan"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">

          {/* PEMDA */}
          <div>
            <Label className="uppercase text-xs font-semibold">Pemda :</Label>
            <div className="mt-2">
              <Select value={form.pemda_id} onValueChange={(val) => setForm({ ...form, pemda_id: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Pemda" />
                </SelectTrigger>
                <SelectContent>
                  {pemdas.map(p => (
                    <SelectItem key={p.id} value={p.id!}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <FieldNote label="Pemda" />
          </div>

          {/* APLIKASI */}
          <div>
            <Label className="uppercase text-xs font-semibold">Aplikasi :</Label>
            <div className="mt-2">
              <Select value={form.aplikasi_id} onValueChange={(val) => setForm({ ...form, aplikasi_id: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Aplikasi" />
                </SelectTrigger>
                <SelectContent>
                  {aplikasis.map(a => (
                    <SelectItem key={a.id} value={a.id!}>{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <FieldNote label="Aplikasi" />
          </div>

          {/* MENU */}
          <div>
            <Label className="uppercase text-xs font-semibold">Menu :</Label>
            <div className="mt-2">
              <Input
                value={form.menu}
                onChange={e =>
                  setForm({ ...form, menu: e.target.value })
                }
              />
            </div>
            <FieldNote label="Menu" />
          </div>

          {/* KONDISI AWAL */}
          <div>
            <Label className="uppercase text-xs font-semibold">Kondisi Awal :</Label>
            <div className="mt-2">
              <Textarea
                value={form.kondisi_awal}
                onChange={e =>
                  setForm({
                    ...form,
                    kondisi_awal: e.target.value,
                  })
                }
              />
            </div>
            <FieldNote label="Kondisi awal" />
          </div>

          {/* KONDISI DIHARAPKAN */}
          <div>
            <Label className="uppercase text-xs font-semibold">Kondisi Diharapkan :</Label>
            <div className="mt-2">
              <Textarea
                value={form.kondisi_diharapkan}
                onChange={e =>
                  setForm({
                    ...form,
                    kondisi_diharapkan: e.target.value,
                  })
                }
              />
            </div>
            <FieldNote label="Kondisi yang diharapkan" />
          </div>

          {/* TANGGAL PESANAN */}
          <div>
            <Label className="uppercase text-xs font-semibold">Tanggal Pesanan :</Label>

            <div className="mt-2">

              <Popover>
                <PopoverTrigger asChild>

                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
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

            </div>

            <FieldNote label="Tanggal pesanan" />

          </div>

          {/* DEADLINE */}
          <div>
            <Label className="uppercase text-xs font-semibold">Deadline :</Label>

            <div className="mt-2">

              <Popover>
                <PopoverTrigger asChild>

                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
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

            </div>

            <FieldNote label="Deadline" />


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