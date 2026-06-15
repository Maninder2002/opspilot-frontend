"use client"

import { useState } from "react"

import {
  Check,
  Copy,
} from "lucide-react"

import {
  Prism as SyntaxHighlighter,
} from "react-syntax-highlighter"

import {
  oneDark,
} from "react-syntax-highlighter/dist/esm/styles/prism"

interface Props {
  language: string

  code: string
}

export default function CodeBlock({
  language,
  code,
}: Props) {
  const [copied, setCopied] =
    useState(false)

  const handleCopy =
    async () => {
      await navigator.clipboard.writeText(
        code
      )

      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 2000)
    }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-700">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-700 bg-zinc-800 px-4 py-2">
        <span className="text-sm text-zinc-400">
          {language}
        </span>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 rounded-lg px-3 py-1 text-sm transition hover:bg-zinc-700"
        >
          {copied ? (
            <>
              <Check size={16} />
              Copied
            </>
          ) : (
            <>
              <Copy size={16} />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          background:
            "#000000",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}