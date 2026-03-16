// _services.ts
import { fetchApi } from "@/lib/fetcher";
import { APIResponse } from "@/types/api";
import { PermintaanRequest, PermintaanResponse } from "./_types";
import { getSession } from "next-auth/react";

// Mendapatkan data Master Pemda untuk ambil Logo
export const getMasterPemda = async () => {
  return fetchApi<APIResponse<any[]>>("/master-pemda", { method: "GET" });
};

export const getPermintaan = async () => {
  return fetchApi<APIResponse<PermintaanResponse[]>>("/permintaan", { method: "GET" });
};

export const createPermintaan = async (data: PermintaanRequest) => {
  return fetchApi<APIResponse<PermintaanResponse>>("/permintaan", { 
    method: "POST", 
    body: data 
  });
};

export const updatePermintaan = async (id: string, data: PermintaanRequest) => {
  return fetchApi<APIResponse<PermintaanResponse>>(`/permintaan/${id}`, { 
    method: "PUT", 
    body: data 
  });
};

export const deletePermintaan = async (id: string) => {
  return fetchApi<APIResponse<any>>(`/permintaan/${id}`, { method: "DELETE" });
};

export const uploadPermintaanAttachment = async (id: string, files: File[]) => {
  const session = await getSession();
  const token = (session as any)?.accessToken;
  if (!token) throw new Error("Sesi habis. Silakan login kembali.");

  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/permintaan/${id}/lampiran`, {
    method: "PATCH",
    headers: { "Authorization": `Bearer ${token}` },
    body: formData,
  });

  const resData = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(resData.message || "Gagal mengunggah lampiran.");
  return resData;
};