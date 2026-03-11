"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

import PermintaanTable from "./PermintaanTable"
import AddPermintaan from "./modals/AddPermintaan"
import EditPermintaan from "./modals/EditPermintaan"

export interface PermintaanItem {
  id: string
  pemda: string
  nama_aplikasi: string
  menu: string
  kondisi_awal: string
  kondisi_diharapkan: string
  tanggal_pesanan: string
  tanggal_deadline: string
  dibuat_oleh: string
  created_at: string
}

export default function PermintaanClient() {

  const [data, setData] = useState<PermintaanItem[]>([
    { id: "1",  pemda: "Pemda Kota Bandung",    nama_aplikasi: "E-Kinerja",     menu: "Dashboard",        kondisi_awal: "Loading lama",                              kondisi_diharapkan: "Loading < 2 detik",                dibuat_oleh: "Agung",  tanggal_pesanan: "2026-03-01", tanggal_deadline: "2026-04-10", created_at: "2026-03-01" },
    { id: "2",  pemda: "Pemda Kab Sragen",      nama_aplikasi: "E-Budgeting",   menu: "Login",            kondisi_awal: "Laman login tidak bisa redirecting",        kondisi_diharapkan: "Laman login berfungsi normal",     dibuat_oleh: "Budi",   tanggal_pesanan: "2026-03-05", tanggal_deadline: "2026-04-21", created_at: "2026-03-05" },
    { id: "3",  pemda: "Pemda Kota Semarang",   nama_aplikasi: "Kertas Kerja",  menu: "Pohon Kinerja",    kondisi_awal: "Pokin tidak bisa add anak",                 kondisi_diharapkan: "Pokin berfungsi normal",           dibuat_oleh: "Citra",  tanggal_pesanan: "2026-03-08", tanggal_deadline: "2026-04-29", created_at: "2026-03-08" },
    { id: "4",  pemda: "Pemda Kab Ngawi",       nama_aplikasi: "Pengajuan KTA", menu: "Register",         kondisi_awal: "Pengguna tidak bisa mendaftarkan akun baru",kondisi_diharapkan: "Pengguna bisa mendaftarkan akun baru", dibuat_oleh: "Deni", tanggal_pesanan: "2026-03-10", tanggal_deadline: "2026-05-03", created_at: "2026-03-10" },
    { id: "5",  pemda: "Pemda Kota Madiun",     nama_aplikasi: "E-Kinerja",     menu: "Dashboard",        kondisi_awal: "Dashboard tidak muncul",                    kondisi_diharapkan: "Dashboard muncul",                 dibuat_oleh: "Eko",    tanggal_pesanan: "2026-03-12", tanggal_deadline: "2026-05-11", created_at: "2026-03-12" },
    { id: "6",  pemda: "Pemda Kab Madiun",      nama_aplikasi: "E-Planning",    menu: "Dashboard",        kondisi_awal: "Dashboard tidak memuat ringkasan data",     kondisi_diharapkan: "Dashboard memuat ringkasan data",  dibuat_oleh: "Fitri",  tanggal_pesanan: "2026-03-15", tanggal_deadline: "2026-05-30", created_at: "2026-03-15" },
    { id: "7",  pemda: "Pemda Kota Kediri",     nama_aplikasi: "E-KAK",         menu: "Laporan Kinerja",  kondisi_awal: "Tidak bisa mengunduh PDF",                  kondisi_diharapkan: "Bisa mengunduh PDF",               dibuat_oleh: "Galih",  tanggal_pesanan: "2026-03-18", tanggal_deadline: "2026-06-07", created_at: "2026-03-18" },
    { id: "8",  pemda: "Pemda Kota Blitar",     nama_aplikasi: "Kertas Kerja",  menu: "Pohon Cascading",  kondisi_awal: "Pohon cascading tidak muncul",              kondisi_diharapkan: "Pohon cascading muncul",           dibuat_oleh: "Hani",   tanggal_pesanan: "2026-03-20", tanggal_deadline: "2026-06-15", created_at: "2026-03-20" },
    { id: "9",  pemda: "Pemda Kota Surakarta",  nama_aplikasi: "Data Kinerja",  menu: "Data Master",      kondisi_awal: "Tidak bisa menambahkan data",               kondisi_diharapkan: "Bisa menambahkan data",            dibuat_oleh: "Irma",   tanggal_pesanan: "2026-03-22", tanggal_deadline: "2026-06-19", created_at: "2026-03-22" },
    { id: "10", pemda: "Pemda Kab Sukoharjo",   nama_aplikasi: "E-Kinerja",     menu: "Laporan",          kondisi_awal: "Grafik tidak tampil",                       kondisi_diharapkan: "Grafik tampil dengan benar",       dibuat_oleh: "Joko",   tanggal_pesanan: "2026-03-25", tanggal_deadline: "2026-06-22", created_at: "2026-03-25" },
    { id: "11", pemda: "Pemda Kota Malang",     nama_aplikasi: "E-Budgeting",   menu: "Anggaran",         kondisi_awal: "Data anggaran tidak tersimpan",             kondisi_diharapkan: "Data anggaran tersimpan",          dibuat_oleh: "Kasih",  tanggal_pesanan: "2026-03-28", tanggal_deadline: "2026-06-28", created_at: "2026-03-28" },
    { id: "12", pemda: "Pemda Kab Malang",      nama_aplikasi: "E-Planning",    menu: "Rencana Kerja",    kondisi_awal: "Tidak bisa ekspor Excel",                   kondisi_diharapkan: "Bisa ekspor Excel",                dibuat_oleh: "Lena",   tanggal_pesanan: "2026-04-01", tanggal_deadline: "2026-07-01", created_at: "2026-04-01" },
    { id: "13", pemda: "Pemda Kota Surabaya",   nama_aplikasi: "E-Kinerja",     menu: "Indikator",        kondisi_awal: "Filter tidak berfungsi",                    kondisi_diharapkan: "Filter berfungsi normal",          dibuat_oleh: "Mira",   tanggal_pesanan: "2026-04-03", tanggal_deadline: "2026-07-05", created_at: "2026-04-03" },
    { id: "14", pemda: "Pemda Kab Sidoarjo",    nama_aplikasi: "E-Absensi",     menu: "Rekap",            kondisi_awal: "Rekap absensi kosong",                      kondisi_diharapkan: "Rekap absensi terisi",             dibuat_oleh: "Nando",  tanggal_pesanan: "2026-04-05", tanggal_deadline: "2026-07-10", created_at: "2026-04-05" },
    { id: "15", pemda: "Pemda Kota Mojokerto",  nama_aplikasi: "E-Office",      menu: "Surat Masuk",      kondisi_awal: "Surat tidak bisa diunggah",                 kondisi_diharapkan: "Surat bisa diunggah",              dibuat_oleh: "Oki",    tanggal_pesanan: "2026-04-07", tanggal_deadline: "2026-07-15", created_at: "2026-04-07" },
    { id: "16", pemda: "Pemda Kab Mojokerto",   nama_aplikasi: "Pohon Kinerja", menu: "Cascading",        kondisi_awal: "Node cascading tidak tersambung",           kondisi_diharapkan: "Node cascading tersambung",        dibuat_oleh: "Putri",  tanggal_pesanan: "2026-04-09", tanggal_deadline: "2026-07-20", created_at: "2026-04-09" },
    { id: "17", pemda: "Pemda Kota Pasuruan",   nama_aplikasi: "E-KAK",         menu: "Upload Dokumen",   kondisi_awal: "Dokumen gagal terunggah",                   kondisi_diharapkan: "Dokumen berhasil diunggah",        dibuat_oleh: "Rudi",   tanggal_pesanan: "2026-04-10", tanggal_deadline: "2026-07-25", created_at: "2026-04-10" },
    { id: "18", pemda: "Pemda Kab Pasuruan",    nama_aplikasi: "Data Kinerja",  menu: "Monitoring",       kondisi_awal: "Data monitoring tidak update",              kondisi_diharapkan: "Data monitoring real-time",        dibuat_oleh: "Sari",   tanggal_pesanan: "2026-04-11", tanggal_deadline: "2026-07-30", created_at: "2026-04-11" },
    { id: "19", pemda: "Pemda Kota Probolinggo",nama_aplikasi: "E-Budgeting",   menu: "Realisasi",        kondisi_awal: "Realisasi tidak bisa diedit",               kondisi_diharapkan: "Realisasi bisa diedit",            dibuat_oleh: "Toni",   tanggal_pesanan: "2026-04-12", tanggal_deadline: "2026-08-01", created_at: "2026-04-12" },
    { id: "20", pemda: "Pemda Kab Probolinggo", nama_aplikasi: "E-Planning",    menu: "Evaluasi",         kondisi_awal: "Evaluasi tidak tersimpan otomatis",         kondisi_diharapkan: "Evaluasi tersimpan otomatis",      dibuat_oleh: "Udin",   tanggal_pesanan: "2026-04-13", tanggal_deadline: "2026-08-05", created_at: "2026-04-13" },
    { id: "21", pemda: "Pemda Kota Batu",       nama_aplikasi: "E-Kinerja",     menu: "Cetak Laporan",    kondisi_awal: "Cetak laporan error 500",                   kondisi_diharapkan: "Cetak laporan berjalan normal",    dibuat_oleh: "Vera",   tanggal_pesanan: "2026-04-14", tanggal_deadline: "2026-08-10", created_at: "2026-04-14" },
    { id: "22", pemda: "Pemda Kab Jombang",     nama_aplikasi: "E-Absensi",     menu: "Check-in",         kondisi_awal: "Check-in tidak terekam",                    kondisi_diharapkan: "Check-in terekam dengan benar",    dibuat_oleh: "Wawan",  tanggal_pesanan: "2026-04-15", tanggal_deadline: "2026-08-15", created_at: "2026-04-15" },
    { id: "23", pemda: "Pemda Kab Blitar",      nama_aplikasi: "E-Office",      menu: "Disposisi",        kondisi_awal: "Disposisi tidak terkirim",                  kondisi_diharapkan: "Disposisi terkirim ke penerima",   dibuat_oleh: "Xena",   tanggal_pesanan: "2026-04-16", tanggal_deadline: "2026-08-20", created_at: "2026-04-16" },
    { id: "24", pemda: "Pemda Kab Kediri",      nama_aplikasi: "Kertas Kerja",  menu: "Matriks",          kondisi_awal: "Matriks tidak bisa disimpan",               kondisi_diharapkan: "Matriks bisa disimpan",            dibuat_oleh: "Yoga",   tanggal_pesanan: "2026-04-17", tanggal_deadline: "2026-08-25", created_at: "2026-04-17" },
  ])

  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState<PermintaanItem | null>(null)

  const handleAdd = (val: PermintaanItem) => {

    toast.success("Permintaan berhasil ditambahkan")

    setData(prev => [
      ...prev,
      { ...val, id: Date.now().toString() }
    ])

  }

  const handleEdit = (val: PermintaanItem) => {

    toast.success("Permintaan berhasil diperbarui")

    setData(prev =>
      prev.map(item =>
        item.id === val.id ? val : item
      )
    )

  }

  const handleDelete = (id: string) => {

    toast.success("Permintaan berhasil dihapus")

    setData(prev =>
      prev.filter(item => item.id !== id)
    )

  }

  return (

    <div className="px-4 space-y-6">

      <div className="flex justify-between items-center">

        <h2 className="text-2xl font-bold text-[#202224]">
          Permintaan Klien
        </h2>

        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md font-bold text-sm transition"
        >
          + Tambah Permintaan
        </button>

      </div>

      <PermintaanTable
        data={data}
        onEdit={setEditItem}
        onDelete={handleDelete}
      />

      {showAdd && (
        <AddPermintaan
          onClose={() => setShowAdd(false)}
          onSave={(val) => {
            handleAdd(val)
            setShowAdd(false)
          }}
        />
      )}

      {editItem && (
        <EditPermintaan
          data={editItem}
          onClose={() => setEditItem(null)}
          onSave={(val) => {
            handleEdit(val)
            setEditItem(null)
          }}
        />
      )}

    </div>

  )

}