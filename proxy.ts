// proxy.ts

import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

const AUTH_ROUTES = ["/login", "/"]

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

  // Sudah login tapi akses prefix role lain → redirect ke home role sendiri
  if (isAuthenticated && isProtected) {
    if (!role) {
      log("PROTECTED: role tidak dikenal → paksa logout", { role: role ?? null })
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
  const res = NextResponse.next()

  if ((token as any)?.accessToken) {
    res.cookies.set("auth", (token as any).accessToken as string, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    })
  }

  if ((token as any)?.refreshToken) {
    res.cookies.set("refresh_token", (token as any).refreshToken as string, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    })
  }

  return res
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
}
