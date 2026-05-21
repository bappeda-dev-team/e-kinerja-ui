"use client"

import LaporanKinerjaClient from "@/app/super-admin/laporan/_components/LaporanKinerjaClient"

export default function SuperAdminLaporan({ mode }: { mode?: "full" | "rekap-only" }) {
  return <LaporanKinerjaClient mode={mode} />
}
