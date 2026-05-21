
'use client'

import { useEffect, useMemo, useState } from "react"
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
import type { RegisterUserRequest } from "@/types/master-user"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: RegisterUserRequest) => void
}

function normalizeRoleLabel(role: Roles) {
  return role.description || role.name || "Tanpa Nama Role"
}

export default function AddMasterUser({
  open,
  onOpenChange,
  onSubmit,
}: Props) {
  const [username, setUsername] = useState("")
  const [fullName, setFullName] = useState("")
  const [password, setPassword] = useState("")
  const [roleId, setRoleId] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [roles, setRoles] = useState<Roles[]>([])
  const [loadingRoles, setLoadingRoles] = useState(false)

  useEffect(() => {
    if (!open) return

    const loadRoles = async () => {
      try {
        setLoadingRoles(true)
        const res = await getRoles()
        if (res.status === 200) {
          setRoles(res.data?.data ?? [])
        } else {
          toast.error(res.data?.message || "Gagal memuat role")
        }
      } catch (error: any) {
        toast.error(error.message || "Gagal memuat role")
      } finally {
        setLoadingRoles(false)
      }
    }

    loadRoles()
  }, [open])

  const selectedRole = useMemo(
    () => roles.find((role) => role.id === roleId),
    [roleId, roles]
  )

  const resetForm = () => {
    setUsername("")
    setFullName("")
    setPassword("")
    setRoleId("")
    setFile(null)
  }

  const handleSubmit = () => {
    if (!username || !fullName || !password || !roleId) {
      toast.error("Semua field wajib diisi!")
      return
    }

    onSubmit({
      username,
      full_name: fullName,
      password,
      role_id: roleId,
      file,
    })

    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) resetForm()
        onOpenChange(nextOpen)
      }}
    >
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Tambah User</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label className="text-xs font-semibold uppercase">Role</Label>
            <div className="mt-2">
              <Select value={roleId} onValueChange={setRoleId}>
                <SelectTrigger>
                  <SelectValue placeholder={loadingRoles ? "Memuat role..." : "Pilih role user"} />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id!}>
                      {normalizeRoleLabel(role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              *Gunakan role ID dari master role. {selectedRole ? `Role terpilih: ${normalizeRoleLabel(selectedRole)} (${selectedRole.id})` : "Role user harus dipilih"}
            </p>
          </div>

          <div>
            <Label className="text-xs font-semibold uppercase">Username</Label>
            <div className="mt-2">
              <Input
                placeholder="masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">*Username harus terisi</p>
          </div>

          <div>
            <Label className="text-xs font-semibold uppercase">Full Name</Label>
            <div className="mt-2">
              <Input
                placeholder="masukkan nama lengkap"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">*Nama lengkap harus terisi</p>
          </div>

          <div>
            <Label className="text-xs font-semibold uppercase">Password</Label>
            <div className="mt-2">
              <Input
                type="password"
                placeholder="masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">*Password harus terisi</p>
          </div>

          <div>
            <Label className="text-xs font-semibold uppercase">File</Label>
            <div className="mt-2">
              <Input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {file ? `File terpilih: ${file.name}` : "Opsional. Upload foto profil jika ada."}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
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
