"use client"

import { useCallback, useEffect, useState } from "react"

import {
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react"

import api from "@/services/api"

interface Chat {
  _id: string
  title: string
  createdAt: string
}

interface Props {
  activeChatId: string | null

  onSelectChat: (
    id: string
  ) => void

  onNewChat: () => void
}

export default function ChatSidebar({
  activeChatId,
  onSelectChat,
  onNewChat,
}: Props) {
  const [chats, setChats] =
    useState<Chat[]>([])

  const [openMenuId, setOpenMenuId] =
    useState<string | null>(null)

  const fetchChats = useCallback(async () => {
    try {
      const response =
        await api.get("/chats")

      setChats(response.data)
    } catch (error) {
      console.error(error)
    }
  }, [])

  const handleDelete = async (
    chatId: string
  ) => {
    try {
      await api.delete(
        `/chats/${chatId}`
      )

      setChats((prev) =>
        prev.filter(
          (chat) =>
            chat._id !== chatId
        )
      )

      setOpenMenuId(null)
    } catch (error) {
      console.error(error)
    }
  }

  const handleRename = async (
    chatId: string,
    currentTitle: string
  ) => {
    const newTitle = prompt(
      "Rename chat",
      currentTitle
    )

    if (!newTitle) return

    try {
      const response =
        await api.patch(
          `/chats/${chatId}`,
          {
            title: newTitle,
          }
        )

      setChats((prev) =>
        prev.map((chat) =>
          chat._id === chatId
            ? response.data
            : chat
        )
      )

      setOpenMenuId(null)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchChats()
  }, [activeChatId, fetchChats])

  return (
    <div className="flex h-full flex-col border-r border-zinc-800 bg-zinc-900">
      {/* Header */}
      <div className="border-b border-zinc-800 p-5">
        <button
          onClick={onNewChat}
          className="w-full rounded-2xl bg-white px-4 py-3 font-semibold text-black transition hover:opacity-90"
        >
          + New Chat
        </button>
      </div>

      {/* Chats */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-2">
          {chats.map((chat) => (
            <div
              key={chat._id}
              className={`group relative rounded-2xl border transition ${
                activeChatId ===
                chat._id
                  ? "border-white bg-zinc-800"
                  : "border-zinc-800 bg-zinc-900 hover:bg-zinc-800"
              }`}
            >
              <button
                onClick={() =>
                  onSelectChat(chat._id)
                }
                className="w-full p-4 pr-12 text-left"
              >
                <h3 className="line-clamp-1 font-medium text-white">
                  {chat.title}
                </h3>

                <p className="mt-1 text-xs text-zinc-500">
                  {new Date(
                    chat.createdAt
                  ).toLocaleString()}
                </p>
              </button>

              {/* Menu Button */}
              <button
                onClick={() =>
                  setOpenMenuId(
                    openMenuId ===
                      chat._id
                      ? null
                      : chat._id
                  )
                }
                className="absolute right-3 top-3 rounded-lg p-1 opacity-0 transition hover:bg-zinc-700 group-hover:opacity-100"
              >
                <MoreHorizontal
                  size={18}
                />
              </button>

              {/* Dropdown */}
              {openMenuId ===
                chat._id && (
                <div className="absolute right-3 top-12 z-20 w-40 rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl">
                  <button
                    onClick={() =>
                      handleRename(
                        chat._id,
                        chat.title
                      )
                    }
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm transition hover:bg-zinc-800"
                  >
                    <Pencil size={16} />
                    Rename
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(
                        chat._id
                      )
                    }
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-400 transition hover:bg-zinc-800"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}