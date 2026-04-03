export interface ProfileRole {
  id: string
  name: string
  description: string
}

export interface ProfileResponse {
  id: string
  role: ProfileRole
  username: string
  full_name: string
  profile_picture?: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}
