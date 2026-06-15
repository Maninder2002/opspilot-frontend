"use client"

import {
  useEffect,
  useRef,
  useState,
} from "react"

import ChatMessage from "@/components/ChatMessage"
import { useAppChat } from "@/contexts/AppChatContext"
import { chatApi } from "@/utils/api"
import { cn } from "@/lib/utils"

const promptSuggestions = [
  {
    title: "Docker Debugging",
    description:
      "Analyze Docker crashes and memory issues",
    message:
      "Why does Docker container exit with code 137?",
  },
  {
    title: "Docker Compose",
    description:
      "Generate production-ready compose files",
    message:
      "Generate docker compose for MERN app with Redis",
  },
  {
    title: "CI/CD Workflows",
    description:
      "Create automated deployment pipelines",
    message:
      "Generate GitHub Actions CI/CD for Node.js app",
  },
  {
    title: "Nginx Issues",
    description:
      "Diagnose reverse proxy and gateway issues",
    message:
      "Why is Nginx returning 502 Bad Gateway?",
  },
]

export default function ChatPage() {
  const {
    activeChatId,
    messages,
    loading,
    ready,
    setMessages,
    setLoading,
    refreshChats,
  } = useAppChat()

  const [message, setMessage] = useState("")
  const [selectedFiles, setSelectedFiles] =
    useState<File[]>([])

  const bottomRef =
    useRef<HTMLDivElement | null>(null)

  const handleSendMessage = async () => {
    if (!message.trim() || !activeChatId) return

    const userMessage = {
      role: "user" as const,
      content: message,
    }

    setMessages((prev) => [...prev, userMessage])

    const currentMessage = message
    setMessage("")
    setLoading(true)

    try {
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          await chatApi.uploadFile(
            activeChatId,
            file
          )
        }

        setSelectedFiles([])
      }

      const parsed =
        await chatApi.sendMessage(
          activeChatId,
          currentMessage
        )

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          tool: parsed.tool,
          content: parsed.response,
        },
      ])

      await refreshChats()
    } catch (error) {
      console.error(error)

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          tool: null,
          content: "Something went wrong.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    })
  }, [messages])

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 px-4 py-5 sm:px-6 sm:py-6">
          {!ready ? (
            <div className="flex flex-col items-center pt-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-foreground" />
            </div>
          ) : !activeChatId ? (
            <div className="flex flex-col items-center pt-12 text-center sm:pt-20">
              <div className="mb-6 w-full max-w-lg rounded-2xl border border-border bg-card p-6">
                <h2 className="text-xl font-bold sm:text-2xl">
                  Start a conversation
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Click{" "}
                  <span className="font-medium text-foreground">
                    New chat
                  </span>{" "}
                  in the sidebar to begin.
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.length === 0 && (
                <div className="flex flex-col items-center pt-6 text-center sm:pt-10">
                  <div className="mb-6 w-full max-w-2xl rounded-2xl border border-border bg-card p-5 sm:p-6">
                    <h2 className="text-xl font-bold sm:text-2xl">
                      How can I help?
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                      Debug deployments, generate configs,
                      or analyze logs with AI.
                    </p>
                  </div>

                  <div className="grid w-full max-w-3xl gap-3 sm:grid-cols-2">
                    {promptSuggestions.map(
                      (prompt) => (
                        <button
                          key={prompt.title}
                          type="button"
                          onClick={() =>
                            setMessage(
                              prompt.message
                            )
                          }
                          className="rounded-2xl border border-border bg-card p-4 text-left transition hover:border-muted-foreground/30 hover:bg-muted"
                        >
                          <h3 className="mb-1 text-sm font-semibold">
                            {prompt.title}
                          </h3>

                          <p className="text-xs text-muted-foreground">
                            {prompt.description}
                          </p>
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {messages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  role={msg.role}
                  content={msg.content}
                  tool={msg.tool}
                />
              ))}

              {loading && (
                <div className="py-4">
                  <div className="flex items-center gap-1.5">
                    {[0, 0.15, 0.3].map((delay) => (
                      <div
                        key={delay}
                        className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60"
                        style={{
                          animationDelay: `${delay}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-background/95 px-3 py-3 backdrop-blur sm:px-6 sm:py-4">
        <div className="mx-auto w-full max-w-3xl">
          {selectedFiles.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {selectedFiles.map(
                (file, index) => (
                  <div
                    key={index}
                    className="flex max-w-full items-center gap-2 rounded-xl border border-border bg-muted px-3 py-1.5 text-xs sm:text-sm"
                  >
                    <span className="truncate">
                      📎 {file.name}
                    </span>

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
                      className="shrink-0 text-destructive hover:opacity-80"
                      aria-label={`Remove ${file.name}`}
                    >
                      ✕
                    </button>
                  </div>
                )
              )}
            </div>
          )}

          <div className="flex items-end gap-2 rounded-2xl border border-border bg-card p-2.5 shadow-sm sm:gap-3 sm:p-3">
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
              className="cursor-pointer rounded-xl border border-border px-3 py-2 transition hover:bg-muted"
            >
              📎
            </label>

            <textarea
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey
                ) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              placeholder="Ask about Docker, CI/CD, Nginx..."
              rows={1}
              className="max-h-32 min-w-0 flex-1 resize-none bg-transparent px-1 py-2 text-sm outline-none placeholder:text-muted-foreground sm:text-base"
            />

            <button
              type="button"
              onClick={handleSendMessage}
              disabled={
                loading ||
                !activeChatId ||
                !message.trim()
              }
              className={cn(
                "shrink-0 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50 sm:px-5 sm:py-2.5"
              )}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
