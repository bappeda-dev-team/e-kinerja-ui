// app/super-admin/data-master/master-roles/_services.ts

import { fetchApi } from "@/lib/fetcher";
import { APIResponse } from "@/types/api";
import { Roles, RoleRequest } from "./_types";

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
  return fetchApi<APIResponse<Roles>>(`/roles/${id}`, { method: "PUT", body: data });
};

export const deleteRole = async (id: string) => {
  return fetchApi<APIResponse<any>>(`/roles/${id}`, { method: "DELETE" });
};
