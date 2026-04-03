// data/dummy-permintaan.ts

export interface PermintaanItem {
  id: string
  pemda: string
  aplikasi: string
  menu: string
  deskripsi: string
  deadline: string
}

export const dummyPermintaan: PermintaanItem[] = [
  {
    id: "REQ001",
    pemda: "Pemda Kota Bandung",
    aplikasi: "E-Kinerja",
    menu: "Dashboard",
    deskripsi: "Pembuatan dashboard monitoring kinerja pegawai",
    deadline: "2025-06-15",
  },
  {
    id: "REQ002",
    pemda: "Pemda Kota Surabaya",
    aplikasi: "E-Kinerja",
    menu: "Laporan",
    deskripsi: "Penambahan fitur laporan otomatis",
    deadline: "2025-06-20",
  },
]