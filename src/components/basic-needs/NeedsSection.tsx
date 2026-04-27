import type { ReactNode } from "react";
import { ResourceCard, type ResourceCardProps } from "./ResourceCard";

export type NeedsSectionProps = {
  id: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  resources: ResourceCardProps[];
};

export function NeedsSection({ id, title, subtitle, icon, resources }: NeedsSectionProps) {
  return (
    <section id={id} className="scroll-mt-24 rounded-3xl border border-border bg-[var(--gradient-soft)] p-5 sm:p-7">
      <header className="mb-5 flex items-start gap-3">
        <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
          {icon}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.name}
            name={resource.name}
            description={resource.description}
            tag={resource.tag}
            actionLabel={resource.actionLabel}
          />
        ))}
      </div>
    </section>
  );
}
