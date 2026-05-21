import { fetchApi } from "@/lib/fetcher"
import type { ApiResponse } from "@/types/api"
import type { DashboardResponse } from "@/types/dashboard"

export const getSuperadminDashboard = async () => {
  return fetchApi<ApiResponse<DashboardResponse>>({
    url: "/superadmin-dashboard",
    method: "GET",
  })
}
