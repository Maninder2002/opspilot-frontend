"use client"

import { useState } from "react"
import {
  Check,
  Copy,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react"

import { cn } from "@/lib/utils"

interface MessageActionsProps {
  content: string
  className?: string
}

export default function MessageActions({
  content,
  className,
}: MessageActionsProps) {
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState<
    "up" | "down" | null
  >(null)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        "mt-3 flex items-center gap-1",
        className
      )}
    >
      <ActionButton
        label="Good response"
        onClick={() =>
          setLiked((prev) =>
            prev === "up" ? null : "up"
          )
        }
        active={liked === "up"}
      >
        <ThumbsUp size={15} />
      </ActionButton>

      <ActionButton
        label="Bad response"
        onClick={() =>
          setLiked((prev) =>
            prev === "down" ? null : "down"
          )
        }
        active={liked === "down"}
      >
        <ThumbsDown size={15} />
      </ActionButton>

      <ActionButton
        label={copied ? "Copied" : "Copy"}
        onClick={handleCopy}
        active={copied}
      >
        {copied ? (
          <Check size={15} />
        ) : (
          <Copy size={15} />
        )}
      </ActionButton>
    </div>
  )
}

function ActionButton({
  children,
  label,
  onClick,
  active,
}: {
  children: React.ReactNode
  label: string
  onClick: () => void
  active?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "rounded-lg p-2 text-muted-foreground transition",
        "hover:bg-muted hover:text-foreground",
        active && "bg-muted text-foreground"
      )}
    >
      {children}
    </button>
  )
}
