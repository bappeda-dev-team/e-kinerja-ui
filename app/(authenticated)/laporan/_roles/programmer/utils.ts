
export function mapStatusToProgress(status?: string | null): number {
  const normalized = status?.toLowerCase().trim()

  if (normalized === "hijau") return 100
  if (normalized === "kuning") return 75
  if (normalized === "orange" || normalized === "oranye") return 50
  if (normalized === "merah") return 25
  return 0
}

export function mapProgressToStatus(progress?: number | null): string {
  if (progress === 100) return "hijau"
  if (progress === 75) return "kuning"
  if (progress === 50) return "orange"
  if (progress === 25) return "merah"
  return "putih"
}

export function getProgressBadgeClass(progress: number): string {
  if (progress >= 100) return "bg-green-100 text-green-600"
  if (progress >= 75) return "bg-yellow-100 text-yellow-600"
  if (progress >= 50) return "bg-orange-100 text-orange-500"
  if (progress >= 25) return "bg-red-100 text-red-500"
  return "bg-gray-200 text-gray-500"
}
