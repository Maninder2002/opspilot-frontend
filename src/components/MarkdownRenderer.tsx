"use client"

import ReactMarkdown from "react-markdown"

import CodeBlock from "@/components/CodeBlock"
import { cn } from "@/lib/utils"

interface Props {
  content: string
}

export default function MarkdownRenderer({
  content,
}: Props) {
  return (
    <div className="chat-markdown text-[15px] leading-7 text-foreground/95">
      <ReactMarkdown
        components={{
          h1({ children }) {
            return (
              <h1 className="mb-4 mt-6 text-2xl font-bold tracking-tight first:mt-0">
                {children}
              </h1>
            )
          },
          h2({ children }) {
            return (
              <h2 className="mb-3 mt-6 text-xl font-semibold tracking-tight first:mt-0">
                {children}
              </h2>
            )
          },
          h3({ children }) {
            return (
              <h3 className="mb-2 mt-5 text-lg font-semibold first:mt-0">
                {children}
              </h3>
            )
          },
          p({ children }) {
            return (
              <p className="mb-4 last:mb-0">
                {children}
              </p>
            )
          },
          ul({ children }) {
            return (
              <ul className="mb-4 list-disc space-y-2 pl-6 last:mb-0">
                {children}
              </ul>
            )
          },
          ol({ children }) {
            return (
              <ol className="mb-4 list-decimal space-y-2 pl-6 last:mb-0">
                {children}
              </ol>
            )
          },
          li({ children }) {
            return (
              <li className="pl-1">{children}</li>
            )
          },
          strong({ children }) {
            return (
              <strong className="font-semibold text-foreground">
                {children}
              </strong>
            )
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent underline-offset-2 hover:underline"
              >
                {children}
              </a>
            )
          },
          blockquote({ children }) {
            return (
              <blockquote className="mb-4 border-l-2 border-border pl-4 text-muted-foreground">
                {children}
              </blockquote>
            )
          },
          hr() {
            return (
              <hr className="my-6 border-border" />
            )
          },
          code(props) {
            const { children, className } = props
            const match = /language-(\w+)/.exec(
              className || ""
            )

            if (match) {
              return (
                <CodeBlock
                  language={match[1]}
                  code={String(children).replace(
                    /\n$/,
                    ""
                  )}
                />
              )
            }

            return (
              <code
                className={cn(
                  "rounded-md bg-muted px-1.5 py-0.5",
                  "font-mono text-[0.875em] text-foreground"
                )}
              >
                {children}
              </code>
            )
          },
          pre({ children }) {
            return <>{children}</>
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
