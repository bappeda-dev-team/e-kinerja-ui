// app/super-admin/data-master/master-pemda/services.ts

import { fetchApi } from "@/lib/fetcher";
import { APIResponse } from "@/types/api";
import { MasterPemdaRequest, MasterPemda } from "./types";

export const getMasterPemda = async () => {
  return fetchApi<APIResponse<MasterPemda[]>>("/master-pemda", { method: "GET" });
};

export const createMasterPemda = async (data: MasterPemdaRequest) => {
  return fetchApi<APIResponse<MasterPemda>>("/master-pemda", { 
    method: "POST", 
    body: data 
  });
};

export const updateMasterPemda = async (id: string, data: Partial<MasterPemdaRequest>) => {
  return fetchApi<APIResponse<MasterPemda>>(`/master-pemda/${id}`, { 
    method: "PUT", 
    body: data 
  });
};

// Fungsi khusus upload logo sesuai Postman (PATCH & key: "file")
export const updateMasterPemdaLogo = async (id: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file); // Key harus "file" sesuai Postman kamu

  const response = await fetchApi<APIResponse<any>>(`/master-pemda/${id}/logo`, {
    method: "PATCH",
    body: formData,
  });

  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.data?.message || "Gagal mengunggah logo");
  }

  return response.data;
};

export const deleteMasterPemda = async (id: string) => {
  return fetchApi<APIResponse<any>>(`/master-pemda/${id}`, { method: "DELETE" });
};
