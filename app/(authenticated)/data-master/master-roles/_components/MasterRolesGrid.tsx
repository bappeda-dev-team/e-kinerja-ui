"use client"

import { useEffect, useState } from "react"
import MasterRolesCard from "./MasterRolesCard"
import type { MasterRolesItem } from "./MasterRolesClient"

interface Props {
  data: MasterRolesItem[]
  loading?: boolean
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

/* --- Hybrid Loader (sama persis) --- */
const HybridLoader = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev =>
        prev >= 90 ? prev : prev + Math.floor(Math.random() * 10)
      )
    }, 200)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">

      <div className="relative flex items-center justify-center">

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

        <div className="absolute flex flex-col items-center">
          <span className="text-blue-600 animate-bounce">⏳</span>
          <span className="text-[10px] font-bold text-blue-600">{progress}%</span>
        </div>

      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-[#202224]">Sedang memproses...</p>
        <p className="text-[11px] text-[#202224]/50">Mohon tunggu sebentar</p>
      </div>

    </div>
  )
}

export default function MasterRolesGrid({ data, loading, onEdit, onDelete }: Props) {

  if (loading) {
    return <HybridLoader />
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-2xl bg-white p-12 text-[#202224]/40 border border-[#B9B9B9]/50">
        Belum ada role.
      </div>
    )
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2">

      {data.map((item) => (

        <MasterRolesCard
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />

      ))}

    </div>
  )
}