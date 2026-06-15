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
import { authApi } from "@/utils/api"

const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
})

type RegisterFormData = z.infer<
  typeof registerSchema
>

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const handleRegister = async (
    data: RegisterFormData
  ) => {
    try {
      setLoading(true)

      const response =
        await authApi.register(data)

      toast.success(response.data.message)
      router.push("/login")
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message ??
            "Registration failed"
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
            Create Account
          </h1>

          <p className="mb-6 text-muted-foreground">
            Join OpsPilot AI
          </p>

          <form
            onSubmit={handleSubmit(handleRegister)}
            className="space-y-4"
          >
            <Input
              type="text"
              placeholder="Name"
              error={errors.name?.message}
              {...register("name")}
            />

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
              {loading
                ? "Creating account..."
                : "Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
