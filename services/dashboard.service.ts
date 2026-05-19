import { fetchApi } from "@/lib/fetcher"
import type { ApiResponse } from "@/types/api"
import type { DashboardResponse } from "@/app/super-admin/dashboard/types"

export const getSuperadminDashboard = async () => {
  return fetchApi<ApiResponse<DashboardResponse>>({
    url: "/superadmin-dashboard",
    method: "GET",
  })
}
