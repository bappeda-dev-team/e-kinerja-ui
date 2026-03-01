"use client"

import type { LaporanKinerjaItem } from "../LaporanKinerjaClient"
import AddLaporanKinerja from "./AddLaporanKinerja"

interface Props {
  open: boolean
  data: LaporanKinerjaItem | null
  onClose: () => void
  onSave: (item: LaporanKinerjaItem) => void
}

export default function EditLaporanKinerja({
  open,
  data,
  onClose,
  onSave,
}: Props) {
  if (!data) return null

  return (
    <AddLaporanKinerja
      open={open}
      onClose={onClose}
      onSave={onSave}
      initialData={data}
    />
  )
}