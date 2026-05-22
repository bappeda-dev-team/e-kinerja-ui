import { fetchApi } from "@/lib/fetcher"
import type { ApiResponse } from "@/types/api"
import type { ProfileResponse } from "@/types/profile"

export const getMe = async () => {
  return fetchApi<ApiResponse<ProfileResponse>>({
    url: "/me",
    method: "GET",
  })
}

export const updateMe = async (body: { full_name?: string; username?: string }) => {
  return fetchApi<ApiResponse<ProfileResponse>>({
    url: "/me",
    method: "PATCH",
    body,
  })
}

export const updateMyProfilePicture = async (file: File) => {
  const formData = new FormData()
  formData.append("file", file)

  return fetchApi<ApiResponse<ProfileResponse>>({
    url: "/me/profile-picture",
    method: "PATCH",
    body: formData,
  })
}

