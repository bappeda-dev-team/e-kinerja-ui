'use client'

import * as React from "react"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import type { MasterAplikasiItem } from "./MasterAplikasiClient"

interface Props {
  data: MasterAplikasiItem[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function MasterAplikasiTable({
  data,
  onEdit,
  onDelete,
}: Props) {

  const [filter, setFilter] = React.useState("")
  const [deleteId, setDeleteId] = React.useState<string | null>(null)

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const filteredData = React.useMemo(() => {

    return data.filter(item =>
      item.nama_aplikasi
        .toLowerCase()
        .includes(filter.toLowerCase())
    )

  }, [data, filter])

  const columns: ColumnDef<MasterAplikasiItem>[] = [

    {
      header: "No",
      cell: ({ row, table }) =>
        table.getState().pagination.pageIndex *
        table.getState().pagination.pageSize +
        row.index +
        1,
    },

    {
      accessorKey: "nama_aplikasi",
      header: "Nama Aplikasi",
    },

    {
      accessorKey: "created_at",
      header: "Created At",
    },

    {
      accessorKey: "updated_at",
      header: "Updated At",
    },

    {
      header: "Aksi",
      cell: ({ row }) => (

        <div className="flex gap-2">

          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(row.original.id)}
          >
            Edit
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => setDeleteId(row.original.id)}
          >
            Hapus
          </Button>

        </div>

      ),
    },

  ]

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (

    <div className="space-y-4">

      {/* SEARCH */}
      <Input
        placeholder="Cari nama aplikasi..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      {/* TABLE */}
      <div className="rounded-md border">

        <Table>

          <TableHeader className="bg-muted">

            {table.getHeaderGroups().map(headerGroup => (

              <TableRow key={headerGroup.id}>

                {headerGroup.headers.map(header => (

                  <TableHead key={header.id}>

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

            {table.getRowModel().rows.map(row => (

              <TableRow key={row.id}>

                {row.getVisibleCells().map(cell => (

                  <TableCell key={cell.id}>

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

      {/* PAGINATION */}

      <div className="flex items-center justify-between text-sm text-muted-foreground">

        <div>
          Page {pagination.pageIndex + 1} of {table.getPageCount()}
        </div>

        <div className="space-x-2">

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>

        </div>

      </div>

      {/* DELETE ALERT */}

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null)
        }}
      >

        <AlertDialogContent>

          <AlertDialogHeader>

            <AlertDialogTitle>
              Yakin ingin menghapus aplikasi ini?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Data yang sudah dihapus tidak dapat dikembalikan.
            </AlertDialogDescription>

          </AlertDialogHeader>

          <AlertDialogFooter>

            <AlertDialogCancel>
              Batal
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={() => {

                if (deleteId) {
                  onDelete(deleteId)
                  setDeleteId(null)
                }

              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>

          </AlertDialogFooter>

        </AlertDialogContent>

      </AlertDialog>

    </div>
  )
}