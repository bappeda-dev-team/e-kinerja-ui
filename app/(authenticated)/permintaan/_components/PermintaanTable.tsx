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
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  ArrowUp,
  ArrowDown,
  Filter,
  EyeOff,
  Settings2,
  MoreVertical,
} from "lucide-react"

import type { PermintaanItem } from "./PermintaanClient" // Pastikan path ini sesuai ya!

interface Props {
  data: PermintaanItem[]
  onEdit: (item: PermintaanItem) => void
  onDelete: (id: string) => void
}

export default function PermintaanTable({
  data,
  onEdit,
  onDelete,
}: Props) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const columns: ColumnDef<PermintaanItem>[] = [
    {
      id: "no",
      header: "No",
      cell: ({ row }) => row.index + 1,
      enableSorting: false,
    },
    { accessorKey: "pemda", header: "Pemda" },
    { accessorKey: "nama_aplikasi", header: "Nama Aplikasi" },
    { accessorKey: "menu", header: "Menu" },
    { accessorKey: "kondisi_awal", header: "Kondisi Awal" },
    { accessorKey: "kondisi_diharapkan", header: "Kondisi Diharapkan" },
    { accessorKey: "tanggal_pesanan", header: "Tanggal Pesanan" },
    { accessorKey: "tanggal_deadline", header: "Tanggal Deadline" },
    {
      accessorKey: "attachments",
      header: "Attachment",
      cell: ({ row }) =>
        row.original.attachments?.length
          ? `${row.original.attachments.length} file`
          : "-",
      enableSorting: false,
    },
    {
      id: "aksi",
      header: "Aksi",
      cell: ({ row }) => (
        <div className="flex gap-2 justify-center">
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
      enableSorting: false,
    },
  ]

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    // MANTRA 1: min-w-0 & w-full memastikan komponen ini nggak bisa mekar melebihi parent-nya
    <div className="w-full min-w-0 space-y-4">
      
      {/* MANTRA 2: grid grid-cols-1 memaksa lebar maksimal adalah 100% dari kontainer */}
      <div className="grid grid-cols-1 w-full">
        
        {/* Kotak border terluar */}
        <div className="rounded-md border bg-background w-full overflow-hidden flex flex-col">
          
          {/* MANTRA 3: overflow-auto & max-h-[60vh] mengurung scroll bar di sini saja! */}
          <div className="w-full overflow-auto max-h-[60vh] relative">
            <Table className="w-full">
              {/* Header kita bikin nempel di atas (sticky) biar asyik pas di-scroll */}
              <TableHeader className="sticky top-0 z-10 bg-muted shadow-[0_1px_0_0_hsl(var(--border))]">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-none">
                    {headerGroup.headers.map((header) => (
                      <TableHead 
                        key={header.id} 
                        // MANTRA 4: whitespace-nowrap biar teks nggak turun ke bawah
                        className="text-left whitespace-nowrap bg-muted px-4 py-3"
                      >
                        {header.isPlaceholder ? null : (
                          <div className="flex items-center justify-start gap-1">
                            <span className="font-semibold text-sm">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </span>

                            {header.column.getCanSort() && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 focus-visible:ring-0"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                  <DropdownMenuItem onClick={() => header.column.toggleSorting(false)}>
                                    <ArrowUp className="mr-2 h-4 w-4" />
                                    Sort ASC
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => header.column.toggleSorting(true)}>
                                    <ArrowDown className="mr-2 h-4 w-4" />
                                    Sort DESC
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {header.column.getCanFilter() && (
                                    <div className="p-2 space-y-1">
                                      <div className="flex items-center gap-2 text-xs font-medium">
                                        <Filter className="h-4 w-4" />
                                        Filter
                                      </div>
                                      <Input
                                        placeholder="Filter value..."
                                        value={(header.column.getFilterValue() as string) ?? ""}
                                        onChange={(e) => header.column.setFilterValue(e.target.value)}
                                        className="h-8"
                                      />
                                    </div>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => header.column.toggleVisibility(false)}>
                                    <EyeOff className="mr-2 h-4 w-4" />
                                    Hide column
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <div className="p-2">
                                    <div className="flex items-center gap-2 text-xs font-medium mb-2">
                                      <Settings2 className="h-4 w-4" />
                                      Manage Columns
                                    </div>
                                    <div className="max-h-40 overflow-y-auto">
                                      {table.getAllColumns()
                                        .filter((column) => column.getCanHide())
                                        .map((column) => (
                                          <DropdownMenuCheckboxItem
                                            key={column.id}
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                          >
                                            {column.columnDef.header as string}
                                          </DropdownMenuCheckboxItem>
                                        ))}
                                    </div>
                                  </div>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell 
                          key={cell.id} 
                          // MANTRA 5: Sama seperti header, isi tabel pantang turun baris
                          className="text-left whitespace-nowrap px-4 py-3"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Tidak ada data.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
        <div>
          Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
          {table.getPageCount() || 1}
        </div>

        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Sebelumnya
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Selanjutnya
          </Button>
        </div>
      </div>
    </div>
  )
}