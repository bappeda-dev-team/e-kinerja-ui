// components/app-sidebar.tsx

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Session } from "next-auth"
import { Collapsible } from "radix-ui"
import { getRoleName, getRolePrefix, ROLE_MENUS, ROLE_LABEL } from "@/lib/roles"

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
  SidebarTrigger,
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

export function AppSidebar({ session }: { session: Session | null }) {
  const pathname = usePathname()
  const [openDataMaster, setOpenDataMaster] = useState(false)

  const roleName = getRoleName(session)
  const rolePrefix = getRolePrefix(session)
  const allowedMenus = roleName ? (ROLE_MENUS[roleName] ?? []) : []

  const can = (menu: string) => allowedMenus.includes(menu)
  const buildPath = (path: string) => `${rolePrefix}${path}`
  const isActive = (path: string) => pathname === buildPath(path)
  const isActivePrefix = (path: string) => pathname.startsWith(buildPath(path))

  useEffect(() => {
    setOpenDataMaster(isActivePrefix("/data-master"))
  }, [pathname, rolePrefix])

  return (
    <Sidebar collapsible="icon">

      {/* HEADER */}
      <SidebarHeader className="flex flex-col items-center justify-center py-6 px-0">
        {/* Collapsed: hanya trigger */}
        <SidebarTrigger className="group-data-[state=expanded]:hidden" />
        {/* Expanded: logo + trigger di kanan atas */}
        <div className="hidden group-data-[state=expanded]:flex flex-col items-center w-full relative">
          <SidebarTrigger className="absolute top-0 right-2" />
          <img
            src="/logo-e-kinerja.png"
            alt="E-Kinerja Logo"
            className="w-16 h-16 object-contain"
          />
          <span className="mt-2 text-lg font-bold text-center">E-Kinerja</span>
          {roleName && (
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              {ROLE_LABEL[roleName]}
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>

              {/* Dashboard — semua role */}
              {can("dashboard") && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive("/dashboard")} tooltip="Dashboard">
                    <Link href={buildPath("/dashboard")} className="flex items-center gap-2">
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
                        isActive={isActivePrefix("/data-master")}
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
        <Link href={buildPath("/data-master/master-user")} className="group/subitem flex items-center">
          <User className={`mr-2 h-4 w-4 transition-colors ${
            isActive("/data-master/master-user")
              ? "text-blue-600!"
              : "text-[#202224]! group-hover/subitem:text-blue-600!"
          }`} />
          <span className={isActive("/data-master/master-user") ? "text-blue-600" : "text-[#202224] group-hover/subitem:text-blue-600"}>
            Master User
          </span>
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>

    <SidebarMenuSubItem>
      <SidebarMenuSubButton asChild isActive={isActive("/data-master/master-roles")}>
        <Link href={buildPath("/data-master/master-roles")} className="group/subitem flex items-center">
          <Shield className={`mr-2 h-4 w-4 transition-colors ${
            isActive("/data-master/master-roles")
              ? "text-blue-600!"
              : "text-[#202224]! group-hover/subitem:text-blue-600!"
          }`} />
          <span className={isActive("/data-master/master-roles") ? "text-blue-600" : "text-[#202224] group-hover/subitem:text-blue-600"}>
            Master Roles
          </span>
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>

    <SidebarMenuSubItem>
      <SidebarMenuSubButton asChild isActive={isActive("/data-master/master-pemda")}>
        <Link href={buildPath("/data-master/master-pemda")} className="group/subitem flex items-center">
          <Building2 className={`mr-2 h-4 w-4 transition-colors ${
            isActive("/data-master/master-pemda")
              ? "text-blue-600!"
              : "text-[#202224]! group-hover/subitem:text-blue-600!"
          }`} />
          <span className={isActive("/data-master/master-pemda") ? "text-blue-600" : "text-[#202224] group-hover/subitem:text-blue-600"}>
            Master Pemda
          </span>
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>

    <SidebarMenuSubItem>
      <SidebarMenuSubButton asChild isActive={isActive("/data-master/master-aplikasi")}>
        <Link href={buildPath("/data-master/master-aplikasi")} className="group/subitem flex items-center">
          <AppWindow className={`mr-2 h-4 w-4 transition-colors ${
            isActive("/data-master/master-aplikasi")
              ? "text-blue-600!"
              : "text-[#202224]! group-hover/subitem:text-blue-600!"
          }`} />
          <span className={isActive("/data-master/master-aplikasi") ? "text-blue-600" : "text-[#202224] group-hover/subitem:text-blue-600"}>
            Master Aplikasi
          </span>
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
                    <Link href={buildPath("/permintaan")} className="flex items-center gap-2">
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
                    <Link href={buildPath("/distribusi")} className="flex items-center gap-2">
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
                    <Link href={buildPath("/laporan")} className="flex items-center gap-2">
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
                    <Link href={buildPath("/verifikasi")} className="flex items-center gap-2">
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

      <SidebarFooter />

      <SidebarRail />
    </Sidebar>
  )
}
