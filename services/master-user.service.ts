import { fetchApi } from "@/lib/fetcher"
import type { ApiResponse } from "@/types/api"
import type { RegisterUserRequest, UserRequest, UserResponse } from "@/app/super-admin/data-master/master-user/types"

export const getUsers = async () => {
  return fetchApi<ApiResponse<UserResponse[]>>({
    url: "/users",
    method: "GET",
  })
}

export const getUserById = async (id: string) => {
  return fetchApi<ApiResponse<UserResponse>>({
    url: `/users/${id}`,
    method: "GET",
  })
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

  return fetchApi<ApiResponse<UserResponse>>({
    url: "/users",
    method: "POST",
    body: formData,
  })
}

export const updateUser = async (id: string, data: UserRequest) => {
  return fetchApi<ApiResponse<UserResponse>>({
    url: `/users/${id}`,
    method: "PATCH",
    body: data,
  })
}

export const deleteUser = async (id: string) => {
  return fetchApi<ApiResponse<null>>({
    url: `/users/${id}`,
    method: "DELETE",
  })
}
