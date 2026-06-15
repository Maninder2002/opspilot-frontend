import axios from "axios"

import { API_BASE_URL } from "@/lib/env"
import { clearAuthData } from "@/utils/storage"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("token")

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthData()

      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith(
          "/login"
        ) &&
        !window.location.pathname.startsWith(
          "/register"
        )
      ) {
        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  }
)

export default api
