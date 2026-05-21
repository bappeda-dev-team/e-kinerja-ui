"use client"

import { ShieldX } from "lucide-react"
import { logout } from "@/lib/logout"

export default function UnauthorizedPage() {
  const handleBackToLogin = () => logout()

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white gap-4">
      <ShieldX className="w-16 h-16 text-red-400" />
      <h1 className="text-2xl font-bold text-gray-800">Akses Ditolak</h1>
      <p className="text-gray-500 text-sm">
        Anda tidak memiliki izin untuk mengakses halaman ini.
      </p>
      <button
        onClick={handleBackToLogin}
        className="mt-4 px-6 py-2.5 bg-[#4880FF] text-white font-semibold rounded-xl hover:opacity-90"
      >
        Kembali ke Login
      </button>
    </div>
  )
}
