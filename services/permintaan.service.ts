import { fetchApi } from "@/lib/fetcher";
import type { ApiResponse } from "@/types/api";
import type { MasterPemda } from "@/app/super-admin/data-master/master-pemda/types";
import type { PermintaanRequest, PermintaanResponse } from "@/app/super-admin/permintaan/types";

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

export const getArchivedPermintaan = async () => {
  return fetchApi<ApiResponse<PermintaanResponse[]>>({
    url: "/permintaan/archived",
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

export const toggleArchivePermintaan = async (item: PermintaanResponse, isArchived: boolean) => {
  const formData = new FormData();

  formData.append("pemda_id", item.pemda?.id || "");
  formData.append("aplikasi_id", item.aplikasi?.id || "");
  formData.append("menu", item.menu || "");
  formData.append("kondisi_awal", item.kondisi_awal || "");
  formData.append("kondisi_diharapkan", item.kondisi_diharapkan || "");

  if (item.tanggal_pesanan) {
    formData.append("tanggal_pesanan", item.tanggal_pesanan.slice(0, 10));
  }

  if (item.tanggal_deadline) {
    formData.append("tanggal_deadline", item.tanggal_deadline.slice(0, 10));
  }

  formData.append("is_archived", String(isArchived));

  return fetchApi<ApiResponse<PermintaanResponse>>({
    url: `/permintaan/${item.id}`,
    method: "PUT",
    body: formData,
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
