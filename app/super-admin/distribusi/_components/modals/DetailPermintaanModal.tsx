"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function DetailPermintaanModal({
  open,
  onClose,
  data,
}: any) {

  if (!data) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">

        <DialogHeader>
          <DialogTitle>Detail Permintaan</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 text-sm">

          <p><b>Pemda:</b> {data.pemda}</p>
          <p><b>Aplikasi:</b> {data.aplikasi}</p>
          <p><b>Menu:</b> {data.menu}</p>

          <p><b>Kondisi Awal:</b> {data.kondisi_awal}</p>
          <p><b>Kondisi Diharapkan:</b> {data.kondisi_diharapkan}</p>

          <p><b>Tanggal Pesanan:</b> {data.tanggal_pesanan}</p>
          <p><b>Deadline:</b> {data.deadline}</p>

          <p><b>Dibuat Oleh:</b> {data.dibuat_oleh}</p>
          <p><b>Created At:</b> {data.created_at}</p>

        </div>

      </DialogContent>
    </Dialog>
  )
}