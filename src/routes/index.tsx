import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  const tiles = [
    { to: "/stable-housing-navigator", label: "Stable Housing Navigator", desc: "A persistent King County housing stabilization plan with triage, barriers, documents, rights prompts, and follow-through." },
    { to: "/housing-shelter", label: "Housing & Shelter", desc: "One discovery engine for affordable housing, transitional options, and shelter tonight." },
    { to: "/bills-basics", label: "Bills & Basics", desc: "Rent help, food, utilities, transportation, and essentials." },
    { to: "/tenant-rights", label: "Tenant Rights", desc: "Notices, eviction help, and practical rights information." },
    { to: "/phone-scripts", label: "Phone Scripts", desc: "Use call scripts, teleprompter mode, and post-call outcomes." },
  ];
  return <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6"><section className="rounded-xl border border-border bg-card p-8"><h1 className="font-display text-5xl">Stable housing starts with a plan that does not give up.</h1><p className="mt-4 max-w-3xl text-muted-foreground">Stable Housing Navigator helps King County residents prevent eviction, solve housing barriers, find support, and keep moving with a next step and a backup plan.</p></section><section className="mt-8 grid gap-4 md:grid-cols-2">{tiles.map(t=><Link key={t.to} to={t.to} className="rounded-xl border border-border bg-card p-5 hover:border-primary"><h2 className="text-xl font-semibold">{t.label}</h2><p className="mt-2 text-sm text-muted-foreground">{t.desc}</p></Link>)}</section></main>;
}
