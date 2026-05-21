import Link from "next/link"
import { FileQuestion } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white gap-4">
      <FileQuestion className="w-16 h-16 text-gray-400" />
      <h1 className="text-2xl font-bold text-gray-800">404 - Halaman Tidak Ditemukan</h1>
      <p className="text-gray-500 text-sm">
        Halaman yang Anda cari tidak ada atau telah dipindahkan.
      </p>
      <Link
        href="/"
        className="mt-4 px-6 py-2.5 bg-[#4880FF] text-white font-semibold rounded-xl hover:opacity-90"
      >
        Kembali ke Beranda
      </Link>
    </div>
  )
}
