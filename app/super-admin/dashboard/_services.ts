import { fetchApi } from "@/lib/fetcher"
import { APIResponse } from "@/types/api"
import type { DashboardResponse } from "./_types"

export const getSuperadminDashboard = async () => {
  return fetchApi<APIResponse<DashboardResponse>>("/superadmin-dashboard", { method: "GET" })
}
