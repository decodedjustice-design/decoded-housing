import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bookmark,
  BookmarkX,
  MapPin,
  Phone,
  Navigation,
  ShieldCheck,
  Search,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { ShelterDetailsDrawer } from "@/components/ShelterDetailsDrawer";

type Shelter = Tables<"shelters">;

const SAVED_KEY = "decoded-housing:saved-shelters";

function readSaved(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SAVED_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeSaved(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SAVED_KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

const TYPE_LABEL: Record<string, string> = {
  emergency_shelter: "Emergency Shelter",
  transitional: "Transitional Housing",
  supportive: "Supportive Housing",
};

export const Route = createFileRoute("/saved-shelters")({
  head: () => ({
    meta: [
      { title: "Saved Shelters — Decoded Housing" },
      {
        name: "description",
        content:
          "View, search, and manage shelters you've bookmarked on Decoded Housing.",
      },
    ],
  }),
  component: SavedSheltersPage,
});

function SavedSheltersPage() {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Shelter | null>(null);

  useEffect(() => {
    setSavedIds(readSaved());
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (savedIds.length === 0) {
      setShelters([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from("shelters")
      .select("*")
      .in("id", savedIds)
      .order("name", { ascending: true })
      .then(({ data, error: err }) => {
        if (cancelled) return;
        if (err) setError(err.message);
        else setShelters(data ?? []);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [savedIds]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return shelters;
    return shelters.filter((s) => {
      return (
        s.name?.toLowerCase().includes(q) ||
        s.organization?.toLowerCase().includes(q) ||
        s.city?.toLowerCase().includes(q) ||
        s.address?.toLowerCase().includes(q)
      );
    });
  }, [shelters, query]);

  const removeOne = (id: string) => {
    const next = savedIds.filter((x) => x !== id);
    setSavedIds(next);
    writeSaved(next);
  };

  const clearAll = () => {
    if (!window.confirm("Remove all saved shelters?")) return;
    setSavedIds([]);
    writeSaved([]);
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Saved Shelters
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Shelters you've bookmarked. Saved on this device only.
          </p>
        </div>
        {savedIds.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear all
          </button>
        )}
      </header>

      {savedIds.length > 0 && (
        <div className="mb-5 flex items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-[var(--shadow-soft)]">
          <Search className="ml-2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, organization, or city…"
            className="flex-1 bg-transparent px-1 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <span className="mr-2 text-xs text-muted-foreground">
            {loading ? "Loading…" : `${filtered.length} of ${shelters.length}`}
          </span>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          Couldn't load saved shelters: {error}
        </div>
      )}

      {!error && savedIds.length === 0 && (
        <EmptyState />
      )}

      {!error && savedIds.length > 0 && !loading && filtered.length === 0 && (
        <div className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
          No saved shelters match “{query}”.
        </div>
      )}

      {loading && savedIds.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: Math.min(savedIds.length, 4) }).map((_, i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-2xl border border-border bg-muted/40"
            />
          ))}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((s) => (
            <SavedCard
              key={s.id}
              s={s}
              onOpen={() => setSelected(s)}
              onRemove={() => removeOne(s.id)}
            />
          ))}
        </div>
      )}

      <ShelterDetailsDrawer
        shelter={selected}
        onClose={() => setSelected(null)}
        onSavedChange={(ids) => setSavedIds(ids)}
      />
    </main>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
      <Bookmark className="mx-auto h-10 w-10 text-muted-foreground" />
      <h2 className="mt-3 text-lg font-semibold text-foreground">
        No saved shelters yet
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Tap the bookmark on any shelter to save it here for later.
      </p>
      <Link
        to="/shelter"
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
      >
        <Search className="h-4 w-4" /> Browse shelters
      </Link>
    </div>
  );
}

function SavedCard({
  s,
  onOpen,
  onRemove,
}: {
  s: Shelter;
  onOpen: () => void;
  onRemove: () => void;
}) {
  const directionsUrl =
    s.address || s.city
      ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
          [s.address, s.city, "WA"].filter(Boolean).join(", "),
        )}`
      : null;

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
      <button
        type="button"
        onClick={onOpen}
        className="group -m-1 flex flex-col gap-3 rounded-xl p-1 text-left transition-colors hover:bg-muted/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
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
      </div>

      {(s.address || s.city) && (
        <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            {s.address ? `${s.address}, ` : ""}
            {s.city}
          </span>
        </div>
      )}

        <div className="flex items-center gap-1 pt-1 text-xs font-medium text-primary">
          <span>View details</span>
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </button>

      <div className="mt-auto grid grid-cols-2 gap-2">
        {s.phone ? (
          <a
            href={`tel:${s.phone.replace(/[^0-9+]/g, "")}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
          >
            <Phone className="h-3.5 w-3.5" /> Call
          </a>
        ) : (
          <button
            type="button"
            onClick={onOpen}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted"
          >
            View
          </button>
        )}
        {directionsUrl ? (
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted"
          >
            <Navigation className="h-3.5 w-3.5" /> Directions
          </a>
        ) : (
          <span className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-muted px-3 py-2 text-xs font-medium text-muted-foreground">
            No address
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
      >
        <BookmarkX className="h-3.5 w-3.5" /> Un-save
      </button>
    </article>
  );
}
