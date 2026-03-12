import { fetchApi } from "@/lib/fetcher";
import { APIResponse } from "@/types/api";
import { MasterPemdaRequest, MasterPemda } from "./_types";

export const getMasterPemda = async () => {
  return fetchApi<APIResponse<MasterPemda[]>>("/master-pemda", { method: "GET" });
};

export const getMasterPemdaById = async (id: string) => {
  return fetchApi<APIResponse<MasterPemda>>(`/master-pemda/${id}`, { method: "GET" });
};

export const createMasterPemda = async (data: MasterPemdaRequest) => {
  return fetchApi<APIResponse<MasterPemda>>("/master-pemda", { method: "POST", body: data });
};

export const updateMasterPemda = async (id: string, data: MasterPemdaRequest) => {
  return fetchApi<APIResponse<MasterPemda>>(`/master-pemda/${id}`, { method: "PUT", body: data });
};

export const deleteMasterPemda = async (id: string) => {
  return fetchApi<APIResponse<any>>(`/master-pemda/${id}`, { method: "DELETE" });
};
