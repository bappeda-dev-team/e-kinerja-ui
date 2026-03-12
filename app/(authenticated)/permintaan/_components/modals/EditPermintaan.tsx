"use client"

import AddPermintaan from "./AddPermintaan"
import type { PermintaanResponse, PermintaanRequest } from "../../_types"

interface Props {
  data: PermintaanResponse
  onClose: () => void
  onSave: (val: PermintaanRequest, id?: string) => void
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