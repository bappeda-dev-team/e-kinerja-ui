"use client"

import { WifiOff, RefreshCw } from "lucide-react"

interface Props {
  onRetry?: () => void
}

export function NetworkError({ onRetry }: Props) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-red-100 bg-red-50/30 px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-5">
        <WifiOff className="h-8 w-8 text-red-500" />
      </div>
      <h2 className="text-lg font-bold text-[#202224] mb-2">Tidak Dapat Terhubung ke Server</h2>
      <p className="text-sm text-[#797A7C] max-w-xs">
        Jaringan kamu bermasalah atau server sedang tidak dapat diakses. Periksa koneksi internet dan coba lagi.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#4880FF] px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(72,128,255,0.3)] hover:bg-blue-600 active:scale-95 transition-all"
        >
          <RefreshCw className="h-4 w-4" />
          Coba Lagi
        </button>
      )}
    </div>
  )
}

export function isNetworkError(status: number) {
  return status === 0
}
