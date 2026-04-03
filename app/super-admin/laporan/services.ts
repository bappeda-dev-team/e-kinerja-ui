// app/super-admin/laporan/services.ts

import { fetchApi } from "@/lib/fetcher"
import { APIResponse, LaporanRequest, LaporanResponse } from "./types"

export const getLaporan = async () => {
  return fetchApi<APIResponse<LaporanResponse[]>>("/laporan", {
    method: "GET",
  })
}

export const getLaporanById = async (id: string) => {
  return fetchApi<APIResponse<LaporanResponse>>(`/laporan/${id}`, {
    method: "GET",
  })
}

export const createLaporan = async (data: LaporanRequest) => {
  return fetchApi<APIResponse<LaporanResponse>>("/laporan", {
    method: "POST",
    body: data,
  })
}

export const updateLaporan = async (id: string, data: LaporanRequest) => {
  return fetchApi<APIResponse<LaporanResponse>>(`/laporan/${id}`, {
    method: "PUT",
    body: data,
  })
}

export const deleteLaporan = async (id: string) => {
  return fetchApi<APIResponse<any>>(`/laporan/${id}`, {
    method: "DELETE",
  })
}

export const getPemda = async () => {
  return fetchApi<APIResponse<any[]>>("/master-pemda", {
    method: "GET",
  })
}