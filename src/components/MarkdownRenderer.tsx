"use client"

import ReactMarkdown from "react-markdown"
import CodeBlock from "@/components/CodeBlock"

interface Props {
  content: string
}

export default function MarkdownRenderer({
  content,
}: Props) {
  return (
    <div className="prose prose-invert max-w-none prose-pre:overflow-x-auto prose-pre:rounded-xl prose-pre:bg-black">
      <ReactMarkdown
        components={{
          code(props) {
            const {
              children,
              className,
            } = props

            const match =
              /language-(\w+)/.exec(
                className || ""
              )

              return match ? (
                <CodeBlock
                  language={match[1]}
                  code={String(
                    children
                  ).replace(/\n$/, "")}
                />
              ) : (
                <code
                  className={className}
                >
                  {children}
                </code>
              )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}