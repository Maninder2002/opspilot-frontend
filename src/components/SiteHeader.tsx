"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { LayoutDashboard, MessageSquare } from "lucide-react"

import ThemeToggle from "@/components/ThemeToggle"
import UserMenu from "@/components/UserMenu"
import { isAuthenticated } from "@/utils/auth"
import { getUser, type StoredUser } from "@/utils/storage"

export default function SiteHeader() {
  const [mounted, setMounted] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [user, setUser] =
    useState<StoredUser | null>(null)

  useEffect(() => {
    setMounted(true)
    setLoggedIn(isAuthenticated())
    setUser(getUser())
  }, [])

  return (
    <nav className="relative z-10 mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-6">
      <Link
        href="/"
        className="text-lg font-bold sm:text-xl"
      >
        OpsPilot AI
      </Link>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <ThemeToggle />

        {mounted && loggedIn ? (
          <>
            <Link
              href="/dashboard"
              className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground sm:inline-flex"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>

            <Link
              href="/chat"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 sm:px-4"
            >
              <MessageSquare size={16} />
              Open Chat
            </Link>

            {user && <UserMenu variant="header" />}
          </>
        ) : (
          <>
            <Link
              href="/chat"
              className="rounded-xl border border-border px-3 py-2 text-sm font-medium transition hover:bg-muted sm:px-4"
            >
              AI Chat
            </Link>

            <Link
              href="/login"
              className="hidden px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground sm:inline-block"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 sm:px-4"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
