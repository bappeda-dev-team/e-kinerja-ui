'use client'

import { useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import MasterUserTable from "./MasterUserTable"
import AddMasterUser from "./modals/AddMasterUser"
import EditMasterUser from "./modals/EditMasterUser"

export interface MasterUserItem {
  id: string
  username: string
  full_name: string
  role: string
  avatar_url?: string
  active: boolean
  created_at: string
  updated_at: string
}

export default function MasterUserClient() {

  const today = new Date().toISOString().slice(0, 10)

  const [data, setData] = useState<MasterUserItem[]>([
    { id: "1",  full_name: "Jason Price",      username: "janick_parisian@yahoo.com",      role: "Admin",       avatar_url: "https://i.pravatar.cc/150?img=11", active: true, created_at: today, updated_at: today },
    { id: "2",  full_name: "Jukkoe Sisao",      username: "sibyl_kozey@gmail.com",          role: "Admin",       avatar_url: "https://i.pravatar.cc/150?img=12", active: true, created_at: today, updated_at: today },
    { id: "3",  full_name: "Harriet King",      username: "nadia_block@hotmail.com",        role: "Super Admin", avatar_url: "https://i.pravatar.cc/150?img=47", active: true, created_at: today, updated_at: today },
    { id: "4",  full_name: "Lenora Benson",     username: "feil.wallace@kunde.us",          role: "Programmer",  avatar_url: "https://i.pravatar.cc/150?img=15", active: true, created_at: today, updated_at: today },
    { id: "5",  full_name: "Olivia Reese",      username: "kemmer.hattie@cremin.us",        role: "Verifikator", avatar_url: "https://i.pravatar.cc/150?img=20", active: true, created_at: today, updated_at: today },
    { id: "6",  full_name: "Bertha Valdez",     username: "loraine.koelpin@tromp.io",       role: "Programmer",  avatar_url: "https://i.pravatar.cc/150?img=16", active: true, created_at: today, updated_at: today },
    { id: "7",  full_name: "Harriett Payne",    username: "nannie_west@estrella.tv",        role: "Programmer",  avatar_url: "https://i.pravatar.cc/150?img=21", active: true, created_at: today, updated_at: today },
    { id: "8",  full_name: "George Bryant",     username: "delmer.kling@gmail.com",         role: "Programmer",  avatar_url: "https://i.pravatar.cc/150?img=13", active: true, created_at: today, updated_at: today },
    { id: "9",  full_name: "Lily French",       username: "lucienne.herman@hotmail.com",    role: "Programmer",  avatar_url: "https://i.pravatar.cc/150?img=44", active: true, created_at: today, updated_at: today },
    { id: "10", full_name: "Howard Adkins",     username: "wiegand.leonor@herman.us",       role: "Programmer",  avatar_url: "https://i.pravatar.cc/150?img=17", active: true, created_at: today, updated_at: today },
    { id: "11", full_name: "Earl Bowman",       username: "waino_altenwerth@nicolette.tv",  role: "Programmer",  avatar_url: "https://i.pravatar.cc/150?img=14", active: true, created_at: today, updated_at: today },
    { id: "12", full_name: "Patrick Padilla",   username: "octavia.nienow@gleichner.net",   role: "Programmer",  avatar_url: "https://i.pravatar.cc/150?img=18", active: true, created_at: today, updated_at: today },
    { id: "13", full_name: "Alma Garrett",      username: "alma.garrett@example.com",       role: "Admin",       avatar_url: "https://i.pravatar.cc/150?img=48", active: true, created_at: today, updated_at: today },
    { id: "14", full_name: "Bruce Powell",      username: "bruce.powell@example.com",       role: "Programmer",  avatar_url: "https://i.pravatar.cc/150?img=19", active: true, created_at: today, updated_at: today },
    { id: "15", full_name: "Clara Shaw",        username: "clara.shaw@example.com",         role: "Verifikator", avatar_url: "https://i.pravatar.cc/150?img=49", active: true, created_at: today, updated_at: today },
    { id: "16", full_name: "Dennis Torres",     username: "dennis.torres@example.com",      role: "Programmer",  avatar_url: "https://i.pravatar.cc/150?img=22", active: true, created_at: today, updated_at: today },
    { id: "17", full_name: "Eleanor Hayes",     username: "eleanor.hayes@example.com",      role: "Admin",       avatar_url: "https://i.pravatar.cc/150?img=50", active: true, created_at: today, updated_at: today },
    { id: "18", full_name: "Frank Reid",        username: "frank.reid@example.com",         role: "Programmer",  avatar_url: "https://i.pravatar.cc/150?img=23", active: true, created_at: today, updated_at: today },
    { id: "19", full_name: "Grace Fleming",     username: "grace.fleming@example.com",      role: "Verifikator", avatar_url: "https://i.pravatar.cc/150?img=51", active: true, created_at: today, updated_at: today },
    { id: "20", full_name: "Henry Lambert",     username: "henry.lambert@example.com",      role: "Programmer",  avatar_url: "https://i.pravatar.cc/150?img=24", active: true, created_at: today, updated_at: today },
    { id: "21", full_name: "Iris Caldwell",     username: "iris.caldwell@example.com",      role: "Programmer",  avatar_url: "https://i.pravatar.cc/150?img=52", active: true, created_at: today, updated_at: today },
    { id: "22", full_name: "Jake Morrison",     username: "jake.morrison@example.com",      role: "Admin",       avatar_url: "https://i.pravatar.cc/150?img=25", active: true, created_at: today, updated_at: today },
    { id: "23", full_name: "Karen Walsh",       username: "karen.walsh@example.com",        role: "Programmer",  avatar_url: "https://i.pravatar.cc/150?img=53", active: true, created_at: today, updated_at: today },
    { id: "24", full_name: "Leo Spencer",       username: "leo.spencer@example.com",        role: "Programmer",  avatar_url: "https://i.pravatar.cc/150?img=26", active: true, created_at: today, updated_at: today },
  ])

  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id))
    toast.success("User berhasil dihapus")
  }

  const handleAdd = (newItem: any) => {

    const newData: MasterUserItem = {
      id: Date.now().toString(),
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...newItem
    }

    setData(prev => [...prev, newData])
    toast.success("User berhasil ditambahkan")
  }

  const handleEdit = (updatedItem: MasterUserItem) => {

    setData(prev =>
      prev.map(item =>
        item.id === updatedItem.id ? updatedItem : item
      )
    )

    toast.success("User berhasil diperbarui")
  }

  return (

    <div className="px-4">

      <div className="flex items-center justify-between mb-4">

        <h2 className="text-2xl font-bold text-[#202224]">
          Master User
        </h2>

        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md font-bold text-sm transition"
        >
          <Plus className="size-4" />
          Tambah User
        </button>

      </div>

      <MasterUserTable
        data={data}
        onEdit={setEditId}
        onDelete={handleDelete}
      />

      <AddMasterUser
        open={showAdd}
        onOpenChange={setShowAdd}
        onSubmit={handleAdd}
      />

      <EditMasterUser
        open={!!editId}
        idUser={editId}
        data={data}
        onOpenChange={(open) => {
          if (!open) setEditId(null)
        }}
        onSubmit={handleEdit}
      />

    </div>

  )
}