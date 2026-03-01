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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

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
  MoreVertical,
  ArrowUp,
  ArrowDown,
  Filter,
  EyeOff,
  Settings2,
} from "lucide-react"

import type { MasterPegawaiItem } from "./MasterPegawaiClient"

interface Props {
  data: MasterPegawaiItem[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function MasterPegawaiTable({
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

  const columns: ColumnDef<MasterPegawaiItem>[] = [

    {
      id: "no",
      header: "No",
      cell: ({ row, table }) => {
        const { pageIndex, pageSize } = table.getState().pagination
        return pageIndex * pageSize + row.index + 1
      },
      enableSorting: false,
    },

    {
      accessorKey: "nama_pegawai",
      header: ({ column, table }) => (
        <DataGridHeader column={column} table={table} title="Nama Pegawai" />
      ),
    },

    {
      accessorKey: "email",
      header: ({ column, table }) => (
        <DataGridHeader column={column} table={table} title="Email" />
      ),
    },

    {
      accessorKey: "jabatan",
      header: ({ column, table }) => (
        <DataGridHeader column={column} table={table} title="Jabatan" />
      ),
    },

    {
      id: "aksi",
      header: "Aksi",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex gap-2 justify-center">
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

      {/* GLOBAL SEARCH */}
      <Input
        placeholder="Cari nama, email, atau jabatan..."
        value={globalFilter ?? ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
      />

      {/* TABLE */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className= "bg-muted" >
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} >
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
                  <TableCell key={cell.id} className="text-left">
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

      {/* DELETE ALERT */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Yakin ingin menghapus data ini?
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


/* ============================= */
/* MUI-STYLE HEADER */
/* ============================= */

function DataGridHeader({ column, table, title }: any) {

  const [filterOpen, setFilterOpen] = React.useState(false)
  const [manageOpen, setManageOpen] = React.useState(false)

  return (
    <div className="flex items-center justify-between w-full">

      {/* TITLE (click = sort) */}
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="cursor-pointer flex items-center gap-1 select-none"
      >
        {title}

        {column.getIsSorted() === "asc" && (
          <ArrowUp className="h-4 w-4" />
        )}

        {column.getIsSorted() === "desc" && (
          <ArrowDown className="h-4 w-4" />
        )}
      </div>

      {/* ALWAYS VISIBLE MENU ICON */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="p-1 rounded hover:bg-white/20 transition"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-52">

          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp className="h-4 w-4 mr-2" />
            Sort by ASC
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown className="h-4 w-4 mr-2" />
            Sort by DESC
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setFilterOpen(true)}>
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOff className="h-4 w-4 mr-2" />
            Hide column
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setManageOpen(true)}>
            <Settings2 className="h-4 w-4 mr-2" />
            Manage columns
          </DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu>

      {filterOpen && (
        <FilterPanel column={column} onClose={() => setFilterOpen(false)} />
      )}

      {manageOpen && (
        <ManageColumnsPanel table={table} onClose={() => setManageOpen(false)} />
      )}

    </div>
  )
}


/* ============================= */
/* FILTER PANEL */
/* ============================= */

function FilterPanel({ column, onClose }: any) {

  const [value, setValue] = React.useState(column.getFilterValue() ?? "")

  return (
    <div className="absolute z-50 mt-2 w-80 rounded-md border bg-background p-4 shadow-lg">
      <div className="flex justify-between mb-3">
        <span className="font-medium">Filter</span>
        <button onClick={onClose}>✕</button>
      </div>

      <Input
        placeholder="contains..."
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          column.setFilterValue(e.target.value)
        }}
      />
    </div>
  )
}


/* ============================= */
/* MANAGE COLUMNS PANEL */
/* ============================= */

function ManageColumnsPanel({ table, onClose }: any) {

  const columns = table.getAllLeafColumns()

  return (
    <div className="absolute z-50 mt-2 w-96 rounded-md border bg-background p-4 shadow-lg">

      <div className="flex justify-between mb-3">
        <span className="font-medium">Manage Columns</span>
        <button onClick={onClose}>✕</button>
      </div>

      <div className="max-h-64 overflow-y-auto space-y-2">
        {columns.map((column: any) => (
          <div key={column.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={column.getIsVisible()}
              onChange={(e) =>
                column.toggleVisibility(e.target.checked)
              }
            />
            <span>{column.id}</span>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            table.getAllLeafColumns().forEach((col: any) =>
              col.toggleVisibility(true)
            )
          }
        >
          Show All
        </Button>
      </div>
    </div>
  )
}