"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import DistribusiTable from "./DistribusiTable"
import AssignDistribusiModal from "../_components/modals/AssignDistribusiModal"

export interface DistribusiItem {
  id: string
  pemda: string
  nama_aplikasi: string
  menu: string
  deadline: string
  pelaksana: string[]
  komentar_admin: string
  status: "Assigned"
}

export interface MasterPegawaiItem {
  id: string
  nama_pegawai: string
  jabatan: string
  email: string
}

/* ================= MASTER PEGAWAI ================= */
const masterPegawai: MasterPegawaiItem[] = [
  { id: "1", nama_pegawai: "ASEP SURYANA", jabatan: "Programmer - Level 1", email: "" },
  { id: "2", nama_pegawai: "LINA WULANDARI", jabatan: "Programmer - Level 1", email: "" },
  { id: "3", nama_pegawai: "RIZKY MAULANA", jabatan: "Programmer - Level 1", email: "" },
  { id: "4", nama_pegawai: "ANDI WIJAYA", jabatan: "Programmer - Level 1", email: "" },
]

/* ================= DUMMY PERMINTAAN ================= */
const initialPermintaan = [
  {
    id: "req-1",
    pemda: "Pemda Kota Surabaya",
    nama_aplikasi: "E-Surat",
    menu: "Arsip",
    deadline: "2025-06-20",
  },
  {
    id: "req-2",
    pemda: "Pemda Kota Bandung",
    nama_aplikasi: "E-Kinerja",
    menu: "Dashboard",
    deadline: "2025-06-15",
  },
]

/* ================= DUMMY DISTRIBUSI ================= */
const dummyDistribusi: DistribusiItem[] = [
  {
    id: "1",
    pemda: "Pemda Kota Malang",
    nama_aplikasi: "E-Planning",
    menu: "Laporan",
    deadline: "2025-06-25",
    pelaksana: ["ASEP SURYANA"],
    komentar_admin: "Prioritas tinggi",
    status: "Assigned",
  },
  {
    id: "2",
    pemda: "Pemda Kota Bogor",
    nama_aplikasi: "E-Kinerja",
    menu: "Dashboard",
    deadline: "2025-06-18",
    pelaksana: ["RIZKY MAULANA", "LINA WULANDARI"],
    komentar_admin: "Deadline ketat",
    status: "Assigned",
  },
]

export default function DistribusiClient() {
  const [permintaan, setPermintaan] = useState(initialPermintaan)
  const [distribusi, setDistribusi] =
    useState<DistribusiItem[]>(dummyDistribusi)

  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [editItem, setEditItem] =
    useState<DistribusiItem | null>(null)

  /* ================= ASSIGN ================= */
  const handleAssign = (
    requestId: string,
    val: { programmer: string[]; komentar_admin: string }
  ) => {
    const request = permintaan.find(p => p.id === requestId)
    if (!request) return

    const programmerNames = masterPegawai
      .filter(p => val.programmer.includes(p.id))
      .map(p => p.nama_pegawai)

    const newDistribusi: DistribusiItem = {
      id: Date.now().toString(),
      pemda: request.pemda,
      nama_aplikasi: request.nama_aplikasi,
      menu: request.menu,
      deadline: request.deadline,
      pelaksana: programmerNames,
      komentar_admin: val.komentar_admin,
      status: "Assigned",
    }

    setDistribusi(prev => [...prev, newDistribusi])
    setPermintaan(prev => prev.filter(p => p.id !== requestId))
  }

  /* ================= DELETE ================= */
  const handleDelete = (id: string) => {
    setDistribusi(prev => prev.filter(d => d.id !== id))
  }

  /* ================= EDIT ================= */
  const handleEditSave = (val: {
    programmer: string[]
    komentar_admin: string
  }) => {
    if (!editItem) return

    const programmerNames = masterPegawai
      .filter(p => val.programmer.includes(p.id))
      .map(p => p.nama_pegawai)

    setDistribusi(prev =>
      prev.map(item =>
        item.id === editItem.id
          ? {
              ...item,
              pelaksana: programmerNames,
              komentar_admin: val.komentar_admin,
            }
          : item
      )
    )

    setEditItem(null)
  }

  return (
    <div className="px-4 space-y-6">

      <h2 className="text-2xl font-semibold">
        Distribusi Pekerjaan
      </h2>

      {/* ================= PERMINTAAN MASUK ================= */}
      {permintaan.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium">
            Permintaan Masuk
          </h3>

          {permintaan.map(item => (
            <div
              key={item.id}
              className="border rounded-md p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{item.pemda}</p>
                <p className="text-sm text-muted-foreground">
                  {item.nama_aplikasi} - {item.menu}
                </p>
                <p className="text-sm">
                  Deadline: {item.deadline}
                </p>
              </div>

              <Button
                size="sm"
                onClick={() => setSelectedItem(item)}
              >
                Distribusikan
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* ================= TABEL ================= */}
      <DistribusiTable
        data={distribusi}
        onDelete={handleDelete}
        onEdit={(item) => setEditItem(item)}
      />

      {/* ================= MODAL ASSIGN ================= */}
      {selectedItem && (
        <AssignDistribusiModal
          data={selectedItem}
          masterPegawai={masterPegawai}
          onClose={() => setSelectedItem(null)}
          onSave={(val) => {
            handleAssign(selectedItem.id, val)
            setSelectedItem(null)
          }}
          mode="assign"
        />
      )}

      {/* ================= MODAL EDIT ================= */}
      {editItem && (
        <AssignDistribusiModal
          data={editItem}
          masterPegawai={masterPegawai}
          onClose={() => setEditItem(null)}
          onSave={handleEditSave}
          mode="edit"
        />
      )}

    </div>
  )
}