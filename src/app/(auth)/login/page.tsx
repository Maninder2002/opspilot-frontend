"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { AxiosError } from "axios"

import SiteHeader from "@/components/SiteHeader"
import Input from "@/components/ui/Input"
import api from "@/services/api"
import { setAuthData } from "@/utils/storage"

const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const handleLogin = async (
    data: LoginFormData
  ) => {
    try {
      setLoading(true)

      const response = await api.post(
        "/auth/login",
        {
          email: data.email,
          password: data.password,
        }
      )

      const { token, user, message } =
        response.data

      setAuthData(token, user)
      toast.success(message)
      router.push("/chat")
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message ??
            "Login failed"
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl sm:p-8">
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
            Welcome Back
          </h1>

          <p className="mb-6 text-muted-foreground">
            Login to OpsPilot AI
          </p>

          <form
            onSubmit={handleSubmit(handleLogin)}
            className="space-y-4"
          >
            <Input
              type="email"
              placeholder="Email"
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              type="password"
              placeholder="Password"
              error={errors.password?.message}
              {...register("password")}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
