import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

// Routes yang butuh login
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/profile",
  "/permintaan",
  "/laporan",
  "/verifikasi",
  "/distribusi",
  "/data-master",
]

// Routes yang tidak boleh diakses kalau sudah login
const AUTH_ROUTES = ["/login", "/"]

// Map role UUID → role name
const ROLE_ID_MAP: Record<string, string> = {
  "3fc5cfba-e591-4b67-9e99-78562fba36e8": "super_admin",
  "8c0c4dda-eaa9-4abc-b79e-132cf7f696d2": "admin",
  "7726b58e-3223-415e-aef9-3784af6754a6": "programmer",
  "bee727b8-a9c2-4577-bf63-7b4a8d201798": "level2",
}

// Route whitelist per role
const ROLE_WHITELIST: Record<string, string[]> = {
  super_admin: [
    "/dashboard",
    "/profile",
    "/permintaan",
    "/distribusi",
    "/laporan",
    "/verifikasi",
    "/data-master",
  ],
  admin: [
    "/dashboard",
    "/profile",
    "/distribusi",
  ],
  programmer: [
    "/dashboard",
    "/profile",
    "/laporan",
  ],
  level2: [
    "/dashboard",
    "/profile",
    "/verifikasi",
  ],
}

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const isAuthenticated = !!token
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  const isAuthRoute = AUTH_ROUTES.includes(pathname)


  // Belum login → redirect ke login
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Sudah login → jangan akses login/root
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Role guard — cek akses berdasarkan role
  if (isAuthenticated && isProtected) {
    const userPayload = (token as any)?.user ?? {}
    const roleId = userPayload.role_id as string | undefined
    const roleName = roleId ? ROLE_ID_MAP[roleId] : undefined

    // Role tidak dikenal → paksa logout ke login
    if (!roleName || !ROLE_WHITELIST[roleName]) {
      const loginUrl = new URL("/login", req.url)
      const res = NextResponse.redirect(loginUrl)
      res.cookies.delete("next-auth.session-token")
      res.cookies.delete("__Secure-next-auth.session-token")
      res.cookies.delete("auth")
      return res
    }

    const allowed = ROLE_WHITELIST[roleName]
    const hasAccess = allowed.some((prefix) => pathname.startsWith(prefix))

    if (!hasAccess) {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
}
