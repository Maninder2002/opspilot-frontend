"use client"

import MarkdownRenderer from "@/components/MarkdownRenderer"

interface Props {
  role: "user" | "assistant"
  content: string
  tool?: string | null
}

export default function ChatMessage({
  role,
  content,
  tool,
}: Props) {
  const isUser =
    role === "user"

  return (
    <div
      className={`flex ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`max-w-3xl rounded-3xl px-6 py-5 shadow-lg ${
          isUser
            ? "bg-white text-black"
            : "border border-zinc-800 bg-zinc-900 text-white"
        }`}
      >
        {!isUser && tool && (
          <div className="mb-3 inline-flex items-center rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
            🛠 {tool}
          </div>
        )}

        <MarkdownRenderer
          content={content}
        />
      </div>
    </div>
  )
}