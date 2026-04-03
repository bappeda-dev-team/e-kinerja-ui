// app/super-admin/dashboard/services.ts

import { fetchApi } from "@/lib/fetcher"
import { APIResponse } from "@/types/api"
import type { DashboardResponse } from "./types"

export const getSuperadminDashboard = async () => {
  return fetchApi<APIResponse<DashboardResponse>>("/superadmin-dashboard", { method: "GET" })
}
