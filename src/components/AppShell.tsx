"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

import UnifiedSidebar from "@/components/UnifiedSidebar"
import { cn } from "@/lib/utils"

const pageMeta: Record<
  string,
  { title: string; subtitle: string }
> = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Your DevOps command center",
  },
  "/chat": {
    title: "AI Chat",
    subtitle:
      "Ask about Docker, CI/CD, Nginx, and deployments",
  },
  "/upload": {
    title: "Upload Logs",
    subtitle: "Upload logs and let AI diagnose issues",
  },
}

export default function AppShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] =
    useState(false)

  const isChat = pathname === "/chat"
  const meta =
    pageMeta[pathname] ?? pageMeta["/dashboard"]

  const closeMobile = () =>
    setMobileOpen(false)

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-background">
      <aside className="hidden h-full w-[272px] shrink-0 border-r border-border lg:block">
        <UnifiedSidebar />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeMobile}
          />
          <aside className="relative h-full w-[min(272px,90vw)] shadow-2xl">
            <UnifiedSidebar
              onNavigate={closeMobile}
            />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col bg-surface">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-[15px] font-semibold tracking-tight">
              {meta.title}
            </h1>
            <p className="hidden truncate text-xs text-muted-foreground sm:block">
              {meta.subtitle}
            </p>
          </div>
        </header>

        <main
          className={cn(
            "flex min-h-0 flex-1 flex-col",
            isChat
              ? "overflow-hidden"
              : "overflow-y-auto"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
