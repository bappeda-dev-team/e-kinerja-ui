import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session: any = await getServerSession(authOptions)
  const token = session?.accessToken

  console.log("[profile-picture] PATCH /users/%s/profile-picture", id)
  console.log("[profile-picture] token:", token ? `${token.slice(0, 20)}...` : "MISSING")

  if (!token) {
    console.error("[profile-picture] Unauthorized — no token found in session")
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get("file")

  console.log("[profile-picture] file:", file ? `${(file as File).name} (${(file as File).size} bytes)` : "MISSING")

  if (!file) {
    console.error("[profile-picture] Bad request — file field missing")
    return NextResponse.json({ message: "File tidak ditemukan" }, { status: 400 })
  }

  const upstream = new FormData()
  upstream.append("file", file)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${apiUrl}/users/${id}/profile-picture`

  console.log("[profile-picture] Forwarding to:", url)

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: upstream,
    })

    const data = await response.json().catch(() => null)

    console.log("[profile-picture] Upstream status:", response.status)
    console.log("[profile-picture] Upstream response:", JSON.stringify(data))

    return NextResponse.json(data, { status: response.status })
  } catch (err: any) {
    console.error("[profile-picture] Fetch error:", err.message)
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
