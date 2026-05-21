// lib/roles.ts

export type RoleName = "super_admin" | "admin" | "programmer" | "verifikator"

let cachedRoleIdMap: Record<string, RoleName> | null = null

export async function fetchRoleIdMap(): Promise<Record<string, RoleName>> {
  if (cachedRoleIdMap) return cachedRoleIdMap

  try {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
    const res = await fetch(`${baseURL}/roles`, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error("fetch /roles failed")
    const json = await res.json()
    const map: Record<string, RoleName> = {}
    for (const role of json.data ?? []) {
      const normalized = normalizeRoleName(role.name)
      if (role.id && normalized) map[role.id] = normalized
    }
    cachedRoleIdMap = map
    return map
  } catch {
    return {}
  }
}

export const ROLE_LABEL: Record<RoleName, string> = {
  super_admin: "Super Admin",
  admin:       "Admin",
  programmer:  "Programmer",
  verifikator: "Verifikator",
}

/** Menu yang boleh diakses per role (dipakai di sidebar) */
export const ROLE_MENUS: Record<RoleName, string[]> = {
  super_admin: ["dashboard", "data-master", "permintaan", "distribusi", "laporan", "verifikasi", "settings"],
  admin:       ["dashboard", "permintaan", "distribusi"],
  programmer:  ["dashboard", "penugasan", "laporan"],
  verifikator: ["dashboard", "verifikasi"],
}

function normalizeRoleName(value?: unknown): RoleName | "" {
  if (typeof value !== "string" || !value) return ""
  const normalized = value.toLowerCase().trim().replace(/[\s-]+/g, "_")

  if (normalized === "super_admin" || normalized === "superadmin") return "super_admin"
  if (normalized === "admin") return "admin"
  if (normalized === "programmer") return "programmer"
  if (normalized === "verifikator" || normalized === "level2" || normalized === "level_2") return "verifikator"

  return ""
}

/** Ambil role name dari session.user — mendukung berbagai struktur JWT payload */
export function getRoleName(session: any): RoleName | "" {
  const user = session?.user

  const roleFromString =
    normalizeRoleName(user?.role_name) ||
    normalizeRoleName(user?.role) ||
    normalizeRoleName(user?.role?.name) ||
    normalizeRoleName(user?.role?.description) ||
    normalizeRoleName(user?.name)

  if (roleFromString) return roleFromString

  const roleId = user?.role_id as string | undefined
  if (!roleId) return ""
  return cachedRoleIdMap?.[roleId] ?? ""
}

/** Sama seperti getRoleName tapi fetch role map dari API jika belum ter-cache */
export async function getRoleNameAsync(session: any): Promise<RoleName | ""> {
  await fetchRoleIdMap()
  return getRoleName(session)
}

export function is(session: any, role: RoleName): boolean {
  return getRoleName(session) === role
}

export function canAccess(session: any, menu: string): boolean {
  const role = getRoleName(session)
  if (!role) return false
  return ROLE_MENUS[role]?.includes(menu) ?? false
}

