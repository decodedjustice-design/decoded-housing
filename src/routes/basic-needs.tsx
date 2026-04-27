import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Apple, Zap, Sofa, Scale, AlertTriangle } from "lucide-react";
import { useResources, CATEGORY_LABEL, DEFAULT_CITY, type ResourceCategory } from "@/lib/resources";
import { ResourceCard } from "@/components/resources/ResourceCard";

export const Route = createFileRoute("/basic-needs")({
  head: () => ({
    meta: [
      { title: "Basic Needs Hub — Decoded Housing" },
      { name: "description", content: "Find food, utility help, furniture, and rent assistance in King County. Verified, current resources sorted by your city." },
    ],
  }),
  component: BasicNeedsPage,
});

const CITIES = ["Redmond", "Bellevue", "Kirkland", "Seattle", "Tukwila", "Tacoma"];

const TABS: { key: "all" | ResourceCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "all", label: "All", icon: Apple },
  { key: "food", label: CATEGORY_LABEL.food, icon: Apple },
  { key: "utilities", label: CATEGORY_LABEL.utilities, icon: Zap },
  { key: "furniture", label: CATEGORY_LABEL.furniture, icon: Sofa },
  { key: "rental", label: CATEGORY_LABEL.rental, icon: Scale },
];

function BasicNeedsPage() {
  const [activeTab, setActiveTab] = useState<"all" | ResourceCategory>("all");
  const [city, setCity] = useState<string>(DEFAULT_CITY);
  const [urgentOnly, setUrgentOnly] = useState(false);

  const { data, loading, error } = useResources({
    category: activeTab === "all" ? undefined : activeTab,
    city,
    urgentOnly,
  });

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Basic Needs Hub</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Verified King County resources for food, utilities, furniture, and rent. Showing nearby help first.
        </p>
      </header>

      {/* Filters */}
      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-soft)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {TABS.map((t) => {
            const active = t.key === activeTab;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                  active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/70"
                }`}
              >
                <t.icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs text-muted-foreground">City</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground"
          >
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <button
            onClick={() => setUrgentOnly((v) => !v)}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
              urgentOnly
                ? "bg-destructive text-destructive-foreground"
                : "border border-border bg-background text-foreground hover:bg-muted"
            }`}
            aria-pressed={urgentOnly}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            {urgentOnly ? "Showing urgent only" : "Show only urgent help"}
          </button>
        </div>
      </div>

      {/* Results */}
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-2xl border border-border bg-muted/40" />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          Couldn’t load resources: {error}
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
          No resources match these filters. Try a different city or turn off “urgent only”.
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((r, i) => (
            <ResourceCard key={r.id} r={r} highlight={urgentOnly && i === 0} />
          ))}
        </div>
      )}
    </main>
  );
}
