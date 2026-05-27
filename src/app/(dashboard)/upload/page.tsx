"use client"

import { useState } from "react"
import ReactMarkdown from "react-markdown"

import ProtectedRoute from "@/components/ProtectedRoute"

import api from "@/services/api"

export default function UploadPage() {
  const [file, setFile] =
    useState<File | null>(null)

  const [loading, setLoading] =
    useState(false)

  const [analysis, setAnalysis] =
    useState("")

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

      setAnalysis(
        response.data.analysis
      )
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">
            Log Analyzer
          </h1>

          <p className="mt-2 text-zinc-400">
            Upload logs and let AI diagnose deployment issues
          </p>
        </div>

        {/* Upload Box */}
        <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900 p-10 text-center">
          <div className="mx-auto max-w-xl">
            <div className="mb-4 text-5xl">
              📄
            </div>

            <h2 className="mb-2 text-2xl font-semibold text-white">
              Upload Log File
            </h2>

            <p className="mb-6 text-zinc-400">
              Supports .log, .txt, .json, .yml
            </p>

            <input
              type="file"
              onChange={(e) =>
                setFile(
                  e.target.files?.[0] || null
                )
              }
              className="mb-6 block w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 text-zinc-300"
            />

            {file && (
              <div className="mb-4 rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-left">
                <p className="font-medium text-white">
                  Selected File:
                </p>

                <p className="mt-1 text-zinc-400">
                  {file.name}
                </p>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="rounded-2xl bg-white px-8 py-4 font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
            >
              {loading
                ? "Analyzing..."
                : "Analyze Logs"}
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 animate-pulse rounded-full bg-white"></div>

              <p className="text-zinc-300">
                AI is analyzing logs...
              </p>
            </div>
          </div>
        )}

        {/* AI Analysis */}
        {analysis && (
          <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                AI Analysis
              </h2>

              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    analysis
                  )
                }
                className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800"
              >
                Copy
              </button>
            </div>

            <div className="prose prose-invert max-w-none prose-pre:overflow-x-auto prose-pre:rounded-xl prose-pre:bg-black">
              <ReactMarkdown>
                {analysis}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}