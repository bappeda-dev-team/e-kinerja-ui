// app/super-admin/permintaan/services.ts

// services.ts
import { fetchApi } from "@/lib/fetcher";
import type { ApiResponse } from "@/types/api";
import type { MasterPemda } from "@/app/super-admin/data-master/master-pemda/types";
import { PermintaanRequest, PermintaanResponse } from "./types";

// Mendapatkan data Master Pemda untuk ambil Logo
export const getMasterPemda = async () => {
  return fetchApi<ApiResponse<MasterPemda[]>>({
    url: "/master-pemda",
    method: "GET",
  });
};

export const getPermintaan = async () => {
  return fetchApi<ApiResponse<PermintaanResponse[]>>({
    url: "/permintaan",
    method: "GET",
  });
};

export const createPermintaan = async (data: PermintaanRequest) => {
  return fetchApi<ApiResponse<PermintaanResponse>>({
    url: "/permintaan",
    method: "POST", 
    body: data 
  });
};

export const updatePermintaan = async (id: string, data: PermintaanRequest) => {
  return fetchApi<ApiResponse<PermintaanResponse>>({
    url: `/permintaan/${id}`,
    method: "PUT", 
    body: data 
  });
};

export const deletePermintaan = async (id: string) => {
  return fetchApi<ApiResponse<null>>({
    url: `/permintaan/${id}`,
    method: "DELETE",
  });
};

export const uploadPermintaanAttachment = async (id: string, files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const response = await fetchApi<ApiResponse<PermintaanResponse>>({
    url: `/permintaan/${id}/lampiran`,
    method: "PATCH",
    body: formData,
  });

  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.data?.message || "Gagal mengunggah lampiran.");
  }

  return response.data;
};
