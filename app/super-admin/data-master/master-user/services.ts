// app/super-admin/data-master/master-user/services.ts

import { fetchApi } from "@/lib/fetcher"
import { APIResponse } from "@/types/api"
import { RegisterUserRequest, UserRequest, UserResponse } from "./types"

export const getUsers = async () => {
  return fetchApi<APIResponse<UserResponse[]>>("/users", { method: "GET" })
}

export const getUserById = async (id: string) => {
  return fetchApi<APIResponse<UserResponse>>(`/users/${id}`, { method: "GET" })
}

export const createUser = async (data: RegisterUserRequest) => {
  const formData = new FormData()
  formData.append("role_id", data.role_id)
  formData.append("username", data.username)
  formData.append("full_name", data.full_name)
  formData.append("password", data.password)

  if (data.file) {
    formData.append("file", data.file)
  } else {
    formData.append("file", "")
  }

  return fetchApi<APIResponse<UserResponse>>("/users", { method: "POST", body: formData })
}

export const updateUser = async (id: string, data: UserRequest) => {
  return fetchApi<APIResponse<UserResponse>>(`/users/${id}`, { method: "PUT", body: data })
}

export const deleteUser = async (id: string) => {
  return fetchApi<APIResponse<any>>(`/users/${id}`, { method: "DELETE" })
}
