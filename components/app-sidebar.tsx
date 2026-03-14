"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Collapsible } from "radix-ui"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarRail,
} from "@/components/ui/sidebar"

import {
  LayoutDashboard,
  Database,
  User,
  Shield,
  Building2,
  AppWindow,
  FileText,
  BadgeCheck,
  Send,
  ClipboardCheck,
  ChevronDown,
} from "lucide-react"

// Map role UUID → role name
const ROLE_ID_MAP: Record<string, string> = {
  "3fc5cfba-e591-4b67-9e99-78562fba36e8": "super_admin",
  "8c0c4dda-eaa9-4abc-b79e-132cf7f696d2": "admin",
  "7726b58e-3223-415e-aef9-3784af6754a6": "programmer",
  "bee727b8-a9c2-4577-bf63-7b4a8d201798": "level2",
}

// Menu visibility per role
const ROLE_MENUS: Record<string, string[]> = {
  super_admin: ["dashboard", "data-master", "permintaan", "distribusi", "laporan", "verifikasi"],
  admin:       ["dashboard", "distribusi"],
  programmer:  ["dashboard", "laporan"],
  level2:      ["dashboard", "verifikasi"],
}

export function AppSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [openDataMaster, setOpenDataMaster] = useState(false)

  const u = session?.user as any
  const roleId = u?.role_id as string | undefined
  const roleName = roleId ? ROLE_ID_MAP[roleId] : undefined
  const allowedMenus = roleName ? (ROLE_MENUS[roleName] ?? []) : []

  const can = (menu: string) => allowedMenus.includes(menu)
  const isActive = (path: string) => pathname === path

  useEffect(() => {
    if (pathname.startsWith("/data-master")) {
      setOpenDataMaster(true)
    }
  }, [pathname])

  return (
    <Sidebar collapsible="icon">

      {/* HEADER */}
      <SidebarHeader className="flex flex-col items-center justify-center py-6 px-0">
        <img
          src="/logo-e-kinerja.png"
          alt="E-Kinerja Logo"
          className="w-8 h-8 object-contain group-data-[state=expanded]:w-16 group-data-[state=expanded]:h-16 transition-all duration-200"
        />
        <span className="mt-2 text-lg font-bold text-center hidden group-data-[state=expanded]:block">
          E-Kinerja
        </span>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>

              {/* Dashboard — semua role */}
              {can("dashboard") && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive("/dashboard")} tooltip="Dashboard">
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {/* DATA MASTER — super_admin only */}
              {can("data-master") && (
                <Collapsible.Root
                  open={openDataMaster}
                  onOpenChange={setOpenDataMaster}
                  className="group/collapsible"
                  asChild
                >
                  <SidebarMenuItem>
                    <Collapsible.Trigger asChild>
                      <SidebarMenuButton
                        isActive={pathname.startsWith("/data-master")}
                        tooltip="Data Master"
                      >
                        <Database className="h-5 w-5" />
                        <span>Data Master</span>
                        <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </SidebarMenuButton>
                    </Collapsible.Trigger>

                    <Collapsible.Content>
                      <SidebarMenuSub>

                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={isActive("/data-master/master-user")}>
                            <Link href="/data-master/master-user">
                              <User className="mr-2 h-4 w-4" />
                              Master User
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>

                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={isActive("/data-master/master-roles")}>
                            <Link href="/data-master/master-roles">
                              <Shield className="mr-2 h-4 w-4" />
                              Master Roles
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>

                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={isActive("/data-master/master-pemda")}>
                            <Link href="/data-master/master-pemda">
                              <Building2 className="mr-2 h-4 w-4" />
                              Master Pemda
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>

                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={isActive("/data-master/master-aplikasi")}>
                            <Link href="/data-master/master-aplikasi">
                              <AppWindow className="mr-2 h-4 w-4" />
                              Master Aplikasi
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>

                      </SidebarMenuSub>
                    </Collapsible.Content>
                  </SidebarMenuItem>
                </Collapsible.Root>
              )}

              {/* Permintaan */}
              {can("permintaan") && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive("/permintaan")} tooltip="Permintaan Klien">
                    <Link href="/permintaan" className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      <span>Permintaan Klien</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {/* Distribusi */}
              {can("distribusi") && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive("/distribusi")} tooltip="Distribusi Pekerjaan">
                    <Link href="/distribusi" className="flex items-center gap-2">
                      <Send className="h-5 w-5" />
                      <span>Distribusi Pekerjaan</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {/* Laporan */}
              {can("laporan") && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive("/laporan")} tooltip="Laporan Kinerja">
                    <Link href="/laporan" className="flex items-center gap-2">
                      <ClipboardCheck className="h-5 w-5" />
                      <span>Laporan Kinerja</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {/* Verifikasi */}
              {can("verifikasi") && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive("/verifikasi")} tooltip="Verifikasi Laporan">
                    <Link href="/verifikasi" className="flex items-center gap-2">
                      <BadgeCheck className="h-5 w-5" />
                      <span>Verifikasi Laporan</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-4 py-2 text-xs text-muted-foreground">
        <span className="hidden group-data-[state=expanded]:block">© 2026 E-Kinerja</span>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
