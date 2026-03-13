import type { PermintaanResponse } from "../../permintaan/_types"

interface Props {
  data: PermintaanResponse[]
  loading?: boolean
}

function formatDate(iso?: string) {
  if (!iso) return "-"
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export default function RecentRequests({ data, loading }: Props) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#202224]">
          Permintaan Terbaru
        </h2>
      </div>

      {loading ? (
        <p className="text-sm text-[#202224]/40 py-4 text-center">Memuat data...</p>
      ) : data.length === 0 ? (
        <p className="text-sm text-[#202224]/40 py-4 text-center">Belum ada permintaan.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="rounded bg-[#F1F4F9] text-[#202224] font-bold">
              <th className="rounded-l-md px-3 py-2 text-left">Pemda</th>
              <th className="px-3 py-2 text-left">Aplikasi</th>
              <th className="px-3 py-2 text-left">Menu</th>
              <th className="rounded-r-md px-3 py-2 text-left">Deadline</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-b border-[#979797]/20 last:border-0">
                <td className="px-3 py-3 text-[#202224]/80 font-semibold">
                  {row.pemda?.name ?? "-"}
                </td>
                <td className="px-3 py-3 text-[#202224]/80 font-semibold">
                  {row.aplikasi?.name ?? "-"}
                </td>
                <td className="px-3 py-3 text-[#202224]/80 font-semibold">
                  {row.menu}
                </td>
                <td className="px-3 py-3 text-[#202224]/80 font-semibold">
                  {formatDate(row.tanggal_deadline)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
