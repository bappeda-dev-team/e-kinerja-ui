"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
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

import {
  ArrowUp,
  ArrowDown,
} from "lucide-react"

import type { MasterUserItem } from "./MasterUserClient"

interface Props {
  data: MasterUserItem[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function MasterUserTable({
  data,
  onEdit,
  onDelete,
}: Props) {

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [deleteId, setDeleteId] = React.useState<string | null>(null)

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const columns: ColumnDef<MasterUserItem>[] = [

    {
      id: "no",
      header: "No",
      cell: ({ row, table }) => {
        const { pageIndex, pageSize } = table.getState().pagination
        return pageIndex * pageSize + row.index + 1
      },
    },

    {
      accessorKey: "username",
      header: ({ column }) => (
        <HeaderSort column={column} title="Username" />
      ),
    },

    {
      accessorKey: "full_name",
      header: ({ column }) => (
        <HeaderSort column={column} title="Full Name" />
      ),
    },

    {
      accessorKey: "role",
      header: ({ column }) => (
        <HeaderSort column={column} title="Role" />
      ),
    },

    {
      accessorKey: "active",
      header: "Active",
      cell: ({ row }) =>
        row.original.active ? "Yes" : "No",
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
      id: "aksi",
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
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (

    <div className="space-y-4">

      {/* SEARCH */}

      <Input
        placeholder="Cari username / nama / role..."
        value={globalFilter ?? ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
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

      <div className="flex items-center justify-between text-sm">

        <div>
          Page {pagination.pageIndex + 1} of {table.getPageCount()}
        </div>

        <div className="space-x-2">

          <Button
            size="sm"
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>

        </div>

      </div>

      {/* DELETE CONFIRM */}

      <AlertDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
      >

        <AlertDialogContent>

          <AlertDialogHeader>

            <AlertDialogTitle>
              Hapus user ini?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Data tidak bisa dikembalikan.
            </AlertDialogDescription>

          </AlertDialogHeader>

          <AlertDialogFooter>

            <AlertDialogCancel>Batal</AlertDialogCancel>

            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  onDelete(deleteId)
                  setDeleteId(null)
                }
              }}
            >
              Hapus
            </AlertDialogAction>

          </AlertDialogFooter>

        </AlertDialogContent>

      </AlertDialog>

    </div>

  )
}


/* SORT HEADER */

function HeaderSort({ column, title }: any) {

  return (

    <div
      onClick={() =>
        column.toggleSorting(column.getIsSorted() === "asc")
      }
      className="flex items-center gap-1 cursor-pointer"
    >

      {title}

      {column.getIsSorted() === "asc" && (
        <ArrowUp className="h-4 w-4" />
      )}

      {column.getIsSorted() === "desc" && (
        <ArrowDown className="h-4 w-4" />
      )}

    </div>

  )
}