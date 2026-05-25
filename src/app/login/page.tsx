"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

import { useForm } from "react-hook-form"
import { email, z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import api from "@/services/api"
import { setAuthData } from "@/utils/storage"

const loginSchema = z.object({
    email: z
        .email("Please enter a valid email"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
})

type LoginFormData = z.infer<
    typeof loginSchema
>

export default function LoginPage() {
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    })

    const [loading, setLoading] = useState(false)

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

            router.push("/dashboard")
        } catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                "Login failed"
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
            <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
                <h1 className="mb-2 text-3xl font-bold">
                    Welcome Back
                </h1>

                <p className="mb-6 text-zinc-400">
                    Login to OpsPilot AI
                </p>

                <form
                    onSubmit={handleSubmit(handleLogin)}
                    className="space-y-4"
                >
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            {...register("email")}
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none transition focus:border-white"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            {...register("password")}
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none transition focus:border-white"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-white py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>
                </form>
            </div>
        </div>
    )
}