"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "@teispace/next-themes"
import {
  Check,
  LogOut,
  Monitor,
  Moon,
  MoreHorizontal,
  Sun,
} from "lucide-react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import {
  clearAuthData,
  getUser,
  getUserInitials,
  type StoredUser,
} from "@/utils/storage"

const themeOptions = [
  { value: "system", label: "System", icon: Monitor },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
] as const

interface UserMenuProps {
  variant?: "sidebar" | "header"
}

export default function UserMenu({
  variant = "sidebar",
}: UserMenuProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [user, setUser] =
    useState<StoredUser | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const isHeader = variant === "header"

  useEffect(() => {
    setUser(getUser())
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false)
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    )
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      )
  }, [])

  const handleLogout = () => {
    clearAuthData()
    setOpen(false)
    router.push("/login")
  }

  const displayName =
    mounted && user?.name
      ? user.name
      : "User"
  const initials = getUserInitials(displayName)

  const menuPanel = (
    <div
      className={cn(
        "z-50 overflow-hidden rounded-xl border border-border bg-card shadow-2xl",
        isHeader
          ? "absolute right-0 top-full mt-2 w-52"
          : "absolute bottom-full left-3 right-3 mb-2"
      )}
    >
      <div className="border-b border-border px-4 py-3">
        <p className="truncate text-sm font-medium">
          {displayName}
        </p>
        {mounted && user?.email && (
          <p className="truncate text-xs text-muted-foreground">
            {user.email}
          </p>
        )}
      </div>

      <div className="border-b border-border px-4 py-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Appearance
        </p>
      </div>

      {themeOptions.map(
        ({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm transition hover:bg-muted"
          >
            <Icon
              size={16}
              className="text-muted-foreground"
            />
            <span className="flex-1 text-left">
              {label}
            </span>
            {theme === value && (
              <Check
                size={16}
                className="text-accent"
              />
            )}
          </button>
        )
      )}

      <div className="border-t border-border" />

      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-destructive transition hover:bg-muted"
      >
        <LogOut size={16} />
        Log out
      </button>
    </div>
  )

  return (
    <div
      ref={menuRef}
      className={cn(
        "relative",
        isHeader ? "" : "p-3"
      )}
    >
      {open && (
        <>
          {isHeader && (
            <button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
          )}

          {!isHeader && (
            <button
              type="button"
              aria-label="Close settings"
              className="fixed inset-0 z-40 bg-black/20 lg:absolute"
              onClick={() => setOpen(false)}
            />
          )}

          {menuPanel}
        </>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Account menu"
        aria-expanded={open}
        className={cn(
          "transition",
          isHeader
            ? cn(
                "flex items-center gap-2 rounded-xl border border-border px-2 py-1.5 hover:bg-muted",
                open && "bg-muted"
              )
            : cn(
                "flex w-full items-center gap-3 rounded-xl border border-transparent px-2 py-2 text-left",
                open
                  ? "border-border bg-sidebar-active"
                  : "hover:border-border hover:bg-sidebar-hover"
              )
        )}
      >
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-blue-600 font-bold text-white shadow-sm",
            isHeader
              ? "h-7 w-7 text-[10px]"
              : "h-9 w-9 text-xs"
          )}
        >
          {initials}
        </div>

        {!isHeader && (
          <>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium leading-tight">
                {displayName}
              </p>
              <p className="truncate text-xs leading-tight text-muted-foreground">
                {mounted && user?.email
                  ? user.email
                  : "Settings & account"}
              </p>
            </div>

            <MoreHorizontal
              size={18}
              className="shrink-0 text-muted-foreground"
            />
          </>
        )}

        {isHeader && (
          <span className="hidden max-w-[120px] truncate text-sm font-medium sm:inline">
            {displayName}
          </span>
        )}
      </button>
    </div>
  )
}
