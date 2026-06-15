import api from "@/utils/api/client"

import type {
  ApiChat,
  SendMessageResponse,
} from "@/utils/api/types"

export const chatApi = {
  list: () => api.get<ApiChat[]>("/chats"),

  getById: (chatId: string) =>
    api.get<ApiChat>(`/chats/${chatId}`),

  create: () =>
    api.post<ApiChat>("/chats"),

  delete: (chatId: string) =>
    api.delete<{ message: string }>(
      `/chats/${chatId}`
    ),

  rename: (
    chatId: string,
    title: string
  ) =>
    api.patch<ApiChat>(
      `/chats/${chatId}`,
      { title }
    ),

  sendMessage: async (
    chatId: string,
    message: string
  ): Promise<SendMessageResponse> => {
    const { data } = await api.post<string>(
      `/chats/${chatId}/messages`,
      { message },
      { responseType: "text" }
    )

    try {
      return JSON.parse(
        data
      ) as SendMessageResponse
    } catch {
      return {
        tool: null,
        response: data,
      }
    }
  },

  uploadFile: (chatId: string, file: File) => {
    const formData = new FormData()
    formData.append("file", file)

    return api.post(
      `/chats/${chatId}/upload`,
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    )
  },
}

export type { ApiChat, SendMessageResponse }
