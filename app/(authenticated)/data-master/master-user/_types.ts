export interface UserResponse {
  id: string
  role_id: string
  username: string
  full_name: string
  profile_picture?: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface UserRequest {
  role_id: string
  username: string
  full_name: string
  password?: string
  profile_picture?: string
  is_active?: boolean
}
