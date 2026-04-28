import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Ticket,
  ShieldCheck,
  Train,
  X,
  LayoutGrid,
  List as ListIcon,
  Clock,
  CheckCircle2,
  Phone,
  Globe,
  Users,
  BedDouble,
  Tag,
  ExternalLink,
} from "lucide-react";
import { useProperties, type Property } from "@/lib/useProperties";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

export const Route = createFileRoute("/search-v2")({
  head: () => ({
    meta: [
      { title: "Find Housing — Decoded Housing" },
      {
        name: "description",
        content:
          "Search affordable housing in King County. Filter by program, AMI, transit, vouchers, and more.",
      },
      { property: "og:title", content: "Find Housing — Decoded Housing" },
      {
        property: "og:description",
        content: "Search affordable housing in King County.",
      },
    ],
  }),
  component: SearchV2Page,
});

const PROGRAMS = ["ARCH", "MFTE", "Section 8", "LIHTC", "Transitional", "Shelter"] as const;
const CITIES = ["Bellevue", "Kirkland", "Redmond", "Issaquah", "Renton"] as const;
const AMI_LEVELS = [
  { label: "30% AMI — Very low income", value: 30 },
  { label: "50% AMI — Low income", value: 50 },
  { label: "60% AMI", value: 60 },
  { label: "80% AMI — Moderate", value: 80 },
  { label: "100% AMI", value: 100 },
  { label: "120% AMI", value: 120 },
];
const UNIT_SIZES = ["Studio", "1BR", "2BR", "3BR", "4BR+"];

const SORTS = [
  { value: "best", label: "Best match" },
  { value: "ami_asc", label: "Lowest AMI first" },
  { value: "transit", label: "Closest to transit" },
  { value: "verified", label: "Verified first" },
  { value: "recent", label: "Recently updated" },
] as const;

function programTagClass(t: string): string {
  const k = t.toLowerCase();
  if (k.includes("arch")) return "bg-[var(--sage-pale)] text-[var(--forest)]";
  if (k.includes("mfte")) return "bg-amber-100 text-amber-900";
  if (k.includes("section 8") || k.includes("s8")) return "bg-blue-100 text-blue-900";
  if (k.includes("trans")) return "bg-purple-100 text-purple-900";
  if (k.includes("shelter")) return "bg-rose-100 text-rose-900";
  if (k.includes("lihtc")) return "bg-teal-100 text-teal-900";
  return "bg-gray-100 text-gray-700 border border-gray-200";
}

function SearchV2Page() {
  const [search, setSearch] = useState("");
  const [activePrograms, setActivePrograms] = useState<string[]>([]);
  const [activeCities, setActiveCities] = useState<string[]>([]);
  const [voucher, setVoucher] = useState(false);
  const [verified, setVerified] = useState(false);
  const [transit, setTransit] = useState(false);
  const [sort, setSort] = useState<string>("best");
  const [view, setView] = useState<"grid" | "list">("list");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Property | null>(null);

  // advanced filters
  const [maxAmi, setMaxAmi] = useState<number | undefined>(undefined);
  const [bedrooms, setBedrooms] = useState<string[]>([]);

  const filters = useMemo(
    () => ({
      search,
      types: activePrograms,
      cities: activeCities,
      voucher,
      verified,
      transit,
      sort: sort === "best" ? undefined : sort,
      maxAmi,
      bedrooms,
    }),
    [search, activePrograms, activeCities, voucher, verified, transit, sort, maxAmi, bedrooms],
  );

  const { data: properties, loading } = useProperties(filters);

  function toggle<T>(arr: T[], v: T): T[] {
    return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
  }

  function resetAll() {
    setActivePrograms([]);
    setActiveCities([]);
    setVoucher(false);
    setVerified(false);
    setTransit(false);
    setMaxAmi(undefined);
    setBedrooms([]);
  }

  return (
    <div
      className="flex h-[calc(100vh-4rem)] flex-col overflow-hidden"
      style={{
        // local design tokens scoped to this page (mirrors the spec)
        ["--forest" as never]: "#1B4332",
        ["--forest-mid" as never]: "#2D6A4F",
        ["--sage" as never]: "#52B788",
        ["--sage-pale" as never]: "#D8F3DC",
        ["--sage-softer" as never]: "#EBF7EE",
        ["--warm-white" as never]: "#FDFCF9",
        ["--warm-off" as never]: "#F5F3EE",
        ["--warm-border" as never]: "#E8E4DC",
        ["--ink" as never]: "#1C1B18",
        ["--ink-mid" as never]: "#3D3B35",
        ["--muted" as never]: "#7C7868",
      }}
    >
      {/* Search bar row */}
      <div className="flex flex-shrink-0 items-center gap-3 border-b border-[var(--warm-border)] bg-white/95 px-5 py-3 backdrop-blur">
        <div className="flex h-10 flex-1 max-w-[520px] items-center gap-2 rounded-lg border-[1.5px] border-[var(--warm-border)] bg-white px-3 focus-within:border-[var(--sage)]">
          <Search className="h-4 w-4 text-[var(--muted)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, city, or address…"
            className="flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
          />
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs text-[var(--muted)]">
          <Link to="/search" className="rounded px-2 py-1 hover:bg-[var(--warm-off)]">
            ← Back to classic search
          </Link>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex flex-shrink-0 items-center gap-2 overflow-x-auto border-b border-[var(--warm-border)] bg-white px-5 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {PROGRAMS.map((p) => (
          <Pill
            key={p}
            active={activePrograms.includes(p)}
            onClick={() => setActivePrograms((a) => toggle(a, p))}
          >
            {p}
          </Pill>
        ))}
        <Divider />
        {CITIES.map((c) => (
          <Pill
            key={c}
            active={activeCities.includes(c)}
            onClick={() => setActiveCities((a) => toggle(a, c))}
          >
            <MapPin className="h-3 w-3" /> {c}
          </Pill>
        ))}
        <Divider />
        <Pill onClick={() => setFiltersOpen(true)}>
          <SlidersHorizontal className="h-3 w-3" /> More filters
        </Pill>
        <Pill active={voucher} onClick={() => setVoucher((v) => !v)}>
          <Ticket className="h-3 w-3" /> Accepts vouchers
        </Pill>
        <Pill active={verified} onClick={() => setVerified((v) => !v)}>
          <ShieldCheck className="h-3 w-3" /> Verified only
        </Pill>
        <Pill active={transit} onClick={() => setTransit((v) => !v)}>
          <Train className="h-3 w-3" /> Near light rail
        </Pill>
        <span className="ml-auto whitespace-nowrap font-mono text-[11px] text-[var(--muted)]">
          {loading ? "Loading…" : `Showing ${properties.length} properties`}
        </span>
      </div>

      {/* Main split */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Results panel */}
        <div className="flex w-full flex-shrink-0 flex-col overflow-y-auto border-r border-[var(--warm-border)] bg-[var(--warm-white)] md:w-[480px]">
          <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-[var(--warm-border)] bg-white px-5 py-3">
            <div className="text-[13px] font-bold text-[var(--ink)]">
              <span className="font-mono text-[var(--forest)]">{properties.length}</span>{" "}
              properties found
            </div>
            <div className="flex items-center gap-2">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="cursor-pointer rounded-md border-[1.5px] border-[var(--warm-border)] bg-white px-2.5 py-1 text-xs font-semibold text-[var(--muted)] outline-none focus:border-[var(--sage)]"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <div className="flex overflow-hidden rounded-md border-[1.5px] border-[var(--warm-border)]">
                <button
                  onClick={() => setView("list")}
                  className={`flex h-7 w-8 items-center justify-center ${view === "list" ? "bg-[var(--forest)] text-white" : "bg-white text-[var(--muted)]"}`}
                  aria-label="List view"
                >
                  <ListIcon className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setView("grid")}
                  className={`flex h-7 w-8 items-center justify-center ${view === "grid" ? "bg-[var(--forest)] text-white" : "bg-white text-[var(--muted)]"}`}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className={`flex flex-col gap-2.5 p-3 ${view === "grid" ? "md:grid md:grid-cols-2" : ""}`}>
            {!loading && properties.length === 0 && (
              <div className="px-6 py-12 text-center text-[var(--muted)]">
                <h3 className="mb-1.5 text-base font-bold text-[var(--ink)]">No properties match</h3>
                <p className="text-[13px] leading-relaxed">
                  Try removing filters or expanding your search area.
                </p>
                <button
                  onClick={resetAll}
                  className="mt-3 rounded-md border border-[var(--warm-border)] px-3 py-1.5 text-xs font-semibold text-[var(--forest)] hover:border-[var(--forest)]"
                >
                  Reset filters
                </button>
              </div>
            )}
            {properties.map((p) => (
              <PropCard
                key={p.id}
                p={p}
                horizontal={view === "list"}
                highlighted={highlightId === p.id}
                onHover={() => setHighlightId(p.id)}
                onSelect={() => setSelected(p)}
              />
            ))}
          </div>
        </div>

        {/* Map panel */}
        <div className="hidden flex-1 items-center justify-center overflow-hidden bg-[var(--sage-softer)] md:flex">
          <FakeMap
            pins={properties.slice(0, 12)}
            highlightId={highlightId}
            onPinHover={setHighlightId}
          />
        </div>
      </div>

      {/* Filter overlay */}
      {filtersOpen && (
        <div
          className="fixed inset-0 z-[300] flex items-start justify-center bg-black/40 pt-20"
          onClick={() => setFiltersOpen(false)}
        >
          <div
            className="max-h-[80vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-7 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-[var(--ink)]">All Filters</h2>
              <button
                onClick={() => setFiltersOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--warm-off)] text-[var(--muted)] hover:bg-[var(--warm-border)]"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <FilterSection title="AMI Level (income limit)">
              <div className="flex flex-wrap gap-1.5">
                <FChip active={maxAmi === undefined} onClick={() => setMaxAmi(undefined)}>
                  Any
                </FChip>
                {AMI_LEVELS.map((a) => (
                  <FChip
                    key={a.value}
                    active={maxAmi === a.value}
                    onClick={() => setMaxAmi(a.value)}
                  >
                    {a.label}
                  </FChip>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Unit size">
              <div className="flex flex-wrap gap-1.5">
                {UNIT_SIZES.map((u) => (
                  <FChip
                    key={u}
                    active={bedrooms.includes(u)}
                    onClick={() => setBedrooms((b) => toggle(b, u))}
                  >
                    {u}
                  </FChip>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Quick toggles">
              <div className="flex flex-wrap gap-1.5">
                <FChip active={voucher} onClick={() => setVoucher((v) => !v)}>
                  🎫 Accepts vouchers
                </FChip>
                <FChip active={verified} onClick={() => setVerified((v) => !v)}>
                  ✓ Verified only
                </FChip>
                <FChip active={transit} onClick={() => setTransit((v) => !v)}>
                  🚆 Near light rail
                </FChip>
              </div>
            </FilterSection>

            <div className="mt-2 flex gap-2.5">
              <button
                onClick={resetAll}
                className="rounded-lg border-[1.5px] border-[var(--warm-border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--muted)] hover:border-[var(--forest)] hover:text-[var(--forest)]"
              >
                Reset all
              </button>
              <button
                onClick={() => setFiltersOpen(false)}
                className="flex-1 rounded-lg bg-[var(--forest)] px-3 py-3 text-sm font-bold text-white hover:bg-[var(--forest-mid)]"
              >
                Show {properties.length} results
              </button>
            </div>
          </div>
        </div>
      )}

      <PropertyDrawer property={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function Pill({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex flex-shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border-[1.5px] px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
        active
          ? "border-[var(--forest)] bg-[var(--sage-pale)] text-[var(--forest)]"
          : "border-[var(--warm-border)] bg-white text-[var(--ink-mid)] hover:border-[var(--sage)] hover:bg-[var(--sage-softer)] hover:text-[var(--forest)]"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="mx-1 h-6 w-px flex-shrink-0 bg-[var(--warm-border)]" />;
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="mb-2.5 text-[13px] font-bold text-[var(--ink)]">{title}</h3>
      {children}
    </div>
  );
}

function FChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer rounded-full border-[1.5px] px-3.5 py-1.5 text-xs font-semibold transition-colors ${
        active
          ? "border-[var(--forest)] bg-[var(--sage-pale)] text-[var(--forest)]"
          : "border-[var(--warm-border)] bg-white text-[var(--ink-mid)] hover:border-[var(--sage)] hover:bg-[var(--sage-softer)] hover:text-[var(--forest)]"
      }`}
    >
      {children}
    </button>
  );
}

function PropCard({
  p,
  horizontal,
  highlighted,
  onHover,
  onSelect,
}: {
  p: Property;
  horizontal: boolean;
  highlighted: boolean;
  onHover: () => void;
  onSelect: () => void;
}) {
  const tags = (p.types ?? []).slice(0, 4);
  return (
    <div
      onMouseEnter={onHover}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`group flex cursor-pointer overflow-hidden rounded-xl border-[1.5px] bg-white transition-all ${
        horizontal ? "flex-row" : "flex-col"
      } ${highlighted ? "border-[var(--forest)] shadow-[0_0_0_3px_rgba(27,67,50,0.1)]" : "border-[var(--warm-border)] hover:-translate-y-px hover:border-[var(--sage)] hover:shadow-[0_6px_24px_rgba(27,67,50,0.09)]"}`}
    >
      <div
        className={`relative overflow-hidden bg-[var(--sage-softer)] ${horizontal ? "h-auto w-[140px] flex-shrink-0" : "h-[150px]"}`}
      >
        {p.image_url ? (
          <img
            src={p.image_url}
            alt={p.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--sage)]">
            <MapPin className="h-8 w-8" />
          </div>
        )}
        <div className="absolute left-2 right-2 top-2 flex items-start justify-between">
          {p.verified && (
            <span className="flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[var(--forest)] shadow">
              <CheckCircle2 className="h-2.5 w-2.5" /> Verified
            </span>
          )}
          {p.likely?.toLowerCase().includes("urgent") && (
            <span className="ml-auto rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white">
              Urgent
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="mb-1.5 flex flex-wrap gap-1">
          {tags.map((t) => (
            <span
              key={t}
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${programTagClass(t)}`}
            >
              {t}
            </span>
          ))}
        </div>
        <h3 className="font-serif text-[15px] font-semibold leading-tight text-[var(--ink)]">
          {p.name}
        </h3>
        <div className="mt-1 flex items-center gap-1 text-xs text-[var(--muted)]">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{p.address ?? p.city}</span>
        </div>

        <div className="mt-2 flex flex-wrap gap-3 text-[11px]">
          {p.ami?.length ? (
            <Meta label="AMI" value={p.ami.slice(0, 2).join(", ")} />
          ) : null}
          {p.units?.length ? (
            <Meta label="Units" value={p.units.slice(0, 3).join(", ")} />
          ) : null}
          {p.affordable ? <Meta label="Affordable" value={`${p.affordable}`} /> : null}
        </div>

        {p.insider && (
          <div className="mt-2 flex gap-1.5 rounded-r-md border-l-[3px] border-amber-600 bg-amber-50 px-2.5 py-1.5 text-[11px] leading-relaxed text-amber-900">
            <span>💡</span>
            <span>{p.insider}</span>
          </div>
        )}

        <div className="mt-2 flex flex-wrap items-center justify-between gap-1.5 border-t border-[var(--warm-off)] pt-2">
          {p.transit_label || p.transit_distance != null ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-900">
              <Train className="h-3 w-3" />
              {p.transit_label ?? `${p.transit_distance} mi`}
            </span>
          ) : (
            <span />
          )}
          {p.updated_days != null && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--sage)]">
              <Clock className="h-3 w-3" /> {p.updated_days}d ago
            </span>
          )}
          {p.waitlist && (
            <span className="text-[11px] text-[var(--muted)]">Waitlist: {p.waitlist}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="block font-semibold text-[var(--muted)]">{label}</span>
      <span className="font-mono text-[12px] font-medium text-[var(--forest)]">{value}</span>
    </div>
  );
}

function FakeMap({
  pins,
  highlightId,
  onPinHover,
}: {
  pins: Property[];
  highlightId: string | null;
  onPinHover: (id: string) => void;
}) {
  // deterministic pseudo positions
  const positioned = pins.map((p, i) => {
    const seed = (p.id?.charCodeAt(0) ?? i * 17) + i * 37;
    const left = 10 + ((seed * 7) % 80);
    const top = 12 + ((seed * 13) % 70);
    return { p, left, top };
  });

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#EDF4ED]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(82,183,136,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(82,183,136,0.08) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* fake roads */}
      <div className="absolute left-0 right-0 top-1/3 h-1.5 bg-white/60" />
      <div className="absolute bottom-1/4 left-0 right-0 h-1 bg-white/60" />
      <div className="absolute bottom-0 left-1/2 top-0 w-1.5 bg-white/60" />
      {/* waterway */}
      <div className="absolute left-[10%] top-[60%] h-12 w-40 rotate-[-8deg] rounded bg-blue-200/50" />

      {positioned.map(({ p, left, top }) => {
        const active = highlightId === p.id;
        return (
          <button
            key={p.id}
            onMouseEnter={() => onPinHover(p.id)}
            className="absolute"
            style={{ left: `${left}%`, top: `${top}%` }}
          >
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-[50%_50%_50%_0] shadow-md transition-transform ${
                active
                  ? "scale-125 bg-amber-600"
                  : "bg-[var(--forest)] hover:scale-110 hover:bg-amber-600"
              }`}
              style={{ transform: `rotate(-45deg) ${active ? "scale(1.2)" : ""}` }}
            >
              <span className="block h-3 w-3 rounded-full bg-white" />
            </span>
          </button>
        );
      })}

      <div className="absolute bottom-5 left-5 rounded-xl border border-[var(--warm-border)] bg-white px-3.5 py-3 shadow-md">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
          Housing type
        </div>
        {[
          { c: "#1B4332", l: "ARCH / MFTE" },
          { c: "#2563EB", l: "Section 8" },
          { c: "#7C3AED", l: "Transitional" },
          { c: "#DC2626", l: "Shelter" },
        ].map((x) => (
          <div
            key={x.l}
            className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-[var(--ink-mid)]"
          >
            <span
              className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
              style={{ background: x.c }}
            />
            {x.l}
          </div>
        ))}
      </div>

      <div className="absolute bottom-5 right-5 flex flex-col gap-1">
        <button className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--warm-border)] bg-white text-lg font-bold shadow hover:bg-[var(--sage-pale)]">
          +
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--warm-border)] bg-white text-lg font-bold shadow hover:bg-[var(--sage-pale)]">
          −
        </button>
      </div>
    </div>
  );
}