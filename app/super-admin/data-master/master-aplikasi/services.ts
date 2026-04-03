// app/super-admin/data-master/master-aplikasi/services.ts

import { fetchApi } from "@/lib/fetcher";
import { APIResponse } from "@/types/api";
import { CreateMasterAplikasiRequest, MasterAplikasi } from "./types";

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
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetchApi<APIResponse<any>>(`/master-aplikasi/${id}/logo`, {
    method: "PATCH",
    body: formData,
  })

  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.data?.message || "Gagal mengunggah logo")
  }

  return response.data
}

export const deleteMasterAplikasi = async (id: string) => {
  return fetchApi<APIResponse<any>>(`/master-aplikasi/${id}`, { method: "DELETE" });
};
