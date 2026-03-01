"use client"

import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import { Settings, LogOut, User } from "lucide-react"

type UserRole = "super_admin" | "admin" | "level1" | "level2"

interface HeaderProps {
  title: string
  userName: string
  role: UserRole
  avatarUrl?: string
}

const roleConfig: Record<
  UserRole,
  { label: string; className: string }
> = {
  super_admin: {
    label: "Super Admin",
    className: "bg-purple-600 text-white",
  },
  admin: {
    label: "Admin",
    className: "bg-blue-600 text-white",
  },
  level1: {
    label: "Programmer",
    className: "bg-orange-500 text-white",
  },
  level2: {
    label: "Verifikator",
    className: "bg-green-600 text-white",
  },
}

export function Header({
  title,
  userName,
  role,
  avatarUrl,
}: HeaderProps) {
  const roleData = roleConfig[role]

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">

      {/* LEFT */}
      <h1 className="text-lg font-semibold tracking-tight">
        {title}
      </h1>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        <Badge className={roleData.className}>
          {roleData.label}
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary">
              <Avatar className="h-9 w-9 cursor-pointer">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">

            <DropdownMenuLabel>
              {userName}
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  )
}