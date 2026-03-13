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

import type { UserResponse, UserRequest } from "../../_types"

interface Props {
  open: boolean
  idUser: string | null
  data: UserResponse[]
  onOpenChange: (open: boolean) => void
  onSubmit: (data: UserRequest, id?: string) => void
}

const roles = [
  { value: "super_admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "programmer", label: "Programmer - Level 1" },
  { value: "verifikator", label: "Verifikator - Level 2" },
]

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

  useEffect(() => {

    if (!idUser) return

    const selected = data.find(item => item.id === idUser)

    if (selected) {
      setUsername(selected.username)
      setFullName(selected.full_name)
      setRole(selected.role_id)
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
                  <SelectValue placeholder="pilih role user" />
                </SelectTrigger>

                <SelectContent>

                  {roles.map(role => (
                    <SelectItem
                      key={role.value}
                      value={role.value}
                    >
                      {role.label}
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