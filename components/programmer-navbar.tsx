"use client"

import { useEffect, useState } from "react"
import { Session } from "next-auth"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { getRolePrefix } from "@/lib/roles"
import { fetchApi, invalidateClientSessionCache } from "@/lib/fetcher"
import { APIResponse } from "@/types/api"
import { deleteCookie } from "cookies-next"
import { signOut } from "next-auth/react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Settings, User, ChevronDown, LayoutDashboard, ClipboardList } from "lucide-react"

interface ProgrammerNavbarProps {
  session: Session | null
}

interface UserProfile {
  full_name: string
  username: string
  profile_picture?: string
  role: { name: string; description: string }
}

export function ProgrammerNavbar({ session }: ProgrammerNavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const rolePrefix = getRolePrefix(session)

  const [mounted, setMounted] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => { setMounted(true) }, [])

  const userId = (session?.user as any)?.user_id ?? (session?.user as any)?.id

  useEffect(() => {
    if (!userId) return

    const fetchProfile = async () => {
      const res = await fetchApi<APIResponse<UserProfile>>(`/users/${userId}`, { method: "GET" })
      if (res.status === 200 && res.data?.data) {
        setProfile(res.data.data)
      }
    }

    fetchProfile()
  }, [userId])

  const displayName = profile?.full_name ?? (session?.user as any)?.full_name ?? "Programmer"
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
          <img src="/logo-e-kinerja.png" alt="Logo" className="h-9 w-9 object-contain" />
          <span className="text-lg font-bold text-gray-900 tracking-tight">E-Kinerja</span>
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
            href={`${rolePrefix}/laporan`}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              isActive("/laporan") 
                ? "bg-blue-50 text-blue-700" 
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Laporan Kinerja
          </Link>
        </nav>

        {/* Right: User Profile */}
        <div className="flex items-center justify-end w-[250px]">
          {!mounted ? null : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 p-1 hover:bg-gray-50 transition-colors">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarImage src={profile?.profile_picture} className="object-cover" />
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start leading-none text-left">
                    <span className="text-sm font-bold text-gray-900">{displayName}</span>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 mt-0.5">
                      {roleLabel}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400 hidden md:block" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 rounded-xl p-2 shadow-xl border-gray-100">
                <DropdownMenuLabel className="font-bold text-gray-900">
                  {displayName}
                  <div className="text-xs font-medium text-gray-500 mt-0.5">{profile?.username || (session?.user as any)?.username}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-2" />

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
                  onClick={() => {
                    invalidateClientSessionCache()
                    deleteCookie("auth", { path: "/" })
                    signOut({ callbackUrl: "/login" })
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

      </div>
    </header>
  )
}
