"use client"

import AddPermintaan from "./AddPermintaan"
import type { PermintaanItem } from "../PermintaanClient"

interface Props {
  data: PermintaanItem
  onClose: () => void
  onSave: (val: PermintaanItem) => void
}

export default function EditPermintaan({
  data,
  onClose,
  onSave,
}: Props) {
  return (
    <AddPermintaan
      initialData={data}
      onClose={onClose}
      onSave={onSave}
    />
  )
}