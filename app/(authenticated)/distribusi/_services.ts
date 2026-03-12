import { fetchApi } from "@/lib/fetcher";
import { APIResponse } from "@/types/api";
import { DistribusiRequest, DistribusiResponse, PelaksanaRequest, PelaksanaResponse } from "./_types";

export const getDistribusi = async (expand?: string) => {
  const url = expand ? `/distribusi?expand=${expand}` : "/distribusi";
  return fetchApi<APIResponse<DistribusiResponse[]>>(url, { method: "GET" });
};

export const getDistribusiById = async (id: string, expand?: string) => {
  const url = expand ? `/distribusi/${id}?expand=${expand}` : `/distribusi/${id}`;
  return fetchApi<APIResponse<DistribusiResponse>>(url, { method: "GET" });
};

export const createDistribusi = async (data: DistribusiRequest) => {
  return fetchApi<APIResponse<DistribusiResponse>>("/distribusi", { method: "POST", body: data });
};

export const updateDistribusi = async (id: string, data: DistribusiRequest) => {
  return fetchApi<APIResponse<DistribusiResponse>>(`/distribusi/${id}`, { method: "PUT", body: data });
};

export const deleteDistribusi = async (id: string) => {
  return fetchApi<APIResponse<any>>(`/distribusi/${id}`, { method: "DELETE" });
};

export const getPelaksana = async (expand?: string) => {
  const url = expand ? `/pelaksana?expand=${expand}` : "/pelaksana";
  return fetchApi<APIResponse<PelaksanaResponse[]>>(url, { method: "GET" });
};

export const getPelaksanaById = async (id: string, expand?: string) => {
  const url = expand ? `/pelaksana/${id}?expand=${expand}` : `/pelaksana/${id}`;
  return fetchApi<APIResponse<PelaksanaResponse>>(url, { method: "GET" });
};

export const createPelaksana = async (data: PelaksanaRequest) => {
  return fetchApi<APIResponse<PelaksanaResponse>>("/pelaksana", { method: "POST", body: data });
};

export const updatePelaksana = async (id: string, data: PelaksanaRequest) => {
  return fetchApi<APIResponse<PelaksanaResponse>>(`/pelaksana/${id}`, { method: "PUT", body: data });
};

export const deletePelaksana = async (id: string) => {
  return fetchApi<APIResponse<any>>(`/pelaksana/${id}`, { method: "DELETE" });
};
