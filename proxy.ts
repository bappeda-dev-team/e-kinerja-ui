// proxy.ts

import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

const AUTH_ROUTES = ["/login", "/"]

const ROLE_ID_MAP: Record<string, string> = {
  "cd8c9166-9b38-4c9b-8afc-1c10ec97e068": "super_admin",
  "5fa89680-b618-42fc-8725-fa72453a9351": "admin",
  "b0cabba0-e1b9-4696-ab4b-7c9a229959e2": "programmer",
  "dda6d213-4503-49e6-955c-5f4ae7796b19": "verifikator",
}

const ROLE_HOME: Record<string, string> = {
  super_admin: "/super-admin/dashboard",
  admin:       "/admin/dashboard",
  programmer:  "/programmer/dashboard",
  verifikator: "/verifikator/dashboard",
}

const ROLE_PREFIX: Record<string, string> = {
  super_admin: "/super-admin",
  admin:       "/admin",
  programmer:  "/programmer",
  verifikator: "/verifikator",
}

const PROTECTED_PREFIXES = ["/super-admin", "/admin", "/programmer", "/verifikator"]

const DEBUG = process.env.MIDDLEWARE_DEBUG === "true"

function log(event: string, data: Record<string, unknown>) {
  if (!DEBUG) return
  console.log(`[MIDDLEWARE] ${event}`, JSON.stringify(data))
}

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const isAuthenticated = !!token
  const isAuthRoute = AUTH_ROUTES.includes(pathname)
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))

  const roleId = (token as any)?.user?.role_id as string | undefined
  const role = roleId ? ROLE_ID_MAP[roleId] : null

  log("REQUEST", {
    pathname,
    isAuthenticated,
    isAuthRoute,
    isProtected,
    roleId: roleId ?? null,
    role: role ?? null,
  })

  // Belum login → redirect ke /login
  if (isProtected && !isAuthenticated) {
    log("REDIRECT → /login (unauthenticated)", { pathname })
    const url = new URL("/login", req.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  // Sudah login → jangan akses /login atau /
  if (isAuthRoute && isAuthenticated) {
    if (!role) {
      log("AUTH_ROUTE: token ada tapi role tidak dikenal → hapus cookie, tetap di halaman", { roleId })
      const res = NextResponse.next()
      res.cookies.delete("next-auth.session-token")
      res.cookies.delete("__Secure-next-auth.session-token")
      return res
    }

    log(`REDIRECT → ${ROLE_HOME[role]} (sudah login, akses auth route)`, { role })
    return NextResponse.redirect(new URL(ROLE_HOME[role], req.url))
  }

  // Sudah login tapi akses prefix role lain → redirect ke home role sendiri
  if (isAuthenticated && isProtected) {
    if (!role) {
      log("PROTECTED: role tidak dikenal → paksa logout", { roleId })
      const res = NextResponse.redirect(new URL("/login", req.url))
      res.cookies.delete("next-auth.session-token")
      res.cookies.delete("__Secure-next-auth.session-token")
      return res
    }

    const myPrefix = ROLE_PREFIX[role]
    if (!pathname.startsWith(myPrefix)) {
      log(`REDIRECT → ${ROLE_HOME[role]} (akses prefix role lain)`, { pathname, myPrefix })
      return NextResponse.redirect(new URL(ROLE_HOME[role], req.url))
    }
  }

  log("PASS", { pathname })
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
}
