// types/api.ts

export type ApiError =
  | Record<string, string | string[]>
  | string[]
  | string
  | null

export interface ApiResponse<T> {
  code?: number
  data?: T
  errors?: ApiError
  message?: string
  success?: boolean
}
