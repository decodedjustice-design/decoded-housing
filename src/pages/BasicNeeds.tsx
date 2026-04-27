import { Apple, Scale, Sofa, Zap } from "lucide-react";
import { NeedsSection } from "@/components/basic-needs/NeedsSection";
import { QuickAssistSidebar } from "@/components/basic-needs/QuickAssistSidebar";

const sectionContent = [
  {
    id: "food",
    title: "Fresh Access",
    subtitle: "Food support that helps right away while fitting daily life.",
    icon: <Apple className="h-5 w-5" />,
    resources: [
      {
        name: "Farmers Market Benefits (SFMNP)",
        description: "Seasonal produce vouchers for eligible households at participating King County markets.",
        tag: "Local" as const,
        actionLabel: "Apply" as const,
      },
      {
        name: "Food Banks (Hopelink, Food Lifeline)",
        description: "Find groceries, pantry staples, and same-week pickup options near your neighborhood.",
        tag: "Free" as const,
        actionLabel: "Learn more" as const,
      },
      {
        name: "Home Delivery Options",
        description: "Delivery support for people with mobility, transportation, or schedule barriers.",
        tag: "Urgent" as const,
        actionLabel: "Call" as const,
      },
    ],
  },
  {
    id: "utilities",
    title: "Keep the Lights On",
    subtitle: "Utility bill programs designed to prevent shutoffs and reduce stress.",
    icon: <Zap className="h-5 w-5" />,
    resources: [
      {
        name: "LIHEAP",
        description: "Federal energy assistance that can help cover heating and power costs.",
        tag: "Urgent" as const,
        actionLabel: "Apply" as const,
      },
      {
        name: "PSE HELP",
        description: "Puget Sound Energy assistance for eligible customers facing high bills.",
        tag: "Local" as const,
        actionLabel: "Apply" as const,
      },
      {
        name: "Byrd Barr Place",
        description: "Energy support and financial coaching for Seattle and King County households.",
        tag: "Local" as const,
        actionLabel: "Call" as const,
      },
      {
        name: "City Utility Discount Programs",
        description: "Income-based water, sewer, and electricity discounts through local city services.",
        tag: "Free" as const,
        actionLabel: "Learn more" as const,
      },
    ],
  },
  {
    id: "furniture",
    title: "House to Home",
    subtitle: "Essential home items that support a safe, stable move-in.",
    icon: <Sofa className="h-5 w-5" />,
    resources: [
      {
        name: "Northwest Furniture Bank",
        description: "Beds, tables, and basic furnishings to help households settle in quickly.",
        tag: "Local" as const,
        actionLabel: "Apply" as const,
      },
      {
        name: "St. Vincent de Paul Vouchers",
        description: "Voucher-supported access to furniture and household essentials.",
        tag: "Free" as const,
        actionLabel: "Call" as const,
      },
      {
        name: "Essentials First",
        description: "Starter-home essentials focused on immediate move-in needs.",
        tag: "Urgent" as const,
        actionLabel: "Learn more" as const,
      },
      {
        name: "Buy Nothing Groups",
        description: "Local community sharing groups. Meet in public places and bring a friend for safety.",
        tag: "Local" as const,
        actionLabel: "Learn more" as const,
      },
    ],
  },
  {
    id: "rent-help",
    title: "Safety Net",
    subtitle: "Rent and financial assistance programs to reduce housing disruption.",
    icon: <Scale className="h-5 w-5" />,
    resources: [
      {
        name: "Keep King County Housed",
        description: "Local referrals and coordinated rent support for households at risk of displacement.",
        tag: "Urgent" as const,
        actionLabel: "Apply" as const,
      },
      {
        name: "United Way Rent Help",
        description: "Rent assistance pathways and connection help through 211 and partner agencies.",
        tag: "Local" as const,
        actionLabel: "Call" as const,
      },
      {
        name: "Section 8 Waitlist Tracker",
        description: "Placeholder tracker UI for future waitlist status updates and opening alerts.",
        tag: "Waitlist" as const,
        actionLabel: "Learn more" as const,
      },
    ],
  },
];

export function BasicNeedsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 sm:pt-10">
      <header className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
        <p className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          King County support resources
        </p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">Basic Needs Hub</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Get help with food, utilities, furniture, and rent — all in one place.
        </p>
      </header>

      <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-[1fr_78px] sm:items-start sm:gap-6 lg:grid-cols-[1fr_88px]">
        <div className="space-y-5 sm:space-y-6">
          {sectionContent.map((section) => (
            <NeedsSection
              key={section.id}
              id={section.id}
              title={section.title}
              subtitle={section.subtitle}
              icon={section.icon}
              resources={section.resources}
            />
          ))}
        </div>

        <QuickAssistSidebar />
      </div>
    </main>
  );
}
