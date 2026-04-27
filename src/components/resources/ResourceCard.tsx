import { BadgeCheck, Phone, Globe, MapPin, Clock, AlertTriangle } from "lucide-react";
import type { Resource } from "@/lib/resources";

const PRIORITY_TINT: Record<number, string> = {
  1: "border-destructive/40 bg-destructive/5",
  2: "border-border bg-card",
  3: "border-border bg-card",
};

export function ResourceCard({ r, highlight = false }: { r: Resource; highlight?: boolean }) {
  const isUrgent = r.priority_level === 1;
  return (
    <article
      className={`rounded-2xl border p-4 shadow-[var(--shadow-soft)] transition-all hover:shadow-md ${PRIORITY_TINT[r.priority_level] ?? "border-border bg-card"} ${highlight ? "ring-2 ring-destructive" : ""}`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-foreground">{r.name}</h3>
          <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
            {r.city && <span>{r.city}{r.zip ? ` · ${r.zip}` : ""}</span>}
            {r.subcategory && <span className="rounded-full bg-muted px-2 py-0.5 capitalize">{r.subcategory.replaceAll("_", " ")}</span>}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {r.verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              <BadgeCheck className="h-3 w-3" /> Verified
            </span>
          )}
          {isUrgent && (
            <span className="inline-flex items-center gap-1 rounded-full bg-destructive/15 px-2 py-0.5 text-[10px] font-semibold text-destructive">
              <AlertTriangle className="h-3 w-3" /> Urgent
            </span>
          )}
        </div>
      </div>

      {r.description && <p className="text-sm text-foreground/80">{r.description}</p>}

      <dl className="mt-3 space-y-1 text-xs text-muted-foreground">
        {r.eligibility && <div><span className="font-medium text-foreground/70">Eligibility:</span> {r.eligibility}</div>}
        {r.hours && (
          <div className="flex items-start gap-1.5"><Clock className="mt-0.5 h-3 w-3 shrink-0" /><span>{r.hours}</span></div>
        )}
        {r.address && (
          <div className="flex items-start gap-1.5"><MapPin className="mt-0.5 h-3 w-3 shrink-0" /><span>{r.address}</span></div>
        )}
      </dl>

      <div className="mt-3 flex flex-wrap gap-2">
        {r.phone && (
          <a href={`tel:${r.phone}`} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">
            <Phone className="h-3.5 w-3.5" /> {r.phone}
          </a>
        )}
        {r.website && (
          <a href={r.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
            <Globe className="h-3.5 w-3.5" /> Website
          </a>
        )}
      </div>
    </article>
  );
}