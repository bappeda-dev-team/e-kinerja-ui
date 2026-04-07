// lib/fetcher.ts

import { NextRequest } from "next/server";
import { getCookie } from "cookies-next";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const SESSION_TTL = 60 * 1000;

let cachedClientSession: any = null;
let cachedClientSessionExpiresAt = 0;
let hasCachedClientSession = false;
let inFlightClientSessionPromise: Promise<any> | null = null;

function setClientSessionCache(session: any) {
  cachedClientSession = session;
  cachedClientSessionExpiresAt = Date.now() + SESSION_TTL;
  hasCachedClientSession = true;
}

export function primeClientSessionCache(session: any) {
  if (typeof window === "undefined") return;
  setClientSessionCache(session);
}

export function invalidateClientSessionCache() {
  cachedClientSession = null;
  cachedClientSessionExpiresAt = 0;
  hasCachedClientSession = false;
  inFlightClientSessionPromise = null;
}

async function getCachedClientSession() {
  const now = Date.now();

  if (hasCachedClientSession && now < cachedClientSessionExpiresAt) {
    return cachedClientSession;
  }

  if (!inFlightClientSessionPromise) {
    inFlightClientSessionPromise = getSession()
      .then((session) => {
        setClientSessionCache(session);
        return session;
      })
      .catch((error) => {
        invalidateClientSessionCache();
        throw error;
      })
      .finally(() => {
        inFlightClientSessionPromise = null;
      });
  }

  return inFlightClientSessionPromise;
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

export async function fetchApi<T = any>(url: string): Promise<{ status: number; message: string; data: T }>;
export async function fetchApi<T = any>(url: string, options: Partial<Omit<ReqApi, 'url'>>): Promise<{ status: number; message: string; data: T }>;
export async function fetchApi<T = any>(params: ReqApi): Promise<{ status: number; message: string; data: T }>;

export async function fetchApi<T = any>(
  urlOrParams: string | ReqApi,
  options?: Partial<Omit<ReqApi, 'url'>>
): Promise<{ status: number; message: string; data: T }> {
  let type: "auth" | "withoutAuth";
  let url: string;
  let method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  let body: any;
  let token: string | undefined;
  let web: string | undefined;

  if (typeof urlOrParams === 'string') {
    url = urlOrParams;
    type = options?.type ?? "auth";
    method = options?.method ?? "GET";
    body = options?.body;
    token = options?.token;
    web = options?.web;
  } else {
    type = urlOrParams.type ?? "auth";
    url = urlOrParams.url;
    method = urlOrParams.method ?? "GET";
    body = urlOrParams.body;
    token = urlOrParams.token;
    web = urlOrParams.web;
  }

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
      } else {
        const session: any = await getCachedClientSession();
        authToken = session?.accessToken ?? null;
      }

      if (authToken) {
        headers.append("Authorization", `Bearer ${authToken}`);
      }
    }
  }

  try {
    const stringifiedBody = body
      ? isFormData
        ? body
        : JSON.stringify(body)
      : null

    // 🔍 DEBUG — hapus setelah berhasil
    if (method === "PUT") {
      console.log("=== FETCHER DEBUG PUT ===")
      console.log("URL:", `${baseURL}${url}`)
      console.log("BODY RAW:", body)
      console.log("BODY FINAL:", stringifiedBody)
      console.log("========================")
    }

    const response = await fetch(`${baseURL}${url}`, {
      method,
      headers,
      body: stringifiedBody,
    });

    if (response.status === 403) {
      invalidateClientSessionCache();
      // Hanya redirect ke /unauthorized jika memang ada token tapi ditolak (bukan karena belum login)
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
