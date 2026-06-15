import api from "@/utils/api/client"

import type {
  AuthResponse,
  ApiUser,
} from "@/utils/api/types"

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export const authApi = {
  login: (payload: LoginPayload) =>
    api.post<AuthResponse>(
      "/auth/login",
      payload
    ),

  register: (payload: RegisterPayload) =>
    api.post<AuthResponse>(
      "/auth/register",
      payload
    ),
}

export type { ApiUser, AuthResponse }
