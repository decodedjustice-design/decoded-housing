import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ShieldCheck, ShieldAlert, BedDouble, Home, Building2, Phone, Mail, ExternalLink } from "lucide-react";
import { useProperties } from "@/lib/useProperties";
import { PropertiesMap } from "@/components/PropertiesMap";

export const Route = createFileRoute("/housing-shelter")({ component: HousingShelterPage });

type HousingType = "all" | "apartment" | "shelter" | "transitional";
type ProgramType = "all" | "affordable" | "voucher-friendly" | "rapid-rehousing";
type Urgency = "all" | "tonight" | "soon";

function HousingShelterPage() {
  const [q, setQ] = useState("");
  const [housingType, setHousingType] = useState<HousingType>("all");
  const [programType, setProgramType] = useState<ProgramType>("all");
  const [city, setCity] = useState("all");
  const [unitSize, setUnitSize] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [voucherFriendly, setVoucherFriendly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [accessibility, setAccessibility] = useState(false);
  const [pets, setPets] = useState(false);
  const [shelterUrgency, setShelterUrgency] = useState<Urgency>("all");
  const [householdFit, setHouseholdFit] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, loading } = useProperties({ search: q });

  const decorated = useMemo(() => data.map((p) => {
    const isShelter = p.types?.some((type) => /shelter|emergency/i.test(type)) ?? false;
    const isTransitional = p.types?.some((type) => /transitional|supportive/i.test(type)) ?? false;
    const isApartment = !isShelter && !isTransitional;
    const badges = [
      isShelter ? "Shelter" : null,
      isTransitional ? "Transitional" : null,
      isApartment ? "Apartment" : null,
      p.voucher ? "Voucher-Friendly" : null,
      p.verified ? "Verified" : "Community Source",
    ].filter(Boolean) as string[];

    return {
      ...p,
      isShelter,
      isTransitional,
      isApartment,
      badges,
      programLabel: p.voucher ? "Voucher-Friendly" : "General Affordable",
      freshness: p.updated_days === null ? "Last updated unknown" : `Updated ${p.updated_days} days ago`,
      waitlistStatus: p.waitlist || (isShelter ? "Call for same-day bed status" : "Waitlist status not published"),
      unitMatrix: p.units?.length ? p.units : isShelter ? ["Bed", "Shared room"] : ["Studio", "1-bedroom", "2-bedroom"],
      amenities: [accessibility ? "Accessibility features" : null, pets ? "Pet / service animal support" : null, "Transit access", "Onsite support"].filter(Boolean) as string[],
      email: `${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "")}@housinghelp.org`,
      photos: p.photos?.length ? p.photos.slice(0, 3) : ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200", "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200"],
    };
  }), [data, accessibility, pets]);

  const cities = useMemo(() => ["all", ...new Set(decorated.map((p) => p.city).filter(Boolean) as string[])], [decorated]);

  const filtered = useMemo(() => decorated.filter((p) => {
    if (housingType === "shelter" && !p.isShelter) return false;
    if (housingType === "transitional" && !p.isTransitional) return false;
    if (housingType === "apartment" && !p.isApartment) return false;
    if (programType === "voucher-friendly" && !p.voucher) return false;
    if (city !== "all" && p.city !== city) return false;
    if (unitSize !== "all" && !p.unitMatrix.some((u) => u.toLowerCase().includes(unitSize))) return false;
    if (priceRange === "under1200" && (p.affordable ?? 5000) > 1200) return false;
    if (priceRange === "1200to1800" && ((p.affordable ?? 0) < 1200 || (p.affordable ?? 0) > 1800)) return false;
    if (voucherFriendly && !p.voucher) return false;
    if (verifiedOnly && !p.verified) return false;
    if (shelterUrgency === "tonight" && !p.isShelter) return false;
    if (householdFit === "family" && !p.unitMatrix.some((u) => /2|3|family/i.test(u))) return false;
    return true;
  }), [decorated, housingType, programType, city, unitSize, priceRange, voucherFriendly, verifiedOnly, shelterUrgency, householdFit]);

  const selected = filtered.find((p) => p.id === selectedId) ?? filtered[0] ?? null;

  return <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
    <h1 className="font-display text-4xl">Housing & Shelter Discovery Engine</h1>
    <p className="mt-2 text-muted-foreground">One canonical discovery route for apartments, transitional programs, and urgent shelter tonight options.</p>

    <section className="mt-6 grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-4">
      <input className="rounded-md border border-input px-3 py-2" placeholder="Search property, program, city" value={q} onChange={(e)=>setQ(e.target.value)} />
      <select className="rounded-md border border-input px-3 py-2" value={housingType} onChange={(e) => setHousingType(e.target.value as HousingType)}><option value="all">All housing types</option><option value="apartment">Apartment-style</option><option value="transitional">Transitional</option><option value="shelter">Shelter</option></select>
      <select className="rounded-md border border-input px-3 py-2" value={programType} onChange={(e) => setProgramType(e.target.value as ProgramType)}><option value="all">All program types</option><option value="affordable">Affordable</option><option value="voucher-friendly">Voucher-friendly</option><option value="rapid-rehousing">Rapid rehousing</option></select>
      <select className="rounded-md border border-input px-3 py-2" value={city} onChange={(e) => setCity(e.target.value)}>{cities.map((c) => <option key={c} value={c}>{c === "all" ? "All cities" : c}</option>)}</select>
      <select className="rounded-md border border-input px-3 py-2" value={unitSize} onChange={(e) => setUnitSize(e.target.value)}><option value="all">All unit sizes</option><option value="studio">Studio</option><option value="1">1 bedroom</option><option value="2">2 bedroom</option><option value="3">3 bedroom</option><option value="bed">Shelter bed</option></select>
      <select className="rounded-md border border-input px-3 py-2" value={priceRange} onChange={(e) => setPriceRange(e.target.value)}><option value="all">All prices</option><option value="under1200">Under $1,200</option><option value="1200to1800">$1,200 - $1,800</option></select>
      <select className="rounded-md border border-input px-3 py-2" value={shelterUrgency} onChange={(e) => setShelterUrgency(e.target.value as Urgency)}><option value="all">All urgency levels</option><option value="tonight">Need shelter tonight</option><option value="soon">Need placement soon</option></select>
      <select className="rounded-md border border-input px-3 py-2" value={householdFit} onChange={(e) => setHouseholdFit(e.target.value)}><option value="all">All household fits</option><option value="single">Single adult</option><option value="family">Family-sized</option></select>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={voucherFriendly} onChange={(e)=>setVoucherFriendly(e.target.checked)} /> Voucher-friendly</label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={verifiedOnly} onChange={(e)=>setVerifiedOnly(e.target.checked)} /> Verified only</label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={accessibility} onChange={(e)=>setAccessibility(e.target.checked)} /> Accessibility</label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={pets} onChange={(e)=>setPets(e.target.checked)} /> Pets / service animal</label>
    </section>

    {shelterUrgency === "tonight" && <section className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm">
      <p className="font-semibold">Urgent routing: Need shelter tonight.</p>
      <p className="mt-1">Call first for bed status and ask about overflow, walk-in times, and family alternatives.</p>
      <Link to="/shelter/tonight" className="mt-2 inline-block font-semibold text-primary">Open tonight shelter workflow →</Link>
    </section>}

    <section className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
      <div className="h-[420px]"><PropertiesMap properties={filtered} selectedId={selected?.id ?? null} onSelect={setSelectedId} /></div>
      <div className="max-h-[420px] space-y-3 overflow-y-auto rounded-xl border border-border bg-card p-3">
        {loading && <p className="text-sm text-muted-foreground">Loading options...</p>}
        {!loading && filtered.map((p) => <article key={p.id} className={`cursor-pointer rounded-xl border p-3 ${selected?.id===p.id ? "border-primary" : "border-border"}`} onClick={() => setSelectedId(p.id)}>
          <div className="flex items-start justify-between"><h2 className="text-base font-semibold">{p.name}</h2>{p.verified ? <ShieldCheck className="h-4 w-4 text-primary" /> : <ShieldAlert className="h-4 w-4 text-muted-foreground" />}</div>
          <p className="text-sm text-muted-foreground">{p.city || "City pending"} • {p.address || "Address available on request"}</p>
          <div className="mt-2 flex flex-wrap gap-1">{p.badges.map((badge) => <span key={badge} className="rounded-full bg-muted px-2 py-0.5 text-[11px]">{badge}</span>)}</div>
          <p className="mt-2 text-sm">Units: {p.unitMatrix.join(", ")} • Price: {p.affordable ? `$${p.affordable}+` : "Call for pricing"}</p>
          <p className="text-xs text-muted-foreground">Waitlist: {p.waitlistStatus} • {p.freshness}</p>
        </article>)}
      </div>
    </section>

    {selected && <section className="mt-6 rounded-xl border border-border bg-card p-5">
      <h3 className="text-2xl font-semibold">{selected.name}</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-3">{selected.photos.slice(0,3).map((photo, i) => <img key={`${selected.id}-${i}`} src={photo} alt={`${selected.name} photo ${i+1}`} className="h-44 w-full rounded-lg object-cover" />)}</div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="space-y-2 text-sm">
          <p className="flex items-center gap-2"><Building2 className="h-4 w-4" /> Program: {selected.programLabel}</p>
          <p className="flex items-center gap-2"><BedDouble className="h-4 w-4" /> Unit matrix: {selected.unitMatrix.join(", ")}</p>
          <p className="flex items-center gap-2"><Home className="h-4 w-4" /> Price notes: {selected.affordable ? `Starting near $${selected.affordable}` : "Price varies, call for current range"}</p>
          <p>Amenities: {selected.amenities.join(", ")}</p>
          <p>Apply instructions: Visit property website, ask about openings, required documents, and timelines.</p>
          <p>If no opening: Ask for waitlist process, callback window, and transitional or shelter alternatives.</p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="flex items-center gap-2"><ExternalLink className="h-4 w-4" /> {selected.website ? <a className="text-primary underline" href={selected.website} target="_blank" rel="noreferrer">Property website</a> : "Website unavailable"}</p>
          <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {selected.phone || "Phone on request"}</p>
          <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> {selected.email}</p>
          <p className="text-muted-foreground">{selected.verified ? "Verified" : "Community verified"} • {selected.freshness}</p>
          <p className="text-muted-foreground">Insider notes: {selected.insider || "Ask about move-in readiness, utility coverage, and approval timeline."}</p>
          <div className="flex gap-3 pt-2"><Link to="/phone-scripts" className="rounded-lg bg-primary px-3 py-2 text-primary-foreground">Script button</Link><Link to="/saved" className="rounded-lg border border-border px-3 py-2">Save</Link></div>
        </div>
      </div>
    </section>}
  </main>;
}
