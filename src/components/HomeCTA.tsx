"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import { isAuthenticated } from "@/utils/auth"
import { getUser } from "@/utils/storage"

export default function HomeCTA() {
  const [mounted, setMounted] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    setMounted(true)
    setLoggedIn(isAuthenticated())
    const user = getUser()
    setUserName(user?.name ?? "")
  }, [])

  if (!mounted) {
    return (
      <section className="px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="mx-auto h-48 max-w-3xl animate-pulse rounded-2xl bg-muted" />
      </section>
    )
  }

  if (loggedIn) {
    return (
      <section className="px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card px-6 py-10 text-center sm:px-8 sm:py-14">
          <h2 className="mb-3 text-2xl font-bold sm:text-3xl">
            Welcome back
            {userName ? `, ${userName.split(" ")[0]}` : ""}
          </h2>

          <p className="mb-8 text-muted-foreground">
            You&apos;re signed in. Jump back into your DevOps
            workspace.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/chat"
              className="inline-block w-full rounded-xl bg-primary px-8 py-3.5 text-center text-base font-semibold text-primary-foreground transition hover:opacity-90 sm:w-auto"
            >
              Continue to AI Chat
            </Link>

            <Link
              href="/dashboard"
              className="inline-block w-full rounded-xl border border-border px-8 py-3.5 text-center text-base font-semibold transition hover:bg-muted sm:w-auto"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="px-4 pb-16 sm:px-6 sm:pb-24">
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card px-6 py-10 text-center sm:px-8 sm:py-14">
        <h2 className="mb-3 text-2xl font-bold sm:text-3xl md:text-4xl">
          Ready to automate DevOps?
        </h2>

        <p className="mb-8 text-muted-foreground">
          Sign up and start chatting with your AI DevOps assistant in
          seconds.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/register"
            className="inline-block w-full rounded-xl bg-primary px-8 py-3.5 text-center text-base font-semibold text-primary-foreground transition hover:opacity-90 sm:w-auto"
          >
            Start Using OpsPilot AI
          </Link>

          <Link
            href="/login"
            className="inline-block w-full rounded-xl border border-border px-8 py-3.5 text-center text-base font-semibold transition hover:bg-muted sm:w-auto"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  )
}
