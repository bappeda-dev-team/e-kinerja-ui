// components/header.tsx

"use client"

import { useEffect, useState } from "react"
import { Session } from "next-auth"
import { useRouter } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import { Settings, LogOut, User, Bell, ChevronDown } from "lucide-react"
import { fetchApi } from "@/lib/fetcher"
import type { ApiResponse } from "@/types/api"
import { signOut } from "next-auth/react"
import { deleteCookie } from "cookies-next"
import { getRolePrefix } from "@/lib/roles"

interface HeaderProps {
  title: string
  session: Session | null
}

interface UserProfile {
  full_name: string
  username: string
  profile_picture?: string
  role: { name: string; description: string }
}

const NOTIFIKASI = [
  { id: "1", pesan: "Permintaan baru dari Pemda Kota Bandung", waktu: "5 menit lalu" },
  { id: "2", pesan: "Laporan kamu perlu revisi oleh Verifikator", waktu: "20 menit lalu" },
  { id: "3", pesan: "Permintaan berhasil disetujui", waktu: "2 jam lalu" },
  { id: "4", pesan: "Permintaan baru dari Pemda Kota Bandung", waktu: "5 menit lalu" },
  { id: "5", pesan: "Laporan kamu perlu revisi oleh Verifikator", waktu: "20 menit lalu" },
  { id: "6", pesan: "Permintaan berhasil disetujui", waktu: "2 jam lalu" },
  { id: "7", pesan: "Permintaan baru dari Pemda Kota Bandung", waktu: "5 menit lalu" },
  { id: "8", pesan: "Laporan kamu perlu revisi oleh Verifikator", waktu: "20 menit lalu" },
]

export function Header({ title, session }: HeaderProps) {
  const router = useRouter()
  const rolePrefix = getRolePrefix(session)

  const [mounted, setMounted] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => { setMounted(true) }, [])

  const userId = (session?.user as any)?.user_id ?? (session?.user as any)?.id

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

  const displayName = profile?.full_name ?? ""
  const roleLabel = profile?.role?.description ?? ""
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U"

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-3 sm:px-6">

      {/* LEFT */}
      <div className="flex min-w-0 items-center gap-3">
        <h1 className="truncate text-sm font-semibold tracking-tight sm:text-lg">
          {title}
        </h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">



        {!mounted ? null : <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary">
              <Avatar className="h-9 w-9 shrink-0 cursor-pointer">
                <AvatarImage src={profile?.profile_picture} className="object-cover" />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start leading-tight">
                <span className="text-sm font-medium">{displayName}</span>
                {roleLabel && (
                  <span className="inline-flex items-center rounded px-1.5 py-0 text-[11px] font-semibold bg-purple-600 text-white">
                    {roleLabel}
                  </span>
                )}
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => router.push(`${rolePrefix}/profile`)}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => router.push(`${rolePrefix}/settings`)}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-red-600"
              onClick={() => {
                deleteCookie("auth", { path: "/" })
                deleteCookie("refresh_token", { path: "/" })
                signOut({ callbackUrl: "/login" })
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>}

      </div>
    </header>
  )
}
