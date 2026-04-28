import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Phone, MapPin, Clock, AlertTriangle, ShieldCheck, Users, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Shelter = Tables<"shelters">;

export const Route = createFileRoute("/shelter")({
  head: () => ({
    meta: [
      { title: "Shelter Finder — Decoded Housing" },
      {
        name: "description",
        content:
          "Find emergency shelter, transitional housing, and supportive housing across King County. Verified intake info, barrier level, and realistic availability.",
      },
    ],
  }),
  component: ShelterPage,
});

const TYPE_LABEL: Record<string, string> = {
  emergency_shelter: "Emergency Shelter",
  transitional: "Transitional Housing",
  supportive: "Supportive Housing",
};

const POPULATIONS = ["families", "women", "men", "youth", "veterans", "lgbtq", "general"];

const AVAIL_STYLE: Record<string, string> = {
  sometimes_open: "bg-primary/10 text-primary border-primary/30",
  usually_full: "bg-destructive/10 text-destructive border-destructive/30",
  delayed: "bg-muted text-muted-foreground border-border",
  unknown: "bg-muted text-muted-foreground border-border",
};

const AVAIL_LABEL: Record<string, string> = {
  sometimes_open: "Sometimes open",
  usually_full: "Usually full",
  delayed: "Waitlist / delayed",
  unknown: "Unknown",
};

const BARRIER_STYLE: Record<string, string> = {
  low: "bg-primary/10 text-primary",
  medium: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  high: "bg-destructive/10 text-destructive",
};

function ShelterPage() {
  const [data, setData] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [type, setType] = useState<string>("all");
  const [city, setCity] = useState<string>("all");
  const [population, setPopulation] = useState<string>("all");
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [lowBarrierOnly, setLowBarrierOnly] = useState(false);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("shelters")
      .select("*")
      .order("name", { ascending: true })
      .then(({ data: rows, error: err }) => {
        if (cancelled) return;
        if (err) setError(err.message);
        else setData(rows ?? []);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const cities = useMemo(() => {
    const set = new Set<string>();
    data.forEach((s) => s.city && set.add(s.city));
    return Array.from(set).sort();
  }, [data]);

  const filtered = useMemo(() => {
    return data.filter((s) => {
      if (type !== "all" && s.type !== type) return false;
      if (city !== "all" && s.city !== city) return false;
      if (population !== "all" && !(s.population ?? []).includes(population)) return false;
      if (openNowOnly && s.realistic_availability !== "sometimes_open") return false;
      if (lowBarrierOnly && s.barrier_level !== "low") return false;
      return true;
    });
  }, [data, type, city, population, openNowOnly, lowBarrierOnly]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Shelter Finder
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Verified King County shelter, transitional, and supportive housing programs. Real intake
          info — call ahead, most fill quickly.
        </p>
      </header>

      {/* Filters */}
      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-soft)] sm:flex-row sm:flex-wrap sm:items-center">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground"
        >
          <option value="all">All types</option>
          <option value="emergency_shelter">Emergency Shelter</option>
          <option value="transitional">Transitional</option>
          <option value="supportive">Supportive</option>
        </select>

        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground"
        >
          <option value="all">All cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={population}
          onChange={(e) => setPopulation(e.target.value)}
          className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground"
        >
          <option value="all">Anyone</option>
          {POPULATIONS.map((p) => (
            <option key={p} value={p}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </option>
          ))}
        </select>

        <button
          onClick={() => setOpenNowOnly((v) => !v)}
          className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
            openNowOnly
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-background text-foreground hover:bg-muted"
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          Open / availability
        </button>

        <button
          onClick={() => setLowBarrierOnly((v) => !v)}
          className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
            lowBarrierOnly
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-background text-foreground hover:bg-muted"
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          Low barrier
        </button>

        <p className="ml-auto text-xs text-muted-foreground">
          {loading ? "Loading…" : `${filtered.length} of ${data.length} programs`}
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          Couldn’t load shelters: {error}
        </div>
      )}

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl border border-border bg-muted/40" />
          ))}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
          No shelters match these filters. Try clearing some filters.
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((s) => (
            <ShelterCard key={s.id} s={s} />
          ))}
        </div>
      )}

      <p className="mt-8 text-center text-xs text-muted-foreground">
        In crisis? Dial <a className="font-semibold text-primary" href="tel:211">211</a> or the
        Mary's Place family hotline at{" "}
        <a className="font-semibold text-primary" href="tel:2066218474">206-621-8474</a>.
      </p>
    </main>
  );
}

function ShelterCard({ s }: { s: Shelter }) {
  const avail = s.realistic_availability ?? "unknown";
  const barrier = s.barrier_level ?? "medium";
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-foreground">{s.name}</h2>
          {s.organization && (
            <p className="text-xs text-muted-foreground">{s.organization}</p>
          )}
        </div>
        {s.verified && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
            <ShieldCheck className="h-3 w-3" /> Verified
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 text-[11px]">
        <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-foreground">
          {TYPE_LABEL[s.type] ?? s.type}
        </span>
        <span className={`rounded-full border px-2 py-0.5 font-medium ${AVAIL_STYLE[avail]}`}>
          {AVAIL_LABEL[avail]}
        </span>
        <span className={`rounded-full px-2 py-0.5 font-medium ${BARRIER_STYLE[barrier] ?? ""}`}>
          {barrier} barrier
        </span>
        {s.intake && (
          <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-foreground">
            Intake: {s.intake.replace("_", " ")}
          </span>
        )}
      </div>

      {(s.population ?? []).length > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          {(s.population ?? []).join(", ")}
        </div>
      )}

      {(s.address || s.city) && (
        <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            {s.address ? `${s.address}, ` : ""}
            {s.city}
          </span>
        </div>
      )}

      {s.access_notes && (
        <p className="text-xs leading-relaxed text-foreground/80">{s.access_notes}</p>
      )}

      {s.backup_option && (
        <p className="flex items-start gap-1.5 rounded-lg bg-muted/60 p-2 text-[11px] text-muted-foreground">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            <span className="font-semibold text-foreground">Backup: </span>
            {s.backup_option}
          </span>
        </p>
      )}

      {s.phone && (
        <a
          href={`tel:${s.phone.replace(/[^0-9+]/g, "")}`}
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <Phone className="h-4 w-4" />
          Call {s.phone}
          <ExternalLink className="h-3 w-3 opacity-70" />
        </a>
      )}
    </article>
  );
}
