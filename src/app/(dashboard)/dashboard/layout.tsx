"use client"

import { useRouter } from "next/navigation"

import { clearAuthData } from "@/utils/storage"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const handleLogout = () => {
    clearAuthData()

    router.push("/login")
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-zinc-800 bg-zinc-900">
        <div className="border-b border-zinc-800 p-6">
          <h1 className="text-2xl font-bold">
            OpsPilot AI
          </h1>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          <button className="w-full rounded-xl bg-zinc-800 px-4 py-3 text-left transition hover:bg-zinc-700">
            Dashboard
          </button>

          <button className="w-full rounded-xl px-4 py-3 text-left transition hover:bg-zinc-800">
            AI Chat
          </button>

          <button className="w-full rounded-xl px-4 py-3 text-left transition hover:bg-zinc-800">
            Upload Logs
          </button>

          <button className="w-full rounded-xl px-4 py-3 text-left transition hover:bg-zinc-800">
            Generators
          </button>
        </nav>

        <div className="border-t border-zinc-800 p-4">
          <button
            onClick={handleLogout}
            className="w-full rounded-xl bg-red-500 px-4 py-3 font-medium transition hover:opacity-90"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}