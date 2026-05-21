// lib/fetcher.ts

import { NextRequest } from "next/server";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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

  const baseURL = process.env.NEXT_PUBLIC_API_URL || process.env.SITE_URL || "http://localhost:8080";
  const headers = new Headers();
  const isFormData = body instanceof FormData;

  if (!isFormData) {
    headers.append("Content-Type", "application/json");
  }

  if (type === "auth") {
    if (web === "basic") {
      headers.append("Authorization", `Basic ${process.env.BASIC_AUTH_TOKEN}`);
    } else {
      let authToken: string | null = token ?? null;

      if (!authToken) {
        if (typeof window === "undefined") {
          const session: any = await getServerSession(authOptions);
          if (session?.error === "RefreshTokenError") redirect("/login");
          authToken = session?.accessToken ?? null;
        } else {
          const session: any = await getSession();
          if (session?.error === "RefreshTokenError") {
            window.location.href = "/login";
            return { status: 401, message: "Session expired", data: null as any };
          }
          authToken = session?.accessToken ?? null;
        }
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
