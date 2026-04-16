// app/admin/profile/services.ts

import { fetchApi } from "@/lib/fetcher"
import type { ApiResponse } from "@/types/api"
import { ProfileResponse } from "./types"

export const getProfileById = async (id: string) => {
  return fetchApi<ApiResponse<ProfileResponse>>({
    url: `/users/${id}`,
    method: "GET",
  })
}

export const updateProfilePicture = async (id: string, file: File) => {
  const formData = new FormData()
  formData.append("file", file)

  return fetchApi<ApiResponse<ProfileResponse>>({
    url: `/users/${id}/profile-picture`,
    method: "PATCH",
    body: formData,
  })
}
