"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { useTheme } from "next-themes"
import {
  Prism as SyntaxHighlighter,
} from "react-syntax-highlighter"
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism"

import { cn } from "@/lib/utils"

export default function CodeBlock({
  language,
  code,
}: {
  language: string
  code: string
}) {
  const [copied, setCopied] = useState(false)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group/code relative my-4 overflow-hidden rounded-xl border border-border bg-muted/70 dark:bg-[#2a2a2e]">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-2">
        <span className="text-xs font-medium text-muted-foreground">
          {language}
        </span>

        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Copied" : "Copy code"}
          title={copied ? "Copied" : "Copy code"}
          className={cn(
            "rounded-md p-1.5 text-muted-foreground transition",
            "hover:bg-background/60 hover:text-foreground",
            "opacity-100 sm:opacity-0 sm:group-hover/code:opacity-100"
          )}
        >
          {copied ? (
            <Check size={14} />
          ) : (
            <Copy size={14} />
          )}
        </button>
      </div>

      <SyntaxHighlighter
        language={language}
        style={isDark ? oneDark : oneLight}
        customStyle={{
          margin: 0,
          padding: "1rem 1.25rem",
          borderRadius: 0,
          background: "transparent",
          fontSize: "0.8125rem",
          lineHeight: "1.6",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
