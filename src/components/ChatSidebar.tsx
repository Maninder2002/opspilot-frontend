"use client"

import { useEffect, useState } from "react"

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

  const fetchChats = async () => {
    try {
      const response =
        await api.get("/chats")

      setChats(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchChats()
  }, [activeChatId])

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
            <button
              key={chat._id}
              onClick={() =>
                onSelectChat(chat._id)
              }
              className={`w-full rounded-2xl border p-4 text-left transition ${
                activeChatId ===
                chat._id
                  ? "border-white bg-zinc-800"
                  : "border-zinc-800 bg-zinc-900 hover:bg-zinc-800"
              }`}
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
          ))}
        </div>
      </div>
    </div>
  )
}