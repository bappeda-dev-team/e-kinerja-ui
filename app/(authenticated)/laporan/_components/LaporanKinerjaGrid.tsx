'use client'

import * as React from "react"
import LaporanKinerjaCard from "./LaporanKinerjaCard"
import type { LaporanKinerjaItem } from "../_types"

interface Props {
  data: LaporanKinerjaItem[]
  loading?: boolean
  onEdit: (item: LaporanKinerjaItem) => void
  onDelete: (id: string) => void
}

/* --- Hybrid Loader Component --- */
const HybridLoader = () => {
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev =>
        prev >= 90 ? prev : prev + Math.floor(Math.random() * 10)
      )
    }, 200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-20 shadow-[6px_6px_54px_rgba(0,0,0,0.05)] space-y-4">
      <div className="relative flex items-center justify-center">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-blue-50"
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
        <div className="absolute flex flex-col items-center">
          <span className="text-blue-600 animate-bounce">⏳</span>
          <span className="text-[10px] font-bold text-blue-600">{progress}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-[#202224]">Mengumpulkan laporan...</p>
        <p className="text-[11px] text-[#202224]/50">Mohon tunggu sebentar</p>
      </div>
    </div>
  )
}

export default function LaporanKinerjaGrid({
  data,
  loading,
  onEdit,
  onDelete,
}: Props) {
  
  // Early return untuk loading diletakkan di bawah jika ada hooks, 
  // tapi karena komponen ini stateless (kecuali loader di atas), ini aman.
  if (loading) {
    return <HybridLoader />
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-2xl bg-white p-20 text-[#202224]/40 shadow-[6px_6px_54px_rgba(0,0,0,0.05)] border border-dashed">
        Belum ada laporan kinerja.
      </div>
    )
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {data.map((item) => (
        <LaporanKinerjaCard
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}