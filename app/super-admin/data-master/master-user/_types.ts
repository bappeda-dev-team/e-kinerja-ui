// app/super-admin/data-master/master-user/_types.ts

export interface UserRole {
  id: string
  name: string
  description: string
}

export interface UserResponse {
  id: string
  role: UserRole
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
