import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { getWaitlist, type WaitlistEntry } from "@/lib/waitlist";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

type WaitlistRow = { id: string; entry: WaitlistEntry };

const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 } as const;

function formatUpdated(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not available" : date.toLocaleString();
}

function DashboardPage() {
  const rows = useMemo<WaitlistRow[]>(() => {
    const waitlist = getWaitlist();
    return Object.entries(waitlist).map(([id, entry]) => ({ id, entry }));
  }, []);

  const activeApplications = rows.filter((row) => ["Applied", "Waitlisted"].includes(row.entry.status)).length;

  const urgentProperty = [...rows].sort((a, b) => {
    const priorityDiff = PRIORITY_ORDER[a.entry.priority] - PRIORITY_ORDER[b.entry.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(b.entry.last_updated).getTime() - new Date(a.entry.last_updated).getTime();
  })[0];

  const dashboardPriority = rows.some((row) => row.entry.priority === "High")
    ? "High"
    : rows.some((row) => row.entry.priority === "Medium")
      ? "Medium"
      : "Low";

  const upcomingDeadlines = urgentProperty
    ? [
        `Follow up with ${urgentProperty.entry.name} within 48 hours.`,
        "Review required documents before submitting updates.",
      ]
    : ["No pending deadlines. Start by searching available housing."];

  const statusChanges = rows.length
    ? rows.slice(0, 3).map((row) => `${row.entry.name}: ${row.entry.status}`)
    : ["No status changes yet."];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-7">
        <h1 className="text-3xl font-semibold text-foreground">System Dashboard</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">Control center for housing applications, tracked properties, and next actions.</p>
      </header>

      <section className="mb-6 grid gap-4 rounded-2xl border border-[#E8E4DC] bg-card p-5 sm:grid-cols-3">
        <CardLabel label="Housing Status" value="In Progress" />
        <CardLabel label="Active Applications" value={String(activeApplications)} />
        <CardLabel label="Priority Level" value={dashboardPriority} />
      </section>

      <section className="mb-6 rounded-2xl border border-[#E8E4DC] bg-card p-5">
        <h2 className="text-lg font-semibold text-foreground">Next Step</h2>
        {urgentProperty ? (
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-foreground">Most urgent property: <span className="font-medium">{urgentProperty.entry.name}</span></p>
              <p className="text-sm text-muted-foreground">Status: {urgentProperty.entry.status} · Priority: {urgentProperty.entry.priority}</p>
            </div>
            <Link to="/waitlist" className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              Start Application
            </Link>
          </div>
        ) : (
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">Start by searching available housing.</p>
            <Link to="/search" className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              View Listing
            </Link>
          </div>
        )}
      </section>

      <section className="mb-6 rounded-2xl border border-[#E8E4DC] bg-card p-5">
        <h2 className="text-lg font-semibold text-foreground">Tracked Properties</h2>
        <div className="mt-4 space-y-3">
          {rows.length === 0 && <p className="text-sm text-muted-foreground">No tracked properties yet.</p>}
          {rows.map((row) => (
            <article key={row.id} className="rounded-xl border border-[#E8E4DC] bg-background p-3">
              <p className="font-medium text-foreground">{row.entry.name}</p>
              <p className="text-sm text-muted-foreground">Status: {row.entry.status}</p>
              <p className="text-xs text-muted-foreground">Last updated: {formatUpdated(row.entry.last_updated)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-6 rounded-2xl border border-[#E8E4DC] bg-card p-5">
        <h2 className="text-lg font-semibold text-foreground">Programs</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {["Rental Assistance", "Utility Assistance", "Food Access"].map((program) => (
            <article key={program} className="rounded-xl border border-[#E8E4DC] bg-background p-4">
              <p className="font-medium text-foreground">{program}</p>
              <Link to="/basic-needs" className="mt-3 inline-flex rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground">
                View Programs
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[#E8E4DC] bg-card p-5">
        <h2 className="text-lg font-semibold text-foreground">Alerts</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <article className="rounded-xl border border-[#E8E4DC] bg-background p-4">
            <h3 className="text-sm font-semibold text-foreground">Upcoming Deadlines</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {upcomingDeadlines.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
          <article className="rounded-xl border border-[#E8E4DC] bg-background p-4">
            <h3 className="text-sm font-semibold text-foreground">Status Changes</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {statusChanges.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
}

function CardLabel({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-xl border border-[#E8E4DC] bg-background p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
    </article>
  );
}
