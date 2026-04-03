import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

const AUTH_ROUTES = ["/login", "/"]

const ROLE_ID_MAP: Record<string, string> = {
  "3fc5cfba-e591-4b67-9e99-78562fba36e8": "super_admin",
  "8c0c4dda-eaa9-4abc-b79e-132cf7f696d2": "admin",
  "7726b58e-3223-415e-aef9-3784af6754a6": "programmer",
  "bee727b8-a9c2-4577-bf63-7b4a8d201798": "level2",
}

const ROLE_HOME: Record<string, string> = {
  super_admin: "/super-admin/dashboard",
  admin:       "/admin/dashboard",
  programmer:  "/programmer/dashboard",
  level2:      "/verifikator/dashboard",
}

const ROLE_PREFIX: Record<string, string> = {
  super_admin: "/super-admin",
  admin:       "/admin",
  programmer:  "/programmer",
  level2:      "/verifikator",
}

const PROTECTED_PREFIXES = ["/super-admin", "/admin", "/programmer", "/verifikator"]

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const isAuthenticated = !!token
  const isAuthRoute = AUTH_ROUTES.includes(pathname)
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))

  // Belum login → redirect ke /login
  if (isProtected && !isAuthenticated) {
    const url = new URL("/login", req.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  // Sudah login → jangan akses /login atau /
  if (isAuthRoute && isAuthenticated) {
    const roleId = (token as any)?.user?.role_id as string | undefined
    const role = roleId ? ROLE_ID_MAP[roleId] : null
    const home = role ? ROLE_HOME[role] : "/login"
    return NextResponse.redirect(new URL(home, req.url))
  }

  // Sudah login tapi akses prefix role lain → redirect ke home role sendiri
  if (isAuthenticated && isProtected) {
    const roleId = (token as any)?.user?.role_id as string | undefined
    const role = roleId ? ROLE_ID_MAP[roleId] : null

    if (!role) {
      // Role tidak dikenal → paksa logout
      const res = NextResponse.redirect(new URL("/login", req.url))
      res.cookies.delete("next-auth.session-token")
      res.cookies.delete("__Secure-next-auth.session-token")
      return res
    }

    const myPrefix = ROLE_PREFIX[role]
    if (!pathname.startsWith(myPrefix)) {
      return NextResponse.redirect(new URL(ROLE_HOME[role], req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
}
