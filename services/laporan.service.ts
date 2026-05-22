import { fetchApi } from "@/lib/fetcher"
import type { ApiResponse } from "@/types/api"
import type { MasterPemda } from "@/types/master-pemda"
import type { LaporanRequest, LaporanResponse } from "@/types/laporan"
import type { SubmitVerifikasiResponse } from "@/types/verifikasi"

export const getLaporan = async () => {
  return fetchApi<ApiResponse<LaporanResponse[]>>({
    url: "/laporan",
    method: "GET",
  })
}

export const getLaporanById = async (id: string) => {
  return fetchApi<ApiResponse<LaporanResponse>>({
    url: `/laporan/${id}`,
    method: "GET",
  })
}

export const createLaporan = async (data: LaporanRequest) => {
  return fetchApi<ApiResponse<LaporanResponse>>({
    url: "/laporan",
    method: "POST",
    body: data,
  })
}

export const updateLaporan = async (id: string, data: LaporanRequest) => {
  return fetchApi<ApiResponse<LaporanResponse>>({
    url: `/laporan/${id}`,
    method: "PUT",
    body: data,
  })
}

export const deleteLaporan = async (id: string) => {
  return fetchApi<ApiResponse<null>>({
    url: `/laporan/${id}`,
    method: "DELETE",
  })
}

export const getPemda = async () => {
  return fetchApi<ApiResponse<MasterPemda[]>>({
    url: "/master-pemda",
    method: "GET",
  })
}

// ==== PROGRAMMER ====
export const ajukanVerifikasi = async (laporanId: string) => {
  return fetchApi<ApiResponse<SubmitVerifikasiResponse>>({
    url: `/laporan/${laporanId}/submit`,
    method: "POST",
  })
}
