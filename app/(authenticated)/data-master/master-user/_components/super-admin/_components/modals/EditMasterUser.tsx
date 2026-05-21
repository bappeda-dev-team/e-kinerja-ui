
'use client'

import { useEffect, useState } from "react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { getRoles } from "@/services/master-roles.service"
import type { Roles } from "@/types/master-roles"
import type { UserResponse, UserRequest } from "../../types"

interface Props {
  open: boolean
  idUser: string | null
  data: UserResponse[]
  onOpenChange: (open: boolean) => void
  onSubmit: (data: UserRequest, id?: string) => void
}

export default function EditMasterUser({
  open,
  idUser,
  data,
  onOpenChange,
  onSubmit,
}: Props) {

  const [username, setUsername] = useState("")
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState("")
  const [rolesList, setRolesList] = useState<Roles[]>([])
  const [loadingRoles, setLoadingRoles] = useState(false)

  useEffect(() => {
    if (!open) return
    const loadRoles = async () => {
      try {
        setLoadingRoles(true)
        const res = await getRoles()
        if (res.status === 200) setRolesList(res.data?.data ?? [])
      } catch {
        toast.error("Gagal memuat role")
      } finally {
        setLoadingRoles(false)
      }
    }
    loadRoles()
  }, [open])

  useEffect(() => {
    if (!idUser) return
    const selected = data.find(item => item.id === idUser)
    if (selected) {
      setUsername(selected.username)
      setFullName(selected.full_name)
      setRole(selected.role.id)
    }
  }, [idUser, data])

  const handleSubmit = () => {

    if (!username || !fullName || !role) {
      toast.error("Semua field wajib diisi!")
      return
    }

    onSubmit({
      username,
      full_name: fullName,
      role_id: role,
    }, idUser!)

 

    onOpenChange(false)
  }

  return (

    <Dialog open={open} onOpenChange={onOpenChange}>

      <DialogContent>

        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">

          {/* USERNAME */}
          <div>

            <Label className="uppercase text-xs font-semibold">
              Username :
            </Label>

            <div className="mt-2">
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <p className="text-xs text-muted-foreground mt-1">
              *Username harus terisi
            </p>

          </div>

          {/* FULL NAME */}
          <div>

            <Label className="uppercase text-xs font-semibold">
              Full Name :
            </Label>

            <div className="mt-2">
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <p className="text-xs text-muted-foreground mt-1">
              *Nama lengkap harus terisi
            </p>

          </div>

          {/* ROLE */}
          <div>

            <Label className="uppercase text-xs font-semibold">
              Role :
            </Label>

            <div className="mt-2">

              <Select
                value={role}
                onValueChange={(value) => setRole(value)}
              >

                <SelectTrigger>
                  <SelectValue placeholder={loadingRoles ? "Memuat role..." : "Pilih role user"} />
                </SelectTrigger>

                <SelectContent>
                  {rolesList.map((r) => (
                    <SelectItem key={r.id} value={r.id!}>
                      {r.description || r.name || "Tanpa Nama Role"}
                    </SelectItem>
                  ))}
                </SelectContent>

              </Select>

            </div>

            <p className="text-xs text-muted-foreground mt-1">
              *Role user harus dipilih
            </p>

          </div>

        </div>

        <DialogFooter>

          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Batal
          </Button>

          <Button onClick={handleSubmit}>
            Simpan
          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>
  )
}