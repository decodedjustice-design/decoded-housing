import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Archive,
  BadgeCheck,
  CalendarClock,
  ClipboardCheck,
  FileText,
  HeartHandshake,
  Home,
  KeyRound,
  LifeBuoy,
  Lock,
  MapPinned,
  MessageSquareText,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
  Wheelchair,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/stable-housing-navigator")({
  component: StableHousingNavigatorPage,
});

type CardItem = {
  title: string;
  text: string;
};

type Pathway = {
  label: string;
  signal: string;
  firstStep: string;
  backup: string;
};

const userTypes = [
  "Families with children",
  "Single parents",
  "Renters at risk of eviction",
  "People already homeless or houseless",
  "Voucher holders",
  "Low-income renters",
  "People with disabilities",
  "Trauma survivors",
  "People fleeing unsafe housing or violence",
  "People denied housing because of screening barriers",
  "People needing utilities, food, childcare, transportation, medical, or benefits support",
  "People exhausted by repeated intake and paperwork",
];

const corePages: CardItem[] = [
  { title: "Start Here Triage", text: "A calm first screen that asks what is most urgent, offers ‘I do not know’ answers, and routes people to immediate next steps before asking anything else." },
  { title: "My Stability Plan", text: "A living plan with today’s top actions, documents, calls, rights to review, backup options, and long-term stabilization steps." },
  { title: "Barrier Workbench", text: "A guided workspace that detects rental debt, screening barriers, missing documents, disability needs, safety concerns, utility arrears, and family needs." },
  { title: "Resource Match", text: "A match engine for King County housing stabilization, basic needs, legal information, shelter, benefits, family supports, and follow-through referrals." },
  { title: "Document Vault", text: "Privacy-first storage grouped by lease, notices, court papers, IDs, income, disability, voucher, utility, denial, school, safety, and communication records." },
  { title: "Letters & Scripts", text: "Plain-language generators for landlord emails, accommodation requests, assistance requests, denial appeals, phone scripts, and advocate packets." },
  { title: "Follow-Through Dashboard", text: "A persistent dashboard that tracks deadlines, pending responses, appointments, backup plans, and what to do if a program says no." },
  { title: "Source Verification Center", text: "A staff and admin workflow that marks legal rules, program criteria, deadlines, sources, and eligibility notes as Verified or Needs Verification." },
];

const triagePathways: Pathway[] = [
  { label: "Eviction or notice", signal: "Notice, court paper, threatened filing, sheriff date, or confusion about a deadline.", firstStep: "Upload or photograph the paper, capture the date received, and show eviction-prevention, legal-information, rental-assistance, and court-response tasks.", backup: "If no program responds today, generate a call script, advocate packet, and a second-path plan: utility/basic needs stabilization, negotiation letter, and verification checklist." },
  { label: "Unsafe housing or violence", signal: "Unsafe unit, domestic violence, stalking, child safety concern, or need for confidential planning.", firstStep: "Open a safety-aware path with a quick-exit button, safe contact preferences, and human review flag before any normal intake questions.", backup: "If the first shelter/resource is full, route to warm handoff checklist, alternate safe contacts, transportation options, and a next-call sequence." },
  { label: "Homeless tonight", signal: "No safe place to sleep, family sleeping outside or in vehicle, youth or medical vulnerability.", firstStep: "Prioritize shelter tonight, coordinated-entry guidance marked Needs Verification, family/youth options, transportation, and document-light next steps.", backup: "If beds are full, provide an if-full plan: warming/cooling space checks, safe phone charging, school/family contact scripts, and next morning navigation tasks." },
  { label: "Voucher deadline", signal: "Voucher expiring, inspection issue, landlord refusal, unit search problem, or portability question.", firstStep: "Build a voucher clock with expiration date, extension request draft, unit search log, reasonable accommodation flag if disability-related, and landlord tracker.", backup: "If the unit falls through, generate alternate unit search criteria, extension evidence packet, and housing authority follow-up script." },
  { label: "Disability accommodation", signal: "Need more time, accessible unit, service/support animal, paperwork help, communication change, or disability-related screening barrier.", firstStep: "Explain possible reasonable accommodation rights as legal information only, draft a request, list helpful documentation, and mark legal details Needs Verification.", backup: "If denied or ignored, prepare a follow-up letter, documentation checklist, fair-housing referral prompt, and human review flag." },
  { label: "Housing denial or barriers", signal: "Denied for credit, eviction history, criminal background, income, landlord references, debt, family size, or voucher/source of income.", firstStep: "Classify the barrier, build an explanation packet, identify documents that help, and trigger any possible protection for review.", backup: "If an appeal fails, produce an alternative plan: targeted landlord list, co-signer/support options, debt plan, application tracker, and advocate case summary." },
];

const intakeQuestions = [
  "What feels most urgent today: notice/eviction, unsafe housing, no place tonight, utility shutoff, voucher deadline, denial, documents, rent debt, or something else?",
  "Do you have children, pregnancy, disability, medical needs, school stability needs, or safety concerns that should change the priority?",
  "Did you receive a paper, text, email, court notice, denial, bill, inspection letter, or voucher deadline? You can upload it, describe it, skip, or mark it sensitive.",
  "Where in King County are you now, and where can you safely receive calls, texts, mail, or email?",
  "What has already been tried, who was contacted, and what happened? This prevents repeating failed steps.",
  "Which documents do you have today, which are missing, and which are unsafe or hard to get?",
  "Do you want the system to save this answer for future forms, keep it sensitive, or not save it?",
];

const barrierCategories = [
  "Eviction history",
  "Rental debt",
  "Criminal background",
  "Credit issues",
  "No income or low income",
  "Voucher/source-of-income barrier",
  "Disability-related barrier",
  "Missing ID or documents",
  "Utility arrears or shutoff",
  "Family size or bedroom mismatch",
  "Transportation or childcare barrier",
  "Domestic violence or safety issue",
  "Language access need",
  "Trauma, overwhelm, or repeated-form burden",
];

const dashboardSections: CardItem[] = [
  { title: "Today’s top 3 actions", text: "Always short, ordered, and doable: call, upload, send, attend, or ask for help." },
  { title: "Deadlines and clocks", text: "Eviction, voucher, utility shutoff, court, inspection, application, and appeal dates with Needs Verification if uncertain." },
  { title: "People contacted", text: "Landlords, programs, housing authorities, schools, utilities, caseworkers, and advocates with response status." },
  { title: "Missing documents", text: "Documents grouped by urgency, source, replacement path, and whether a sensitive-data warning is needed." },
  { title: "What to do if this fails", text: "A backup plan is attached to every task so the user is never left at a dead end." },
  { title: "Weekly ‘what changed?’ check-in", text: "A gentle check-in that asks what got worse, what improved, what was denied, and what deadline moved." },
];

const resourceRules: CardItem[] = [
  { title: "Priority matching", text: "Safety, children, disability, imminent housing loss, homelessness tonight, medical vulnerability, and voucher deadlines rank first." },
  { title: "Eligibility caution", text: "The system does not claim eligibility unless a current source has been verified. Otherwise it displays Needs Verification and asks staff to confirm." },
  { title: "Warm handoff", text: "Each match includes phone/email, what to say, what to send, hours/source status, backup contact, and a follow-up date." },
  { title: "Basic-needs stabilization", text: "Food, diapers, childcare, transportation, medical, behavioral health, benefits, and utilities are treated as housing-preservation supports." },
];

const rightsTriggers: CardItem[] = [
  { title: "Possible eviction protection", text: "Triggered by notices, court papers, payment issues, lockout threats, or habitability facts. Shows legal information, not legal advice, and flags deadlines for verification." },
  { title: "Possible fair housing issue", text: "Triggered by disability, family status, voucher/source of income, language access, unsafe harassment, or denial facts. Requires source and legal review." },
  { title: "Possible accommodation need", text: "Triggered by disability-related need for time, accessible unit, communication help, support animal, paperwork help, or deadline flexibility." },
  { title: "Possible safety planning need", text: "Triggered by violence, stalking, unsafe contact, child safety, confidential address needs, or unsafe communication channel." },
];

const documentGroups = [
  "Lease and addenda",
  "Rent notices and landlord letters",
  "Court papers",
  "IDs and immigration-safe identity alternatives marked Needs Verification",
  "Income proof and benefits letters",
  "Disability documents and accommodation history",
  "Voucher papers and inspection records",
  "Utility bills and shutoff notices",
  "Rental ledger and payment receipts",
  "Denial letters and screening reports",
  "Communication screenshots",
  "Safety documents",
  "Children’s school, custody, transportation, or medical housing needs",
];

const generatorRules: CardItem[] = [
  { title: "Letters stay factual", text: "Generated letters use user-approved facts, avoid legal conclusions, and separate confirmed facts from Needs Verification notes." },
  { title: "Scripts reduce overwhelm", text: "Phone scripts include one-sentence purpose, three facts to share, documents to mention, exact ask, voicemail version, and next step." },
  { title: "Case packets travel", text: "Advocate packets summarize household needs, barriers, documents, deadlines, contact log, tried options, backup plan, and verification status." },
  { title: "User controls sensitivity", text: "Before export, the user can hide trauma details, safety information, disability documents, or family/custody details." },
];

const backendFields = [
  "household_id, user_id, preferred_name, safe_contact_methods, language_access_needs",
  "household_members, child_school_needs, disability_accommodation_needs, medical_vulnerability_flags",
  "triage_priority, urgent_risks, current_housing_status, safe_location_status",
  "barrier_profile, barrier_scorecard, document_inventory, sensitive_field_flags",
  "deadlines, voucher_clock, utility_shutoff_clock, eviction_notice_metadata",
  "resource_matches, eligibility_status, source_verification_status, referral_attempts",
  "tasks, backup_tasks, contact_log, application_tracker, landlord_communication_tracker",
  "generated_letters, generated_scripts, case_summary_exports, consent_records, audit_log",
];

const adminFeatures: CardItem[] = [
  { title: "Verification queue", text: "Staff review HUD, Washington, King County, city, program, and provider details before any eligibility or deadline language is marked Verified." },
  { title: "High-risk review", text: "Safety, child needs, disability denial, lockout, court, voucher expiration, and homelessness tonight trigger human review queues." },
  { title: "Resource health", text: "Track last verified date, source URL or document, hours, phone, intake status, service area, and known backups." },
  { title: "Outcome learning", text: "Record denials, no responses, successful handoffs, and workaround paths to improve future plans without blaming users." },
];

const mvpFeatures = [
  "Smart triage with urgent pathways",
  "Personalized stability plan",
  "Barrier scorecard",
  "Document vault taxonomy",
  "Resource matching with Needs Verification labels",
  "Rights/protection trigger prompts",
  "Letters, scripts, and case-summary generator",
  "Follow-through dashboard and backup plans",
  "Safety exit and sensitive-answer controls",
  "Admin source verification queue",
];

const futureFeatures = [
  "Secure integrations with verified partner intake forms",
  "Auto-fill with user consent and reusable answer bank",
  "SMS follow-through loop with safe-contact rules",
  "Document OCR that extracts dates but requires user/staff confirmation",
  "Multilingual guided mode and voice-friendly intake",
  "Advocate collaboration portal",
  "Offline printable packets for libraries, schools, shelters, and clinics",
  "Program capacity signals where partners provide verified data",
];

function StableHousingNavigatorPage() {
  return (
    <main className="bg-[radial-gradient(circle_at_top_left,oklch(0.92_0.04_170/0.45),transparent_30%),linear-gradient(180deg,oklch(0.985_0.006_84),oklch(0.955_0.012_74))]">
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
        <div className="rounded-[2rem] border border-border bg-card/90 p-6 shadow-[var(--shadow-elevated)] sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <ShieldCheck className="h-4 w-4" /> King County, Washington
          </div>
          <h1 className="mt-5 font-display text-4xl leading-tight text-foreground sm:text-6xl">
            Stable Housing Navigator
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
            A trauma-informed digital housing navigator for people trying to retain housing, stabilize a tenancy, prevent eviction, find affordable housing, solve screening barriers, and stay supported after placement.
          </p>
          <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Core promise</p>
            <p className="mt-2 text-xl font-semibold text-foreground">
              The platform never gives up. If one option fails, it looks for another path, program, document, contact, protection to verify, appeal, workaround, or stabilization step.
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a href="#triage" className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)]">
              Start with urgent risks
            </a>
            <a href="#blueprint" className="inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground">
              View full app blueprint
            </a>
          </div>
        </div>

        <aside className="rounded-[2rem] border border-border bg-background/85 p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-accent p-3 text-accent-foreground"><LifeBuoy className="h-6 w-6" /></div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Immediate guidance card</h2>
              <p className="text-sm text-muted-foreground">Every user receives a next step and backup plan.</p>
            </div>
          </div>
          <ol className="mt-6 space-y-4">
            {[
              "Tell us what is most urgent. You can choose ‘I do not know.’",
              "Save or skip sensitive details. You control what is reused.",
              "Get today’s top 3 actions, documents to gather, and calls to make.",
              "If a program says no or does not answer, open the alternate plan generator.",
            ].map((step, index) => (
              <li key={step} className="flex gap-3 rounded-2xl border border-border bg-card p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{index + 1}</span>
                <span className="text-sm leading-6 text-foreground">{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-5 rounded-2xl border border-destructive/25 bg-destructive/5 p-4 text-sm text-foreground">
            <strong>Safety:</strong> include a quick-exit button, safe-contact settings, device/privacy warning, and human review flags for high-risk situations.
          </div>
        </aside>
      </section>

      <section id="triage" className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <SectionHeading eyebrow="Smart Housing Triage" title="Urgent risks come first, before normal intake." text="The navigator asks calm questions, routes by priority, and gives immediate next steps without blaming the user for incomplete documents or repeated denials." />
        <div className="grid gap-4 lg:grid-cols-3">
          {triagePathways.map((pathway) => (
            <article key={pathway.label} className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-warning/30 p-3 text-warning-foreground"><AlertTriangle className="h-5 w-5" /></div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{pathway.label}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{pathway.signal}</p>
                </div>
              </div>
              <div className="mt-4 space-y-3 text-sm leading-6">
                <p><strong>First step:</strong> {pathway.firstStep}</p>
                <p><strong>Backup plan:</strong> {pathway.backup}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="blueprint" className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <SectionHeading eyebrow="Complete website/app blueprint" title="A full navigator, not a static directory." text="Stable Housing Navigator combines guided intake, barrier detection, resource matching, rights review prompts, document organization, letter generation, follow-through, and source verification." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {corePages.map((page) => <InfoCard key={page.title} item={page} icon={<MapPinned className="h-5 w-5" />} />)}
        </div>
      </section>

      <TwoColumnSection
        eyebrow="Users and mission"
        title="Built for families, renters, voucher holders, disabled users, trauma survivors, and people already pushed through too many systems."
        leftTitle="Mission statement"
        leftItems={[
          "Help King County residents keep housing, regain housing, prevent displacement, and stay connected after placement.",
          "Reduce repeated intake trauma by reusing answers only with consent and letting users mark facts as sensitive.",
          "Treat basic needs, utilities, childcare, transportation, safety, disability access, and benefits as housing stability work.",
        ]}
        rightTitle="User types"
        rightItems={userTypes}
      />

      <BlueprintGrid />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <SectionHeading eyebrow="No-repetition intake system" title="Answers become a reusable, user-controlled answer bank." text="The system stores answers safely, reuses them across forms when permitted, and lets the user edit, skip, delete, or mark details sensitive before any export." />
        <div className="grid gap-4 lg:grid-cols-3">
          {intakeQuestions.map((question, index) => (
            <article key={question} className="rounded-3xl border border-border bg-card p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Question {index + 1}</p>
              <p className="mt-3 text-sm leading-6 text-foreground">{question}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <SectionHeading eyebrow="Barrier Detection Engine" title="The app organizes barriers without turning them into blame." text="A scorecard helps prioritize action, not judge the user. Each barrier maps to documents, possible protections to verify, matching resources, letters, and backups." />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {barrierCategories.map((barrier) => (
            <div key={barrier} className="rounded-2xl border border-border bg-background p-4 text-sm font-medium text-foreground shadow-[var(--shadow-card)]">
              {barrier}
            </div>
          ))}
        </div>
      </section>

      <MatrixSection />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <SectionHeading eyebrow="Safety, privacy, and reliability" title="High-risk moments require careful design and human review." text="The platform distinguishes legal information from legal advice, avoids unverified eligibility claims, protects sensitive facts, and provides a next step plus backup plan at every stage." />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <InfoCard item={{ title: "Privacy-first", text: "Collect minimum necessary data, encrypt sensitive records, log access, and allow user-controlled exports and deletion workflows." }} icon={<Lock className="h-5 w-5" />} />
          <InfoCard item={{ title: "Safety exit", text: "Persistent quick-exit, safe-contact preferences, private browsing warning, and hidden-sensitive-fields mode for unsafe devices." }} icon={<ShieldCheck className="h-5 w-5" />} />
          <InfoCard item={{ title: "Accessibility", text: "Mobile-first, screen-reader-friendly, plain-language text, large tap targets, low-stress color, save-and-continue, and ‘I do not know’ options." }} icon={<Wheelchair className="h-5 w-5" />} />
          <InfoCard item={{ title: "No hallucinated rules", text: "Legal and program details require source verification. Uncertain laws, criteria, and deadlines are labeled Needs Verification." }} icon={<BadgeCheck className="h-5 w-5" />} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <SectionHeading eyebrow="MVP and future roadmap" title="Launch useful immediately, then deepen automation with verified partners." text="The MVP focuses on triage, stability planning, document organization, generated communication, source verification, and persistent follow-through." />
        <div className="grid gap-6 lg:grid-cols-2">
          <Checklist title="MVP feature list" items={mvpFeatures} icon={<ClipboardCheck className="h-5 w-5" />} />
          <Checklist title="Future feature list" items={futureFeatures} icon={<Sparkles className="h-5 w-5" />} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <SectionHeading eyebrow="Recommended tech stack and build steps" title="A secure, verifiable case-planning application." text="The stack should support careful permissions, auditability, source verification, local resource data, and human handoff workflows." />
        <div className="grid gap-4 lg:grid-cols-3">
          <Checklist title="Frontend" items={["React + TanStack Router for guided flows", "Tailwind design system for calm mobile-first UI", "Accessible components with keyboard and screen-reader support", "Client-side draft saving with explicit consent"]} icon={<Home className="h-5 w-5" />} />
          <Checklist title="Backend" items={["PostgreSQL/Supabase-style relational data with row-level security", "Encrypted object storage for documents", "Audit logs for access and exports", "Queue system for reminders, verification, and human review"]} icon={<Archive className="h-5 w-5" />} />
          <Checklist title="Implementation steps" items={["Model triage, barriers, documents, tasks, sources, and contacts", "Build guided intake and dashboard first", "Seed resources only from verified source records", "Add letter/script generators with review controls", "Pilot with advocates and revise for trauma-informed usability"]} icon={<KeyRound className="h-5 w-5" />} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="rounded-[2rem] border border-primary/20 bg-primary p-8 text-primary-foreground shadow-[var(--shadow-elevated)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] opacity-80">Never dead-end the user</p>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl">Every screen ends with a next step, a backup plan, and a way back to human help.</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 opacity-90">
            Stable Housing Navigator is designed to feel calm, directive, human, persistent, and committed: “We will keep looking with you.”
          </p>
          <Link to="/shelter/tonight" className="mt-6 inline-flex rounded-full bg-primary-foreground px-5 py-3 text-sm font-semibold text-primary">
            Need a safe place tonight?
          </Link>
        </div>
      </section>
    </main>
  );
}

function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="mb-6 max-w-4xl">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{eyebrow}</p>
      <h2 className="mt-2 font-display text-3xl leading-tight text-foreground sm:text-4xl">{title}</h2>
      <p className="mt-3 text-base leading-7 text-muted-foreground">{text}</p>
    </div>
  );
}

function InfoCard({ item, icon }: { item: CardItem; icon: React.ReactNode }) {
  return (
    <article className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-accent-foreground">{icon}</div>
      <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
    </article>
  );
}

function Checklist({ title, items, icon }: { title: string; items: string[]; icon: React.ReactNode }) {
  return (
    <article className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">{icon}</div>
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      </div>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-foreground">
            <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function TwoColumnSection({ eyebrow, title, leftTitle, leftItems, rightTitle, rightItems }: { eyebrow: string; title: string; leftTitle: string; leftItems: string[]; rightTitle: string; rightItems: string[] }) {
  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{eyebrow}</p>
        <h2 className="mt-2 font-display text-3xl leading-tight text-foreground sm:text-4xl">{title}</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Checklist title={leftTitle} items={leftItems} icon={<HeartHandshake className="h-5 w-5" />} />
        <Checklist title={rightTitle} items={rightItems} icon={<UserRoundCheck className="h-5 w-5" />} />
      </div>
    </section>
  );
}

function BlueprintGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <Checklist title="Navigation structure" items={["Home / Start Here", "Urgent help", "My stability plan", "Resource match", "Documents", "Letters & scripts", "Applications", "Rights to review", "Family and child needs", "Follow-through dashboard", "Source verification"]} icon={<MapPinned className="h-5 w-5" />} />
        <Checklist title="Main user flows" items={["Urgent triage → immediate safety/housing-loss pathway → top 3 actions", "Barrier detection → document checklist → resource match → letter/script", "Affordable housing search → application tracker → denial/appeal path", "Voucher clock → landlord tracker → extension/accommodation request", "Weekly check-in → changed facts → updated plan and backups"]} icon={<RefreshCw className="h-5 w-5" />} />
        <Checklist title="Dashboard sections" items={dashboardSections.map((item) => `${item.title}: ${item.text}`)} icon={<CalendarClock className="h-5 w-5" />} />
        <Checklist title="Document vault structure" items={documentGroups} icon={<FileText className="h-5 w-5" />} />
      </div>
    </section>
  );
}

function MatrixSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <SectionHeading eyebrow="Rules engines" title="Matching, rights triggers, documents, generators, and admin verification work together." text="The app can be innovative without inventing facts: it flags possible protections gently, shows why a review may matter, and requires source verification before specific legal or eligibility claims are treated as confirmed." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Checklist title="Resource matching logic" items={resourceRules.map((item) => `${item.title}: ${item.text}`)} icon={<LifeBuoy className="h-5 w-5" />} />
        <Checklist title="Legal/right trigger logic" items={rightsTriggers.map((item) => `${item.title}: ${item.text}`)} icon={<ShieldCheck className="h-5 w-5" />} />
        <Checklist title="Form, letter, and script generator rules" items={generatorRules.map((item) => `${item.title}: ${item.text}`)} icon={<MessageSquareText className="h-5 w-5" />} />
        <Checklist title="Follow-through workflow" items={["Create task with owner, deadline, documents, phone/email, and backup", "Log every call, voicemail, denial, missing document, and promise to follow up", "If no response by follow-up date, escalate to alternate program/contact/script", "Weekly check-in asks what changed and recalculates the plan", "Generate human-readable case packet for advocates"]} icon={<RefreshCw className="h-5 w-5" />} />
        <Checklist title="Backend data fields" items={backendFields} icon={<Archive className="h-5 w-5" />} />
        <Checklist title="Admin dashboard" items={adminFeatures.map((item) => `${item.title}: ${item.text}`)} icon={<BadgeCheck className="h-5 w-5" />} />
        <Checklist title="Source verification system" items={["Each legal/program/resource statement stores jurisdiction, source type, source link or file, reviewer, reviewed date, expiration/recheck date, and confidence level", "Statuses: Verified, Needs Verification, Stale, Conflicting, Superseded, or Human Review Required", "Public UI never hides uncertainty; uncertain criteria and deadlines are labeled Needs Verification", "Admin changes are audited and can be rolled back"]} icon={<ShieldCheck className="h-5 w-5" />} />
        <Checklist title="Creative innovation tools" items={["Housing barrier scorecard", "Alternative plan generator", "Do-not-abandon follow-up loop", "Warm handoff checklist", "Landlord communication tracker", "Application and voucher deadline trackers", "Utility shutoff prevention pathway", "Family safety pathway", "Benefits eligibility reminders marked Needs Verification until checked"]} icon={<Zap className="h-5 w-5" />} />
      </div>
    </section>
  );
}
