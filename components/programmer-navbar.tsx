"use client"

import { useEffect, useState } from "react"
import { Session } from "next-auth"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { getRolePrefix, getRoleName, ROLE_LABEL } from "@/lib/roles"
import { fetchApi } from "@/lib/fetcher"
import { usePenugasanBadge } from "@/hooks/use-penugasan-badge"
import type { ApiResponse } from "@/types/api"
import { logout } from "@/lib/logout"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Settings, User, ChevronDown, LayoutDashboard, BriefcaseBusiness } from "lucide-react"

interface ProgrammerNavbarProps {
  session: Session | null
}

interface UserProfile {
  full_name: string
  username: string
  profile_picture?: string
  role: { name: string; description: string }
}

type SessionUser = Session["user"] & {
  id?: string
  user_id?: string
  full_name?: string
  username?: string
}

export function ProgrammerNavbar({ session }: ProgrammerNavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const rolePrefix = getRolePrefix(session)
  const roleName = getRoleName(session)
  const sessionUser = session?.user as SessionUser | undefined

  const [profile, setProfile] = useState<UserProfile | null>(null)

  const userId = sessionUser?.user_id ?? sessionUser?.id
  const { unreadCount } = usePenugasanBadge({ userId })

  useEffect(() => {
    if (!userId) return

    const fetchProfile = async () => {
      const res = await fetchApi<ApiResponse<UserProfile>>({
        url: `/users/${userId}`,
        method: "GET",
      })
      if (res.status === 200 && res.data?.data) {
        setProfile(res.data.data)
      }
    }

    fetchProfile()
  }, [userId])

  const displayName = profile?.full_name ?? sessionUser?.full_name ?? "Programmer"
  const roleLabel = profile?.role?.description ?? "Programmer"
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase() || "P"

  const isActive = (path: string) => pathname === `${rolePrefix}${path}`

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center px-4 md:px-8">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-3 w-[250px]">
          <Image src="/logo-e-kinerja.png" alt="Logo" width={36} height={36} className="h-9 w-9 object-contain" />
          <div className="min-w-0">
            <span className="block truncate text-lg font-bold tracking-tight text-gray-900">E-Kinerja</span>
            <span className="block truncate text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              {roleName ? ROLE_LABEL[roleName] : "Programmer"}
            </span>
          </div>
        </div>

        {/* Center: Tabs */}
        <nav className="flex-1 flex justify-center items-center gap-2">
          <Link
            href={`${rolePrefix}/dashboard`}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              isActive("/dashboard") 
                ? "bg-blue-50 text-blue-700" 
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link
            href={`${rolePrefix}/penugasan`}
            className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              isActive("/penugasan")
                ? "bg-blue-50 text-blue-700"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <BriefcaseBusiness className="w-4 h-4" />
            Penugasan
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Right: User Profile */}
        <div className="flex items-center justify-end w-[250px]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 p-1 hover:bg-gray-50 transition-colors">
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarImage src={profile?.profile_picture} className="object-cover" />
                  <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">{initials}</AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start leading-tight text-left">
                  <span className="text-sm font-medium text-gray-900">{displayName}</span>
                  {roleLabel && (
                    <span className="inline-flex items-center rounded px-1.5 py-0 text-[11px] font-semibold bg-purple-600 text-white">
                      {roleLabel}
                    </span>
                  )}
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400 hidden md:block" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 rounded-xl p-2 shadow-xl border-gray-100">
              <DropdownMenuItem onClick={() => router.push(`${rolePrefix}/profile`)} className="rounded-lg cursor-pointer">
                <User className="mr-2 h-4 w-4 text-gray-500" />
                Profil
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => router.push(`${rolePrefix}/settings`)} className="rounded-lg cursor-pointer mt-1">
                <Settings className="mr-2 h-4 w-4 text-gray-500" />
                Pengaturan
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-2" />

              <DropdownMenuItem
                className="rounded-lg cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 focus:text-red-700 focus:bg-red-50"
                onClick={() => logout()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>
    </header>
  )
}
