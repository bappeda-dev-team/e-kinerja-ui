// app/super-admin/data-master/master-pemda/services.ts

import { fetchApi } from "@/lib/fetcher";
import { APIResponse } from "@/types/api";
import { MasterPemdaRequest, MasterPemda } from "./types";
import { getSession } from "next-auth/react";

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
  const session = await getSession();
  const token = (session as any)?.accessToken;

  const formData = new FormData();
  formData.append("file", file); // Key harus "file" sesuai Postman kamu

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/master-pemda/${id}/logo`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  });

  const resData = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(resData.message || "Gagal mengunggah logo");
  }
  return resData;
};

export const deleteMasterPemda = async (id: string) => {
  return fetchApi<APIResponse<any>>(`/master-pemda/${id}`, { method: "DELETE" });
};