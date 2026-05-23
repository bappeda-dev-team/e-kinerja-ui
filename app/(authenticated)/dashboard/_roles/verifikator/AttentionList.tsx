import {
  formatDateLabel,
  formatDateTimeLabel,
  getStatusMeta,
  isNearDeadline,
  type VerifikasiListItem,
} from "@/app/(authenticated)/verifikasi/_roles/verifikator/utils"
import EmptyState from "./EmptyState"

interface AttentionListProps {
  items: VerifikasiListItem[]
  loading: boolean
}

export default function AttentionList({ items, loading }: AttentionListProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <div>
          <h2 className="text-2xl font-bold text-[#202224]">Perlu Perhatian Segera</h2>
          <p className="text-sm text-[#202224]/55">Menampilkan verifikasi yang belum selesai dan sudah melewati deadline.</p>
        </div>
      </div>

      {loading ? (
        <EmptyState label="Memuat daftar prioritas..." />
      ) : items.length === 0 ? (
        <EmptyState label="Belum ada verifikasi yang melewati deadline." />
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const statusMeta = getStatusMeta(item.status)

            return (
              <div key={item.id} className="rounded-2xl border border-[#F0F1F5] p-5 transition-colors hover:bg-[#FAFBFD]">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      {item.pemdaLogo ? (
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-100 bg-white p-1">
                          <img src={item.pemdaLogo} alt={item.pemdaName} className="h-full w-full object-contain" />
                        </div>
                      ) : (
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">
                          {item.pemdaName.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-base font-bold text-[#202224]">{item.pemdaName}</p>
                        <p className="truncate text-sm text-[#202224]/60">
                          {item.aplikasiName}
                          {item.menu ? ` · ${item.menu}` : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset ${statusMeta.badgeClass}`}>
                    {statusMeta.label}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 text-sm text-[#202224]/70 md:grid-cols-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#202224]/45">Programmer</p>
                    <p className="mt-1 font-semibold text-[#202224]">{item.programmer}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#202224]/45">Deadline</p>
                    <p className={`mt-1 font-semibold ${isNearDeadline(item.tanggalDeadline) ? "text-red-600" : "text-[#202224]"}`}>
                      {formatDateLabel(item.tanggalDeadline)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#202224]/45">Diperbarui</p>
                    <p className="mt-1 font-semibold text-[#202224]">{formatDateTimeLabel(item.diperbaruiPada)}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#202224]/45">Progress</p>
                    <p className="mt-1 line-clamp-2 text-sm text-[#202224]/75">{item.progress || "-"}</p>
                  </div>
                  {item.komentar ? (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#202224]/45">Komentar Verifikasi</p>
                      <p className="mt-1 line-clamp-2 text-sm italic text-[#5065F6]">"{item.komentar}"</p>
                    </div>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
