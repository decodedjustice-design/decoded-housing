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
    <main className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:pt-16">
      <section
        className="relative overflow-hidden rounded-3xl border border-border p-8 shadow-[var(--shadow-soft)] sm:p-14"
        style={{ backgroundImage: "var(--gradient-hero)" }}
      >
        <div className="max-w-2xl text-primary-foreground">
          <p className="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
            King County housing support
          </p>
          <h1 className="text-3xl font-semibold leading-tight sm:text-5xl">
            What do you need right now?
          </h1>
          <p className="mt-4 max-w-xl text-base text-white/85 sm:text-lg">
            One step at a time. Pick where you are today and we'll guide you with clear actions, scripts, and local resources.
          </p>
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        {paths.map((p) => (
          <Link
            key={p.to}
            to={p.to}
            className="group rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
          >
            <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${p.tone}`}>
              <p.icon className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">{p.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
            <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
              Start here <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        ))}
      </section>

      <section className="mt-12 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground">Not sure where to start?</h3>
            <p className="text-sm text-muted-foreground">Tap Quick Assist (right side) for food, utilities, furniture, and rent help anytime.</p>
          </div>
          <Link
            to="/tenant-rights"
            className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:opacity-90"
          >
            Read tenant rights <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
