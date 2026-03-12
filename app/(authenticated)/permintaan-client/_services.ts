import { fetchApi } from "@/lib/fetcher";
import { APIResponse } from "@/types/api";
import { PermintaanRequest, PermintaanResponse } from "./_types";

export const getPermintaan = async (expand?: string) => {
  const url = expand ? `/permintaan?expand=${expand}` : "/permintaan";
  return fetchApi<APIResponse<PermintaanResponse[]>>(url, { method: "GET" });
};

export const getPermintaanById = async (id: string, expand?: string) => {
  const url = expand ? `/permintaan/${id}?expand=${expand}` : `/permintaan/${id}`;
  return fetchApi<APIResponse<PermintaanResponse>>(url, { method: "GET" });
};

export const createPermintaan = async (data: PermintaanRequest) => {
  return fetchApi<APIResponse<PermintaanResponse>>("/permintaan", { method: "POST", body: data });
};

export const updatePermintaan = async (id: string, data: PermintaanRequest) => {
  return fetchApi<APIResponse<PermintaanResponse>>(`/permintaan/${id}`, { method: "PUT", body: data });
};

export const deletePermintaan = async (id: string) => {
  return fetchApi<APIResponse<any>>(`/permintaan/${id}`, { method: "DELETE" });
};
