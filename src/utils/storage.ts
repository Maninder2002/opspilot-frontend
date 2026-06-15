export interface StoredUser {
  id: string
  name: string
  email: string
}

export const ACTIVE_CHAT_KEY =
  "opspilot_active_chat"

export const setAuthData = (
  token: string,
  user: unknown
) => {
  localStorage.setItem("token", token)
  localStorage.setItem(
    "user",
    JSON.stringify(user)
  )
}

export const clearAuthData = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  localStorage.removeItem(ACTIVE_CHAT_KEY)
}

export const getUser = (): StoredUser | null => {
  if (typeof window === "undefined") {
    return null
  }

  const raw = localStorage.getItem("user")

  if (!raw) return null

  try {
    return JSON.parse(raw) as StoredUser
  } catch {
    return null
  }
}

export const getUserInitials = (
  name: string
) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export const getActiveChatId = () => {
  if (typeof window === "undefined") {
    return null
  }

  return localStorage.getItem(ACTIVE_CHAT_KEY)
}

export const setActiveChatIdStorage = (
  chatId: string
) => {
  localStorage.setItem(
    ACTIVE_CHAT_KEY,
    chatId
  )
}

export const clearActiveChatIdStorage =
  () => {
    localStorage.removeItem(
      ACTIVE_CHAT_KEY
    )
  }
