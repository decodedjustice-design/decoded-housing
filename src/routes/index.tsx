import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  Heart,
  Home,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Train,
  Wallet,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Decoded Housing — Stable Housing Navigator for King County" },
      {
        name: "description",
        content:
          "Search King County affordable housing, ARCH and MFTE properties, shelter options, eligibility guidance, documents, call scripts, and tenant-rights support.",
      },
      { property: "og:title", content: "Decoded Housing — Find affordable housing without dead ends" },
      {
        property: "og:description",
        content:
          "A no-abandonment housing navigator for King County residents: search properties, triage barriers, gather documents, and plan the next call.",
      },
    ],
  }),
  component: HomePage,
});

const trust = [
  { icon: CheckCircle2, label: "ARCH, MFTE, LIHTC, voucher and shelter pathways" },
  { icon: Building2, label: "King County property data preserved" },
  { icon: Heart, label: "Family, youth, single-adult and urgent shelter support" },
  { icon: Wallet, label: "Free housing-stability guidance" },
];

const entryPoints = [
  {
    icon: Search,
    title: "Search affordable properties",
    text: "Filter real King County property records by city, program, bedroom need, voucher fit, verification status, and transit access.",
    to: "/properties" as const,
    cta: "Open property tracker",
  },
  {
    icon: Sparkles,
    title: "Build a stability plan",
    text: "Start with urgent risks, screening barriers, documents, rights triggers, and backup steps so the flow never ends at a dead end.",
    to: "/stable-housing-navigator" as const,
    cta: "Start navigator",
  },
  {
    icon: AlertTriangle,
    title: "Find shelter tonight",
    text: "Use urgent routing for families, youth and young adults, single adults, full-shelter contingencies, and crisis numbers.",
    to: "/shelter/tonight" as const,
    cta: "Open urgent help",
    urgent: true,
  },
];

const workflow = [
  "Check urgent risks first: eviction deadlines, unsafe housing, family shelter need, or tonight’s bed search.",
  "Search properties and availability signals without losing the application checklist or phone script.",
  "Match eligibility: ARCH, MFTE, AMI levels, voucher questions, household size, and screening barriers.",
  "Leave with a next step, a backup plan, documents to gather, and a call outcome to track.",
];

const retainedTools = [
  { label: "Eligibility guidance", to: "/apply" as const, icon: ClipboardList },
  { label: "Documents checklist", to: "/housing/documents" as const, icon: ShieldCheck },
  { label: "Phone scripts", to: "/phone-scripts" as const, icon: Phone },
  { label: "Family shelter support", to: "/shelter/family" as const, icon: Home },
];

function HomePage() {
  return (
    <main className="bg-background text-foreground">
      <section className="grain relative overflow-hidden border-b border-border/70 bg-[var(--gradient-hero)] text-primary-foreground">
        <div className="absolute inset-0 bg-[var(--gradient-mesh)] opacity-80" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div className="max-w-3xl animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white/85">
              King County Stable Housing Navigator
            </span>
            <h1 className="mt-6 font-display text-5xl leading-[1.02] text-balance sm:text-6xl lg:text-7xl">
              Find housing, solve barriers, and keep the next step in sight.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78">
              Decoded Housing brings affordable property search, ARCH and MFTE guidance, shelter routing, documents, eligibility, tenant-rights prompts, and call scripts into one no-abandonment flow.
            </p>
            <form action="/properties" className="mt-8 flex flex-col gap-3 rounded-3xl border border-white/15 bg-white/95 p-2 shadow-[var(--shadow-elevated)] sm:flex-row">
              <label className="sr-only" htmlFor="home-search">Search city, program, or property</label>
              <div className="flex flex-1 items-center gap-3 px-4 text-foreground">
                <Search className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <input id="home-search" name="q" className="min-h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Search Bellevue, ARCH, voucher, 2BR..." />
              </div>
              <button className="rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90" type="submit">
                Search properties
              </button>
            </form>
            <div className="mt-5 flex flex-wrap gap-2">
              {retainedTools.map((tool) => (
                <Link key={tool.label} to={tool.to} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-white/88 hover:bg-white/15">
                  <tool.icon className="h-4 w-4" /> {tool.label}
                </Link>
              ))}
            </div>
          </div>

          <aside className="rounded-[2rem] border border-white/15 bg-white/95 p-5 text-foreground shadow-[var(--shadow-elevated)] lg:mt-10">
            <div className="rounded-[1.5rem] bg-gradient-to-br from-primary/15 to-accent/40 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Availability tracker</p>
                  <h2 className="mt-2 font-display text-3xl">Properties stay connected to action.</h2>
                </div>
                <ShieldCheck className="h-10 w-10 text-primary" />
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {["Program", "Waitlist", "Next call"].map((item) => (
                  <div key={item} className="rounded-2xl border border-border bg-card p-3 text-sm font-semibold shadow-[var(--shadow-card)]">{item}</div>
                ))}
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-2 text-sm font-semibold"><MapPin className="h-4 w-4 text-primary" /> ARCH / MFTE property search</div>
                <p className="mt-1 text-sm text-muted-foreground">Preserves affordable-housing data while upgrading the discovery experience.</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-2 text-sm font-semibold"><Train className="h-4 w-4 text-primary" /> Mobile-first map and list fallback</div>
                <p className="mt-1 text-sm text-muted-foreground">A property list remains usable even when maps or API keys are unavailable.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-b border-border bg-muted/45 px-4 py-5 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-x-8 gap-y-3">
          {trust.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <item.icon className="h-4 w-4 text-primary" /> {item.label}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-18">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Choose your starting point</p>
          <h2 className="mt-3 font-display text-4xl text-balance">A production-ready front door for different housing situations.</h2>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {entryPoints.map((item) => (
            <Link key={item.title} to={item.to} className={`group rounded-[2rem] border p-6 shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)] ${item.urgent ? "border-destructive/30 bg-destructive/5" : "border-border bg-card"}`}>
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.urgent ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}><item.icon className="h-6 w-6" /></div>
              <h3 className="mt-5 font-display text-2xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
              <span className={`mt-5 inline-flex items-center gap-2 text-sm font-bold ${item.urgent ? "text-destructive" : "text-primary"}`}>{item.cta}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-primary px-4 py-14 text-primary-foreground sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground/70">No-abandonment workflow</p>
          <h2 className="mt-3 max-w-3xl font-display text-4xl text-balance">The site now treats search, eligibility, documents, and follow-through as one journey.</h2>
          <div className="mt-8 grid gap-3 md:grid-cols-4">
            {workflow.map((step, index) => (
              <article key={step} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold text-primary">{index + 1}</div>
                <p className="mt-4 text-sm leading-6 text-primary-foreground/78">{step}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
