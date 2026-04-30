import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useProperties } from "@/lib/useProperties";

export const Route = createFileRoute("/housing-shelter")({ component: HousingShelterPage });

type CriminalHistory = "none" | "arrest_only" | "old_conviction" | "recent_conviction" | "unsure" | "prefer_not";

function HousingShelterPage() {
  const [q, setQ] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [householdSize, setHouseholdSize] = useState(1);
  const [income, setIncome] = useState(35000);
  const [voucher, setVoucher] = useState(false);
  const [criminal, setCriminal] = useState<CriminalHistory>("prefer_not");

  const { data } = useProperties({ search: q });

  const ranked = useMemo(() => data.map((p) => {
    let score = 50;
    if (voucher && p.voucher) score += 20;
    if (p.verified) score += 15;
    if (income < 50000 && p.ami?.some((a) => a.includes("50") || a.includes("60"))) score += 10;
    if (householdSize >= 3 && p.units?.some((u) => u.includes("2") || u.includes("3"))) score += 10;
    if (criminal === "recent_conviction") score -= 5;
    return { ...p, score, fit: score >= 75 ? "Likely fit" : score >= 55 ? "Possible fit" : "Unclear" };
  }).sort((a, b) => b.score - a.score), [data, voucher, income, householdSize, criminal]);

  return <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
    <h1 className="font-display text-4xl">Housing & Shelter Discovery</h1>
    <p className="mt-2 text-muted-foreground">One search for affordable housing, voucher-friendly options, transitional housing, and shelter tonight.</p>

    <section className="mt-6 grid gap-4 rounded-xl border border-border bg-card p-4 md:grid-cols-3">
      <input className="rounded-md border border-input px-3 py-2" placeholder="Search city, neighborhood, property" value={q} onChange={(e)=>setQ(e.target.value)} />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={voucher} onChange={(e)=>setVoucher(e.target.checked)} /> I have a voucher</label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={urgent} onChange={(e)=>setUrgent(e.target.checked)} /> I need shelter tonight</label>
      <label className="text-sm">Household size <input type="number" min={1} className="mt-1 w-full rounded-md border border-input px-3 py-2" value={householdSize} onChange={(e)=>setHouseholdSize(Number(e.target.value)||1)} /></label>
      <label className="text-sm">Annual income <input type="number" min={0} className="mt-1 w-full rounded-md border border-input px-3 py-2" value={income} onChange={(e)=>setIncome(Number(e.target.value)||0)} /></label>
      <label className="text-sm">Criminal-history screening concern
        <select className="mt-1 w-full rounded-md border border-input px-3 py-2" value={criminal} onChange={(e)=>setCriminal(e.target.value as CriminalHistory)}>
          <option value="none">No concern</option><option value="arrest_only">Arrest only</option><option value="old_conviction">Old conviction</option><option value="recent_conviction">Recent conviction</option><option value="unsure">Unsure</option><option value="prefer_not">Prefer not to say</option>
        </select>
      </label>
    </section>

    {urgent && <section className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm">
      <p className="font-semibold">Urgent routing: start shelter calls now.</p>
      <p className="mt-1">If no bed is available, ask about waitlist timing, callback windows, and overflow alternatives.</p>
      <Link to="/shelter/tonight" className="mt-2 inline-block font-semibold text-primary">Open shelter tonight guide →</Link>
    </section>}

    <section className="mt-6 grid gap-3">
      {ranked.slice(0, 20).map((p) => (
        <article key={p.id} className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-start justify-between gap-3"><div><h2 className="text-lg font-semibold">{p.name}</h2><p className="text-sm text-muted-foreground">{p.address || "Address being confirmed"} • {p.city || "City not listed"}</p></div><span className="rounded-full bg-muted px-2 py-1 text-xs">{p.fit}</span></div>
          <p className="mt-2 text-sm">Units: {p.units?.join(", ") || "Unit sizes still being confirmed"} • Pricing: {p.affordable ? `$${p.affordable}+` : "Pricing not verified"}</p>
          <p className="text-sm">Website: {p.website ? <a href={p.website} className="text-primary underline">Visit site</a> : "Website not listed"} • Phone: {p.phone || "Call to confirm contact number"}</p>
          <p className="text-sm">Waitlist: {p.waitlist || "Waitlist status not verified"} • Last updated: {p.updated_days ?? "Unknown"} days ago</p>
          <div className="mt-2 flex gap-3 text-sm"><Link to="/phone-scripts" className="text-primary">Script</Link><Link to="/saved" className="text-primary">Save</Link></div>
        </article>
      ))}
    </section>
  </main>;
}
