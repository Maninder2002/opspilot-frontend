"use client"

import { useState } from "react"
import {
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react"

import { useAppChat } from "@/contexts/AppChatContext"
import { cn } from "@/lib/utils"

export default function ChatList() {
  const {
    chats,
    activeChatId,
    ready,
    loadChat,
    deleteChat,
    renameChat,
  } = useAppChat()

  const [openMenuId, setOpenMenuId] =
    useState<string | null>(null)

  const handleRename = async (
    chatId: string,
    currentTitle: string
  ) => {
    const newTitle = prompt(
      "Rename chat",
      currentTitle
    )
    if (!newTitle?.trim()) return
    await renameChat(chatId, newTitle.trim())
    setOpenMenuId(null)
  }

  if (!ready) {
    return (
      <div className="space-y-2 px-1 py-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-10 animate-pulse rounded-xl bg-sidebar-hover"
          />
        ))}
      </div>
    )
  }

  if (chats.length === 0) {
    return (
      <div className="mx-1 rounded-xl border border-dashed border-border px-3 py-6 text-center">
        <p className="text-xs text-muted-foreground">
          No conversations yet.
        </p>
        <p className="mt-1 text-xs font-medium text-sidebar-foreground">
          Tap New chat above
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-0.5">
      {chats.map((chat) => {
        const isActive =
          activeChatId === chat._id
        const menuOpen =
          openMenuId === chat._id

        return (
          <div
            key={chat._id}
            className={cn(
              "relative",
              menuOpen && "z-20"
            )}
          >
            <div
              className={cn(
                "group flex items-center rounded-xl transition-colors",
                isActive
                  ? "bg-sidebar-active"
                  : "hover:bg-sidebar-hover"
              )}
            >
              <button
                type="button"
                onClick={() => {
                  setOpenMenuId(null)
                  loadChat(chat._id)
                }}
                className={cn(
                  "min-w-0 flex-1 truncate px-3 py-2.5 text-left text-[13px]",
                  isActive
                    ? "font-medium text-sidebar-foreground"
                    : "text-sidebar-foreground/85"
                )}
              >
                {chat.title}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setOpenMenuId(
                    menuOpen ? null : chat._id
                  )
                }}
                className={cn(
                  "mr-1 shrink-0 rounded-lg p-1.5 text-muted-foreground transition",
                  "opacity-0 hover:bg-background/60 hover:text-foreground group-hover:opacity-100",
                  menuOpen && "opacity-100"
                )}
                aria-label="Chat options"
              >
                <MoreHorizontal size={14} />
              </button>
            </div>

            {menuOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 w-40 rounded-xl border border-border bg-card p-1 shadow-xl">
                <button
                  type="button"
                  onClick={() =>
                    handleRename(
                      chat._id,
                      chat.title
                    )
                  }
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs transition hover:bg-muted"
                >
                  <Pencil size={13} />
                  Rename
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await deleteChat(chat._id)
                    setOpenMenuId(null)
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-destructive transition hover:bg-muted"
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
