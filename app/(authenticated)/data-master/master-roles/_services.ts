import { fetchApi } from "@/lib/fetcher";
import { APIResponse } from "@/types/api";
import { Roles } from "./_types";

export const getRoles = async () => {
  return fetchApi<APIResponse<Roles[]>>("/roles", { method: "GET" });
};

export const getRolesById = async (id: string) => {
  return fetchApi<APIResponse<Roles>>(`/roles/${id}`, { method: "GET" });
};
