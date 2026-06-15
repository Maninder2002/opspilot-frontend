"use client"

import { useState } from "react"
import Link from "next/link"
import {
  usePathname,
  useRouter,
} from "next/navigation"
import {
  ChevronDown,
  LayoutDashboard,
  MessageSquarePlus,
  Upload,
  X,
} from "lucide-react"

import ChatList from "@/components/ChatList"
import UserMenu from "@/components/UserMenu"
import { useAppChat } from "@/contexts/AppChatContext"
import { cn } from "@/lib/utils"

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/upload",
    label: "Upload Logs",
    icon: Upload,
  },
]

interface UnifiedSidebarProps {
  onNavigate?: () => void
}

export default function UnifiedSidebar({
  onNavigate,
}: UnifiedSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { createNewChat } = useAppChat()
  const isChatView = pathname === "/chat"
  const [chatsOpen, setChatsOpen] =
    useState(true)

  const handleNewChat = async () => {
    await createNewChat()
    onNavigate?.()
  }

  const openChatView = () => {
    if (!isChatView) {
      router.push("/chat")
      onNavigate?.()
    }
  }

  return (
    <div className="grid h-full w-full grid-rows-[auto_minmax(0,1fr)_auto] bg-sidebar text-sidebar-foreground">
      {onNavigate && (
        <div className="flex items-center justify-between border-b border-border px-4 py-3 lg:hidden">
          <span className="text-sm font-semibold">
            Menu
          </span>
          <button
            type="button"
            onClick={onNavigate}
            className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-sidebar-hover hover:text-sidebar-foreground"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div className="space-y-4 border-b border-border p-4">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-2.5 px-1"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-white">
            OP
          </div>
          <span className="text-sm font-semibold tracking-tight">
            OpsPilot AI
          </span>
        </Link>

        <button
          type="button"
          onClick={handleNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
        >
          <MessageSquarePlus size={16} />
          New chat
        </button>

        <nav className="space-y-1">
          {navItems.map(
            ({ href, label, icon: Icon }) => {
              const isActive =
                pathname === href

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                    isActive
                      ? "bg-sidebar-active font-medium text-sidebar-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-sidebar-hover hover:text-sidebar-foreground"
                  )}
                >
                  <Icon size={17} />
                  {label}
                </Link>
              )
            }
          )}
        </nav>
      </div>

      <div className="flex min-h-0 flex-col overflow-hidden">
        <div className="flex shrink-0 items-center justify-between px-4 pb-2 pt-3">
          <button
            type="button"
            onClick={openChatView}
            className={cn(
              "text-[11px] font-semibold uppercase tracking-[0.12em]",
              isChatView
                ? "text-sidebar-foreground"
                : "text-muted-foreground hover:text-sidebar-foreground"
            )}
          >
            Recent chats
          </button>

          <button
            type="button"
            onClick={() =>
              setChatsOpen((prev) => !prev)
            }
            className="rounded-md p-1 text-muted-foreground transition hover:bg-sidebar-hover hover:text-sidebar-foreground"
            aria-label={
              chatsOpen
                ? "Collapse chats"
                : "Expand chats"
            }
          >
            <ChevronDown
              size={14}
              className={cn(
                "transition-transform duration-200",
                chatsOpen && "rotate-180"
              )}
            />
          </button>
        </div>

        {chatsOpen && (
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 pb-2">
            <ChatList />
          </div>
        )}
      </div>

      <div className="sidebar-footer isolate z-10 border-t border-border bg-sidebar">
        <UserMenu />
      </div>
    </div>
  )
}
