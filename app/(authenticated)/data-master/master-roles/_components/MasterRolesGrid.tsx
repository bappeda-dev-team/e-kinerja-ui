import MasterRolesCard from "./MasterRolesCard"
import type { MasterRolesItem } from "./MasterRolesClient"

interface Props {
  data: MasterRolesItem[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function MasterRolesGrid({ data, onEdit, onDelete }: Props) {

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