export interface LaporanKinerjaItem {
  id: string
  permintaan: string
  programmer: string
  progress: string
  status: number
  created_at: string
  updated_at: string
}

export const masterPegawai = [
  { id: "1", nama_pegawai: "ASEP SURYANA",   jabatan: "Programmer - Level 1" },
  { id: "2", nama_pegawai: "RIZKY MAULANA",  jabatan: "Programmer - Level 1" },
  { id: "3", nama_pegawai: "LINA WULANDARI", jabatan: "Programmer - Level 1" },
]

export const permintaanList = [
  { id: "p1", pemda: "Pemda Kota Bandung",     menu: "Dashboard" },
  { id: "p2", pemda: "Pemda Kota Surabaya",    menu: "Laporan" },
  { id: "p3", pemda: "Pemda Kabupaten Sragen", menu: "Pohon Kinerja" },
]

export const initialData: LaporanKinerjaItem[] = [
  {
    id: "1",
    permintaan: "Pemda Kota Bandung - Dashboard",
    programmer: "ASEP SURYANA",
    progress: "Optimasi query database untuk mempercepat loading dashboard",
    status: 50,
    created_at: "5 Mar 2025",
    updated_at: "5 Mar 2025",
  },
  {
    id: "2",
    permintaan: "Pemda Kota Bandung - Dashboard",
    programmer: "RIZKY MAULANA",
    progress: "Fitur laporan hampir selesai, sedang dalam tahap testing",
    status: 75,
    created_at: "5 Mar 2025",
    updated_at: "5 Mar 2025",
  },
  {
    id: "3",
    permintaan: "Pemda Kota Bandung - Dashboard",
    programmer: "LINA WULANDARI",
    progress: "Optimasi query database untuk mempercepat loading dashboard",
    status: 25,
    created_at: "5 Mar 2025",
    updated_at: "5 Mar 2025",
  },
  {
    id: "4",
    permintaan: "Pemda Kota Bandung - Dashboard",
    programmer: "ASEP SURYANA",
    progress: "Optimasi query database untuk mempercepat loading dashboard",
    status: 0,
    created_at: "5 Mar 2025",
    updated_at: "5 Mar 2025",
  },
  {
    id: "5",
    permintaan: "Pemda Kota Bandung - Dashboard",
    programmer: "RIZKY MAULANA",
    progress: "Optimasi query database untuk mempercepat loading dashboard",
    status: 100,
    created_at: "5 Mar 2025",
    updated_at: "5 Mar 2025",
  },
  {
    id: "6",
    permintaan: "Pemda Kota Bandung - Dashboard",
    programmer: "LINA WULANDARI",
    progress: "Optimasi query database untuk mempercepat loading dashboard",
    status: 50,
    created_at: "5 Mar 2025",
    updated_at: "5 Mar 2025",
  },
  {
    id: "7",
    permintaan: "Pemda Kota Bandung - Dashboard",
    programmer: "ASEP SURYANA",
    progress: "Optimasi query database untuk mempercepat loading dashboard",
    status: 75,
    created_at: "5 Mar 2025",
    updated_at: "5 Mar 2025",
  },
  {
    id: "8",
    permintaan: "Pemda Kota Bandung - Dashboard",
    programmer: "RIZKY MAULANA",
    progress: "Optimasi query database untuk mempercepat loading dashboard",
    status: 25,
    created_at: "5 Mar 2025",
    updated_at: "5 Mar 2025",
  },
]
