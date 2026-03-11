"use client"

import type { LaporanKinerjaItem } from "../../data"
import AddLaporanKinerja from "./AddLaporanKinerja"

interface Props {
  open: boolean
  data: LaporanKinerjaItem | null
  onClose: () => void
  onSave: (item: LaporanKinerjaItem) => void

  permintaanList: {
    id: string
    pemda: string
    menu: string
  }[]

  masterPegawai: {
    id: string
    nama_pegawai: string
    jabatan: string
  }[]
}

export default function EditLaporanKinerja({
  open,
  data,
  onClose,
  onSave,
  permintaanList,
  masterPegawai,
}: Props) {

  if (!data) return null

  return (
    <AddLaporanKinerja
      open={open}
      onClose={onClose}
      onSave={onSave}
      initialData={data}
      permintaanList={permintaanList}
      masterPegawai={masterPegawai}
    />
  )
}