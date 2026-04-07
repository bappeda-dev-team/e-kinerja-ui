// lib/roles.ts

export type RoleName = "super_admin" | "admin" | "programmer" | "level2"

export const ROLE_ID_MAP: Record<string, RoleName> = {
  "3fc5cfba-e591-4b67-9e99-78562fba36e8": "super_admin",
  "8c0c4dda-eaa9-4abc-b79e-132cf7f696d2": "admin",
  "7726b58e-3223-415e-aef9-3784af6754a6": "programmer",
  "bee727b8-a9c2-4577-bf63-7b4a8d201798": "level2",
}

export const ROLE_LABEL: Record<RoleName, string> = {
  super_admin: "Super Admin",
  admin:       "Admin",
  programmer:  "Programmer",
  level2:      "Verifikator",
}

export const ROLE_PREFIX: Record<RoleName, string> = {
  super_admin: "/super-admin",
  admin: "/admin",
  programmer: "/programmer",
  level2: "/verifikator",
}

/** Menu yang boleh diakses per role (dipakai di sidebar) */
export const ROLE_MENUS: Record<RoleName, string[]> = {
  super_admin: ["dashboard", "data-master", "permintaan", "distribusi", "laporan", "verifikasi"],
  admin:       ["dashboard", "permintaan", "distribusi"],
  programmer:  ["dashboard", "laporan"],
  level2:      ["dashboard"],
}

/** Ambil role name dari session.user */
export function getRoleName(session: any): RoleName | "" {
  const roleId = session?.user?.role_id as string | undefined
  return roleId ? (ROLE_ID_MAP[roleId] ?? "") : ""
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
