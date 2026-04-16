import { fetchApi } from "@/lib/fetcher"
import type { ApiResponse } from "@/types/api"
import { PenugasanResponse } from "./types"

export const getPenugasan = async () => {
  return fetchApi<ApiResponse<PenugasanResponse[]>>({
    url: "/pelaksana",
    method: "GET",
  })
}

export const markAllPenugasanAsRead = async () => {
  return fetchApi<ApiResponse<null>>({
    url: "/pelaksana/mark-all-read",
    method: "PATCH",
  })
}
