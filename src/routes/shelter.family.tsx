import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/shelter/family")({ component: Page });

function Page() {
  return <main className="mx-auto max-w-5xl px-4 pb-20 pt-10 sm:px-6"><h1 className="text-3xl font-semibold text-foreground">Family shelter</h1><p className="mt-2 text-muted-foreground">Family shelter options.</p><div className="mt-6 rounded-xl border border-border bg-card p-4"><p className="text-sm text-muted-foreground">This page is part of the new housing help route structure. Preserve and move existing content blocks into this section as needed.</p><Link to="/" className="mt-3 inline-block text-sm font-medium text-primary">Back to Start Here</Link></div></main>;
}
