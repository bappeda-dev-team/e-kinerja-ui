// app/super-admin/permintaan/_components/modals/EditPermintaan.tsx

"use client"

import AddPermintaan from "./AddPermintaan"
import type { PermintaanResponse, PermintaanRequest } from "../../types"

interface Props {
  data: PermintaanResponse
  onClose: () => void
  onSave: (val: PermintaanRequest, files: File[], id?: string) => void
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