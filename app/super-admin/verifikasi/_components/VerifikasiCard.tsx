"use client"

import { MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { VerifikasiItem } from "./VerifikasiClient"

export default function VerifikasiCard({ item, onVerify }: { item: VerifikasiItem, onVerify: (i: VerifikasiItem) => void }) {
  const format = (d?: string) => d ? new Date(d).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }) : "-"
  
  return (
    <div className="bg-white rounded-2xl shadow-[6px_6px_54px_rgba(0,0,0,0.05)] p-5 border border-transparent hover:border-blue-100 transition-all relative">
      <div className="flex gap-4">
        {/* ✅ Update Avatar/Logo Pemda */}
        <div className="w-[50px] h-[54px] bg-white rounded flex items-center justify-center shrink-0 border border-gray-100 overflow-hidden">
          {item.logo_pemda ? (
            <img src={item.logo_pemda} className="w-full h-full object-contain p-1" alt="logo" />
          ) : (
            <span className="font-bold text-[#00B69B]">
              {item.nama_pemda?.substring(0,2).toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0 pr-6">
          <h4 className="font-bold text-[#202224] text-base truncate leading-tight">{item.nama_pemda}</h4>
          <p className="text-xs text-gray-400 font-medium mt-0.5">{item.aplikasi} • {item.menu}</p>
          
          {item.progres_deskripsi && (
            <p className="text-[11px] text-blue-600 font-bold italic mt-2 line-clamp-2 leading-relaxed bg-blue-50/50 p-1.5 rounded">
              "{item.progres_deskripsi}"
            </p>
          )}
        </div>

        <div className="absolute top-5 right-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 hover:bg-gray-100 rounded-full transition">
                <MoreVertical className="size-4 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onVerify(item)}>Proses Verifikasi</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {item.status === "revisi" && (
          <div className="space-y-2">
            <span className="bg-[#FD5454]/10 text-[#FD5454] text-[10px] font-bold px-2 py-1 rounded-[3px] tracking-wider">Revisi</span>
            <p className="text-sm text-[#202224] font-semibold opacity-80 leading-snug">{item.komentar}</p>
          </div>
        )}

        {item.status === "terverifikasi" && (
          <div className="text-[13px] space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#FD9A56]/10 text-[#FD9A56] text-[10px] font-bold px-1.5 py-0.5 rounded">Verifikator</span>
              <span className="font-semibold text-gray-600">{item.verifikator}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="bg-[#00B69B]/10 text-[#00B69B] text-[10px] font-bold px-1.5 py-0.5 rounded">Komentar</span>
              <p className="font-semibold text-gray-600 flex-1 leading-tight">{item.komentar}</p>
            </div>
          </div>
        )}

        {item.status === "menunggu" && (
          <button 
            onClick={() => onVerify(item)} 
            className="bg-[#4379EE] text-white text-[12px] font-bold px-5 py-2 rounded-md hover:bg-blue-700 transition shadow-md shadow-blue-200"
          >
            Verifikasi Sekarang
          </button>
        )}
      </div>

      <div className="mt-5 pt-3 border-t border-gray-50 flex items-center justify-between text-[11px]">
        {item.status === "revisi" ? (
          <p className="text-[#FD5454] font-bold">Deadline: {item.deadline}</p>
        ) : (
          <p className="text-gray-400">Diajukan: {format(item.tanggal_diajukan)}</p>
        )}
      </div>
    </div>
  )
}