// proxy.ts

import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

const AUTH_ROUTES = ["/login", "/"]

const ROLE_HOME: Record<string, string> = {
  super_admin: "/dashboard",
  admin:       "/dashboard",
  programmer:  "/dashboard",
  verifikator: "/dashboard",
}

const PROTECTED_PREFIXES = [
  "/dashboard", "/distribusi", "/permintaan", "/laporan",
  "/penugasan", "/verifikasi", "/profile", "/data-master", "/settings",
]

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

  const u = (token as any)?.user
  const rawRole: string =
    u?.role_name ??
    (typeof u?.role === "string" ? u.role : null) ??
    u?.role?.name ??
    u?.role?.description ??
    u?.name ??
    ""
  const normalized = rawRole.toLowerCase().trim().replace(/[\s-]+/g, "_")
  const role: string | null =
    normalized === "super_admin" || normalized === "superadmin" ? "super_admin" :
    normalized === "admin"       ? "admin" :
    normalized === "programmer"  ? "programmer" :
    normalized === "verifikator" || normalized === "level2" || normalized === "level_2" ? "verifikator" :
    null

  log("REQUEST", {
    pathname,
    isAuthenticated,
    isAuthRoute,
    isProtected,
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
      log("AUTH_ROUTE: token ada tapi role tidak dikenal → hapus cookie, tetap di halaman", { role: role ?? null })
      const res = NextResponse.next()
      res.cookies.delete("next-auth.session-token")
      res.cookies.delete("__Secure-next-auth.session-token")
      return res
    }

    log(`REDIRECT → ${ROLE_HOME[role]} (sudah login, akses auth route)`, { role })
    return NextResponse.redirect(new URL(ROLE_HOME[role], req.url))
  }

  // Sudah login tapi role tidak dikenal → paksa logout
  if (isAuthenticated && isProtected && !role) {
    log("PROTECTED: role tidak dikenal → paksa logout", { role: null })
    const res = NextResponse.redirect(new URL("/login", req.url))
    res.cookies.delete("next-auth.session-token")
    res.cookies.delete("__Secure-next-auth.session-token")
    return res
  }

  if ((token as any)?.error === "RefreshTokenError") {
    log("RefreshTokenError → force logout", {})
    const res = NextResponse.redirect(new URL("/login", req.url))
    res.cookies.delete("next-auth.session-token")
    res.cookies.delete("__Secure-next-auth.session-token")
    return res
  }

  log("PASS", { pathname })
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
}
