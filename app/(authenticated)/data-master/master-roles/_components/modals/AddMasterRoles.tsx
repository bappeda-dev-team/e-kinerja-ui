"use client"

import { useState } from "react"
import { X, Plus } from "lucide-react"

interface Props {
  onClose: () => void
  onSave: (data: { name: string; description: string; color: string }) => void
  initialData?: { name: string; description: string; color: string }
}

export default function AddMasterRoles({ onClose, onSave, initialData }: Props) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    color: initialData?.color || "#FFBB38", // Default warna kuning
  })

  const presetColors = ["#00B69B", "#FFBB38", "#FF4D4D", "#8884FF", "#4880FF"]

  const handleSave = () => {
    if (!formData.name.trim() || !formData.description.trim()) return
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[500px] rounded-2xl bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-bold text-[#202224]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            {initialData ? "Edit Role" : "Tambah Role Baru"}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="px-8 py-6 space-y-6">
          
          {/* Section Preview Role */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Preview Tampilan</p>
            <div className="flex justify-center">
              <div className="w-[220px] rounded-2xl border border-gray-100 bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col items-center pb-5">
                <div 
                  className="h-[70px] w-full mb-3 transition-colors duration-500 ease-in-out" 
                  style={{ backgroundColor: formData.color }} 
                />
                <p className="text-sm font-bold text-[#202224] truncate px-3 w-full text-center">
                  {formData.name || "Nama Role"}
                </p>
                <p className="text-[11px] text-gray-400 truncate px-3 w-full text-center">
                  {formData.description || "Deskripsi singkat role..."}
                </p>
              </div>
            </div>
          </div>

          {/* Form Inputs */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#202224]">Nama Role*</label>
              <input
                type="text"
                placeholder="Contoh: Administrator"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-[#F5F6FA] px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#4880FF]/20 focus:border-[#4880FF] focus:outline-none transition-all"
              />
              <p className="text-[10px] text-gray-400">*Wajib diisi agar role mudah diidentifikasi</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#202224]">Deskripsi Role*</label>
              <input
                type="text"
                placeholder="Jelaskan wewenang role ini"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-[#F5F6FA] px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#4880FF]/20 focus:border-[#4880FF] focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Warna Role Selection */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-[#202224]">Warna Identitas*</label>
            <div className="flex items-center gap-3 flex-wrap">
              {presetColors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: c })}
                  className={`h-9 w-9 rounded-full transition-all duration-200 ${
                    formData.color === c 
                      ? 'ring-4 ring-[#4880FF]/30 scale-110 shadow-sm' 
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
              
              {/* Custom Color Picker */}
              <div className="relative h-9 w-9 flex items-center justify-center rounded-full bg-gray-100 border-2 border-dashed border-gray-300 text-gray-500 hover:bg-gray-200 hover:border-gray-400 transition-all cursor-pointer group">
                <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
                <input 
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  title="Pilih warna kustom"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-8 py-2.5 text-sm font-bold text-[#202224] hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={!formData.name.trim() || !formData.description.trim()}
              className="rounded-xl bg-[#4880FF] px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-600 disabled:bg-gray-300 disabled:shadow-none transition-all active:scale-95"
            >
              Simpan Role
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}