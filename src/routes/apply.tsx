import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/apply")({ component: () => <Navigate to="/housing/how-to-apply" replace /> });
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Circle, MessageSquareQuote, Phone } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [
      { title: "Application Workflow — Decoded Housing" },
      { name: "description", content: "Structured application workflow with checklist, scripts, and progress tracking." },
      { property: "og:title", content: "Application Workflow — Decoded Housing" },
      { property: "og:description", content: "Standard workflow for completing a housing application." },
    ],
  }),
  component: ApplyPage,
});

const steps = [
  { title: "Document Collection", detail: "Collect ID, income documentation, rental history, and references." },
  { title: "Eligibility Verification", detail: "Confirm AMI threshold, household size, and voucher status." },
  { title: "Application Completion", detail: "Complete all required application fields." },
  { title: "Submission and Follow-Up", detail: "Confirm submission and track follow-up actions." },
  { title: "Lease Execution", detail: "Prepare required questions, documents, and review checklist." },
];

const scriptGroups = [
  {
    title: "ARCH / MFTE / Income-Restricted",
    shortPrompt: "Say: I’m looking for your income-restricted or ARCH units. Are you taking applications or a waitlist?",
    script:
      "Hi, my name is ____. I’m looking for an income-restricted apartment in [city]. Are you accepting applications for income-restricted units or a waitlist?",
  },
  {
    title: "Emergency Shelter Intake",
    shortPrompt: "Say: I’m trying to find shelter tonight in King County. Here’s where I’m staying right now.",
    script:
      "Hi, my name is ____. I’m looking for shelter tonight in King County. Tonight I’m staying [outside / in my car / couch surfing]. Are there any beds, family spots, or waitlists available today?",
  },
  {
    title: "RAP / Coordinated Entry",
    shortPrompt: "Say: I’m experiencing homelessness and was told to contact your Regional Access Point.",
    script:
      "Hi, my name is ____. I was told I could come to your Regional Access Point. Can you share your current walk-in hours and how I can start a Coordinated Entry assessment?",
  },
  {
    title: "Rent Help / Basic Needs",
    shortPrompt: "Say: I’m behind on rent and worried about losing my housing. Are there programs that might help?",
    script:
      "Hi, my name is ____. I live in [city], King County, and I’m behind on rent by about $____. Do you offer rent help or move-in cost help, or can you refer me to programs that do?",
  },
];

function ApplyPage() {
  const [done, setDone] = useState<number[]>([0]);
  const pct = Math.round((done.length / steps.length) * 100);

  const toggle = (i: number) =>
    setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]));

  return (
    <main className="mx-auto max-w-4xl px-4 pb-24 pt-10 sm:px-6">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold text-foreground">Application Tracker</h1>
        <p className="mt-1 text-sm text-muted-foreground">Structured checklist for application completion.</p>
      </header>

      <div className="mb-6 rounded-2xl border border-border bg-card p-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">Progress</span>
          <span className="text-muted-foreground">{pct}% complete</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <ol className="space-y-3">
        {steps.map((s, i) => {
          const isDone = done.includes(i);
          return (
            <li key={s.title} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <button onClick={() => toggle(i)} className="flex w-full items-start gap-3 text-left">
                {isDone ? (
                  <CheckCircle2 className="mt-0.5 h-6 w-6 flex-shrink-0 text-primary" />
                ) : (
                  <Circle className="mt-0.5 h-6 w-6 flex-shrink-0 text-muted-foreground" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">Step {i + 1}</span>
                  </div>
                  <h3 className={`text-base font-semibold ${isDone ? "text-muted-foreground line-through" : "text-foreground"}`}>
                    {s.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.detail}</p>
                </div>
              </button>
            </li>
          );
        })}
      </ol>

      <section className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <Phone className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Phone Scripts (Trauma-Informed)</h2>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">Use these as teleprompter-ready scripts. Keep it short, clear, and direct.</p>
        <div className="grid gap-4">
          {scriptGroups.map((group) => (
            <article key={group.title} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <h3 className="text-base font-semibold text-foreground">{group.title}</h3>
              <p className="mt-2 rounded-lg bg-muted p-3 text-xs text-foreground/90">{group.shortPrompt}</p>
              <div className="mt-3 rounded-xl border border-border bg-[var(--gradient-soft)] p-4">
                <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-primary">
                  <MessageSquareQuote className="h-4 w-4" /> Long Script
                </div>
                <p className="text-sm text-foreground">{group.script}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
