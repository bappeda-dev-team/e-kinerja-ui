"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Session } from "next-auth"
import { signOut } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import { deleteCookie } from "cookies-next"
import { BadgeCheck, LayoutDashboard, LogOut, ShieldCheck, User, ChevronDown } from "lucide-react"

import { getRolePrefix } from "@/lib/roles"
import { fetchApi, invalidateClientSessionCache } from "@/lib/fetcher"
import type { APIResponse } from "@/types/api"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface VerifikatorNavbarProps {
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

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/verifikasi",
    label: "Verifikasi",
    icon: BadgeCheck,
  },
]

export function VerifikatorNavbar({ session }: VerifikatorNavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const rolePrefix = getRolePrefix(session)
  const sessionUser = session?.user as SessionUser | undefined
  const [profile, setProfile] = useState<UserProfile | null>(null)

  const userId = sessionUser?.user_id ?? sessionUser?.id

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

  const displayName = profile?.full_name ?? sessionUser?.full_name ?? "Verifikator"
  const roleLabel = profile?.role?.description ?? "Verifikator"
  const initials = displayName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase() || "V"

  const isActive = (path: string) => {
    const fullPath = `${rolePrefix}${path}`
    return pathname === fullPath || pathname.startsWith(`${fullPath}/`)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="flex min-h-16 items-center gap-3 px-4 py-3 md:px-8">
        <div className="flex min-w-0 items-center gap-3 md:w-[250px]">
          <Image src="/logo-e-kinerja.png" alt="Logo" width={36} height={36} className="h-9 w-9 object-contain" />
          <div className="min-w-0">
            <span className="block truncate text-lg font-bold tracking-tight text-gray-900">E-Kinerja</span>
            <span className="block truncate text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Verifikator
            </span>
          </div>
        </div>

        <nav className="flex flex-1 items-center justify-start gap-2 overflow-x-auto md:justify-center">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={`${rolePrefix}${item.href}`}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center justify-end md:w-[250px]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarImage src={profile?.profile_picture} className="object-cover" />
                  <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">{initials}</AvatarFallback>
                </Avatar>
                <div className="hidden text-left leading-none md:flex md:flex-col md:items-start">
                  <span className="text-sm font-bold text-gray-900">{displayName}</span>
                  <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-600">
                    <ShieldCheck className="h-3 w-3" />
                    {roleLabel}
                  </span>
                </div>
                <ChevronDown className="hidden h-4 w-4 text-gray-400 md:block" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 rounded-xl border-gray-100 p-2 shadow-xl">
              <DropdownMenuLabel className="font-bold text-gray-900">
                {displayName}
                <div className="mt-0.5 text-xs font-medium text-gray-500">{profile?.username || sessionUser?.username}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-2" />

              <DropdownMenuItem onClick={() => router.push(`${rolePrefix}/profile`)} className="cursor-pointer rounded-lg">
                <User className="mr-2 h-4 w-4 text-gray-500" />
                Profil
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-2" />

              <DropdownMenuItem
                className="cursor-pointer rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700"
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
        </div>
      </div>
    </header>
  )
}
