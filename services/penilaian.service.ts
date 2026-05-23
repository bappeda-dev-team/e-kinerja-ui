import { fetchApi } from "@/lib/fetcher"
import type { ApiResponse } from "@/types/api"
import type { CreatePenilaianRequest, UpdatePenilaianRequest, PenilaianResponse } from "@/types/penilaian"

export const getPenilaian = async () =>
  fetchApi<ApiResponse<PenilaianResponse[]>>({
    url: "/penilaian",
    method: "GET",
  })

export const getPenilaianByDistribusiId = async (distribusiId: string) =>
  fetchApi<ApiResponse<PenilaianResponse>>({
    url: `/penilaian/${distribusiId}`,
    method: "GET",
  })

export const createPenilaian = async (data: CreatePenilaianRequest) =>
  fetchApi<ApiResponse<PenilaianResponse>>({
    url: "/penilaian",
    method: "POST",
    body: data,
  })

export const updatePenilaian = async (id: string, data: UpdatePenilaianRequest) =>
  fetchApi<ApiResponse<PenilaianResponse>>({
    url: `/penilaian/${id}`,
    method: "PATCH",
    body: data,
  })
