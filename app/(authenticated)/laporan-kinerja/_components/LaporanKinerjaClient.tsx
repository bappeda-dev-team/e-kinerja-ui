"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import LaporanKinerjaTable from "./LaporanKinerjaTable"
import AddLaporanKinerja from "./modals/AddLaporanKinerja"
import EditLaporanKinerja from "./modals/EditLaporanKinerja"

export interface LaporanKinerjaItem {
  id: string
  pemda: string
  nama_aplikasi: string
  menu: string
  pelaksana: string
  status: number
  laporan_progress: string
  attachments: {
    name: string
    url: string
  }[]
}

export default function LaporanKinerjaClient() {
  const [data, setData] = useState<LaporanKinerjaItem[]>([
    {
      id: "1",
      pemda: "Pemda Kota Bandung",
      nama_aplikasi: "E-Kinerja",
      menu: "Dashboard",
      pelaksana: "ASEP SURYANA",
      status: 50,
      laporan_progress: "Terdapat kendala pada optimasi query database.",
      attachments: [
        { name: "progress-report.pdf", url: "#" },
        { name: "screenshot-1.png", url: "#" },
        { name: "log-error.txt", url: "#" },
        { name: "timeline.xlsx", url: "#" },
        { name: "revisi-ui.fig", url: "#" },
      ],
    },
    {
      id: "2",
      pemda: "Pemda Kota Surabaya",
      nama_aplikasi: "E-Arsip",
      menu: "Arsip Digital",
      pelaksana: "LINA WULANDARI",
      status: 75,
      laporan_progress: "Fitur hampir selesai, sedang tahap testing.",
      attachments: [
        { name: "arsip-progress.pdf", url: "#" },
        { name: "mockup.png", url: "#" },
        { name: "db-schema.sql", url: "#" },
        { name: "testing-doc.docx", url: "#" },
        { name: "meeting-notes.txt", url: "#" },
      ],
    },
  ])

  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState<LaporanKinerjaItem | null>(null)

  const handleAdd = (item: LaporanKinerjaItem) => {
    setData((prev) => [...prev, item])
  }

  const handleEdit = (item: LaporanKinerjaItem) => {
    setData((prev) =>
      prev.map((d) => (d.id === item.id ? item : d))
    )
  }

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((d) => d.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Laporan Kinerja</h2>
        <Button onClick={() => setShowAdd(true)}>
          + Tambah Laporan
        </Button>
      </div>

      <LaporanKinerjaTable
        data={data}
        onEdit={setEditItem}
        onDelete={handleDelete}
      />

      <AddLaporanKinerja
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={handleAdd}
      />

      <EditLaporanKinerja
        open={!!editItem}
        data={editItem}
        onClose={() => setEditItem(null)}
        onSave={handleEdit}
      />
    </div>
  )
}