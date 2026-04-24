// app/super-admin/distribusi/services.ts

import { fetchApi } from "@/lib/fetcher";
import type { ApiResponse } from "@/types/api";
import type { MasterPemda } from "@/app/super-admin/data-master/master-pemda/types";
import { CreateDistribusiKomentarRequest, DistribusiKomentar, DistribusiRequest, DistribusiResponse, PelaksanaRequest, PelaksanaResponse, PermintaanResponse, UpdateDistribusiRequest, UserResponse } from "./types";

export const getPermintaan = async () => {
  return fetchApi<ApiResponse<PermintaanResponse[]>>({
    url: "/permintaan",
    method: "GET",
  });
};

export const getDistribusi = async () => {
  return fetchApi<ApiResponse<DistribusiResponse[]>>({
    url: "/distribusi",
    method: "GET",
  });
};

export const getDistribusiById = async (id: string) => {
  return fetchApi<ApiResponse<DistribusiResponse>>({
    url: `/distribusi/${id}`,
    method: "GET",
  });
};

export const createDistribusi = async (data: DistribusiRequest) => {
  return fetchApi<ApiResponse<DistribusiResponse>>({
    url: "/distribusi",
    method: "POST",
    body: data,
  });
};

export const updateDistribusi = async (id: string, data: UpdateDistribusiRequest) => {
  return fetchApi<ApiResponse<DistribusiResponse>>({
    url: `/distribusi/${id}`,
    method: "PUT",
    body: data,
  });
};

export const deleteDistribusi = async (id: string) => {
  return fetchApi<ApiResponse<null>>({
    url: `/distribusi/${id}`,
    method: "DELETE",
  });
};

export const createDistribusiKomentar = async (id: string, data: CreateDistribusiKomentarRequest) => {
  return fetchApi<ApiResponse<DistribusiKomentar>>({
    url: `/distribusi/komentar/${id}`,
    method: "POST",
    body: data,
  });
};

export const getPelaksana = async () => {
  return fetchApi<ApiResponse<PelaksanaResponse[]>>({
    url: "/pelaksana",
    method: "GET",
  });
};

export const getPelaksanaById = async (id: string) => {
  return fetchApi<ApiResponse<PelaksanaResponse>>({
    url: `/pelaksana/${id}`,
    method: "GET",
  });
};

export const createPelaksana = async (data: PelaksanaRequest) => {
  return fetchApi<ApiResponse<PelaksanaResponse>>({
    url: "/pelaksana",
    method: "POST",
    body: data,
  });
};

export const updatePelaksana = async (id: string, data: PelaksanaRequest) => {
  return fetchApi<ApiResponse<PelaksanaResponse>>({
    url: `/pelaksana/${id}`,
    method: "PUT",
    body: data,
  });
};

export const deletePelaksana = async (id: string) => {
  return fetchApi<ApiResponse<null>>({
    url: `/pelaksana/${id}`,
    method: "DELETE",
  });
};

export const getUsers = async () => {
  return fetchApi<ApiResponse<UserResponse[]>>({
    url: "/users",
    method: "GET",
  });
};

// Tambahkan ini untuk ambil logo
export const getPemda = async () => {
  return fetchApi<ApiResponse<MasterPemda[]>>({
    url: "/master-pemda",
    method: "GET",
  });
};
