"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

import MarkdownRenderer from "@/components/MarkdownRenderer"
import MessageActions from "@/components/MessageActions"
import { cn } from "@/lib/utils"

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
  const isUser = role === "user"
  const [copied, setCopied] = useState(false)

  const handleCopyUser = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isUser) {
    return (
      <div className="group flex w-full justify-end py-2">
        <div className="relative max-w-[min(85%,42rem)] rounded-3xl border border-border bg-muted px-4 py-3 sm:px-5 sm:py-3.5">
          <button
            type="button"
            onClick={handleCopyUser}
            aria-label={copied ? "Copied" : "Copy message"}
            title={copied ? "Copied" : "Copy message"}
            className={cn(
              "absolute right-2 top-2 rounded-md p-1 text-muted-foreground transition",
              "hover:bg-background/60 hover:text-foreground",
              "opacity-0 group-hover:opacity-100",
              copied && "opacity-100"
            )}
          >
            {copied ? (
              <Check size={14} />
            ) : (
              <Copy size={14} />
            )}
          </button>

          <p className="whitespace-pre-wrap pr-6 text-[15px] leading-7 text-foreground">
            {content}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="group flex w-full justify-start py-2">
      <div className="relative w-full max-w-[min(85%,42rem)] rounded-3xl border border-border bg-muted px-4 py-3 sm:px-5 sm:py-3.5">
        {tool && (
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent-muted px-3 py-1 text-xs font-medium text-accent">
            <span>🛠</span>
            {tool.replace(/_/g, " ")}
          </div>
        )}

        <MarkdownRenderer content={content} />

        <MessageActions content={content} />
      </div>
    </div>
  )
}
