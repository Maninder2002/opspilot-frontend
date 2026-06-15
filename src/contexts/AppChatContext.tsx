"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { useRouter } from "next/navigation"

import api from "@/services/api"
import {
  clearActiveChatIdStorage,
  getActiveChatId,
  setActiveChatIdStorage,
} from "@/utils/storage"

export interface Chat {
  _id: string
  title: string
  createdAt: string
}

export interface Message {
  role: "user" | "assistant"
  content: string
  tool?: string | null
}

interface AppChatContextValue {
  chats: Chat[]
  activeChatId: string | null
  messages: Message[]
  loading: boolean
  ready: boolean
  loadChat: (chatId: string) => Promise<void>
  createNewChat: () => Promise<void>
  deleteChat: (chatId: string) => Promise<void>
  renameChat: (
    chatId: string,
    title: string
  ) => Promise<void>
  setMessages: React.Dispatch<
    React.SetStateAction<Message[]>
  >
  setLoading: (loading: boolean) => void
  refreshChats: () => Promise<void>
}

const AppChatContext =
  createContext<AppChatContextValue | null>(
    null
  )

function sortChatsNewestFirst(
  chats: Chat[]
) {
  return [...chats].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  )
}

export function AppChatProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChatId, setActiveChatId] =
    useState<string | null>(null)
  const [messages, setMessages] = useState<
    Message[]
  >([])
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  const refreshChats =
    useCallback(async () => {
      try {
        const response =
          await api.get("/chats")
        setChats(
          sortChatsNewestFirst(
            response.data
          )
        )
      } catch (error) {
        console.error(error)
      }
    }, [])

  const loadChatById = useCallback(
    async (chatId: string) => {
      const response = await api.get(
        `/chats/${chatId}`
      )

      setMessages(response.data.messages)
      setActiveChatId(chatId)
      setActiveChatIdStorage(chatId)
    },
    []
  )

  const loadChat = useCallback(
    async (chatId: string) => {
      try {
        await loadChatById(chatId)

        if (
          window.location.pathname !==
          "/chat"
        ) {
          router.push("/chat")
        }
      } catch (error) {
        console.error(error)
      }
    },
    [loadChatById, router]
  )

  const createNewChat =
    useCallback(async () => {
      try {
        const response =
          await api.post("/chats")

        setActiveChatId(response.data._id)
        setActiveChatIdStorage(
          response.data._id
        )
        setMessages([])
        await refreshChats()
        router.push("/chat")
      } catch (error) {
        console.error(error)
      }
    }, [refreshChats, router])

  const deleteChat = useCallback(
    async (chatId: string) => {
      try {
        await api.delete(`/chats/${chatId}`)

        const remaining = sortChatsNewestFirst(
          chats.filter(
            (chat) => chat._id !== chatId
          )
        )

        setChats(remaining)

        if (activeChatId === chatId) {
          if (remaining.length > 0) {
            await loadChatById(
              remaining[0]._id
            )
          } else {
            setActiveChatId(null)
            setMessages([])
            clearActiveChatIdStorage()
          }
        }
      } catch (error) {
        console.error(error)
      }
    },
    [activeChatId, chats, loadChatById]
  )

  const renameChat = useCallback(
    async (
      chatId: string,
      title: string
    ) => {
      try {
        const response = await api.patch(
          `/chats/${chatId}`,
          { title }
        )

        setChats((prev) =>
          sortChatsNewestFirst(
            prev.map((chat) =>
              chat._id === chatId
                ? response.data
                : chat
            )
          )
        )
      } catch (error) {
        console.error(error)
      }
    },
    []
  )

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      try {
        const response =
          await api.get("/chats")
        const list = sortChatsNewestFirst(
          response.data
        )

        if (cancelled) return

        setChats(list)

        if (list.length === 0) {
          setReady(true)
          return
        }

        const savedId = getActiveChatId()
        const targetId =
          savedId &&
          list.some(
            (chat) => chat._id === savedId
          )
            ? savedId
            : list[0]._id

        await loadChatById(targetId)
      } catch (error) {
        console.error(error)
      } finally {
        if (!cancelled) {
          setReady(true)
        }
      }
    }

    init()

    return () => {
      cancelled = true
    }
  }, [loadChatById])

  return (
    <AppChatContext.Provider
      value={{
        chats,
        activeChatId,
        messages,
        loading,
        ready,
        loadChat,
        createNewChat,
        deleteChat,
        renameChat,
        setMessages,
        setLoading,
        refreshChats,
      }}
    >
      {children}
    </AppChatContext.Provider>
  )
}

export function useAppChat() {
  const context = useContext(AppChatContext)

  if (!context) {
    throw new Error(
      "useAppChat must be used within AppChatProvider"
    )
  }

  return context
}
