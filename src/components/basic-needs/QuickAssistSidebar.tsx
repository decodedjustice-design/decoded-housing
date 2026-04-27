import type { ComponentType } from "react";
import { Apple, Sofa, Scale, Zap } from "lucide-react";

type SectionLink = {
  id: string;
  label: string;
  emoji: string;
  icon: ComponentType<{ className?: string }>;
  tint: string;
};

const sectionLinks: SectionLink[] = [
  {
    id: "food",
    label: "Food",
    emoji: "🍎",
    icon: Apple,
    tint: "bg-[oklch(0.93_0.05_145)] text-[oklch(0.32_0.07_150)]",
  },
  {
    id: "utilities",
    label: "Utilities",
    emoji: "⚡",
    icon: Zap,
    tint: "bg-[oklch(0.95_0.05_88)] text-[oklch(0.37_0.09_84)]",
  },
  {
    id: "furniture",
    label: "Furniture",
    emoji: "🛋️",
    icon: Sofa,
    tint: "bg-[oklch(0.95_0.03_60)] text-[oklch(0.34_0.06_55)]",
  },
  {
    id: "rent-help",
    label: "Rent Help",
    emoji: "⚖️",
    icon: Scale,
    tint: "bg-[oklch(0.93_0.06_28)] text-[oklch(0.44_0.13_25)]",
  },
];

export function QuickAssistSidebar() {
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <aside className="sticky bottom-3 z-20 rounded-2xl border border-border bg-card/95 p-2 shadow-[var(--shadow-soft)] backdrop-blur sm:top-24 sm:w-[78px] sm:self-start">
      <p className="px-2 py-1 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Quick Assist
      </p>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-1">
        {sectionLinks.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => scrollToSection(section.id)}
            aria-label={`${section.emoji} ${section.label}`}
            className={`flex min-h-12 items-center justify-center rounded-xl px-2 transition-transform hover:scale-[1.02] sm:h-12 sm:w-full ${section.tint}`}
            title={section.label}
          >
            <span className="sr-only">{section.label}</span>
            <section.icon className="h-5 w-5 sm:hidden" />
            <span className="hidden text-xl sm:block" aria-hidden="true">
              {section.emoji}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}
