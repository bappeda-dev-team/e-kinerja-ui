"use client"

import { Button } from "@/components/ui/button"
import type { VerifikasiItem } from "./VerifikasiClient"

interface Props {
  data: VerifikasiItem[]
  onVerify: (item: VerifikasiItem) => void
}

export default function VerifikasiTable({
  data,
  onVerify,
}: Props) {
  return (
    <div className="border rounded-md overflow-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="p-3 text-left">Pemda</th>
            <th className="p-3 text-left">Menu</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Ketepatan</th>
            <th className="p-3 text-left">Kualitas</th>
            <th className="p-3 text-center">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-3">{item.pemda}</td>
              <td className="p-3">{item.menu}</td>
              <td className="p-3">{item.status}%</td>
              <td className="p-3">
                {item.ketepatan_waktu ?? "-"}%
              </td>
              <td className="p-3">
                {item.kualitas ?? "-"}
              </td>
              <td className="p-3 text-center">
                <Button size="sm" onClick={() => onVerify(item)}>
                  Verifikasi
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}