import HomeCTA from "@/components/HomeCTA"
import SiteHeader from "@/components/SiteHeader"

const capabilities = [
  "Analyze Logs",
  "Generate Docker Configs",
  "Create CI/CD Pipelines",
  "Troubleshoot Nginx",
  "Deploy Applications",
  "Analyze Uploaded Files",
]

const features = [
  {
    icon: "📄",
    title: "Log Analyzer",
    description:
      "Paste server logs and get instant root-cause analysis, error patterns, and actionable fixes.",
  },
  {
    icon: "🐳",
    title: "Docker Generator",
    description:
      "Describe your stack and receive production-ready Dockerfiles and compose configurations.",
  },
  {
    icon: "⚙️",
    title: "CI/CD Generator",
    description:
      "Generate GitHub Actions, GitLab CI, or Jenkins pipelines tailored to your project.",
  },
  {
    icon: "🌐",
    title: "Nginx Assistant",
    description:
      "Debug reverse-proxy issues, optimize configs, and resolve SSL and routing problems.",
  },
  {
    icon: "🚀",
    title: "Deployment Assistant",
    description:
      "Get step-by-step deployment guides for cloud platforms, VPS, and container orchestration.",
  },
  {
    icon: "📊",
    title: "File Analyzer",
    description:
      "Upload CSV, Excel, or log files and ask questions — the AI extracts insights for you.",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <header className="relative overflow-hidden px-4 pb-16 pt-8 text-center sm:px-6 sm:pb-20 sm:pt-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--hero-glow),_transparent_60%)]"
        />

        <div className="relative mx-auto max-w-4xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-accent">
            AI-Powered DevOps Assistant
          </p>

          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            OpsPilot AI
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl">
            Your intelligent copilot for logs, containers, pipelines, and
            deployments — all in one conversational interface.
          </p>

          <ul className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {capabilities.map((item) => (
              <li
                key={item}
                className="rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs text-muted-foreground sm:px-4 sm:text-sm"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </header>

      <section className="px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="mx-auto grid max-w-5xl gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group rounded-2xl border border-border bg-card/60 p-5 transition hover:border-muted-foreground/30 hover:bg-card sm:p-6"
            >
              <span
                className="mb-4 block text-3xl"
                role="img"
                aria-hidden
              >
                {feature.icon}
              </span>

              <h2 className="mb-2 text-lg font-semibold">
                {feature.title}
              </h2>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <HomeCTA />
    </div>
  )
}
