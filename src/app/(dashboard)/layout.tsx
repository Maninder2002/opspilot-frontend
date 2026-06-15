"use client"

import ProtectedRoute from "@/components/ProtectedRoute"
import AppShell from "@/components/AppShell"
import { AppChatProvider } from "@/contexts/AppChatContext"

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <AppChatProvider>
        <AppShell>{children}</AppShell>
      </AppChatProvider>
    </ProtectedRoute>
  )
}
