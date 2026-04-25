import { useState } from "react";
import { Apple, Zap, Sofa, Scale, X, ChevronRight } from "lucide-react";

type Key = "food" | "utilities" | "furniture" | "rent";

const items: { key: Key; label: string; icon: React.ComponentType<{ className?: string }>; tint: string }[] = [
  { key: "food", label: "Food", icon: Apple, tint: "bg-[oklch(0.92_0.06_140)] text-[oklch(0.32_0.08_150)]" },
  { key: "utilities", label: "Utilities", icon: Zap, tint: "bg-[oklch(0.94_0.08_85)] text-[oklch(0.35_0.1_75)]" },
  { key: "furniture", label: "Furniture", icon: Sofa, tint: "bg-[oklch(0.92_0.04_60)] text-[oklch(0.35_0.06_55)]" },
  { key: "rent", label: "Rent", icon: Scale, tint: "bg-[oklch(0.93_0.05_25)] text-[oklch(0.45_0.13_25)]" },
];

const resources: Record<Key, { name: string; detail: string }[]> = {
  food: [
    { name: "Fresh Bucks Markets", detail: "$10 vouchers at participating farmers markets" },
    { name: "Rainier Valley Food Bank", detail: "Free groceries — Tue/Thu/Sat" },
    { name: "WIC / SNAP enrollment", detail: "Same-week appointments available" },
  ],
  utilities: [
    { name: "Seattle City Light UDP", detail: "60% off electric bill — income based" },
    { name: "PSE HELP Program", detail: "Up to $1,000 toward gas/electric" },
    { name: "LIHEAP Energy Assistance", detail: "Annual heating grant" },
  ],
  furniture: [
    { name: "Sea Mar — House to Home", detail: "Free furniture for new tenants" },
    { name: "NW Center Big Blue Truck", detail: "Pickup donations + shop deals" },
    { name: "St. Vincent de Paul vouchers", detail: "Beds, tables, dressers" },
  ],
  rent: [
    { name: "King County Rent Help", detail: "Up to 3 months past-due rent" },
    { name: "Catholic Community Services", detail: "Emergency rental assistance" },
    { name: "211 — call anytime", detail: "Live referrals to active funds" },
  ],
};

export function QuickAssistSidebar() {
  const [active, setActive] = useState<Key | null>(null);

  return (
    <>
      <aside className="fixed bottom-4 right-4 z-30 flex flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-[var(--shadow-soft)] sm:bottom-auto sm:right-4 sm:top-24">
        <div className="px-2 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Quick Assist
        </div>
        {items.map((it) => (
          <button
            key={it.key}
            onClick={() => setActive(it.key)}
            className={`group flex h-11 w-11 items-center justify-center rounded-xl transition-transform hover:scale-105 ${it.tint}`}
            aria-label={it.label}
            title={it.label}
          >
            <it.icon className="h-5 w-5" />
          </button>
        ))}
      </aside>

      {active && (
        <div className="fixed inset-0 z-50 flex items-end justify-end bg-foreground/30 p-4 sm:items-start sm:pt-24" onClick={() => setActive(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold capitalize text-foreground">Nearby {active} resources</h3>
              <button onClick={() => setActive(null)} className="rounded-md p-1 hover:bg-muted" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="space-y-2">
              {resources[active].map((r) => (
                <li key={r.name} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-background p-3">
                  <div>
                    <div className="text-sm font-medium text-foreground">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.detail}</div>
                  </div>
                  <ChevronRight className="mt-1 h-4 w-4 text-muted-foreground" />
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] text-muted-foreground">Placeholder data — real listings coming soon.</p>
          </div>
        </div>
      )}
    </>
  );
}