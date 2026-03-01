"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import type { LaporanKinerjaItem } from "./LaporanKinerjaClient"

interface Props {
  data: LaporanKinerjaItem[]
  onEdit: (item: LaporanKinerjaItem) => void
  onDelete: (id: string) => void
}

export default function LaporanKinerjaTable({
  data,
  onEdit,
  onDelete,
}: Props) {
  const columns: ColumnDef<LaporanKinerjaItem>[] = [
    {
      id: "no",
      header: "No",
      cell: ({ row }) => row.index + 1,
    },
    { accessorKey: "pemda", header: "Pemda" },
    { accessorKey: "nama_aplikasi", header: "Nama Aplikasi" },
    { accessorKey: "menu", header: "Menu" },
    { accessorKey: "pelaksana", header: "Pelaksana" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const value = row.original.status

        const colorMap: Record<number, string> = {
          0: "bg-gray-400",
          25: "bg-red-500",
          50: "bg-orange-500",
          75: "bg-yellow-400",
          100: "bg-green-500",
        }

        return (
          <div className="flex justify-center">
            <span
              className={`px-3 py-1 rounded-full text-white text-xs font-medium ${colorMap[value] || "bg-gray-400"}`}
            >
              {value}%
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "laporan_progress",
      header: "Laporan Progress Oleh Pelaksana",
      cell: ({ row }) => (
        // Pakai min-w dan break-words biar teks panjang nggak bikin tabel melar tak terhingga
        <div className="min-w-[200px] max-w-sm whitespace-normal break-words">
          {row.original.laporan_progress}
        </div>
      ),
    },
    {
      accessorKey: "attachments",
      header: "Attachment",
      cell: ({ row }) => {
        const files = row.original.attachments
        if (!files || files.length === 0) return "-"

        return (
          <div className="flex flex-col gap-1">
            {files.map((file, i) => (
              <a
                key={i}
                href={file.url}
                download={file.name}
                // Tambahkan whitespace-nowrap biar nama file nggak berantakan ke bawah
                className="flex items-center gap-1 text-primary underline text-sm hover:opacity-80 whitespace-nowrap"
              >
                <Download className="h-3 w-3 flex-shrink-0" />
                <span className="truncate max-w-[150px]">{file.name}</span>
              </a>
            ))}
          </div>
        )
      },
    },
    {
      id: "aksi",
      header: "Aksi",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(row.original)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(row.original.id)}
          >
            Hapus
          </Button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    // KUNCI UTAMA: Tambahkan "grid grid-cols-1" di samping w-full dan min-w-0
    <div className="w-full min-w-0 grid grid-cols-1">
      <div className="rounded-md border bg-background w-full overflow-hidden flex flex-col">
        {/* Kontainer ini yang memegang kuasa atas scrollbar */}
        <div className="w-full overflow-auto max-h-[65vh] relative">
          <Table className="w-full">
            <TableHeader className="sticky top-0 z-10 bg-background shadow-[0_1px_0_0_hsl(var(--border))]">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-none">
                  {headerGroup.headers.map((header) => (
                    // Header dipaksa dalam satu baris dengan whitespace-nowrap
                    <TableHead key={header.id} className="px-4 py-3 whitespace-nowrap bg-background">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    // Isi tabel juga wajib whitespace-nowrap agar scroll horizontal aktif
                    <TableCell key={cell.id} className="px-4 py-3 align-top whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}