import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Search,
  MapPin,
  ShieldCheck,
  Sparkles,
  Heart,
  Wallet,
  ArrowRight,
  AlertTriangle,
  Train,
  CheckCircle2,
  Building2,
  ClipboardList,
  Phone,
} from "lucide-react";

export const Route = createFileRoute("/home-v2")({
  head: () => ({
    meta: [
      { title: "Decoded Housing — Housing Search in King County" },
      {
        name: "description",
        content:
          "ARCH, MFTE, Section 8, public housing, shelters — all in one place. Real listings, plain language, and the exact scripts to get in the door. Free, always.",
      },
      { property: "og:title", content: "Decoded Housing — Housing Search in King County" },
      {
        property: "og:description",
        content:
          "Affordable units are hidden by design. We surface ARCH, MFTE, HUD, Section 8 and shelters in one searchable hub.",
      },
    ],
  }),
  component: HomeV2,
});

const trust = [
  { icon: CheckCircle2, label: "184 verified properties" },
  { icon: Building2, label: "ARCH, MFTE, HUD, Section 8 & shelters" },
  { icon: Heart, label: "Built by someone who lived the system" },
  { icon: Wallet, label: "Always free — no ads, no paywalls" },
];

const doors = [
  {
    tag: "Free",
    tone: "green" as const,
    icon: "🏠",
    title: "Housing Search",
    desc: "Search ARCH, MFTE, Section 8, and income-based apartments across King County. Real listings with contact info and insider tips on how to apply.",
    cta: "Open Search",
    to: "/search" as const,
    urgent: false,
  },
  {
    tag: "Free",
    tone: "amber" as const,
    icon: "📋",
    title: "Program Eligibility",
    desc: "Answer 4 questions about your household and income. We'll show you every program you're eligible for — with AMI levels, income limits, and how to apply.",
    cta: "Run Eligibility Check",
    to: "/apply" as const,
    urgent: false,
  },
  {
    tag: "Priority",
    tone: "red" as const,
    icon: "🚨",
    title: "Immediate Shelter Access",
    desc: "If you or your family need a safe place tonight, start here. We'll show you the best available options for your situation — ranked, with direct contact info.",
    cta: "Open Shelter Options",
    to: "/shelter" as const,
    urgent: true,
  },
];

const steps = [
  {
    n: "1",
    title: "Units exist, but aren't listed",
    desc: "A building with 200 apartments might have 20 ARCH units at reduced rent. None will appear on Zillow or Apartments.com.",
  },
  {
    n: "2",
    title: "We surface them",
    desc: "Our database pulls from ARCH, WSHFC, HUD, and city records — programs that don't share data with each other.",
  },
  {
    n: "3",
    title: "You call with the right words",
    desc: 'Use our phone scripts. Ask specifically for "ARCH units" or "income-qualified units." The leasing agent won\'t volunteer this.',
  },
  {
    n: "4",
    title: "Know your rights",
    desc: "Voucher holders can't be denied for income source in Washington State. We'll tell you the law and what to do if it's violated.",
  },
];

const listings = [
  {
    name: "Vue 22 Bellevue",
    location: "Bellevue · 60–80% AMI",
    tags: [{ label: "ARCH", cls: "bg-primary/10 text-primary" }, { label: "MFTE", cls: "bg-amber-100 text-amber-900" }],
    meta: "1–2BR · Accepts vouchers",
    transit: "BelRed · 0.3 mi",
  },
  {
    name: "Horizon at Together Center",
    location: "Redmond · 30–60% AMI",
    tags: [{ label: "ARCH", cls: "bg-primary/10 text-primary" }],
    meta: "Studio–2BR",
    transit: "Overlake · 0.8 mi",
  },
  {
    name: "Sophia Way – Eastside Women's Shelter",
    location: "Bellevue · Women & families",
    tags: [{ label: "Transitional", cls: "bg-purple-100 text-purple-900" }],
    meta: "Transitional · Call intake",
    transit: "East Main · 1.1 mi",
  },
];

function HomeV2() {
  return (
    <div className="bg-background text-foreground">
      {/* HERO */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 pb-20 pt-16 lg:grid-cols-2">
        <div className="max-w-xl">
          <span className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-bold text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            184 affordable properties in King County
          </span>
          <h1 className="mb-5 font-serif text-[clamp(36px,5vw,58px)] font-bold leading-[1.15] tracking-tight text-foreground">
            Locate housing that is{" "}
            <span className="relative inline-block text-primary">
              program-eligible.
              <span className="absolute inset-x-0 bottom-1 -z-10 h-1 rounded bg-primary/20" />
            </span>
          </h1>
          <p className="mb-9 text-[17px] leading-[1.75] text-muted-foreground">
            ARCH, MFTE, Section 8, public housing, shelters — all in one place. Verified listings, standardized guidance, and call scripts for application intake.
          </p>

          <form
            action="/search"
            className="mb-5 flex items-center gap-3 rounded-2xl border-2 border-border bg-card py-2 pl-5 pr-2 shadow-[0_4px_24px_rgba(27,67,50,0.08)] focus-within:border-primary"
          >
            <Search className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
            <input
              name="q"
              type="text"
              placeholder="City, neighborhood, or program (e.g. Bellevue, ARCH)"
              className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap gap-2.5">
            {[
              { label: "🏘 ARCH units", to: "/search?type=ARCH" },
              { label: "🏢 MFTE units", to: "/search?type=MFTE" },
              { label: "🎫 Accepts vouchers", to: "/search" },
              { label: "📋 Run Eligibility Check", to: "/apply" },
            ].map((q) => (
              <a
                key={q.label}
                href={q.to}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3.5 py-1.5 text-[13px] font-semibold text-foreground/80 transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
              >
                {q.label}
              </a>
            ))}
          </div>
        </div>

        {/* Hero card */}
        <div className="relative hidden lg:block">
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[0_20px_60px_rgba(27,67,50,0.12)]">
            <div className="relative flex h-56 items-end bg-gradient-to-br from-primary via-primary/80 to-primary/50 p-5">
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <span className="relative z-10 inline-flex items-center gap-1.5 rounded-lg bg-card px-3 py-1.5 text-xs font-bold text-primary">
                <ShieldCheck className="h-3.5 w-3.5" /> Verified listing
              </span>
            </div>
            <div className="p-5">
              <div className="mb-2.5 flex gap-1.5">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">ARCH</span>
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-900">MFTE</span>
              </div>
              <div className="mb-1 font-serif text-[17px] font-semibold">Vue 22 Bellevue</div>
              <div className="mb-3.5 flex items-center gap-1 text-[13px] text-muted-foreground">
                <MapPin className="h-3 w-3" /> 3690 132nd Ave NE, Bellevue
              </div>
              <div className="flex gap-4 border-t border-border pt-3.5">
                <div className="text-xs text-muted-foreground">
                  <strong className="block text-[15px] font-bold text-primary">60–80%</strong>AMI levels
                </div>
                <div className="text-xs text-muted-foreground">
                  <strong className="block text-[15px] font-bold text-primary">1–2BR</strong>Unit types
                </div>
                <div className="text-xs text-muted-foreground">
                  <strong className="block text-[15px] font-bold text-primary">0.3 mi</strong>BelRed Station
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -right-5 -top-4 rounded-2xl border border-border bg-card px-4 py-3.5 shadow-[0_8px_32px_rgba(27,67,50,0.12)]">
            <div className="mb-1 text-[11px] font-semibold text-muted-foreground">Properties in database</div>
            <div className="font-mono text-sm font-medium text-primary">184 properties · 3,400+ units</div>
          </div>

          <div className="absolute -bottom-4 -left-5 flex items-center gap-2.5 rounded-2xl bg-primary px-4 py-3.5 text-primary-foreground shadow-[0_8px_32px_rgba(27,67,50,0.2)]">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-base">
              <Train className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-primary-foreground/70">Nearest light rail</div>
              <div className="text-sm font-bold">BelRed/130th · 2 Line</div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="border-y border-border bg-muted/40 px-6 py-5">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {trust.map((t) => (
            <div key={t.label} className="flex items-center gap-2 text-[13px] font-semibold text-muted-foreground">
              <t.icon className="h-4 w-4 text-primary" />
              {t.label}
            </div>
          ))}
        </div>
      </div>

      {/* 3 DOORS */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-3 text-center text-xs font-bold uppercase tracking-[2px] text-primary">
          Where do you need to start?
        </div>
        <h2 className="mb-2 text-center font-serif text-[clamp(26px,4vw,40px)] font-bold leading-tight">
          What are you looking for today?
        </h2>
        <p className="mx-auto mb-13 max-w-md pb-13 text-center text-base text-muted-foreground">
          We meet you where you are. No judgment. No wrong answer.
        </p>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {doors.map((d) => (
            <Link
              key={d.title}
              to={d.to}
              className={`group relative block overflow-hidden rounded-3xl border-2 p-8 transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(27,67,50,0.10)] ${
                d.urgent
                  ? "border-destructive/30 bg-gradient-to-br from-destructive/5 to-transparent hover:border-destructive"
                  : "border-border bg-card hover:border-primary"
              }`}
            >
              <span
                className={`absolute right-4 top-4 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  d.urgent ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                }`}
              >
                {d.tag}
              </span>
              <div
                className={`mb-5 flex h-13 w-13 items-center justify-center rounded-2xl text-2xl ${
                  d.tone === "green" ? "bg-primary/10" : d.tone === "amber" ? "bg-amber-100" : "bg-destructive/10"
                }`}
                style={{ width: 52, height: 52 }}
              >
                {d.icon}
              </div>
              <h3 className="mb-2 font-serif text-[21px] font-bold leading-tight">{d.title}</h3>
              <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{d.desc}</p>
              <span
                className={`inline-flex items-center gap-1.5 text-sm font-bold ${
                  d.urgent ? "text-destructive" : "text-primary"
                }`}
              >
                {d.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-primary px-6 py-20 text-primary-foreground">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-2 text-center font-serif text-[clamp(24px,4vw,36px)] font-bold">
            Why can't you find these units anywhere else?
          </h2>
          <p className="mb-13 pb-6 text-center text-[15px] text-primary-foreground/70">
            Affordable units are hidden by design. Here's how to unlock them.
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div
                key={s.n}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center transition-colors hover:bg-white/10"
              >
                <div className="mx-auto mb-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/90 font-mono text-sm font-medium text-primary">
                  {s.n}
                </div>
                <div className="mb-2 text-[15px] font-bold">{s.title}</div>
                <div className="text-[13px] leading-relaxed text-primary-foreground/70">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED LISTINGS */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 text-xs font-bold uppercase tracking-[2px] text-primary">Recently verified</div>
            <h2 className="font-serif text-[clamp(26px,4vw,40px)] font-bold leading-tight">Properties near you</h2>
          </div>
          <Link
            to="/search"
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-border bg-card px-5 py-2.5 text-sm font-bold text-primary transition-colors hover:border-primary hover:bg-primary/10"
          >
            View all 184 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((l) => (
            <Link
              key={l.name}
              to="/search"
              className="group block overflow-hidden rounded-2xl border-2 border-border bg-card transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_8px_32px_rgba(27,67,50,0.10)]"
            >
              <div className="relative h-40 overflow-hidden bg-primary/10">
                <div
                  className="h-full w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                  style={{
                    backgroundImage:
                      "url(https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80)",
                  }}
                />
                <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-card px-2.5 py-1 text-[11px] font-bold text-primary shadow">
                  <ShieldCheck className="h-3 w-3" /> Verified
                </span>
              </div>
              <div className="p-4">
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {l.tags.map((t) => (
                    <span
                      key={t.label}
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${t.cls}`}
                    >
                      {t.label}
                    </span>
                  ))}
                </div>
                <div className="mb-1 font-serif text-[15px] font-semibold leading-tight">{l.name}</div>
                <div className="mb-2.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {l.location}
                </div>
                <div className="flex items-center justify-between border-t border-border pt-2.5 text-xs">
                  <span className="font-medium text-muted-foreground">{l.meta}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                    <Train className="h-3 w-3" /> {l.transit}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ELIGIBILITY CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid grid-cols-1 items-center gap-10 rounded-[28px] border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-amber-50 p-8 md:grid-cols-[1fr_auto] md:p-13">
          <div>
            <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-primary">
              4-question quiz · takes 2 minutes
            </div>
            <h2 className="mb-3 font-serif text-[clamp(22px,3.5vw,32px)] font-bold leading-tight text-primary">
              Not sure what you qualify for?
              <br />
              Let's figure it out together.
            </h2>
            <p className="text-[15px] leading-relaxed text-foreground/75">
              Enter your household size and income. We'll show you every program you're eligible for — ARCH, MFTE,
              Section 8, HUD 202, public housing — with income limits and exactly how to apply.
            </p>
          </div>
          <Link
            to="/apply"
            className="inline-flex items-center gap-2 self-center rounded-xl bg-primary px-7 py-4 text-[15px] font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <ClipboardList className="h-4 w-4" /> Check my eligibility <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* STORY TEASER */}
      <section className="border-y border-border bg-muted/40 px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="relative mb-7 font-serif text-[clamp(20px,3vw,28px)] italic leading-[1.55] text-primary">
            <span className="absolute -left-5 top-6 font-serif text-[80px] leading-none text-primary/20">"</span>
            I called every number. I hit every wall. My son's walking was delayed because he couldn't practice in the
            van. This platform exists because the system failed us — and we are not the only ones.
          </p>
          <div className="mb-6 text-[13px] font-semibold text-muted-foreground">— Amber, founder · Bellevue, WA</div>
          <Link
            to="/our-story"
            className="inline-flex items-center gap-1.5 border-b-2 border-primary pb-0.5 text-sm font-bold text-primary transition-colors hover:text-primary/80"
          >
            Read why we built this <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-primary px-6 pb-8 pt-16 text-primary-foreground">
        <div className="mx-auto mb-12 grid max-w-6xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-2.5 font-serif text-xl font-bold">Decoded Housing</div>
            <p className="max-w-xs text-[13px] font-light leading-relaxed text-primary-foreground/70">
              We surface the affordable housing that's hidden in plain sight. Built by someone who lived the system.
              Free, always.
            </p>
          </div>
          {[
            {
              title: "Find Housing",
              links: [
                { label: "Search Properties", to: "/search" as const },
                { label: "Check Eligibility", to: "/apply" as const },
                { label: "Get Shelter Now", to: "/shelter" as const },
              ],
            },
            {
              title: "Resources",
              links: [
                { label: "Tenant Rights", to: "/tenant-rights" as const },
                { label: "Basic Needs", to: "/basic-needs" as const },
                { label: "Our Story", to: "/our-story" as const },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <div className="mb-4 text-[11px] font-bold uppercase tracking-[1.5px] text-primary-foreground/60">
                {col.title}
              </div>
              {col.links.map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  className="mb-2.5 block text-[13px] text-primary-foreground/70 hover:text-primary-foreground"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
          <div>
            <div className="mb-4 text-[11px] font-bold uppercase tracking-[1.5px] text-primary-foreground/60">
              External
            </div>
            {[
              { label: "ARCH Housing", href: "https://www.archhousing.org" },
              { label: "KCHA", href: "https://www.kcha.org" },
              { label: "WSHFC", href: "https://www.wshfc.org" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-2.5 block text-[13px] text-primary-foreground/70 hover:text-primary-foreground"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-6 text-xs text-primary-foreground/60">
          <span>© 2026 Decoded Housing · Always verify directly with properties</span>
          <span>Data: ARCH, WSHFC, HUD, City of Bellevue</span>
        </div>
      </footer>

      {/* mute unused import lint */}
      <span className="hidden">
        <Sparkles />
        <Phone />
        <AlertTriangle />
      </span>
    </div>
  );
}