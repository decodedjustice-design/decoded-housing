import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Circle, MessageSquareQuote } from "lucide-react";
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
              {i === 2 && (
                <div className="mt-4 rounded-xl border border-border bg-[var(--gradient-soft)] p-4">
                  <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-primary">
                    <MessageSquareQuote className="h-4 w-4" /> Call Script
                  </div>
                  <p className="text-sm text-foreground">
                    "Hi, I'm calling about the unit listed for [address]. I have a Section 8 voucher and would like to confirm you accept it and ask about the application process."
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </main>
  );
}
