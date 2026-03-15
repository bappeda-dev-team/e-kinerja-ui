'use client'

import { useEffect, useState, useRef } from "react"
import { toast } from "sonner"
import { Camera, Image as ImageIcon, X } from "lucide-react"

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
  }, [idPemda, data])

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

    // Kirim data gabungan
    onSubmit({
      id: idPemda!,
      name: nama,
      logoFile: selectedFile, // Kirim file jika ada perubahan
      existingLogo: existingLogo,
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Pemda</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Upload Logo Section */}
          <div className="flex flex-col items-center gap-4">
            <Label className="uppercase text-xs font-bold self-start">Logo Pemda :</Label>
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-2 border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <img src={previewUrl} alt="New Preview" className="w-full h-full object-cover" />
                ) : existingLogo ? (
                  <img src={existingLogo} alt="Current Logo" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-300" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-lg hover:scale-110 transition"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            {(previewUrl || existingLogo) && (
              <p className="text-[10px] text-muted-foreground italic">Klik ikon kamera untuk mengganti logo</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="uppercase text-xs font-bold">Nama Pemda :</Label>
            <Input
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button onClick={handleSubmit}>Simpan Perubahan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}