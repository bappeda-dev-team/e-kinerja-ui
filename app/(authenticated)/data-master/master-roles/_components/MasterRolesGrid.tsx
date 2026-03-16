"use client"

import * as React from "react"
import MasterRolesCard from "./MasterRolesCard"
import type { MasterRolesItem } from "./MasterRolesClient"

// --- Komponen Hybrid Loader ---
const HybridLoader = () => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? prev : prev + Math.floor(Math.random() * 10)));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4 min-h-[400px]">
      <div className="relative flex items-center justify-center">
        {/* Lingkaran Progress */}
        <svg className="w-24 h-24 transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-blue-100"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={251.2}
            strokeDashoffset={251.2 - (251.2 * progress) / 100}
            className="text-blue-600 transition-all duration-300 ease-out"
            strokeLinecap="round"
          />
        </svg>
        
        {/* Ikon Jam Pasir di Tengah */}
        <div className="absolute flex flex-col items-center">
          <span className="text-blue-600 animate-bounce text-xl">⏳</span>
          <span className="text-[10px] font-bold text-blue-600">{progress}%</span>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-sm font-semibold text-[#202224]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            Sedang memproses...
        </p>
        <p className="text-[11px] text-[#202224]/50" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            Mohon tunggu sebentar
        </p>
      </div>
    </div>
  );
};

interface Props {
  data: MasterRolesItem[]
  loading?: boolean // Tambahkan prop loading agar loader bisa bekerja
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function MasterRolesGrid({ data, loading, onEdit, onDelete }: Props) {

  // Tampilkan HybridLoader jika sedang loading
  if (loading) {
    return <HybridLoader />
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl bg-white p-12 text-[#202224]/40 border border-gray-100 shadow-sm">
        Belum ada role.
      </div>
    )
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {data.map((item) => (
        <div 
          key={item.id} 
          className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <MasterRolesCard
            item={item}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  )
}