import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: StartHerePage });

function StartHerePage() {
  const choices = [
    { to: "/shelter/tonight", label: "Need shelter tonight" },
    { to: "/housing/find-affordable-housing", label: "Find affordable housing" },
    { to: "/tenant-rights/eviction-help", label: "Worried about losing housing" },
    { to: "/housing/with-voucher", label: "I have a voucher" },
    { to: "/bills-basics", label: "Bills & basics" },
    { to: "/tenant-rights", label: "Tenant rights" },
  ];

  return <main className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6"><h1 className="text-4xl font-semibold text-foreground">What do you need most right now?</h1><p className="mt-3 text-muted-foreground">Start with the path that matches your situation.</p><section className="mt-8 grid gap-4 sm:grid-cols-2">{choices.map((c) => <Link key={c.to} to={c.to} className="rounded-xl border border-border bg-card p-5 text-lg font-medium hover:border-primary">{c.label}</Link>)}</section></main>;
const paths = [
  {
    to: "/shelter" as const,
    title: "Need shelter tonight",
    desc: "Get urgent options, phone numbers, and simple first steps if you need a safe place now.",
    cta: "Get shelter options",
    icon: Home,
    tone: "bg-[oklch(0.93_0.06_25)] text-[oklch(0.45_0.13_25)]",
  },
  {
    to: "/search" as const,
    title: "Find affordable housing",
    desc: "Browse places in King County and see what to do next, with or without a voucher.",
    cta: "Find housing",
    icon: Search,
    tone: "bg-[oklch(0.93_0.05_150)] text-[oklch(0.32_0.08_155)]",
  },
  {
    to: "/basic-needs" as const,
    title: "I'm worried I'll lose my housing",
    desc: "Find rent help, prevention resources, and actions to take before a crisis gets worse.",
    cta: "Get prevention help",
    icon: AlertTriangle,
    tone: "bg-[oklch(0.92_0.05_20)] text-[oklch(0.45_0.13_25)]",
  },
  {
    to: "/waitlist" as const,
    title: "I have a voucher and need a place",
    desc: "Use voucher-friendly search and planning steps to move forward faster.",
    cta: "Use voucher help",
    icon: KeyRound,
    tone: "bg-[oklch(0.92_0.05_140)] text-[oklch(0.32_0.07_150)]",
  },
  {
    to: "/basic-needs" as const,
    title: "Food, utilities, furniture, and basics",
    desc: "Get connected to food, utility support, rent help, and household essentials.",
    cta: "Find basics support",
    icon: HeartHandshake,
    tone: "bg-[oklch(0.94_0.07_85)] text-[oklch(0.38_0.1_75)]",
  },
  {
    to: "/tenant-rights" as const,
    title: "Know your tenant rights",
    desc: "Understand your rights in plain language and learn what to do if a landlord problem comes up.",
    cta: "Get tenant rights help",
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
            What do you need most right now?
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/85 sm:text-[17px]">
            Start with your situation. We can help with shelter tonight, affordable housing, rent and basics, voucher steps, and tenant rights.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/shelter"
              className="inline-flex items-center gap-2 rounded-[8px] bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition-opacity hover:opacity-90"
            >
              Need shelter tonight <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 rounded-[8px] border border-white/35 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/20"
            >
              Find affordable housing
            </Link>
          </div>
          <p className="mt-4 text-sm text-white/80">You are not behind. Pick one path now, and come back for the next step anytime.</p>
        </div>
      </section>

      <section className="mt-6 rounded-[8px] border border-border bg-card/70 p-5 text-sm text-muted-foreground">
        This guide is for people in King County with or without vouchers. You’ll get practical next steps, not agency jargon.
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
                {p.cta} <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
