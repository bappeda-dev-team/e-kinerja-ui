"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
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

export function AppSidebar() {
  const pathname = usePathname()
  const [openDataMaster, setOpenDataMaster] = useState(false)

  const isActive = (path: string) => pathname === path

  // Auto open Data Master jika berada di route data-master
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

              {/* Dashboard */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard")} tooltip="Dashboard">
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* DATA MASTER */}
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

              {/* Permintaan */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/permintaan-client")} tooltip="Permintaan Klien">
                  <Link href="/permintaan-client" className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    <span>Permintaan Klien</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Distribusi */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/distribusi-pekerjaan")} tooltip="Distribusi Pekerjaan">
                  <Link href="/distribusi-pekerjaan" className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    <span>Distribusi Pekerjaan</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Laporan */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/laporan-kinerja")} tooltip="Laporan Kinerja">
                  <Link href="/laporan-kinerja" className="flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5" />
                    <span>Laporan Kinerja</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Verifikasi */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/verifikasi-laporan")} tooltip="Verifikasi Laporan">
                  <Link href="/verifikasi-laporan" className="flex items-center gap-2">
                    <BadgeCheck className="h-5 w-5" />
                    <span>Verifikasi Laporan</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

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
