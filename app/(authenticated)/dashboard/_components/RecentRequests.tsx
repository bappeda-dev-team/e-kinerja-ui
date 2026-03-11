import { ChevronRight } from "lucide-react"
import { recentRequests } from "../data"

export default function RecentRequests() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#202224]">
          Permintaan Terbaru
        </h2>
        <button className="flex items-center gap-1 rounded border border-gray-200 px-3 py-1 text-sm text-[#202224]/70 hover:bg-gray-50">
          Mei
          <ChevronRight className="h-3 w-3 rotate-90" />
        </button>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="rounded bg-[#F1F4F9] text-[#202224] font-bold">
            <th className="rounded-l-md px-3 py-2 text-left">Pemda</th>
            <th className="px-3 py-2 text-left">Aplikasi</th>
            <th className="px-3 py-2 text-left">Menu</th>
            <th className="px-3 py-2 text-left">Deadline</th>
            <th className="rounded-r-md px-3 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {recentRequests.map((row, i) => (
            <tr key={i} className="border-b border-[#979797]/20 last:border-0">
              <td className="px-3 py-3 text-[#202224]/80 font-semibold">
                {row.pemda}
              </td>
              <td className="px-3 py-3 text-[#202224]/80 font-semibold">
                {row.aplikasi}
              </td>
              <td className="px-3 py-3 text-[#202224]/80 font-semibold">
                {row.menu}
              </td>
              <td className="px-3 py-3 text-[#202224]/80 font-semibold">
                {row.deadline}
              </td>
              <td className="px-3 py-3">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold text-white ${row.statusColor}`}
                >
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
