"use client"

import { useEffect, useState } from "react"

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

export default function EditPermintaanModal({
  open,
  setOpen,
  data,
}: any) {

  const [form, setForm] = useState({
    pemda: "",
    menu: "",
    admin: "",
    komentar_admin: "",
  })

  useEffect(() => {

    if (data) {

      setForm({
        pemda: data.permintaan?.pemda || "",
        menu: data.permintaan?.menu || "",
        admin: data.admin || "",
        komentar_admin: data.komentar_admin || "",
      })

    }

  }, [data])

  const handleChange = (field: string, value: string) => {

    setForm({
      ...form,
      [field]: value,
    })

  }

  const handleSubmit = () => {

    console.log("update data:", form)

    setOpen(false)
  }

  return (

    <Dialog open={open} onOpenChange={setOpen}>

      <DialogContent>

        <DialogHeader>
          <DialogTitle>Edit Permintaan</DialogTitle>
        </DialogHeader>


        <div className="space-y-4">

          <div className="space-y-2">
            <Label>Pemda</Label>
            <Input
              value={form.pemda}
              onChange={(e) =>
                handleChange("pemda", e.target.value)
              }
            />
          </div>


          <div className="space-y-2">
            <Label>Menu</Label>
            <Input
              value={form.menu}
              onChange={(e) =>
                handleChange("menu", e.target.value)
              }
            />
          </div>


          <div className="space-y-2">
            <Label>Admin</Label>
            <Input
              value={form.admin}
              onChange={(e) =>
                handleChange("admin", e.target.value)
              }
            />
          </div>


          <div className="space-y-2">
            <Label>Komentar</Label>
            <Input
              value={form.komentar_admin}
              onChange={(e) =>
                handleChange("komentar_admin", e.target.value)
              }
            />
          </div>

        </div>


        <DialogFooter className="mt-4">

          <Button
            variant="outline"
            onClick={() => setOpen(false)}
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