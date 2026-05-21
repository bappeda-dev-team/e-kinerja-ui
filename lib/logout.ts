import { signOut, getSession } from "next-auth/react"

export async function logout() {
  try {
    const session: any = await getSession()
    const token = session?.accessToken
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

  await signOut({ callbackUrl: "/login" })
}
