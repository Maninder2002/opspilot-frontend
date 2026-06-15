"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import ChatSidebar from "@/components/ChatSidebar"
import api from "@/services/api"
import ChatMessage from "@/components/ChatMessage"

interface Message {
  role: "user" | "assistant"
  content: string
  tool?: string | null
}

export default function ChatPage() {
  const [message, setMessage] =
    useState("")

  const [activeChatId, setActiveChatId] =
    useState<string | null>(null)

  const [loading, setLoading] =
    useState(false)

  const [messages, setMessages] =
    useState<Message[]>([])

  const [selectedFiles, setSelectedFiles] =
    useState<File[]>([])

  const bottomRef =
    useRef<HTMLDivElement | null>(
      null
    )

  const handleSendMessage = async () => {
    if (!message.trim()) return

    const userMessage: Message = {
      role: "user",
      content: message,
    }

    setMessages((prev) => [
      ...prev,
      userMessage,
    ])

    const currentMessage = message

    setMessage("")

    setLoading(true)

    try {
      // Upload files first
      if (
        selectedFiles.length > 0 &&
        activeChatId
      ) {
        for (const file of selectedFiles) {
          const formData =
            new FormData()

          formData.append(
            "file",
            file
          )

          await fetch(
            `http://localhost:5000/api/chats/${activeChatId}/upload`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem(
                  "token"
                )}`,
              },
              body: formData,
            }
          )
        }

        setSelectedFiles([])
      }

      const response = await fetch(
        `http://localhost:5000/api/chats/${activeChatId}/messages`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },

          body: JSON.stringify({
            message: currentMessage,
          }),
        }
      )

      const text =
        await response.text()

      let parsed

      try {
        parsed =
          JSON.parse(text)
      } catch {
        parsed = {
          tool: null,
          response: text,
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          tool: parsed.tool,
          content:
            parsed.response,
        },
      ])
    } catch (error) {
      console.error(error)

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          tool: null,
          content:
            "Something went wrong.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const loadChat = async (
    chatId: string
  ) => {
    try {
      const response =
        await api.get(
          `/chats/${chatId}`
        )

      setMessages(
        response.data.messages
      )

      setActiveChatId(chatId)
    } catch (error) {
      console.error(error)
    }
  }

  const createNewChat = async () => {
    try {
      const response =
        await api.post("/chats")

      setActiveChatId(
        response.data._id
      )

      setMessages([])
    } catch (error) {
      console.error(error)
    }
  }

  const initializeChat = useCallback(async () => {
    try {
      const response =
        await api.get("/chats")

      const chats =
        response.data

      if (chats.length > 0) {
        loadChat(chats[0]._id)
      } else {
        createNewChat()
      }
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    initializeChat()
  }, [initializeChat])

  useEffect(() => {
    bottomRef.current?.scrollIntoView(
      {
        behavior: "smooth",
      }
    )
  }, [messages])

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-zinc-950 text-white">
        {/* Sidebar */}
        <div className="w-80">
          <ChatSidebar
            activeChatId={activeChatId}
            onSelectChat={loadChat}
            onNewChat={createNewChat}
          />
        </div>

        {/* Main Chat */}
        <div className="flex flex-1 flex-col">
          {/* Header */}
          <div className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur">
            <div className="flex items-center justify-between px-6 py-5">
              <div>
                <h1 className="text-2xl font-bold">
                  OpsPilot AI
                </h1>

                <p className="mt-1 text-sm text-zinc-400">
                  AI-powered DevOps assistant
                </p>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-8">
              {messages.length === 0 && (
                <div className="mt-20 flex flex-col items-center text-center">
                  <div className="mb-6 rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
                    <h2 className="text-4xl font-bold">
                      OpsPilot AI
                    </h2>

                    <p className="mt-3 max-w-2xl text-zinc-400">
                      Debug deployment issues,
                      generate Docker configs,
                      analyze logs and automate
                      DevOps workflows using AI.
                    </p>
                  </div>

                  <div className="grid w-full max-w-4xl gap-4 md:grid-cols-2">
                    <button
                      onClick={() =>
                        setMessage(
                          "Why does Docker container exit with code 137?"
                        )
                      }
                      className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-left transition hover:border-zinc-700 hover:bg-zinc-800"
                    >
                      <h3 className="mb-2 font-semibold">
                        Docker Debugging
                      </h3>

                      <p className="text-sm text-zinc-400">
                        Analyze Docker crashes
                        and memory issues
                      </p>
                    </button>

                    <button
                      onClick={() =>
                        setMessage(
                          "Generate docker compose for MERN app with Redis"
                        )
                      }
                      className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-left transition hover:border-zinc-700 hover:bg-zinc-800"
                    >
                      <h3 className="mb-2 font-semibold">
                        Docker Compose
                      </h3>

                      <p className="text-sm text-zinc-400">
                        Generate
                        production-ready compose
                        files
                      </p>
                    </button>

                    <button
                      onClick={() =>
                        setMessage(
                          "Generate GitHub Actions CI/CD for Node.js app"
                        )
                      }
                      className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-left transition hover:border-zinc-700 hover:bg-zinc-800"
                    >
                      <h3 className="mb-2 font-semibold">
                        CI/CD Workflows
                      </h3>

                      <p className="text-sm text-zinc-400">
                        Create automated
                        deployment pipelines
                      </p>
                    </button>

                    <button
                      onClick={() =>
                        setMessage(
                          "Why is Nginx returning 502 Bad Gateway?"
                        )
                      }
                      className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-left transition hover:border-zinc-700 hover:bg-zinc-800"
                    >
                      <h3 className="mb-2 font-semibold">
                        Nginx Issues
                      </h3>

                      <p className="text-sm text-zinc-400">
                        Diagnose reverse proxy
                        and gateway issues
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {messages.map(
                (msg, index) => (
                  <ChatMessage
                    key={index}
                    role={msg.role}
                    content={msg.content}
                    tool={msg.tool}
                  />
                )
              )}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-3xl border border-zinc-800 bg-zinc-900 px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-white"></div>

                      <div className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:0.2s]"></div>

                      <div className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-zinc-800 bg-zinc-950/95 backdrop-blur">
            <div className="mx-auto w-full max-w-5xl px-6 py-5">
              {selectedFiles.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {selectedFiles.map(
                    (file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm"
                      >
                        📎 {file.name}

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedFiles(
                              (prev) =>
                                prev.filter(
                                  (_, i) =>
                                    i !== index
                                )
                            )
                          }
                          className="text-red-400 hover:text-red-300"
                        >
                          ✕
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
              <div className="flex items-end gap-4 rounded-3xl border border-zinc-800 bg-zinc-900 p-4 shadow-2xl">
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(
                      e.target.files || []
                    )

                    setSelectedFiles((prev) => [
                      ...prev,
                      ...files,
                    ])
                  }}
                />

                <label
                  htmlFor="file-upload"
                  className="cursor-pointer rounded-2xl border border-zinc-700 px-4 py-3 transition hover:bg-zinc-800"
                >
                  📎
                </label>
                <textarea
                  value={message}
                  onChange={(e) =>
                    setMessage(
                      e.target.value
                    )
                  }
                  placeholder="Ask OpsPilot AI about Docker, CI/CD, Nginx, deployments..."
                  rows={1}
                  className="max-h-40 flex-1 resize-none bg-transparent px-2 py-3 outline-none placeholder:text-zinc-500"
                />

                <button
                  onClick={
                    handleSendMessage
                  }
                  disabled={loading}
                  className="rounded-2xl bg-white px-6 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}