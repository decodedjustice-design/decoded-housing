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
    title: "Find housing",
    desc: "Browse affordable units, vouchers welcome.",
    icon: Search,
    tone: "bg-[oklch(0.93_0.05_150)] text-[oklch(0.32_0.08_155)]",
  },
  {
    to: "/shelter" as const,
    title: "I might lose housing",
    desc: "Eviction help, hotlines, and immediate steps.",
    icon: AlertTriangle,
    tone: "bg-[oklch(0.93_0.06_25)] text-[oklch(0.45_0.13_25)]",
  },
  {
    to: "/basic-needs" as const,
    title: "Help paying bills",
    desc: "Food, utilities, rent assistance, furniture.",
    icon: HeartHandshake,
    tone: "bg-[oklch(0.94_0.07_85)] text-[oklch(0.38_0.1_75)]",
  },
  {
    to: "/apply" as const,
    title: "I just got approved / moving in",
    desc: "Step-by-step move-in checklist and scripts.",
    icon: KeyRound,
    tone: "bg-[oklch(0.92_0.05_140)] text-[oklch(0.32_0.07_150)]",
  },
];

function Index() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-28 pt-8 sm:px-6 lg:pt-14">
      <section
        className="grain animate-fade-up relative overflow-hidden rounded-[28px] border border-white/10 p-8 shadow-[var(--shadow-elevated)] sm:p-16"
        style={{ backgroundImage: "var(--gradient-hero)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: "var(--gradient-mesh)" }}
        />
        <div className="relative max-w-2xl text-primary-foreground">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            King County housing support
          </p>
          <h1 className="font-display text-balance text-[44px] font-medium leading-[1.02] tracking-tight sm:text-[68px]">
            What do you need <em className="italic text-white/90">right now</em>?
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/75 sm:text-[17px]">
            One step at a time. Pick where you are today and we'll guide you with clear actions, scripts, and local resources.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3 text-[12px] text-white/60">
            <span className="font-mono">/01</span>
            <span className="h-px w-8 bg-white/30" />
            <span className="uppercase tracking-[0.2em]">Choose your path below</span>
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-4 sm:grid-cols-2">
        {paths.map((p, i) => (
          <Link
            key={p.to}
            to={p.to}
            className="group hover-lift relative overflow-hidden rounded-2xl border border-border/70 bg-card p-7 shadow-[var(--shadow-card)]"
            style={{ animation: `fade-up 0.7s var(--ease-out-expo) ${i * 80}ms both` }}
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[var(--gradient-soft)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative">
              <div className="mb-5 flex items-center justify-between">
                <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${p.tone}`}>
                  <p.icon className="h-5 w-5" />
                </div>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
                  0{i + 1}
                </span>
              </div>
              <h2 className="font-display text-2xl font-medium tracking-tight text-foreground">{p.title}</h2>
              <p className="mt-2 text-pretty text-[14px] leading-relaxed text-muted-foreground">{p.desc}</p>
              <div className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-primary transition-all duration-300 group-hover:gap-3">
                Start here <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </Link>
        ))}
      </section>

      <section className="mt-14 overflow-hidden rounded-2xl border border-border/70 bg-card p-7 shadow-[var(--shadow-card)] sm:p-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-xl font-medium tracking-tight text-foreground">Not sure where to start?</h3>
            <p className="mt-1.5 text-[14px] text-muted-foreground">Tap Quick Assist (right side) for food, utilities, furniture, and rent help anytime.</p>
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
