// app/super-admin/data-master/master-aplikasi/_services.ts

import { fetchApi } from "@/lib/fetcher";
import { APIResponse } from "@/types/api";
import { CreateMasterAplikasiRequest, MasterAplikasi } from "./_types";
import { getSession } from "next-auth/react";

export const getMasterAplikasi = async () => {
  return fetchApi<APIResponse<MasterAplikasi[]>>("/master-aplikasi", { method: "GET" });
};

export const getMasterAplikasiById = async (id: string) => {
  return fetchApi<APIResponse<MasterAplikasi>>(`/master-aplikasi/${id}`, { method: "GET" });
};

export const createMasterAplikasi = async (data: CreateMasterAplikasiRequest) => {
  return fetchApi<APIResponse<MasterAplikasi>>("/master-aplikasi", { method: "POST", body: data });
};

export const updateMasterAplikasi = async (id: string, data: CreateMasterAplikasiRequest) => {
  return fetchApi<APIResponse<MasterAplikasi>>(`/master-aplikasi/${id}`, { method: "PUT", body: data });
};

// ✅ Upload logo — sama persis seperti pemda
export const updateMasterAplikasiLogo = async (id: string, file: File) => {
  const session = await getSession()
  const token = (session as any)?.accessToken

  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/master-aplikasi/${id}/logo`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  const resData = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(resData.message || "Gagal mengunggah logo")
  return resData
}

export const deleteMasterAplikasi = async (id: string) => {
  return fetchApi<APIResponse<any>>(`/master-aplikasi/${id}`, { method: "DELETE" });
};