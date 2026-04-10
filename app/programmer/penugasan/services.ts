import { fetchApi } from "@/lib/fetcher"
import { APIResponse } from "@/types/api"
import { PenugasanResponse } from "./types"

export const getPenugasan = async () => {
  return fetchApi<APIResponse<PenugasanResponse[]>>("/pelaksana", { method: "GET" })
}
