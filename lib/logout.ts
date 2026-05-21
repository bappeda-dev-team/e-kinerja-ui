import { signOut } from "next-auth/react"
import { deleteCookie, getCookie } from "cookies-next"

export async function logout() {
  try {
    const token = getCookie("auth")
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? ""
    await fetch(`${apiUrl}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
  } catch {
    // fire-and-forget — tetap lanjut logout meskipun backend error
  }

  deleteCookie("auth", { path: "/" })
  deleteCookie("refresh_token", { path: "/" })
  await signOut({ callbackUrl: "/login" })
}
