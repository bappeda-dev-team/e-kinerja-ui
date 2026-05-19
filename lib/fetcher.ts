// lib/fetcher.ts

import { NextRequest } from "next/server";
import { getCookie } from "cookies-next";
import { signOut } from "next-auth/react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function refreshAccessToken(): Promise<string | null> {
  const res = await fetch("/api/auth/refresh", { method: "POST" })
  if (!res.ok) return null
  const data = await res.json()
  return data.accessToken ?? null
}

interface ReqApi {
  type?: "auth" | "withoutAuth";
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
  token?: string;
  web?: string;
  req?: NextRequest;
}

export async function fetchApi<T = any>(
  params: ReqApi,
): Promise<{ status: number; message: string; data: T }> {
  const {
    type = "auth",
    url,
    method = "GET",
    body,
    token,
    web,
  } = params;

  // Client-side: pakai proxy rewrites (/api/backend/...) untuk menghindari CORS
  // Server-side: pakai URL langsung ke backend
  const baseURL = typeof window === "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL || process.env.SITE_URL || "http://localhost:8080")
    : "/api/backend";
  const headers = new Headers();
  const isFormData = body instanceof FormData;

  if (!isFormData) {
    headers.append("Content-Type", "application/json");
  }

  if (type === "auth") {
    const cookieToken = getCookie("auth") as string | undefined;
    const overrideToken = token || cookieToken;

    if (web === "basic") {
      headers.append("Authorization", `Basic ${process.env.BASIC_AUTH_TOKEN}`);
    } else {
      let authToken: string | null = null;

      if (overrideToken) {
        authToken = overrideToken;
      } else if (typeof window === "undefined") {
        const session: any = await getServerSession(authOptions);
        authToken = session?.accessToken ?? null;
      }

      if (authToken) {
        headers.append("Authorization", `Bearer ${authToken}`);
      }
    }
  }

  const stringifiedBody = body
    ? isFormData
      ? body
      : JSON.stringify(body)
    : null

  try {
    const response = await fetch(`${baseURL}${url}`, {
      method,
      headers,
      body: stringifiedBody,
    });

    if (response.status === 403) {
      const hadToken = headers.get("Authorization") !== null;
      if (hadToken) {
        if (typeof window === "undefined") redirect("/unauthorized");
        else window.location.href = "/unauthorized";
      }
    }

    if (response.status === 401) {
      let resData: any = null;
      try {
        resData = await response.clone().json();
      } catch {}

      const msg = resData?.message?.toLowerCase() ?? "";
      const isExpired = msg.includes("expired") || msg === "token tidak valid";

      if (isExpired) {
        const cookieToken = getCookie("auth") as string | undefined;

        if (!cookieToken) {
          // Belum login sama sekali
          if (typeof window === "undefined") redirect("/login");
          else window.location.href = "/login";
          return { status: 401, message: "Unauthorized", data: null as any };
        }

        // Sudah login tapi token expired → coba refresh
        if (typeof window !== "undefined") {
          const newToken = await refreshAccessToken();
          if (newToken) {
            headers.set("Authorization", `Bearer ${newToken}`);
            const retryResponse = await fetch(`${baseURL}${url}`, { method, headers, body: stringifiedBody });
            let retryData = null;
            try { retryData = await retryResponse.json(); } catch {}
            return {
              status: retryResponse.status,
              message: retryResponse.ok ? "Success" : (retryData?.message || retryResponse.statusText),
              data: retryData,
            };
          } else {
            await signOut({ callbackUrl: "/login" });
            return { status: 401, message: "Session expired", data: null as any };
          }
        }
      }
    }

    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    return {
      status: response.status,
      message: response.ok ? "Success" : (data?.message || response.statusText),
      data
    };

  } catch (error: any) {
    const isNetworkFailure =
      error instanceof TypeError &&
      (error.message === "Failed to fetch" || error.message === "Network request failed" || error.message === "Load failed")
    console.error("FetchAPI Error:", error);
    return {
      status: isNetworkFailure ? 0 : 500,
      message: isNetworkFailure ? "Tidak dapat terhubung ke server. Periksa koneksi internet kamu." : (error.message || "Internal Server Error"),
      data: null as any
    };
  }
}
