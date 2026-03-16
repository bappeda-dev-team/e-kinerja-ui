'use client'

import { useEffect, useState, useRef } from "react"
import { toast } from "sonner"
import { Camera } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import type { MasterPemdaItem } from "../MasterPemdaClient"

interface Props {
  open: boolean
  idPemda: string | null
  data: MasterPemdaItem[]
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

export default function EditMasterPemda({ open, idPemda, data, onOpenChange, onSubmit }: Props) {
  const [nama, setNama] = useState("")
  const [existingLogo, setExistingLogo] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!idPemda) return
    const selected = data.find(item => item.id === idPemda)
    if (selected) {
      setNama(selected.name)
      setExistingLogo(selected.logo || null)
      setPreviewUrl(null)
      setSelectedFile(undefined)
    }
  }, [idPemda, data, open])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = () => {
    if (!nama.trim()) {
      toast.error("Nama Pemda wajib diisi!")
      return
    }
    onSubmit({ id: idPemda!, name: nama, logoFile: selectedFile })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[890px] p-0 overflow-hidden border-[#B9B9B9] rounded-2xl">
        <DialogHeader className="px-10 pt-8 pb-6 border-b border-[#E0E0E0]">
          <DialogTitle className="text-[32px] font-bold text-[#202224] font-nunito">
            Edit Pemda
          </DialogTitle>
        </DialogHeader>

        <div className="px-10 py-8 space-y-8 font-nunito">
          <div className="flex gap-12">
            {/* PREVIEW CARD */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-[#606060]">Preview Pemda</Label>
              <div className="w-[205px] h-[189px] bg-white rounded-3xl border-[0.3px] border-[#B9B9B9] shadow-[6px_6px_54px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center p-4 relative overflow-hidden">
                 <div className="w-[64px] h-[64px] bg-[#ECECEE] rounded-full flex items-center justify-center mb-3 overflow-hidden z-10">
                    {(previewUrl || existingLogo) ? (
                      <img src={previewUrl || existingLogo!} className="w-full h-full object-contain p-1" alt="Logo" />
                    ) : (
                      <span className="text-[#202224]/60 text-xs font-semibold">Logo</span>
                    )}
                 </div>
                 <p className="text-base font-bold text-[#202224] text-center line-clamp-1 z-10">
                    {nama || "Nama Pemda"}
                 </p>
                 <p className="text-sm font-semibold text-[#202224]/60 mt-1 z-10">
                    Data Master
                 </p>
              </div>
            </div>

            {/* UPLOAD BOX */}
            <div className="flex flex-col items-center justify-center gap-3 self-center pt-8">
              <button onClick={() => fileInputRef.current?.click()} className="w-20 h-20 bg-[#ECECEE] rounded-full flex items-center justify-center hover:bg-[#E2E2E4] transition group">
                <Camera className="w-8 h-8 text-[#202224]/70 group-hover:scale-110 transition" />
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="text-sm font-semibold text-[#4379EE] tracking-[0.54px] hover:underline">
                Ubah Foto
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>
          </div>

          <div className="space-y-2 max-w-[780px]">
            <Label className="text-sm font-semibold text-[#606060]">Nama Pemda*</Label>
            <Input
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="h-[52px] bg-[#F5F6FA] border-[#D5D5D5] rounded-md px-4 focus-visible:ring-[#4880FF]"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-[108px] h-[45px] rounded-[12px] border-[#D5D5D5] text-lg font-bold text-[#313131]">
              Batal
            </Button>
            <Button onClick={handleSubmit} className="w-[108px] h-[45px] rounded-[12px] bg-[#4880FF] hover:bg-[#4880FF]/90 text-lg font-bold text-white opacity-90">
              Simpan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}