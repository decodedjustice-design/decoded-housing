import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  const tiles = [
    { to: "/housing-shelter", label: "Housing & Shelter", desc: "One discovery engine for affordable housing, transitional options, and shelter tonight." },
    { to: "/bills-basics", label: "Bills & Basics", desc: "Rent help, food, utilities, transportation, and essentials." },
    { to: "/tenant-rights", label: "Tenant Rights", desc: "Notices, eviction help, and practical rights information." },
    { to: "/phone-scripts", label: "Phone Scripts", desc: "Use call scripts, teleprompter mode, and post-call outcomes." },
  ];
  return <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6"><section className="rounded-xl border border-border bg-card p-8"><h1 className="font-display text-5xl">Housing stability starts with one clear next step.</h1><p className="mt-4 max-w-3xl text-muted-foreground">Decoded Housing helps you move through housing search, shelter access, and barriers with grounded, trauma-aware guidance.</p></section><section className="mt-8 grid gap-4 md:grid-cols-2">{tiles.map(t=><Link key={t.to} to={t.to} className="rounded-xl border border-border bg-card p-5 hover:border-primary"><h2 className="text-xl font-semibold">{t.label}</h2><p className="mt-2 text-sm text-muted-foreground">{t.desc}</p></Link>)}</section></main>;
}
