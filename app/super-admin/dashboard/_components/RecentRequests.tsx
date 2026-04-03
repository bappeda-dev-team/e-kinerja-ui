import { useState, useEffect } from "react";
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, TableIcon } from "lucide-react";
import Link from "next/link";
import type { DashboardPermintaanItem } from "../_types";

const PAGE_SIZE = 10;

interface Props {
  data: DashboardPermintaanItem[];
  loading?: boolean;
}

// --- Komponen Hybrid Loader ---
const HybridLoader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? prev : prev + Math.floor(Math.random() * 10)));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4 min-h-[300px]">
      <div className="relative flex items-center justify-center">
        {/* Lingkaran Progress */}
        <svg className="w-24 h-24 transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-blue-100"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={251.2}
            strokeDashoffset={251.2 - (251.2 * progress) / 100}
            className="text-blue-600 transition-all duration-300 ease-out"
            strokeLinecap="round"
          />
        </svg>
        
        {/* Ikon Jam Pasir di Tengah */}
        <div className="absolute flex flex-col items-center">
          <span className="text-blue-600 animate-bounce text-xl">⏳</span>
          <span className="text-[10px] font-bold text-blue-600">{progress}%</span>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-sm font-semibold text-[#202224]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            Sedang memproses...
        </p>
        <p className="text-[11px] text-[#202224]/50" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            Mohon tunggu sebentar
        </p>
      </div>
    </div>
  );
};

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  proses:  { label: "Dalam Proses", className: "bg-[#FFA756]/15 text-[#FFA756]" },
  selesai: { label: "Selesai",      className: "bg-[#00B69B]/15 text-[#00B69B]" },
  revisi:  { label: "Revisi",       className: "bg-[#FD5454]/15 text-[#FD5454]" },
  pending: { label: "Pending",      className: "bg-gray-100 text-gray-500" },
}

function StatusBadge({ status }: { status?: string }) {
  const key = (status ?? "").toLowerCase()
  const cfg = STATUS_MAP[key] ?? { label: status ?? "-", className: "bg-gray-100 text-gray-500" }
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${cfg.className}`}>
      {cfg.label}
    </span>
  )
}

function formatDate(iso?: string) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function RecentRequests({ data, loading }: Props) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageData = data.slice(start, start + PAGE_SIZE);

  // Reset ke page 1 kalau data berubah
  useEffect(() => { setPage(1); }, [data]);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#202224]">Permintaan Terbaru</h2>
        <Link
          href="/permintaan"
          className="flex items-center gap-2 rounded-xl border border-[#202224]/15 px-4 py-2 text-sm font-semibold text-[#202224] hover:bg-[#F1F4F9] transition-colors"
        >
          <TableIcon className="h-4 w-4" />
          Lihat Semua (Tabel)
        </Link>
      </div>

      {loading ? (
        <HybridLoader />
      ) : data.length === 0 ? (
        <p className="text-sm text-[#202224]/40 py-12 text-center">Belum ada permintaan.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
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
                {pageData.map((row) => (
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
                    <td className="px-3 py-3">
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#979797]/15 text-sm text-[#202224]/70">
            <span className="font-medium">
              {start + 1}–{Math.min(start + PAGE_SIZE, data.length)} dari {data.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="p-1.5 rounded-lg hover:bg-[#F1F4F9] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronFirst className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className="p-1.5 rounded-lg hover:bg-[#F1F4F9] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-2 font-semibold text-[#202224]">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg hover:bg-[#F1F4F9] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg hover:bg-[#F1F4F9] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLast className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}