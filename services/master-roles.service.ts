import { fetchApi } from "@/lib/fetcher";
import type { ApiResponse } from "@/types/api";
import type { Roles, RoleRequest } from "@/app/super-admin/data-master/master-roles/types";

export const getRoles = async () => {
  return fetchApi<ApiResponse<Roles[]>>({
    url: "/roles",
    method: "GET",
  });
};

export const getRolesById = async (id: string) => {
  return fetchApi<ApiResponse<Roles>>({
    url: `/roles/${id}`,
    method: "GET",
  });
};

export const createRole = async (data: RoleRequest) => {
  return fetchApi<ApiResponse<Roles>>({
    url: "/roles",
    method: "POST",
    body: data,
  });
};

export const updateRole = async (id: string, data: RoleRequest) => {
  return fetchApi<ApiResponse<Roles>>({
    url: `/roles/${id}`,
    method: "PATCH",
    body: data,
  });
};

export const deleteRole = async (id: string) => {
  return fetchApi<ApiResponse<null>>({
    url: `/roles/${id}`,
    method: "DELETE",
  });
};
