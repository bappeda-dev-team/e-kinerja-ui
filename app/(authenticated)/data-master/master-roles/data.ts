export interface MasterRolesItem {
  id: string
  name: string
  label: string
  description: string
  color: string
  created_at: string
  updated_at: string
}

export const initialData: MasterRolesItem[] = [
  {
    id: "1",
    name: "super_admin",
    label: "Super Admin",
    description: "Akses penuh sistem",
    color: "#4ADE80",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "admin",
    label: "Admin",
    description: "Mengelola distribusi pekerjaan",
    color: "#FCD34D",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "verifikator",
    label: "Verifikator",
    description: "Level 2",
    color: "#F87171",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "programmer",
    label: "Programmer",
    description: "Level 1",
    color: "#A78BFA",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]
