"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

import {
  LayoutDashboard,
  Users,
  Building2,
  AppWindow,
  FileText,
  FileCheck,
  Send,
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react"

export function AppSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [openDataMaster, setOpenDataMaster] = useState(false)

  const isActive = (path: string) => pathname === path

  return (
    <Sidebar
      className={`transition-all duration-300 ${
        collapsed ? "w-20" : "w-60"
      }`}
    >
      {/* HEADER */}
<SidebarHeader className="relative flex flex-col items-center px-4 py-6">

  {!collapsed && (
    <>
      <h2 className="text-lg font-bold text-center">
        E-Kinerja
      </h2>

      <img
        src="/logo-e-kinerja.png"
        alt="E-Kinerja Logo"
        className="mt-3 w-16 h-16 object-contain"
      />
    </>
  )}

  {/* Collapse Button */}
  <button
    onClick={() => setCollapsed(!collapsed)}
    className="absolute top-4 right-4 p-1 rounded hover:bg-muted"
  >
    {collapsed ? (
      <ChevronRight className="h-4 w-4" />
    ) : (
      <ChevronLeft className="h-4 w-4" />
    )}
  </button>

</SidebarHeader>

      <SidebarContent>
        <SidebarMenu>

          {/* 1️⃣ Dashboard */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/dashboard")}
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5" />
                {!collapsed && "Dashboard"}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* 2️⃣ Data Master (MAIN MENU + COLLAPSIBLE) */}
          <SidebarMenuItem>
            <button
              onClick={() => setOpenDataMaster(!openDataMaster)}
              className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted ${
                openDataMaster ? "bg-muted" : ""
              }`}
            >
              <Users className="h-5 w-5" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">
                    Data Master
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      openDataMaster ? "rotate-180" : ""
                    }`}
                  />
                </>
              )}
            </button>
          </SidebarMenuItem>

          {/* Sub Menu */}
          {!collapsed && openDataMaster && (
            <div className="ml-8 space-y-1">

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/data-master/pegawai")}
                >
                  <Link href="/data-master/master-pegawai">
                    <Users className="mr-2 h-4 w-4" />
                    Nama Pegawai
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/data-master/master-pemda")}
                >
                  <Link href="/data-master/master-pemda">
                    <Building2 className="mr-2 h-4 w-4" />
                    Nama Pemda
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/data-master/master-aplikasi")}
                >
                  <Link href="/data-master/master-aplikasi">
                    <AppWindow className="mr-2 h-4 w-4" />
                    Nama Aplikasi
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

            </div>
          )}

          {/* 3️⃣ Permintaan Klien */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/permintaan")}
            >
              <Link href="/permintaan" className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {!collapsed && "Permintaan Klien"}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* 4️⃣ Distribusi */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/distribusi")}
            >
              <Link href="/distribusi" className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                {!collapsed && "Distribusi Pekerjaan"}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* 5️⃣ Laporan */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/laporan-kinerja")}
            >
              <Link
                href="/laporan-kinerja"
                className="flex items-center gap-2"
              >
                <ClipboardCheck className="h-5 w-5" />
                {!collapsed && "Laporan Kinerja"}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

        {/* 6️⃣ Verifikasi Laporan */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/verifikasi-laporan")}
            >
              <Link
                href="/verifikasi-laporan"
                className="flex items-center gap-2"
              >
                <FileCheck className="h-5 w-5" />
                {!collapsed && "Verifikasi Laporan"}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="px-4 py-2 text-xs text-muted-foreground">
        {!collapsed && "© 2026 E-Kinerja"}
      </SidebarFooter>
    </Sidebar>
  )
}