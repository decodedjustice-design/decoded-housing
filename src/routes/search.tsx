import { createFileRoute } from "@tanstack/react-router";
import {
  MapPin,
  BedDouble,
  Users,
  ShieldCheck,
  Train,
  Tag,
  Building2,
  Navigation,
  ExternalLink,
  Ticket,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useProperties, type Property } from "@/lib/useProperties";
import { PropertiesMap } from "@/components/PropertiesMap";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const KING_COUNTY_CITIES = [
  "Auburn","Bellevue","Bothell","Burien","Covington","Des Moines","Enumclaw",
  "Federal Way","Issaquah","Kenmore","Kent","Kirkland","Lake Forest Park",
  "Maple Valley","Mercer Island","Newcastle","Pacific","Redmond","Renton",
  "Sammamish","Seatac","Seattle","Shoreline","Snoqualmie","Tukwila","Vashon",
  "Woodinville",
];

const AMI_OPTIONS: Array<{ label: string; value: number | "" }> = [
  { label: "Any AMI", value: "" },
  { label: "Up to 30%", value: 30 },
  { label: "Up to 50%", value: 50 },
  { label: "Up to 60%", value: 60 },
  { label: "Up to 80%", value: 80 },
];

const BEDROOM_OPTIONS = [
  { label: "Any size", value: "" },
  { label: "Studio", value: "Studio" },
  { label: "1 bedroom", value: "1BR" },
  { label: "2 bedrooms", value: "2BR" },
  { label: "3 bedrooms", value: "3BR" },
  { label: "4+ bedrooms", value: "4BR+" },
];

const PROGRAM_OPTIONS: Array<{ label: string; value: string }> = [
  { label: "All programs", value: "" },
  { label: "LIHTC (Tax Credit)", value: "LIHTC (Tax Credit)" },
  { label: "MFTE / ARCH Set-Aside", value: "MFTE/ARCH Set-Aside" },
];

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

function SearchPage() {
  const [city, setCity] = useState<string>("");
  const [maxAmi, setMaxAmi] = useState<number | "">("");
  const [bedroom, setBedroom] = useState<string>("");
  const [program, setProgram] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const cardRefs = useRef<Map<string, HTMLElement>>(new Map());

  const filters = useMemo(
    () => ({
      cities: city ? [city] : [],
      maxAmi: maxAmi === "" ? undefined : maxAmi,
      bedrooms: bedroom ? [bedroom] : [],
      types: program ? [program] : [],
      sort: "recent" as const,
    }),
    [city, maxAmi, bedroom, program],
  );

  const { data, loading, error } = useProperties(filters);

  const opened = useMemo(
    () => data.find((p) => p.id === openId) ?? null,
    [data, openId],
  );

  // Reset selection if it disappears from filtered results
  useEffect(() => {
    if (selectedId && !data.some((p) => p.id === selectedId)) {
      setSelectedId(null);
    }
  }, [data, selectedId]);

  // Scroll selected card into view
  useEffect(() => {
    if (!selectedId) return;
    const el = cardRefs.current.get(selectedId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedId]);

  return (
    <main className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold text-foreground">Find affordable housing</h1>
        <p className="mt-1 text-sm text-muted-foreground">King County listings — filter by what fits your situation.</p>
      </header>

      <div className="mb-6 grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-xs font-medium text-muted-foreground">
          City
          <select
            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">All King County</option>
            {KING_COUNTY_CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className="text-xs font-medium text-muted-foreground">
          AMI
          <select
            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            value={maxAmi === "" ? "" : String(maxAmi)}
            onChange={(e) => setMaxAmi(e.target.value === "" ? "" : Number(e.target.value))}
          >
            {AMI_OPTIONS.map((opt) => (
              <option key={opt.label} value={opt.value === "" ? "" : String(opt.value)}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-medium text-muted-foreground">
          Unit size
          <select
            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            value={bedroom}
            onChange={(e) => setBedroom(e.target.value)}
          >
            {BEDROOM_OPTIONS.map((opt) => (
              <option key={opt.label} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>

        <label className="text-xs font-medium text-muted-foreground">
          Program
          <select
            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            value={program}
            onChange={(e) => setProgram(e.target.value)}
          >
            {PROGRAM_OPTIONS.map((opt) => (
              <option key={opt.label} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4 sm:grid-cols-2">
          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <article key={`skeleton-${i}`} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <div className="mb-3 h-32 animate-pulse rounded-xl border border-border bg-muted/40" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-muted/40" />
                <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-muted/40" />
                <div className="mt-3 h-6 w-1/2 animate-pulse rounded bg-muted/40" />
                <div className="mt-4 h-9 w-full animate-pulse rounded-xl bg-muted/40" />
              </article>
            ))}

          {!loading && !error && data.map((l) => (
            <article
              key={l.id}
              ref={(node) => {
                if (node) cardRefs.current.set(l.id, node);
                else cardRefs.current.delete(l.id);
              }}
              onClick={() => {
                setSelectedId(l.id);
                setOpenId(l.id);
              }}
              className={`cursor-pointer rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)] transition ${
                selectedId === l.id
                  ? "border-primary ring-2 ring-primary/40"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <div className="mb-3 h-32 rounded-xl bg-[var(--gradient-soft)] border border-border" />
              <h3 className="text-base font-semibold text-foreground">{l.name}</h3>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> {l.city}
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-1 text-accent-foreground">
                  <Users className="h-3 w-3" /> {(l.ami ?? []).join(" • ") || "AMI not listed"}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-1 text-accent-foreground">
                  <BedDouble className="h-3 w-3" /> {(l.units ?? []).join(" • ") || "Units vary"}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedId(l.id);
                  setOpenId(l.id);
                }}
                className="mt-4 w-full rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-glow"
              >
                View details
              </button>
            </article>
          ))}

          {!loading && !error && data.length === 0 && (
            <article className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground sm:col-span-2">
              No results found. Try different filters.
            </article>
          )}

          {!loading && error && (
            <article className="rounded-2xl border border-destructive/40 bg-destructive/5 p-6 text-sm text-destructive sm:col-span-2">
              Couldn’t load properties: {error}
            </article>
          )}
        </div>

        <aside className="hidden h-[600px] lg:block lg:sticky lg:top-6">
          <PropertiesMap
            properties={data}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </aside>
      </div>

      <PropertyDetailsDrawer property={opened} onClose={() => setOpenId(null)} />
    </main>
  );
}

function PropertyDetailsDrawer({
  property,
  onClose,
}: {
  property: Property | null;
  onClose: () => void;
}) {
  const open = property !== null;
  const p = property;

  const directionsUrl = p
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        [p.address, p.city, "WA"].filter(Boolean).join(", "),
      )}`
    : "#";

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        {p && (
          <>
            <SheetHeader className="text-left">
              <div className="flex items-start justify-between gap-3">
                <SheetTitle className="text-xl leading-tight">{p.name}</SheetTitle>
                {p.verified && (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    <ShieldCheck className="h-3 w-3" /> Verified
                  </span>
                )}
              </div>
              {(p.address || p.city) && (
                <SheetDescription className="flex items-start gap-1.5">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>
                    {p.address ? `${p.address}, ` : ""}
                    {p.city}
                  </span>
                </SheetDescription>
              )}
            </SheetHeader>

            <div className="mt-4 flex flex-col gap-4">
              <div className="h-36 rounded-xl border border-border bg-[var(--gradient-soft)]" />

              {(p.address || p.city) && (
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
                >
                  <Navigation className="h-4 w-4" />
                  Get directions
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              )}

              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {p.voucher && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
                    <Ticket className="h-3 w-3" /> Vouchers accepted
                  </span>
                )}
                {p.transit_distance != null && p.transit_distance <= 0.5 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 font-medium text-accent-foreground">
                    <Train className="h-3 w-3" />
                    {p.transit_label ?? `${p.transit_distance} mi to transit`}
                  </span>
                )}
                {(p.types ?? []).map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 font-medium text-foreground"
                  >
                    <Tag className="h-3 w-3" /> {t}
                  </span>
                ))}
              </div>

              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    AMI
                  </dt>
                  <dd className="mt-0.5 flex items-start gap-1.5 text-foreground">
                    <Users className="mt-0.5 h-3.5 w-3.5 text-muted-foreground" />
                    {(p.ami ?? []).join(" • ") || "Not listed"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Unit sizes
                  </dt>
                  <dd className="mt-0.5 flex items-start gap-1.5 text-foreground">
                    <BedDouble className="mt-0.5 h-3.5 w-3.5 text-muted-foreground" />
                    {(p.units ?? []).join(" • ") || "Varies"}
                  </dd>
                </div>
                {p.affordable != null && (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Affordable units
                    </dt>
                    <dd className="mt-0.5 flex items-start gap-1.5 text-foreground">
                      <Building2 className="mt-0.5 h-3.5 w-3.5 text-muted-foreground" />
                      {p.affordable}
                    </dd>
                  </div>
                )}
                {p.waitlist && (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Waitlist
                    </dt>
                    <dd className="mt-0.5 text-foreground">{p.waitlist}</dd>
                  </div>
                )}
                {p.likely && (
                  <div className="col-span-2">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Likelihood
                    </dt>
                    <dd className="mt-0.5 text-foreground">{p.likely}</dd>
                  </div>
                )}
              </dl>

              {p.insider && (
                <div className="rounded-xl border border-border bg-card p-3">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Insider tip
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {p.insider}
                  </p>
                </div>
              )}

              {p.updated_days != null && (
                <p className="text-xs text-muted-foreground">
                  Updated {p.updated_days} day{p.updated_days === 1 ? "" : "s"} ago
                </p>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
