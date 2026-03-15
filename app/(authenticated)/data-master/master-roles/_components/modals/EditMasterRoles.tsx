'use client'

import { useState } from "react"
import { toast } from "sonner"
import { X } from "lucide-react"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"

import type { MasterRolesItem } from "../MasterRolesClient"

const PRESET_COLORS = [
  "#00B69B", "#FCBE2D", "#FD5454", "#8280FF", "#5088FF"
]

interface Props {
  data: MasterRolesItem
  onClose: () => void
  onSave: (data: MasterRolesItem) => void
}

export default function EditMasterRoles({ data, onClose, onSave }: Props) {
  const [name, setName] = useState(data.name)
  const [description, setDescription] = useState(data.description)
  
  // Inisialisasi state color dari data yang sudah ada
  // @ts-ignore
  const [color, setColor] = useState(data.color || PRESET_COLORS[0])

  const handleSubmit = () => {
    if (!name.trim() || !description.trim()) {
      toast.error("Semua field wajib diisi!")
      return
    }

    onSave({
      ...data,
      name,
      description,
      // @ts-ignore
      color, // Memasukkan warna terpilih ke payload data
      updated_at: new Date().toISOString(),
    })
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-[890px] p-0 overflow-hidden border-none rounded-2xl bg-white shadow-lg">
        <VisuallyHidden.Root>
          <DialogTitle>Edit Master Role - {data.name}</DialogTitle>
        </VisuallyHidden.Root>

        {/* Header */}
        <div className="px-8 py-6 flex justify-between items-center border-b border-[#E0E0E0]">
          <h2 className="text-[32px] font-bold text-[#202224]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            Edit Role
          </h2>
          <button onClick={onClose} className="text-[#A6A6A6] hover:text-black transition-colors">
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="p-10 space-y-10">
          {/* Real-time Preview Section */}
          <div className="space-y-4">
            <label className="text-[14px] font-semibold text-[#606060]">Preview Card</label>
            <div className="w-[282px] h-[189px] bg-white border border-[#B9B9B9]/30 rounded-3xl shadow-[6px_6px_54px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
              <div 
                className="h-[94px] w-full transition-colors duration-300 ease-in-out" 
                style={{ backgroundColor: color }} 
              />
              <div className="flex-1 flex flex-col items-center justify-center p-4">
                <span className="text-[16px] font-bold text-[#202224] text-center line-clamp-1">{name || "Nama Role"}</span>
                <span className="text-[14px] text-[#202224] opacity-60 text-center line-clamp-2">{description || "Deskripsi Role"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#606060]">Nama Role*</label>
              <input
                className="w-full h-[52px] px-4 bg-[#F5F6FA] border border-[#D5D5D5] rounded-md focus:ring-2 focus:ring-[#4880FF]/20 focus:border-[#4880FF] outline-none text-[14px] text-[#202224]"
                placeholder="Masukkan nama role"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#606060]">Deskripsi Role*</label>
              <input
                className="w-full h-[52px] px-4 bg-[#F5F6FA] border border-[#D5D5D5] rounded-md focus:ring-2 focus:ring-[#4880FF]/20 focus:border-[#4880FF] outline-none text-[14px] text-[#202224]"
                placeholder="Masukkan deskripsi role"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Color Selection Section */}
            <div className="space-y-4">
              <label className="text-[14px] font-semibold text-[#606060]">Warna Role*</label>
              <div className="flex gap-4 items-center flex-wrap">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`h-[44px] w-[44px] rounded-full transition-all ${
                      color === c 
                        ? 'ring-4 ring-offset-2 ring-[#4880FF] scale-110 shadow-md' 
                        : 'hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
                
                {/* Custom Color Picker Button */}
                <div className="relative h-[44px] w-[44px] rounded-full bg-[#D9D9D9] text-[#606060] flex items-center justify-center hover:bg-gray-300 transition-colors group">
                  <span className="text-[24px] font-light">+</span>
                  <input 
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    title="Pilih warna kustom"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-10 py-8 flex justify-end gap-4 border-t border-[#E0E0E0]/50">
          <button
            onClick={onClose}
            className="w-[108px] h-[56px] border border-[#D5D5D5] rounded-[12px] text-[18px] font-bold text-[#313131] hover:bg-gray-50 transition-all"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="w-[108px] h-[56px] bg-[#4880FF] hover:bg-[#3669e1] rounded-[12px] text-[18px] font-bold text-white transition-all shadow-md active:scale-95"
          >
            Simpan
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}