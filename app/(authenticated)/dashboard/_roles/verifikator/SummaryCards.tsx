import { BadgeCheck, ClipboardList, Clock3 } from "lucide-react"

interface SummaryCardsProps {
  menunggu: number
  revisi: number
  terverifikasi: number
}

export default function SummaryCards({ menunggu, revisi, terverifikasi }: SummaryCardsProps) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-base font-semibold text-[#202224]/70">Menunggu Verifikasi</p>
            <p className="mt-3 text-4xl font-bold text-[#202224]">{menunggu}</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E4EBFA]">
            <ClipboardList className="h-7 w-7 text-[#5065F6]" />
          </div>
        </div>
        <p className="text-sm font-semibold text-[#FD5454]">
          {menunggu > 0 ? "Masih ada laporan baru yang belum diperiksa." : "Tidak ada antrean baru."}
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-base font-semibold text-[#202224]/70">Perlu Revisi</p>
            <p className="mt-3 text-4xl font-bold text-[#202224]">{revisi}</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF1D8]">
            <Clock3 className="h-7 w-7 text-[#FF9F43]" />
          </div>
        </div>
        <p className="text-sm font-semibold text-[#202224]/70">Perlu follow up ke programmer agar perbaikan cepat selesai.</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-base font-semibold text-[#202224]/70">Terverifikasi</p>
            <p className="mt-3 text-4xl font-bold text-[#202224]">{terverifikasi}</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D9F7E8]">
            <BadgeCheck className="h-7 w-7 text-[#00B69B]" />
          </div>
        </div>
        <p className="text-sm font-semibold text-[#00B69B]">
          {terverifikasi > 0 ? "Laporan yang sudah selesai diverifikasi." : "Belum ada laporan selesai."}
        </p>
      </div>
    </div>
  )
}
