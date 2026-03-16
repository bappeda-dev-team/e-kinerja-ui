"use client"

import * as React from "react"
import { Pencil, Trash2 } from "lucide-react"
import MasterRolesCard from "./MasterRolesCard"
import type { MasterRolesItem } from "./MasterRolesClient"

const HybridLoader = () => {
  const [progress, setProgress] = React.useState(0)
  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? prev : prev + Math.floor(Math.random() * 10)))
    }, 200)
    return () => clearInterval(interval)
  }, [])
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4 min-h-[400px]">
      <div className="relative flex items-center justify-center">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-blue-100" />
          <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent"
            strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * progress) / 100}
            className="text-blue-600 transition-all duration-300 ease-out" strokeLinecap="round" />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-blue-600 animate-bounce text-xl">⏳</span>
          <span className="text-[10px] font-bold text-blue-600">{progress}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-[#202224]">Sedang memproses...</p>
        <p className="text-[11px] text-[#202224]/50">Mohon tunggu sebentar</p>
      </div>
    </div>
  )
}

function getFixedColor(name: string) {
  const role = name.toLowerCase()
  if (role.includes("super")) return "#FCBE2D"
  if (role.includes("programmer")) return "#8280FF"
  if (role.includes("verifikator")) return "#FD5454"
  if (role.includes("admin")) return "#00B69B"
  return "#4880FF"
}

interface Props {
  data: MasterRolesItem[]
  allData: MasterRolesItem[] // ✅ semua data untuk table view
  loading?: boolean
  showTable?: boolean        // ✅
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function MasterRolesGrid({ data, allData, loading, showTable, onEdit, onDelete }: Props) {
  if (loading) return <HybridLoader />

  // ✅ Table view
  if (showTable) {
    return (
      <div className="bg-white rounded-2xl shadow-[6px_6px_54px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
          <span className="text-sm font-bold text-[#202224]">Semua Role</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-[#202224]/60">
            {allData.length}
          </span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#202224]/50 w-8">#</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#202224]/50">Role</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#202224]/50">Deskripsi</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#202224]/50">Dibuat</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#202224]/50">Diperbarui</th>
              <th className="px-4 py-3 text-xs font-semibold text-[#202224]/50 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {allData.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-sm text-[#202224]/40">Belum ada role.</td>
              </tr>
            ) : allData.map((item, i) => {
              const color = getFixedColor(item.name)
              const formatDate = (d: string) => d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"
              return (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="px-4 py-3 text-xs text-[#202224]/40">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      <span className="font-semibold text-xs text-[#202224] capitalize">
                        {item.name.replace("_", " ")}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#797A7C]">{item.description || "-"}</td>
                  <td className="px-4 py-3 text-xs text-[#797A7C]">{formatDate(item.created_at)}</td>
                  <td className="px-4 py-3 text-xs text-[#797A7C]">{formatDate(item.updated_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(item.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-[#767676] hover:bg-gray-50 transition active:scale-95"
                      >
                        <Pencil className="size-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-xs font-semibold text-red-500 hover:bg-red-50 transition active:scale-95"
                      >
                        <Trash2 className="size-3" />
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  // ✅ Card view
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
        <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <MasterRolesCard item={item} onEdit={onEdit} onDelete={onDelete} />
        </div>
      ))}
    </div>
  )
}