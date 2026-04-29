import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Search, AlertTriangle, HeartHandshake, KeyRound, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Decoded Housing — Start Here" },
      { name: "description", content: "What do you need right now? Find housing, get help if you might lose it, pay bills, or settle in." },
      { property: "og:title", content: "Decoded Housing — Start Here" },
      { property: "og:description", content: "Calm, supportive housing guidance for King County." },
    ],
  }),
  component: Index,
});

const paths = [
  {
    to: "/search" as const,
    title: "Housing Search",
    desc: "Browse affordable units and review standard eligibility details.",
    icon: Search,
    tone: "bg-[oklch(0.93_0.05_150)] text-[oklch(0.32_0.08_155)]",
  },
  {
    to: "/shelter" as const,
    title: "Housing Stability Support",
    desc: "Review eviction prevention resources, hotlines, and immediate actions.",
    icon: AlertTriangle,
    tone: "bg-[oklch(0.93_0.06_25)] text-[oklch(0.45_0.13_25)]",
  },
  {
    to: "/basic-needs" as const,
    title: "Basic Needs Assistance",
    desc: "Access food, utility, rent, and household support programs.",
    icon: HeartHandshake,
    tone: "bg-[oklch(0.94_0.07_85)] text-[oklch(0.38_0.1_75)]",
  },
  {
    to: "/apply" as const,
    title: "Application and Move-In Support",
    desc: "Follow structured steps for applications and move-in planning.",
    icon: KeyRound,
    tone: "bg-[oklch(0.92_0.05_140)] text-[oklch(0.32_0.07_150)]",
  },
];

function Index() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-28 pt-8 sm:px-6 lg:pt-14">
      <section
        className="grain animate-fade-up relative overflow-hidden rounded-[8px] border border-white/10 p-8 shadow-[var(--shadow-elevated)] sm:p-16"
        style={{ backgroundImage: "var(--gradient-hero)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: "var(--gradient-mesh)" }}
        />
        <div className="relative max-w-2xl text-primary-foreground">
          <h1 className="font-display text-balance text-[44px] font-medium leading-[1.02] tracking-tight sm:text-[68px]">
            HOUSING ACCESS PLATFORM
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/75 sm:text-[17px]">
            Search affordable housing, review eligibility, and manage applications across King County.
          </p>
          <div className="mt-8">
            <Link
              to="/search"
              className="inline-flex items-center gap-2 rounded-[8px] bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition-opacity hover:opacity-90"
            >
              Start Housing Search <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-6 sm:grid-cols-2">
        {paths.map((p, i) => (
          <Link
            key={p.to}
            to={p.to}
            className="group relative rounded-[8px] border border-border bg-card p-8"
            style={{ animation: `fade-up 0.7s var(--ease-out-expo) ${i * 80}ms both` }}
          >
            <div>
              <div className="mb-5 flex items-center justify-between">
                <div className={`inline-flex h-11 w-11 items-center justify-center rounded-[8px] ${p.tone}`}>
                  <p.icon className="h-5 w-5" />
                </div>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
                  0{i + 1}
                </span>
              </div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">{p.title}</h2>
              <p className="mt-2 text-pretty text-[14px] leading-relaxed text-muted-foreground">{p.desc}</p>
              <div className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-primary transition-all duration-300 group-hover:gap-3">
                Start here <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </Link>
        ))}
      </section>

      <section className="mt-14 overflow-hidden rounded-[8px] border border-border bg-card p-8 sm:p-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-foreground">Housing Support Services</h3>
            <p className="mt-1.5 text-[14px] text-muted-foreground">Use Get Assistance (right side) to access food, utilities, furniture, and rent support at any time.</p>
          </div>
          <Link
            to="/tenant-rights"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[13px] font-medium text-background shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-px hover:shadow-[var(--shadow-elevated)]"
          >
            Read tenant rights <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
