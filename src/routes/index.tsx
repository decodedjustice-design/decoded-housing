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
}
