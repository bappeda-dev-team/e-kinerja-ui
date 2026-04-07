// app/super-admin/data-master/master-roles/services.ts

import { fetchApi } from "@/lib/fetcher";
import { APIResponse } from "@/types/api";
import { Roles, RoleRequest } from "./types";

export const getRoles = async () => {
  return fetchApi<APIResponse<Roles[]>>("/roles", { method: "GET" });
};

export const getRolesById = async (id: string) => {
  return fetchApi<APIResponse<Roles>>(`/roles/${id}`, { method: "GET" });
};

export const createRole = async (data: RoleRequest) => {
  return fetchApi<APIResponse<Roles>>("/roles", { method: "POST", body: data });
};

export const updateRole = async (id: string, data: RoleRequest) => {
  return fetchApi<APIResponse<Roles>>(`/roles/${id}`, { method: "PATCH", body: data });
};

export const deleteRole = async (id: string) => {
  return fetchApi<APIResponse<any>>(`/roles/${id}`, { method: "DELETE" });
};
