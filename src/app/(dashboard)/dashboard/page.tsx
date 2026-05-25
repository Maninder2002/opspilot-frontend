"use client"

import ProtectedRoute from "@/components/ProtectedRoute"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>
        <h1 className="mb-4 text-4xl font-bold">
          Dashboard
        </h1>

        <p className="text-zinc-400">
          Welcome to OpsPilot AI
        </p>
      </div>
    </ProtectedRoute>
  )
}