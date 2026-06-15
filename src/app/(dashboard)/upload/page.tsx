"use client"

import { useState } from "react"
import ReactMarkdown from "react-markdown"
import toast from "react-hot-toast"

import api from "@/services/api"

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(
    null
  )
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState("")

  const handleUpload = async () => {
    if (!file) return

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append("file", file)

      const response = await api.post(
        "/upload/analyze",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      )

      setAnalysis(response.data.analysis)
    } catch {
      toast.error("Failed to analyze file")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center sm:p-10">
        <div className="mx-auto max-w-xl">
          <div className="mb-4 text-5xl">📄</div>

          <h2 className="mb-2 text-xl font-semibold sm:text-2xl">
            Upload Log File
          </h2>

          <p className="mb-6 text-sm text-muted-foreground sm:text-base">
            Supports .log, .txt, .json, .yml
          </p>

          <input
            type="file"
            onChange={(e) =>
              setFile(
                e.target.files?.[0] || null
              )
            }
            className="mb-6 block w-full rounded-xl border border-border bg-muted p-3 text-sm text-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground"
          />

          {file && (
            <div className="mb-4 rounded-xl border border-border bg-muted p-4 text-left">
              <p className="font-medium">
                Selected File:
              </p>
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {file.name}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full rounded-xl bg-primary px-8 py-3.5 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50 sm:w-auto"
          >
            {loading
              ? "Analyzing..."
              : "Analyze Logs"}
          </button>
        </div>
      </div>

      {loading && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 animate-pulse rounded-full bg-foreground" />
            <p className="text-sm text-muted-foreground">
              AI is analyzing logs...
            </p>
          </div>
        </div>
      )}

      {analysis && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-5 sm:p-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-bold sm:text-xl">
              AI Analysis
            </h2>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(
                  analysis
                )
                toast.success(
                  "Copied to clipboard"
                )
              }}
              className="rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground transition hover:bg-muted"
            >
              Copy
            </button>
          </div>

          <div className="prose prose-sm max-w-none dark:prose-invert sm:prose-base">
            <ReactMarkdown>
              {analysis}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  )
}
