import { useState } from "react";
import { Apple, Zap, Sofa, Scale, X, BadgeCheck, AlertTriangle, Phone } from "lucide-react";
import { useResources, DEFAULT_CITY, type ResourceCategory } from "@/lib/resources";

type Item = { key: ResourceCategory; label: string; icon: React.ComponentType<{ className?: string }>; tint: string };

const items: Item[] = [
  { key: "food", label: "Food", icon: Apple, tint: "bg-[oklch(0.92_0.06_140)] text-[oklch(0.32_0.08_150)]" },
  { key: "utilities", label: "Utilities", icon: Zap, tint: "bg-[oklch(0.94_0.08_85)] text-[oklch(0.35_0.1_75)]" },
  { key: "furniture", label: "Furniture", icon: Sofa, tint: "bg-[oklch(0.92_0.04_60)] text-[oklch(0.35_0.06_55)]" },
  { key: "rental", label: "Legal/Rent", icon: Scale, tint: "bg-[oklch(0.93_0.05_25)] text-[oklch(0.45_0.13_25)]" },
];

function MiniPanel({ category, onClose }: { category: ResourceCategory; onClose: () => void }) {
  const { data, loading } = useResources({ category, city: DEFAULT_CITY, limit: 5 });
  const top = data[0];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end bg-foreground/30 p-4 sm:items-start sm:pt-24" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold capitalize text-foreground">Nearby {category} resources</h3>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-muted" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        {loading && <p className="text-xs text-muted-foreground">Loading…</p>}

        {!loading && data.length === 0 && (
          <p className="text-xs text-muted-foreground">No resources found nearby.</p>
        )}

        <ul className="space-y-2">
          {data.map((r) => {
            const isTopUrgent = r.id === top?.id && r.priority_level === 1;
            return (
              <li
                key={r.id}
                className={`rounded-xl border p-3 ${isTopUrgent ? "border-destructive/40 bg-destructive/5" : "border-border bg-background"}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-sm font-medium text-foreground">{r.name}</span>
                      {r.verified && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-primary" />}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {r.city}{r.subcategory ? ` · ${r.subcategory.replaceAll("_", " ")}` : ""}
                    </div>
                    {r.description && <p className="mt-1 line-clamp-2 text-xs text-foreground/75">{r.description}</p>}
                  </div>
                  {isTopUrgent && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-destructive/15 px-2 py-0.5 text-[10px] font-semibold text-destructive">
                      <AlertTriangle className="h-3 w-3" /> Top
                    </span>
                  )}
                </div>
                {r.phone && (
                  <a href={`tel:${r.phone}`} className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                    <Phone className="h-3 w-3" /> {r.phone}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export function QuickAssistSidebar() {
  const [active, setActive] = useState<ResourceCategory | null>(null);

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

      {active && <MiniPanel category={active} onClose={() => setActive(null)} />}
    </>
  );
}