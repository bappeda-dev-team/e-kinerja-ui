'use client'

import { useState } from "react"
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

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: {
    username: string
    full_name: string
    role: string
  }) => void
}

const roles = [
  { value: "super_admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "programmer", label: "Programmer - Level 1" },
  { value: "verifikator", label: "Verifikator - Level 2" },
]

export default function AddMasterUser({
  open,
  onOpenChange,
  onSubmit,
}: Props) {

  const [username, setUsername] = useState("")
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState("")

  const handleSubmit = () => {

    if (!username || !fullName || !role) {
      toast.error("Semua field wajib diisi!")
      return
    }

    onSubmit({
      username,
      full_name: fullName,
      role,
    })

  

    setUsername("")
    setFullName("")
    setRole("")

    onOpenChange(false)
  }

  return (

    <Dialog open={open} onOpenChange={onOpenChange}>

      <DialogContent>

        <DialogHeader>
          <DialogTitle>Tambah User</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">

          {/* USERNAME */}
          <div>

            <Label className="uppercase text-xs font-semibold">
              Username :
            </Label>

            <div className="mt-2">
              <Input
                placeholder="masukkan username"
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
                placeholder="masukkan nama lengkap"
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