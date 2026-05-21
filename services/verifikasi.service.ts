import { fetchApi } from "@/lib/fetcher";
import type { ApiResponse } from "@/types/api";
import type { MasterPemda } from "@/types/master-pemda";
import type { VerifikasiRequest, VerifikasiResponse } from "@/types/verifikasi";

export const getVerifikasi = async () => {
  return fetchApi<ApiResponse<VerifikasiResponse[]>>({
    url: "/verifikasi",
    method: "GET",
  });
};

export const getVerifikasiById = async (id: string) => {
  return fetchApi<ApiResponse<VerifikasiResponse>>({
    url: `/verifikasi/${id}`,
    method: "GET",
  });
};

export const createVerifikasi = async (data: VerifikasiRequest) => {
  return fetchApi<ApiResponse<VerifikasiResponse>>({
    url: "/verifikasi",
    method: "POST",
    body: data,
  });
};

export const updateVerifikasi = async (id: string, data: VerifikasiRequest) => {
  return fetchApi<ApiResponse<VerifikasiResponse>>({
    url: `/verifikasi/${id}`,
    method: "PUT",
    body: data,
  });
};

export const deleteVerifikasi = async (id: string) => {
  return fetchApi<ApiResponse<null>>({
    url: `/verifikasi/${id}`,
    method: "DELETE",
  });
};

export const getPemda = async () => {
  return fetchApi<ApiResponse<MasterPemda[]>>({
    url: "/master-pemda",
    method: "GET",
  });
};
