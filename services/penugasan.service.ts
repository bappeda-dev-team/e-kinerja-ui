import { fetchApi } from "@/lib/fetcher"
import type { ApiResponse } from "@/types/api"
import type { PelaksanaResponse } from "@/types/penugasan"
import type { PenugasanDetail, PenugasanDetailRequest, UpdatePenugasanStatusRequest, ReassignPenugasanRequest } from "@/types/penugasan"
import type { LaporanResponse } from "@/types/laporan"

export const getPelaksana = async () => {
  return fetchApi<ApiResponse<PelaksanaResponse[]>>({
    url: "/pelaksana",
    method: "GET",
  })
}

export const markAllPelaksanaAsRead = async () => {
  return fetchApi<ApiResponse<null>>({
    url: "/pelaksana/mark-all-read",
    method: "PATCH",
  })
}

export const getPenugasanList = async (params?: { pelaksana_id?: string; distribusi_id?: string }) => {
  const query = new URLSearchParams()
  if (params?.pelaksana_id) query.set("pelaksana_id", params.pelaksana_id)
  if (params?.distribusi_id) query.set("distribusi_id", params.distribusi_id)
  const qs = query.toString()
  return fetchApi<ApiResponse<PenugasanDetail[]>>({
    url: `/penugasan${qs ? `?${qs}` : ""}`,
    method: "GET",
  })
}

export const getPenugasanById = async (id: string) => {
  return fetchApi<ApiResponse<PenugasanDetail>>({
    url: `/penugasan/${id}`,
    method: "GET",
  })
}

export const createPenugasanDetail = async (data: PenugasanDetailRequest) => {
  return fetchApi<ApiResponse<PenugasanDetail>>({
    url: "/penugasan",
    method: "POST",
    body: data,
  })
}

export const updatePenugasanDetail = async (id: string, data: PenugasanDetailRequest) => {
  return fetchApi<ApiResponse<PenugasanDetail>>({
    url: `/penugasan/${id}`,
    method: "PUT",
    body: data,
  })
}

export const updatePenugasanStatus = async (id: string, data: UpdatePenugasanStatusRequest) => {
  return fetchApi<ApiResponse<PenugasanDetail>>({
    url: `/penugasan/${id}/status`,
    method: "PATCH",
    body: data,
  })
}

export const reassignPenugasan = async (id: string, data: ReassignPenugasanRequest) => {
  return fetchApi<ApiResponse<PenugasanDetail>>({
    url: `/penugasan/${id}/reassign`,
    method: "PATCH",
    body: data,
  })
}

export const deletePenugasanDetail = async (id: string) => {
  return fetchApi<ApiResponse<null>>({
    url: `/penugasan/${id}`,
    method: "DELETE",
  })
}

export const createPenugasanLaporan = async (data: FormData) => {
  return fetchApi<ApiResponse<LaporanResponse>>({
    url: "/laporan",
    method: "POST",
    body: data,
  })
}
