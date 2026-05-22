
/** status dari API: "0" | "25" | "50" | "75" | "100" */
export function mapStatusToProgress(status?: string | null): number {
  const n = parseInt(status ?? "", 10)
  if (n === 100) return 100
  if (n === 75) return 75
  if (n === 50) return 50
  if (n === 25) return 25
  return 0
}

/** Konversi progress number ke nilai status yang dikirim ke API */
export function mapProgressToStatus(progress?: number | null): string {
  if (progress === 100) return "100"
  if (progress === 75) return "75"
  if (progress === 50) return "50"
  if (progress === 25) return "25"
  return "0"
}

export function getProgressBadgeClass(progress: number): string {
  if (progress >= 100) return "bg-green-100 text-green-600"
  if (progress >= 75) return "bg-yellow-100 text-yellow-600"
  if (progress >= 50) return "bg-orange-100 text-orange-500"
  if (progress >= 25) return "bg-red-100 text-red-500"
  return "bg-gray-200 text-gray-500"
}
