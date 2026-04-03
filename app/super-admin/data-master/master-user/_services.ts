import { fetchApi } from "@/lib/fetcher"
import { APIResponse } from "@/types/api"
import { UserRequest, UserResponse } from "./_types"

export const getUsers = async () => {
  return fetchApi<APIResponse<UserResponse[]>>("/users", { method: "GET" })
}

export const getUserById = async (id: string) => {
  return fetchApi<APIResponse<UserResponse>>(`/users/${id}`, { method: "GET" })
}

export const createUser = async (data: UserRequest) => {
  return fetchApi<APIResponse<UserResponse>>("/users", { method: "POST", body: data })
}

export const updateUser = async (id: string, data: UserRequest) => {
  return fetchApi<APIResponse<UserResponse>>(`/users/${id}`, { method: "PUT", body: data })
}

export const deleteUser = async (id: string) => {
  return fetchApi<APIResponse<any>>(`/users/${id}`, { method: "DELETE" })
}
