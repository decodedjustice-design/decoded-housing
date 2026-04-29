import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Search, AlertTriangle, HeartHandshake, KeyRound, Scale, Home, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Decoded Housing — Start Here" },
      { name: "description", content: "King County housing help in plain language. Find shelter, housing, rent help, food, and tenant support." },
      { property: "og:title", content: "Decoded Housing — Start Here" },
      { property: "og:description", content: "Calm, step-by-step housing guidance for King County." },
    ],
  }),
  component: Index,
});

const paths = [
  {
    to: "/search" as const,
    title: "Find affordable housing",
    desc: "Browse places in King County and see what to do next, with or without a voucher.",
    icon: Search,
    tone: "bg-[oklch(0.93_0.05_150)] text-[oklch(0.32_0.08_155)]",
  },
  {
    to: "/shelter" as const,
    title: "Need shelter tonight",
    desc: "Get urgent options, phone numbers, and simple first steps if you need a safe place now.",
    icon: Home,
    tone: "bg-[oklch(0.93_0.06_25)] text-[oklch(0.45_0.13_25)]",
  },
  {
    to: "/shelter" as const,
    title: "I'm worried I'll lose my housing",
    desc: "Find rent help, prevention resources, and actions to take before a crisis gets worse.",
    icon: AlertTriangle,
    tone: "bg-[oklch(0.92_0.05_20)] text-[oklch(0.45_0.13_25)]",
  },
  {
    to: "/waitlist" as const,
    title: "I have a voucher and need a place",
    desc: "Use voucher-friendly search and planning steps to move forward faster.",
    icon: KeyRound,
    tone: "bg-[oklch(0.92_0.05_140)] text-[oklch(0.32_0.07_150)]",
  },
  {
    to: "/basic-needs" as const,
    title: "Food, utilities, furniture, and basics",
    desc: "Get connected to food, utility support, rent help, and household essentials.",
    icon: HeartHandshake,
    tone: "bg-[oklch(0.94_0.07_85)] text-[oklch(0.38_0.1_75)]",
  },
  {
    to: "/tenant-rights" as const,
    title: "Know your tenant rights",
    desc: "Understand your rights in plain language and learn what to do if a landlord problem comes up.",
    icon: Scale,
    tone: "bg-[oklch(0.92_0.04_250)] text-[oklch(0.36_0.09_250)]",
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
            Housing help in King County that makes sense
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/85 sm:text-[17px]">
            If you need shelter, affordable housing, rent help, or basics like food and utilities, start here. We break things down into clear next steps.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/search"
              className="inline-flex items-center gap-2 rounded-[8px] bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition-opacity hover:opacity-90"
            >
              Find housing now <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/shelter"
              className="inline-flex items-center gap-2 rounded-[8px] border border-white/35 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/20"
            >
              Need shelter tonight
            </Link>
          </div>
          <p className="mt-4 text-sm text-white/80">You are not behind. Start with your situation, and we’ll help you take the next step.</p>
        </div>
      </section>

      <section className="mt-6 rounded-[8px] border border-border bg-card/70 p-5 text-sm text-muted-foreground">
        This guide is for people in King County with or without vouchers. You’ll get practical steps, not agency jargon.
      </section>

      <section className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paths.map((p, i) => (
          <Link
            key={`${p.to}-${p.title}`}
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
        <h3 className="text-xl font-semibold tracking-tight text-foreground">How to use this site</h3>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[14px] text-muted-foreground">
          <li>Pick the card that matches your situation right now.</li>
          <li>Follow the steps and use the phone numbers or links provided.</li>
          <li>Come back anytime for your next step as things change.</li>
        </ol>
      </section>
    </main>
  );
}
