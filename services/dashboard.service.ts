import { fetchApi } from "@/lib/fetcher"
import type { ApiResponse } from "@/types/api"
import type {
  SuperAdminDashboardResponse,
  AdminDashboardResponse,
  ProgrammerDashboardResponse,
  VerifikatorDashboardResponse,
  DashboardActivityResponse,
} from "@/types/dashboard"

export const getDashboard = async <T = SuperAdminDashboardResponse | AdminDashboardResponse | ProgrammerDashboardResponse | VerifikatorDashboardResponse>() => {
  return fetchApi<ApiResponse<T>>({
    url: "/dashboard",
    method: "GET",
  })
}

export const getDashboardActivity = async () => {
  return fetchApi<ApiResponse<DashboardActivityResponse>>({
    url: "/dashboard/activity",
    method: "GET",
  })
}

// ─── Typed helpers per role ───────────────────────────────────────

export const getSuperAdminDashboard = () =>
  getDashboard<SuperAdminDashboardResponse>()

export const getAdminDashboard = () =>
  getDashboard<AdminDashboardResponse>()

export const getProgrammerDashboard = () =>
  getDashboard<ProgrammerDashboardResponse>()

export const getVerifikatorDashboard = () =>
  getDashboard<VerifikatorDashboardResponse>()

/** @deprecated Gunakan getSuperAdminDashboard(). Endpoint /superadmin-dashboard sudah tidak ada. */
export const getSuperadminDashboard = getSuperAdminDashboard
