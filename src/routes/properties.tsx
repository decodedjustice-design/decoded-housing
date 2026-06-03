import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BedDouble,
  Building2,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  Filter,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Train,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PropertiesMap } from "@/components/PropertiesMap";
import { useProperties } from "@/hooks/use-properties";

export const Route = createFileRoute("/properties")({
  head: () => ({
    meta: [
      { title: "Property Tracker — Decoded Housing" },
      {
        name: "description",
        content:
          "Search King County affordable housing properties, ARCH, MFTE, voucher-friendly options, waitlist signals, contact steps, and application guidance.",
      },
    ],
  }),
  component: PropertiesPage,
});

function initialQuery() {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("q") ?? "";
}

function PropertiesPage() {
  const [q, setQ] = useState(initialQuery);
  const [city, setCity] = useState("all");
  const [program, setProgram] = useState("all");
  const [bedroom, setBedroom] = useState("all");
  const [voucherOnly, setVoucherOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [transitOnly, setTransitOnly] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filters = useMemo(
    () => ({
      search: q,
      cities: city === "all" ? undefined : [city],
      voucher: voucherOnly,
      verified: verifiedOnly,
      transit: transitOnly,
      sort: "verified",
    }),
    [city, q, transitOnly, verifiedOnly, voucherOnly],
  );
  const { data, loading, error, totalLoaded, source } = useProperties(filters);

  const filtered = useMemo(() => {
    return data.filter((property) => {
      if (program !== "all" && !property.types?.some((type) => type.toLowerCase().includes(program))) return false;
      if (bedroom !== "all" && !property.units?.some((unit) => unit.toLowerCase().includes(bedroom))) return false;
      return true;
    });
  }, [bedroom, data, program]);

  const cities = useMemo(() => ["all", ...Array.from(new Set(data.map((p) => p.city).filter(Boolean) as string[])).sort()], [data]);
  const selected = filtered.find((property) => property.id === selectedId) ?? filtered[0] ?? null;
  const verifiedCount = filtered.filter((property) => property.verified).length;
  const voucherCount = filtered.filter((property) => property.voucher).length;
  const waitlistCount = filtered.filter((property) => Boolean(property.waitlist)).length;

  return (
    <main className="bg-[var(--gradient-soft)]">
      <section className="border-b border-border bg-card/80 px-4 py-10 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.55fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              <Building2 className="h-4 w-4" /> Affordable Housing Availability Tracker
            </div>
            <h1 className="mt-5 font-display text-5xl leading-tight text-foreground sm:text-6xl">Search properties with an application plan attached.</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
              This tracker recreates the strongest pattern from the Manus properties page: a searchable availability workspace. Decoded Housing extends it with ARCH/MFTE context, eligibility prompts, documents, call scripts, and backup pathways.
            </p>
          </div>
          <aside className="rounded-[2rem] border border-border bg-background p-5 shadow-[var(--shadow-card)]">
            <h2 className="text-lg font-semibold">Current dataset</h2>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-muted p-4"><dt className="text-muted-foreground">Loaded</dt><dd className="mt-1 text-2xl font-bold">{totalLoaded}</dd></div>
              <div className="rounded-2xl bg-muted p-4"><dt className="text-muted-foreground">Matching</dt><dd className="mt-1 text-2xl font-bold">{filtered.length}</dd></div>
              <div className="rounded-2xl bg-muted p-4"><dt className="text-muted-foreground">Verified</dt><dd className="mt-1 text-2xl font-bold">{verifiedCount}</dd></div>
              <div className="rounded-2xl bg-muted p-4"><dt className="text-muted-foreground">Voucher</dt><dd className="mt-1 text-2xl font-bold">{voucherCount}</dd></div>
            </dl>
            <p className="mt-3 text-xs text-muted-foreground">Source: {source === "supabase" ? "Supabase properties table" : source === "static" ? "static enriched property file" : "loading"}</p>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="rounded-[2rem] border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <div className="grid gap-3 lg:grid-cols-[1.4fr_repeat(3,0.75fr)]">
            <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-input bg-background px-4">
              <Search className="h-5 w-5 text-muted-foreground" />
              <span className="sr-only">Search properties</span>
              <input value={q} onChange={(event) => setQ(event.target.value)} className="w-full bg-transparent text-sm outline-none" placeholder="Search property, city, address, or program" />
            </label>
            <label className="sr-only" htmlFor="city-filter">City</label>
            <select id="city-filter" className="rounded-2xl border border-input bg-background px-3 py-3 text-sm" value={city} onChange={(event) => setCity(event.target.value)}>
              {cities.map((item) => <option key={item} value={item}>{item === "all" ? "All cities" : item}</option>)}
            </select>
            <label className="sr-only" htmlFor="program-filter">Program</label>
            <select id="program-filter" className="rounded-2xl border border-input bg-background px-3 py-3 text-sm" value={program} onChange={(event) => setProgram(event.target.value)}>
              <option value="all">All programs</option>
              <option value="arch">ARCH</option>
              <option value="mfte">MFTE</option>
              <option value="section 8">Section 8</option>
              <option value="tax credit">Tax Credit</option>
              <option value="public housing">Public Housing</option>
            </select>
            <label className="sr-only" htmlFor="bedroom-filter">Bedroom</label>
            <select id="bedroom-filter" className="rounded-2xl border border-input bg-background px-3 py-3 text-sm" value={bedroom} onChange={(event) => setBedroom(event.target.value)}>
              <option value="all">All bedroom sizes</option>
              <option value="studio">Studio</option>
              <option value="1br">1BR</option>
              <option value="2br">2BR</option>
              <option value="3br">3BR+</option>
            </select>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Filter className="mt-1 h-4 w-4 text-muted-foreground" />
            {[{ label: "Voucher-friendly", value: voucherOnly, set: setVoucherOnly }, { label: "Verified only", value: verifiedOnly, set: setVerifiedOnly }, { label: "Near frequent transit", value: transitOnly, set: setTransitOnly }].map((item) => (
              <label key={item.label} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 font-medium">
                <input type="checkbox" checked={item.value} onChange={(event) => item.set(event.target.checked)} /> {item.label}
              </label>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Metric icon={ShieldCheck} label="Verified" value={verifiedCount} />
            <Metric icon={ClipboardList} label="Waitlist signal" value={waitlistCount} />
            <Metric icon={Train} label="Voucher fit" value={voucherCount} />
          </div>
          <div className="h-[360px] overflow-hidden rounded-[2rem] border border-border bg-card p-2 shadow-[var(--shadow-card)] lg:h-[520px]">
            <PropertiesMap properties={filtered} selectedId={selected?.id ?? null} onSelect={setSelectedId} />
          </div>
        </div>

        <div className="rounded-[2rem] border border-border bg-card p-3 shadow-[var(--shadow-card)]">
          {loading && <p className="p-5 text-sm text-muted-foreground">Loading property records...</p>}
          {!loading && error && <div className="m-2 rounded-2xl border border-warning/40 bg-warning/15 p-4 text-sm"><strong>Data notice:</strong> {error}</div>}
          {!loading && filtered.length === 0 && <div className="editorial-empty-state"><AlertTriangle className="mx-auto h-8 w-8 text-muted-foreground" /><h2 className="mt-3 text-lg font-semibold">No matches with those filters.</h2><p className="mt-1 text-sm text-muted-foreground">Remove one filter or open the navigator for alternate routes.</p></div>}
          <div className="max-h-[720px] space-y-3 overflow-y-auto pr-1">
            {filtered.map((property) => (
              <article key={property.id} className={`rounded-3xl border p-4 transition ${selected?.id === property.id ? "border-primary bg-primary/5" : "border-border bg-background"}`}>
                <button className="w-full text-left" onClick={() => setSelectedId(property.id)}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">{property.name}</h2>
                      <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-4 w-4" /> {property.address || property.city || "Address not published"}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${property.verified ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{property.verified ? "Verified" : "Needs verification"}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(property.types ?? []).map((type) => <span key={type} className="rounded-full bg-accent/60 px-2.5 py-1 text-xs font-semibold text-accent-foreground">{type}</span>)}
                    {(property.ami ?? []).map((ami) => <span key={ami} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{ami}</span>)}
                  </div>
                  <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
                    <Info icon={BedDouble} label="Units" value={property.units?.length ? property.units.join(", ") : "Call for unit mix"} />
                    <Info icon={ClipboardList} label="Waitlist" value={property.waitlist ? "Published/open signal" : "Call to confirm"} />
                    <Info icon={Train} label="Transit" value={property.transit_label || property.transit_station || "Transit details pending"} />
                  </div>
                </button>
                {selected?.id === property.id && (
                  <div className="mt-4 rounded-2xl border border-border bg-card p-4 text-sm">
                    <p className="font-semibold">Recommended next call</p>
                    <p className="mt-1 text-muted-foreground">Ask for current availability, income-restricted unit openings, waitlist steps, required documents, screening criteria, and voucher acceptance if relevant.</p>
                    {property.insider && <p className="mt-2 text-muted-foreground"><strong className="text-foreground">Property note:</strong> {property.insider}</p>}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {property.phone && <a href={`tel:${property.phone}`} className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-2 font-semibold text-primary-foreground"><Phone className="h-4 w-4" /> Call</a>}
                      {property.website && <a href={property.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 font-semibold"><ExternalLink className="h-4 w-4" /> Website</a>}
                      <Link to="/phone-scripts" className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 font-semibold">Open script <ArrowRight className="h-4 w-4" /></Link>
                      <Link to="/housing/documents" className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 font-semibold">Documents checklist</Link>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: number }) {
  return <div className="rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"><Icon className="h-5 w-5 text-primary" /><div className="mt-2 text-2xl font-bold">{value}</div><div className="text-xs text-muted-foreground">{label}</div></div>;
}

function Info({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return <div className="rounded-2xl bg-muted p-3"><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground"><Icon className="h-3.5 w-3.5" /> {label}</div><div className="mt-1 font-medium text-foreground">{value}</div></div>;
}
