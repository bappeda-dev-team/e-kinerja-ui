import { fetchApi } from "@/lib/fetcher";
import { APIResponse } from "@/types/api";
import { CreateMasterAplikasiRequest, MasterAplikasi } from "./_types";

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

export const deleteMasterAplikasi = async (id: string) => {
  return fetchApi<APIResponse<any>>(`/master-aplikasi/${id}`, { method: "DELETE" });
};
