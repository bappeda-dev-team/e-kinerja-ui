'use client'

import { useState, useRef } from "react"
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

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { name: string; logo?: File }) => void
}

export default function AddMasterPemda({ open, onOpenChange, onSubmit }: Props) {
  const [nama, setNama] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file)) // Buat preview lokal
    }
  }

  const clearFile = () => {
    setSelectedFile(undefined)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = () => {
    if (!nama.trim()) {
      toast.error("Nama Pemda wajib diisi!")
      return
    }
    onSubmit({ name: nama, logo: selectedFile })
    
    // Reset state
    setNama("")
    clearFile()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Pemda</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Section Upload Logo */}
          <div className="flex flex-col items-center gap-4">
            <Label className="uppercase text-xs font-bold self-start">Logo Pemda :</Label>
            <div className="relative group">
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
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
              {previewUrl && (
                <button
                  onClick={clearFile}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Section Nama */}
          <div className="space-y-2">
            <Label className="uppercase text-xs font-bold">Nama Pemda :</Label>
            <Input
              placeholder="Masukkan nama pemda"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
            <p className="text-[10px] text-muted-foreground italic">*Wajib diisi</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button onClick={handleSubmit}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}