import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  getWaitlist,
  saveWaitlist,
  WAITLIST_PRIORITIES,
  WAITLIST_STATUSES,
  type WaitlistPriority,
  type WaitlistStatus,
} from "@/lib/waitlist";

export const Route = createFileRoute("/waitlist")({
  component: WaitlistPage,
});

const STATUS_COLORS: Record<WaitlistStatus, string> = {
  Interested: "text-gray-700 bg-gray-100",
  Applied: "text-blue-700 bg-blue-100",
  Waitlisted: "text-amber-700 bg-amber-100",
  Approved: "text-green-700 bg-green-100",
  Rejected: "text-red-700 bg-red-100",
};

function WaitlistPage() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [waitlist, setWaitlist] = useState(() => getWaitlist());

  const rows = useMemo(() => {
    return Object.entries(waitlist).filter(([, item]) => {
      if (statusFilter && item.status !== statusFilter) return false;
      if (priorityFilter && item.priority !== priorityFilter) return false;
      return true;
    });
  }, [waitlist, statusFilter, priorityFilter]);

  const updateItem = (id: string, updates: Partial<(typeof waitlist)[string]>) => {
    const next = {
      ...waitlist,
      [id]: {
        ...waitlist[id],
        ...updates,
        last_updated: new Date().toISOString(),
      },
    };
    setWaitlist(next);
    saveWaitlist(next);
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold text-foreground">Your Housing Tracker</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track your saved places, application steps, and updates in one calm view.</p>
      </header>

      <section className="mb-6 grid gap-3 rounded-2xl border border-[#E8E4DC] bg-card p-4 sm:grid-cols-2">
        <label className="text-xs font-medium text-muted-foreground">Status
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="mt-1 block w-full rounded-lg border border-[#E8E4DC] bg-background px-3 py-2 text-sm">
            <option value="">All statuses</option>
            {WAITLIST_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </label>
        <label className="text-xs font-medium text-muted-foreground">Priority
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="mt-1 block w-full rounded-lg border border-[#E8E4DC] bg-background px-3 py-2 text-sm">
            <option value="">All priorities</option>
            {WAITLIST_PRIORITIES.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
          </select>
        </label>
      </section>

      <section className="space-y-3">
        {rows.length === 0 && (
          <div className="rounded-2xl border border-[#E8E4DC] bg-card p-6 text-sm text-muted-foreground">No tracked properties yet. Save a property from search to start your tracker.</div>
        )}
        {rows.map(([id, item]) => (
          <article key={id} className="rounded-2xl border border-[#E8E4DC] bg-card p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-foreground">{item.name}</h2>
              <span className={`rounded-full px-2 py-1 text-xs font-semibold ${STATUS_COLORS[item.status]}`}>{item.status}</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-medium text-muted-foreground">Status
                <select value={item.status} onChange={(e) => updateItem(id, { status: e.target.value as WaitlistStatus })} className="mt-1 block w-full rounded-lg border border-[#E8E4DC] px-3 py-2 text-sm">
                  {WAITLIST_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </label>
              <label className="text-xs font-medium text-muted-foreground">Priority
                <select value={item.priority} onChange={(e) => updateItem(id, { priority: e.target.value as WaitlistPriority })} className="mt-1 block w-full rounded-lg border border-[#E8E4DC] px-3 py-2 text-sm">
                  {WAITLIST_PRIORITIES.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
                </select>
              </label>
              <label className="text-xs font-medium text-muted-foreground sm:col-span-2">Notes
                <textarea value={item.notes} onChange={(e) => updateItem(id, { notes: e.target.value })} className="mt-1 min-h-20 w-full rounded-lg border border-[#E8E4DC] px-3 py-2 text-sm" placeholder="Add reminders, next steps, or contact notes." />
              </label>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Last updated: {new Date(item.last_updated).toLocaleString()}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
