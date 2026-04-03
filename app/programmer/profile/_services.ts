import { fetchApi } from "@/lib/fetcher"
import { APIResponse } from "@/types/api"
import { ProfileResponse } from "./_types"

export const getProfileById = async (id: string) => {
  return fetchApi<APIResponse<ProfileResponse>>(`/users/${id}`, { method: "GET" })
}

export const updateProfilePicture = async (id: string, file: File) => {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`/api/users/${id}/profile-picture`, {
    method: "PATCH",
    body: formData,
  })

  const data = await response.json().catch(() => null)
  return { status: response.status, message: response.ok ? "Success" : response.statusText, data }
}
