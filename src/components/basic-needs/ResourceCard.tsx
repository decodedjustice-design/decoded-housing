import type { ComponentType } from "react";
import { ArrowRight, PhoneCall, ClipboardCheck } from "lucide-react";

type ResourceTag = "Free" | "Urgent" | "Waitlist" | "Local";
type ActionLabel = "Apply" | "Call" | "Learn more";

const tagTone: Record<ResourceTag, string> = {
  Free: "bg-[oklch(0.94_0.05_145)] text-[oklch(0.31_0.07_150)]",
  Urgent: "bg-[oklch(0.92_0.06_28)] text-[oklch(0.44_0.13_25)]",
  Waitlist: "bg-[oklch(0.95_0.04_88)] text-[oklch(0.37_0.09_84)]",
  Local: "bg-[oklch(0.95_0.03_200)] text-[oklch(0.35_0.08_210)]",
};

const actionIcon: Record<ActionLabel, ComponentType<{ className?: string }>> = {
  Apply: ClipboardCheck,
  Call: PhoneCall,
  "Learn more": ArrowRight,
};

export type ResourceCardProps = {
  name: string;
  description: string;
  tag: ResourceTag;
  actionLabel: ActionLabel;
};

export function ResourceCard({ name, description, tag, actionLabel }: ResourceCardProps) {
  const ActionIcon = actionIcon[actionLabel];

  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] sm:p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold leading-snug text-foreground">{name}</h3>
        <span className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${tagTone[tag]}`}>
          {tag}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>

      <button className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        <ActionIcon className="h-4 w-4" />
        {actionLabel}
      </button>
    </article>
  );
}
