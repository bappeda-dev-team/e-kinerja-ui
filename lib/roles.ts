// lib/roles.ts

export type RoleName = "super_admin" | "admin" | "programmer" | "verifikator"

const LEGACY_ROLE_ID_MAP: Record<string, RoleName> = {
  "cd8c9166-9b38-4c9b-8afc-1c10ec97e068": "super_admin",
  "5fa89680-b618-42fc-8725-fa72453a9351": "admin",
  "b0cabba0-e1b9-4696-ab4b-7c9a229959e2": "programmer",
  "dda6d213-4503-49e6-955c-5f4ae7796b19": "verifikator",
}

export const ROLE_LABEL: Record<RoleName, string> = {
  super_admin: "Super Admin",
  admin:       "Admin",
  programmer:  "Programmer",
  verifikator: "Verifikator",
}

export const ROLE_PREFIX: Record<RoleName, string> = {
  super_admin: "/super-admin",
  admin:       "/admin",
  programmer:  "/programmer",
  verifikator: "/verifikator",
}

/** Menu yang boleh diakses per role (dipakai di sidebar) */
export const ROLE_MENUS: Record<RoleName, string[]> = {
  super_admin: ["dashboard", "data-master", "permintaan", "distribusi", "laporan", "verifikasi"],
  admin:       ["dashboard", "permintaan", "distribusi"],
  programmer:  ["dashboard", "laporan"],
  verifikator: ["dashboard", "verifikasi"],
}

function normalizeRoleName(value?: string | null): RoleName | "" {
  const normalized = value?.toLowerCase().trim().replace(/[\s-]+/g, "_")

  if (!normalized) return ""
  if (normalized === "super_admin" || normalized === "superadmin") return "super_admin"
  if (normalized === "admin") return "admin"
  if (normalized === "programmer") return "programmer"
  if (normalized === "verifikator" || normalized === "level2" || normalized === "level_2") return "verifikator"

  return ""
}

/** Ambil role name dari session.user */
export function getRoleName(session: any): RoleName | "" {
  const user = session?.user

  const roleFromString =
    normalizeRoleName(user?.role_name) ||
    normalizeRoleName(user?.role) ||
    normalizeRoleName(user?.role?.name) ||
    normalizeRoleName(user?.role?.description)

  if (roleFromString) return roleFromString

  const roleId = user?.role_id as string | undefined
  return roleId ? (LEGACY_ROLE_ID_MAP[roleId] ?? "") : ""
}

export function is(session: any, role: RoleName): boolean {
  return getRoleName(session) === role
}

export function canAccess(session: any, menu: string): boolean {
  const role = getRoleName(session)
  if (!role) return false
  return ROLE_MENUS[role]?.includes(menu) ?? false
}

export function getRolePrefix(session: any): string {
  const role = getRoleName(session)
  return role ? ROLE_PREFIX[role] : "/super-admin"
}
