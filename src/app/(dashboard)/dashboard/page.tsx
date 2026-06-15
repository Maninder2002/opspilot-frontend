import Link from "next/link"
import {
  ArrowRight,
  MessageSquare,
  Sparkles,
  Upload,
} from "lucide-react"

const tools = [
  {
    href: "/chat",
    label: "AI Chat",
    description:
      "Debug Docker, generate CI/CD pipelines, fix Nginx, and automate DevOps with AI.",
    icon: MessageSquare,
    accent: "from-blue-500/20 to-blue-600/5",
    iconColor: "text-blue-500",
  },
  {
    href: "/upload",
    label: "Upload Logs",
    description:
      "Drop log files and get instant AI-powered root-cause analysis and fixes.",
    icon: Upload,
    accent: "from-violet-500/20 to-violet-600/5",
    iconColor: "text-violet-500",
  },
]

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
      <div className="mb-10">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles size={13} className="text-accent" />
          DevOps Assistant
        </div>

        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome back
        </h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
          Choose a tool below to analyze logs, generate configs, or chat with
          your AI copilot.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {tools.map(
          ({
            href,
            label,
            description,
            icon: Icon,
            accent,
            iconColor,
          }) => (
            <Link
              key={href}
              href={href}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition duration-200 hover:border-accent/30 hover:shadow-lg"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-0 transition group-hover:opacity-100`}
              />

              <div className="relative">
                <div
                  className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-muted ${iconColor}`}
                >
                  <Icon size={22} />
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold">
                      {label}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {description}
                    </p>
                  </div>

                  <ArrowRight
                    size={18}
                    className="mt-1 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-accent"
                  />
                </div>
              </div>
            </Link>
          )
        )}
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-muted/40 p-5 sm:p-6">
        <h3 className="text-sm font-semibold">
          What OpsPilot can do
        </h3>
        <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          {[
            "Analyze server logs",
            "Generate Docker configs",
            "Create CI/CD pipelines",
            "Troubleshoot Nginx",
            "Deploy applications",
            "Analyze uploaded files",
          ].map((item) => (
            <li
              key={item}
              className="flex items-center gap-2"
            >
              <span className="h-1 w-1 shrink-0 rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
