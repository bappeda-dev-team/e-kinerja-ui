"use client";

import { useEffect, useState } from "react";
import type { PermintaanResponse } from "../../permintaan/_types";

interface Props {
  data: PermintaanResponse[];
  loading?: boolean;
}

function formatDate(iso?: string) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// --- Komponen Hybrid Loader ---
const HybridLoader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) =>
        prev >= 90 ? prev : prev + Math.floor(Math.random() * 10)
      );
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
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

        {/* Ikon tengah */}
        <div className="absolute flex flex-col items-center">
          <span className="text-blue-600 animate-bounce">⏳</span>
          <span className="text-[10px] font-bold text-blue-600">
            {progress}%
          </span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-[#202224]">
          Sedang memproses...
        </p>
        <p className="text-[11px] text-[#202224]/50">
          Mohon tunggu sebentar
        </p>
      </div>
    </div>
  );
};

export default function RecentRequests({ data, loading }: Props) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#202224]">
          Permintaan Terbaru
        </h2>
      </div>

      {loading ? (
        <HybridLoader />
      ) : data.length === 0 ? (
        <p className="text-sm text-[#202224]/40 py-10 text-center">
          Belum ada permintaan.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="rounded bg-[#F1F4F9] text-[#202224] font-bold">
                <th className="rounded-l-md px-3 py-2 text-left">Pemda</th>
                <th className="px-3 py-2 text-left">Aplikasi</th>
                <th className="px-3 py-2 text-left">Menu</th>
                <th className="rounded-r-md px-3 py-2 text-left">
                  Deadline
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-[#979797]/20 last:border-0 hover:bg-gray-50 transition-colors"
                >
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
        </div>
      )}
    </div>
  );
}