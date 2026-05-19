import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(_req: NextRequest) {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get("refresh_token")?.value

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 })
  }

  const apiUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || process.env.SITE_URL || ""
  const res = await fetch(`${apiUrl}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  })

  if (!res.ok) {
    return NextResponse.json({ error: "Refresh failed" }, { status: 401 })
  }

  const data = await res.json()
  const newAccessToken = data.data?.access_token
  const newRefreshToken = data.data?.refresh_token

  if (!newAccessToken) {
    return NextResponse.json({ error: "No access token in response" }, { status: 401 })
  }

  const response = NextResponse.json({ accessToken: newAccessToken })

  response.cookies.set("auth", newAccessToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  })

  if (newRefreshToken) {
    response.cookies.set("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    })
  }

  return response
}
