export {
  getLaporan,
  getLaporanById,
  createLaporan,
  updateLaporan,
  deleteLaporan,
  getPemda,
} from "@/app/super-admin/laporan/services"

import { fetchApi } from "@/lib/fetcher"
import type { ApiResponse } from "@/types/api"
import type { SubmitVerifikasiResponse } from "@/app/super-admin/verifikasi/types"

export const ajukanVerifikasi = async (laporanId: string) => {
  return fetchApi<ApiResponse<SubmitVerifikasiResponse>>({
    url: `/laporan/verif/${laporanId}`,
    method: "POST",
  })
}
