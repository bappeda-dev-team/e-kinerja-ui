"use client"

import React, { useState, useEffect, useRef } from "react"
import { format } from "date-fns"
import { CalendarIcon, UploadCloud, X, FileText, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

import { getMasterPemda } from "../../../data-master/master-pemda/_services"
import { getMasterAplikasi } from "../../../data-master/master-aplikasi/_services"
import type { MasterPemda } from "../../../data-master/master-pemda/_types"
import type { MasterAplikasi } from "../../../data-master/master-aplikasi/_types"
import type { PermintaanResponse, PermintaanRequest } from "../../_types"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

interface Props {
  initialData?: PermintaanResponse
  onClose: () => void
  onSave: (val: PermintaanRequest, files: File[], id?: string) => void
}

export default function AddPermintaan({ initialData, onClose, onSave }: Props) {
  const [form, setForm] = useState({
    pemda_id: initialData?.pemda?.id || "",
    aplikasi_id: initialData?.aplikasi?.id || "",
    menu: initialData?.menu || "",
    kondisi_awal: initialData?.kondisi_awal || "",
    kondisi_diharapkan: initialData?.kondisi_diharapkan || "",
  })

  const [pemdas, setPemdas] = useState<MasterPemda[]>([])
  const [aplikasis, setAplikasis] = useState<MasterAplikasi[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [tanggalPesanan, setTanggalPesanan] = useState<Date | undefined>(
    initialData?.tanggal_pesanan ? new Date(initialData.tanggal_pesanan) : undefined
  )
  const [tanggalDeadline, setTanggalDeadline] = useState<Date | undefined>(
    initialData?.tanggal_deadline ? new Date(initialData.tanggal_deadline) : undefined
  )

  useEffect(() => {
    getMasterPemda().then((res: any) => setPemdas(res.data?.data || []))
    getMasterAplikasi().then((res: any) => setAplikasis(res.data?.data || []))
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles((prev) => [...prev, ...files])
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (!form.pemda_id || !form.aplikasi_id || !form.menu || !tanggalPesanan || !tanggalDeadline) {
      return toast.error("Mohon lengkapi data yang berbintang (*)")
    }

    const cleanPayload: PermintaanRequest = {
      pemda_id: form.pemda_id,
      aplikasi_id: form.aplikasi_id,
      menu: form.menu,
      kondisi_awal: form.kondisi_awal,
      kondisi_diharapkan: form.kondisi_diharapkan,
      tanggal_pesanan: format(tanggalPesanan, "yyyy-MM-dd"),
      tanggal_deadline: format(tanggalDeadline, "yyyy-MM-dd"),
    }

    onSave(cleanPayload, selectedFiles, initialData?.id)
  }

  const fixedHeightClass = "bg-[#F5F6FA] border-[#D5D5D5] h-[52px] w-full rounded-[4px] px-4 flex items-center focus:ring-0"

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[950px] p-0 border-none max-h-[95vh] flex flex-col overflow-hidden font-nunito">
        <DialogHeader className="px-10 py-6 border-b shrink-0">
          <DialogTitle className="text-[32px] font-bold text-[#202224]">
            {initialData ? "Edit Permintaan" : "Tambah Permintaan"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-10 py-8">
          <div className="grid grid-cols-2 gap-x-12 gap-y-6">
            <div className="space-y-2">
              <Label className="text-[#606060] font-semibold">Pemda*</Label>
              <Select value={form.pemda_id} onValueChange={(val) => setForm({ ...form, pemda_id: val })}>
                <SelectTrigger className={fixedHeightClass}><SelectValue placeholder="Pilih pemda" /></SelectTrigger>
                <SelectContent>{pemdas.map((p) => (<SelectItem key={p.id} value={p.id!}>{p.name}</SelectItem>))}</SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[#606060] font-semibold">Kondisi Harapan*</Label>
              <Input className={fixedHeightClass} placeholder="Kondisi harapan" value={form.kondisi_diharapkan} onChange={(e) => setForm({...form, kondisi_diharapkan: e.target.value})} />
            </div>

            <div className="space-y-2">
              <Label className="text-[#606060] font-semibold">Aplikasi*</Label>
              <Select value={form.aplikasi_id} onValueChange={(val) => setForm({ ...form, aplikasi_id: val })}>
                <SelectTrigger className={fixedHeightClass}><SelectValue placeholder="Pilih aplikasi" /></SelectTrigger>
                <SelectContent>{aplikasis.map((a) => (<SelectItem key={a.id} value={a.id!}>{a.name}</SelectItem>))}</SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[#606060] font-semibold">Tanggal Pesanan*</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn(fixedHeightClass, "justify-start font-normal gap-3")}>
                    <CalendarIcon className="h-5 w-5 text-[#637381]" />
                    {tanggalPesanan ? format(tanggalPesanan, "PPP") : "Pilih Tanggal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={tanggalPesanan} onSelect={setTanggalPesanan} /></PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-[#606060] font-semibold">Menu*</Label>
              <Input className={fixedHeightClass} placeholder="Menu" value={form.menu} onChange={(e) => setForm({...form, menu: e.target.value})} />
            </div>

            <div className="space-y-2">
              <Label className="text-[#606060] font-semibold">Deadline*</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn(fixedHeightClass, "justify-start font-normal gap-3")}>
                    <CalendarIcon className="h-5 w-5 text-[#637381]" />
                    {tanggalDeadline ? format(tanggalDeadline, "PPP") : "Pilih Deadline"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={tanggalDeadline} onSelect={setTanggalDeadline} /></PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-[#606060] font-semibold">Kondisi Awal*</Label>
              <Input className={fixedHeightClass} placeholder="Kondisi awal" value={form.kondisi_awal} onChange={(e) => setForm({...form, kondisi_awal: e.target.value})} />
            </div>

            {/* ATTACHMENT SECTION */}
            <div className="col-span-2 space-y-3 mt-4">
              <Label className="text-[#606060] font-semibold text-sm">Lampiran</Label>
              <div 
                className="border-2 border-dashed border-[#C4CDD5] bg-[#F5F6FA] rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:bg-[#F0F2F5] transition cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileChange} />
                <div className="bg-[#DFE3E8] p-3 rounded-full"><UploadCloud size={28} className="text-[#919EAB]" /></div>
                <div className="text-center">
                  <p className="font-bold text-[#212B36]">Klik untuk unggah lampiran</p>
                  <p className="text-xs text-[#637381]">PDF, DOCX, XLSX, JPG up to 10MB</p>
                </div>
              </div>

              {/* LIST FILE */}
              <div className="grid grid-cols-2 gap-3 mt-2">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white border border-[#D5D5D5] p-3 rounded-lg shadow-sm">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded shrink-0"><FileText size={18} /></div>
                      <span className="text-xs font-semibold text-[#202224] truncate">{file.name}</span>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); removeFile(idx); }} className="text-red-500 hover:bg-red-50 p-1 rounded-full"><X size={16} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="px-10 py-6 border-t shrink-0 flex gap-4">
          <Button variant="outline" onClick={onClose} className="w-32 h-12 rounded-lg font-bold">Batal</Button>
          <Button onClick={handleSubmit} className="w-32 h-12 bg-[#5D87FF] hover:bg-blue-600 text-white rounded-lg font-bold">Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}