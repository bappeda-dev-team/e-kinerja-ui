import { fetchApi } from "@/lib/fetcher";
import { APIResponse } from "@/types/api";
import { VerifikasiRequest, VerifikasiResponse } from "./_types";

export const getVerifikasi = async () => {
  return fetchApi<APIResponse<VerifikasiResponse[]>>("/verifikasi", { method: "GET" });
};

export const getVerifikasiById = async (id: string) => {
  return fetchApi<APIResponse<VerifikasiResponse>>(`/verifikasi/${id}`, { method: "GET" });
};

export const createVerifikasi = async (data: VerifikasiRequest) => {
  return fetchApi<APIResponse<VerifikasiResponse>>("/verifikasi", { method: "POST", body: data });
};

export const updateVerifikasi = async (id: string, data: VerifikasiRequest) => {
  return fetchApi<APIResponse<VerifikasiResponse>>(`/verifikasi/${id}`, { method: "PUT", body: data });
};

export const deleteVerifikasi = async (id: string) => {
  return fetchApi<APIResponse<any>>(`/verifikasi/${id}`, { method: "DELETE" });
};
