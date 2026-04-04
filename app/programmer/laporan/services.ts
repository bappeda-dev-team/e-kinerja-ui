export {
  getLaporan,
  getLaporanById,
  createLaporan,
  updateLaporan,
  deleteLaporan,
  getPemda,
} from "@/app/super-admin/laporan/services"

import { fetchApi } from "@/lib/fetcher"
import { APIResponse } from "@/types/api"

export const ajukanVerifikasi = async (laporanId: string) => {
  return fetchApi<APIResponse<any>>(`/laporan/verif/${laporanId}`, { method: "POST" })
}
