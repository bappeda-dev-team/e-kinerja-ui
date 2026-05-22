"use client"

import { useState, useEffect } from "react"
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
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import { Settings, LogOut, User, ChevronDown } from "lucide-react"
import { logout } from "@/lib/logout"
import { getMe } from "@/services/profile.service"
import type { ProfileResponse } from "@/types/profile"

interface HeaderProps {
  title: string
  session: Session | null
}

export function Header({ title, session }: HeaderProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [profile, setProfile] = useState<ProfileResponse | null>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!session) return
    getMe().then((res) => {
      if (res.status === 200 && res.data?.data) setProfile(res.data.data)
    }).catch(() => {})
  }, [session])

  const displayName = profile?.full_name ?? ""
  const roleLabel = profile?.role?.description ?? ""
  const profilePicture = profile?.profile_picture ?? ""
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
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
                <AvatarImage src={profilePicture} className="object-cover" />
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
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-red-600"
              onClick={() => logout()}
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
