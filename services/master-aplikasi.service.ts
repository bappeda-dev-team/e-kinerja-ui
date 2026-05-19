import { fetchApi } from "@/lib/fetcher";
import type { ApiResponse } from "@/types/api";
import type { CreateMasterAplikasiRequest, MasterAplikasi } from "@/app/super-admin/data-master/master-aplikasi/types";

export const getMasterAplikasi = async () => {
  return fetchApi<ApiResponse<MasterAplikasi[]>>({
    url: "/master-aplikasi",
    method: "GET",
  });
};

export const getMasterAplikasiById = async (id: string) => {
  return fetchApi<ApiResponse<MasterAplikasi>>({
    url: `/master-aplikasi/${id}`,
    method: "GET",
  });
};

export const createMasterAplikasi = async (data: CreateMasterAplikasiRequest) => {
  return fetchApi<ApiResponse<MasterAplikasi>>({
    url: "/master-aplikasi",
    method: "POST",
    body: data,
  });
};

export const updateMasterAplikasi = async (id: string, data: CreateMasterAplikasiRequest) => {
  return fetchApi<ApiResponse<MasterAplikasi>>({
    url: `/master-aplikasi/${id}`,
    method: "PUT",
    body: data,
  });
};

// ✅ Upload logo — sama persis seperti pemda
export const updateMasterAplikasiLogo = async (id: string, file: File) => {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetchApi<ApiResponse<MasterAplikasi>>({
    url: `/master-aplikasi/${id}/logo`,
    method: "PATCH",
    body: formData,
  })

  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.data?.message || "Gagal mengunggah logo")
  }

  return response.data
}

export const deleteMasterAplikasi = async (id: string) => {
  return fetchApi<ApiResponse<null>>({
    url: `/master-aplikasi/${id}`,
    method: "DELETE",
  });
};
