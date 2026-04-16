// app/verifikator/verifikasi/mock-data.ts

import type { VerifikasiStatus } from "./utils"

export interface MockProgrammer {
  id: string
  nama: string
  jabatan: string
}

export interface MockPekerjaan {
  id: string
  pemda_id: string
  aplikasi: string
  menu: string
  deadline: string
  created_at: string
  programmer: MockProgrammer
  laporan_progress: string
  status_progress: number // 0 | 25 | 50 | 75 | 100
  status: VerifikasiStatus
  komentar_verifikator?: string
}

export interface MockPemda {
  id: string
  nama: string
  logo?: string
  latest_laporan_at: string
  pekerjaan: MockPekerjaan[]
}

export const MOCK_PIPELINE: MockPemda[] = [
  {
    id: "pemda-1",
    nama: "Kota Bandung",
    latest_laporan_at: "2026-04-16T09:30:00Z",
    pekerjaan: [
      {
        id: "pek-1-1",
        pemda_id: "pemda-1",
        aplikasi: "SIPD",
        menu: "Manajemen Anggaran",
        deadline: "2026-04-20T00:00:00Z",
        created_at: "2026-04-16T09:30:00Z",
        programmer: { id: "prog-1", nama: "Andi Saputra", jabatan: "Programmer" },
        laporan_progress: "Sudah selesai implementasi modul anggaran, tinggal testing akhir dan dokumentasi.",
        status_progress: 75,
        status: "menunggu",
      },
      {
        id: "pek-1-2",
        pemda_id: "pemda-1",
        aplikasi: "SIPD",
        menu: "Laporan Realisasi",
        deadline: "2026-04-25T00:00:00Z",
        created_at: "2026-04-14T14:00:00Z",
        programmer: { id: "prog-2", nama: "Budi Santoso", jabatan: "Programmer" },
        laporan_progress: "Fitur export PDF sudah berjalan. Masih ada bug pada filter tanggal yang sedang diperbaiki.",
        status_progress: 50,
        status: "revisi",
        komentar_verifikator: "Tolong perbaiki bug filter tanggal terlebih dahulu sebelum dikirim ulang.",
      },
      {
        id: "pek-1-3",
        pemda_id: "pemda-1",
        aplikasi: "e-Musrenbang",
        menu: "Input Usulan Masyarakat",
        deadline: "2026-05-01T00:00:00Z",
        created_at: "2026-04-12T10:00:00Z",
        programmer: { id: "prog-1", nama: "Andi Saputra", jabatan: "Programmer" },
        laporan_progress: "Seluruh fitur input usulan telah selesai dan sudah diuji coba bersama dinas terkait.",
        status_progress: 100,
        status: "terverifikasi",
      },
    ],
  },
  {
    id: "pemda-2",
    nama: "Kabupaten Bogor",
    latest_laporan_at: "2026-04-15T16:45:00Z",
    pekerjaan: [
      {
        id: "pek-2-1",
        pemda_id: "pemda-2",
        aplikasi: "SIMDA",
        menu: "Penatausahaan Keuangan",
        deadline: "2026-04-22T00:00:00Z",
        created_at: "2026-04-15T16:45:00Z",
        programmer: { id: "prog-3", nama: "Citra Dewi", jabatan: "Programmer" },
        laporan_progress: "Modul penatausahaan sudah selesai 75%, masih perlu finalisasi validasi data input.",
        status_progress: 75,
        status: "menunggu",
      },
      {
        id: "pek-2-2",
        pemda_id: "pemda-2",
        aplikasi: "SIMDA",
        menu: "Rekonsiliasi Aset",
        deadline: "2026-04-30T00:00:00Z",
        created_at: "2026-04-13T11:00:00Z",
        programmer: { id: "prog-4", nama: "Deni Pratama", jabatan: "Programmer" },
        laporan_progress: "Progress rekonsiliasi aset sudah mencapai 50%, sedang proses sinkronisasi data dari dinas.",
        status_progress: 50,
        status: "menunggu",
      },
    ],
  },
  {
    id: "pemda-3",
    nama: "Kota Depok",
    latest_laporan_at: "2026-04-15T08:00:00Z",
    pekerjaan: [
      {
        id: "pek-3-1",
        pemda_id: "pemda-3",
        aplikasi: "e-Kinerja",
        menu: "Penilaian SKP",
        deadline: "2026-04-18T00:00:00Z",
        created_at: "2026-04-15T08:00:00Z",
        programmer: { id: "prog-2", nama: "Budi Santoso", jabatan: "Programmer" },
        laporan_progress: "Fitur penilaian SKP sudah selesai 100%, siap untuk UAT bersama pengguna.",
        status_progress: 100,
        status: "terverifikasi",
        komentar_verifikator: "Bagus, lanjutkan ke fase UAT.",
      },
      {
        id: "pek-3-2",
        pemda_id: "pemda-3",
        aplikasi: "e-Kinerja",
        menu: "Dashboard Pimpinan",
        deadline: "2026-05-05T00:00:00Z",
        created_at: "2026-04-10T09:00:00Z",
        programmer: { id: "prog-5", nama: "Eka Rahayu", jabatan: "Programmer" },
        laporan_progress: "Dashboard sudah menampilkan grafik utama. Masih perlu tambah widget realisasi anggaran.",
        status_progress: 50,
        status: "revisi",
        komentar_verifikator: "Tambahkan widget realisasi anggaran sesuai spesifikasi yang sudah dikirim.",
      },
      {
        id: "pek-3-3",
        pemda_id: "pemda-3",
        aplikasi: "SIPD",
        menu: "Monitoring Kegiatan",
        deadline: "2026-05-10T00:00:00Z",
        created_at: "2026-04-08T13:00:00Z",
        programmer: { id: "prog-3", nama: "Citra Dewi", jabatan: "Programmer" },
        laporan_progress: "Modul monitoring kegiatan sedang dalam tahap development, baru selesai 25%.",
        status_progress: 25,
        status: "menunggu",
      },
    ],
  },
  {
    id: "pemda-4",
    nama: "Kabupaten Bekasi",
    latest_laporan_at: "2026-04-14T13:20:00Z",
    pekerjaan: [
      {
        id: "pek-4-1",
        pemda_id: "pemda-4",
        aplikasi: "SIMRS",
        menu: "Pendaftaran Pasien",
        deadline: "2026-04-28T00:00:00Z",
        created_at: "2026-04-14T13:20:00Z",
        programmer: { id: "prog-1", nama: "Andi Saputra", jabatan: "Programmer" },
        laporan_progress: "Fitur pendaftaran pasien online sudah selesai dan terintegrasi dengan BPJS.",
        status_progress: 100,
        status: "terverifikasi",
      },
    ],
  },
  {
    id: "pemda-5",
    nama: "Kota Bekasi",
    latest_laporan_at: "2026-04-13T10:00:00Z",
    pekerjaan: [
      {
        id: "pek-5-1",
        pemda_id: "pemda-5",
        aplikasi: "e-Office",
        menu: "Surat Masuk & Keluar",
        deadline: "2026-04-19T00:00:00Z",
        created_at: "2026-04-13T10:00:00Z",
        programmer: { id: "prog-4", nama: "Deni Pratama", jabatan: "Programmer" },
        laporan_progress: "Modul surat masuk sudah selesai, surat keluar masih dalam proses development 60%.",
        status_progress: 75,
        status: "menunggu",
      },
      {
        id: "pek-5-2",
        pemda_id: "pemda-5",
        aplikasi: "e-Office",
        menu: "Disposisi Digital",
        deadline: "2026-05-15T00:00:00Z",
        created_at: "2026-04-11T15:00:00Z",
        programmer: { id: "prog-5", nama: "Eka Rahayu", jabatan: "Programmer" },
        laporan_progress: "Fitur disposisi digital baru mulai dikerjakan, masih 0% progress.",
        status_progress: 0,
        status: "menunggu",
      },
    ],
  },
]
