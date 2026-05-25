"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import api from "@/services/api"

import Input from "@/components/ui/Input"

const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters"),

  email: z
    .email("Please enter a valid email"),

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

      const response = await api.post(
        "/auth/register",
        data
      )

      toast.success(response.data.message)

      router.push("/login")
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
        <h1 className="mb-2 text-3xl font-bold">
          Create Account
        </h1>

        <p className="mb-6 text-zinc-400">
          Join OpsPilot AI
        </p>

        <form
          onSubmit={handleSubmit(
            handleRegister
          )}
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
            className="w-full rounded-xl bg-white py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
          >
            {loading
              ? "Creating account..."
              : "Register"}
          </button>
        </form>
      </div>
    </div>
  )
}       