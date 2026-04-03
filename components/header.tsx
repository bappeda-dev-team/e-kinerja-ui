"use client"

import { useEffect, useState } from "react"
import { Session } from "next-auth"
import { useRouter } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { APIResponse } from "@/types/api"
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
      const res = await fetchApi<APIResponse<UserProfile>>(`/users/${userId}`, { method: "GET" })
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
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">

      {/* LEFT */}
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold tracking-tight">
          {title}
        </h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* Notification Bell */}
        {!mounted ? null : <Popover>
          <PopoverTrigger asChild>
            <button className="relative rounded-full p-1 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {NOTIFIKASI.length}
              </span>
            </button>
          </PopoverTrigger>

          <PopoverContent
            align="end"
            className="w-72 p-0 rounded-2xl shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <h2 className="text-base font-bold text-[#202224]">Notifikasi</h2>
              <button className="text-xs font-semibold text-primary hover:underline">
                Baca Semua
              </button>
            </div>

            <div className="overflow-y-auto max-h-80 divide-y divide-gray-100 px-2 pb-3">
              {NOTIFIKASI.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 px-2 py-3 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                >
                  <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#202224] leading-snug">{item.pesan}</p>
                    <p className="text-xs text-[#797A7C] mt-0.5">{item.waktu}</p>
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>}

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
            <DropdownMenuLabel>{displayName}</DropdownMenuLabel>
            <DropdownMenuSeparator />

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
