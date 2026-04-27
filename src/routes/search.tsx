import { createFileRoute } from "@tanstack/react-router";
import { MapPin, BedDouble, Users, Map as MapIcon } from "lucide-react";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search Housing — Decoded Housing" },
      { name: "description", content: "Browse affordable housing across King County. Filter by city, AMI, and unit size." },
      { property: "og:title", content: "Search Housing — Decoded Housing" },
      { property: "og:description", content: "Affordable units in King County with filters for AMI and unit size." },
    ],
  }),
  component: SearchPage,
});

const listings = [
  { id: 1, name: "Othello Square Apartments", city: "Seattle", ami: "30–60% AMI", beds: "1–3 BR" },
  { id: 2, name: "Patricia Apartments", city: "Renton", ami: "50–80% AMI", beds: "Studio–2 BR" },
  { id: 3, name: "Greenbridge Family Homes", city: "White Center", ami: "30–50% AMI", beds: "2–4 BR" },
  { id: 4, name: "Madrona Ridge", city: "Kent", ami: "60% AMI", beds: "1–2 BR" },
  { id: 5, name: "Cedar River Court", city: "Tukwila", ami: "40–60% AMI", beds: "Studio–3 BR" },
  { id: 6, name: "Plaza Roberto Maestas", city: "Seattle", ami: "30–60% AMI", beds: "1–3 BR" },
];

function SearchPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold text-foreground">Find affordable housing</h1>
        <p className="mt-1 text-sm text-muted-foreground">King County listings — filter by what fits your situation.</p>
      </header>

      <div className="mb-6 grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-3">
        {[
          { label: "City", value: "All King County" },
          { label: "AMI", value: "Up to 60%" },
          { label: "Unit size", value: "Any" },
        ].map((f) => (
          <label key={f.label} className="text-xs font-medium text-muted-foreground">
            {f.label}
            <select className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">
              <option>{f.value}</option>
            </select>
          </label>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4 sm:grid-cols-2">
          {listings.map((l) => (
            <article key={l.id} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <div className="mb-3 h-32 rounded-xl bg-[var(--gradient-soft)] border border-border" />
              <h3 className="text-base font-semibold text-foreground">{l.name}</h3>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> {l.city}
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-1 text-accent-foreground">
                  <Users className="h-3 w-3" /> {l.ami}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-1 text-accent-foreground">
                  <BedDouble className="h-3 w-3" /> {l.beds}
                </span>
              </div>
              <button className="mt-4 w-full rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-glow">
                View details
              </button>
            </article>
          ))}
        </div>

        <aside className="hidden h-[600px] rounded-2xl border border-border bg-[var(--gradient-soft)] lg:flex lg:flex-col lg:items-center lg:justify-center">
          <MapIcon className="h-10 w-10 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Map view coming soon</p>
        </aside>
      </div>
    </main>
  );
}