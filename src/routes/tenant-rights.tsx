import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tenant-rights")({
  head: () => ({
    meta: [
      { title: "Tenant Rights & Legal Aid — Decoded Housing" },
      {
        name: "description",
        content:
          "Know your Washington tenant rights, get eviction-prevention steps, and connect with free legal aid in King County.",
      },
    ],
  }),
  component: TenantRightsPage,
});

function TenantRightsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-6 rounded-2xl bg-emerald-950 p-6 text-white sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">Tenant Rights & Legal Aid</p>
        <h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">Know your rights. Use them.</h1>
        <p className="mt-3 max-w-3xl text-sm text-emerald-100 sm:text-base">
          Washington State tenant protections can help prevent illegal denials, unfair screening, and avoidable evictions.
          This page summarizes key protections and connects you to free help.
        </p>
      </header>

      <section className="mb-10 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 sm:p-5">
        <p className="font-bold">⚠ Facing eviction right now?</p>
        <p className="mt-1">
          Call <a className="font-bold underline" href="tel:211">211</a> for emergency assistance and
          <a className="ml-1 font-bold underline" href="https://www.columbialegal.org" target="_blank" rel="noreferrer">Columbia Legal Services (888) 201-1014</a>.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold">Core tenant protections</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <RightCard title="Voucher / lawful income protection" law="RCW 59.18.255" body="Landlords cannot deny solely because your rent is paid by a housing voucher or another lawful income source." link="https://app.leg.wa.gov/RCW/default.aspx?cite=59.18.255" />
          <RightCard title="Screening criteria disclosure" law="RCW 59.18.257" body="Before charging an application fee, landlords must provide written screening criteria and denial standards." link="https://app.leg.wa.gov/RCW/default.aspx?cite=59.18.257" />
          <RightCard title="Just-cause eviction rules" law="RCW 59.18.650" body="Landlords generally must have a legal reason to terminate tenancy. Eviction notices are not immediate lockouts." link="https://app.leg.wa.gov/RCW/default.aspx?cite=59.18.650" />
          <RightCard title="Anti-retaliation protections" law="RCW 59.18.240" body="A landlord cannot lawfully evict or punish you for asserting rights like requesting repairs or reporting violations." link="https://app.leg.wa.gov/RCW/default.aspx?cite=59.18.240" />
        </div>
      </section>

      <section className="mb-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <h2 className="text-xl font-bold text-emerald-900">If you receive an eviction notice</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-emerald-900">
          <li>Call 211 immediately for rental-assistance referrals.</li>
          <li>Contact legal aid the same day.</li>
          <li>Keep every notice, payment receipt, and communication.</li>
          <li>Do not ignore court papers; deadlines are short.</li>
        </ol>
      </section>

      <section>
        <h2 className="text-2xl font-bold">Free legal help in King County</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Partner name="Columbia Legal Services" contact="(888) 201-1014" href="https://www.columbialegal.org" description="Eviction defense and fair housing legal aid." />
          <Partner name="ELAP" contact="(425) 747-7274" href="https://www.elap.org" description="Civil legal aid in East King County." />
          <Partner name="Housing Justice Project" contact="(206) 267-7069" href="https://www.washington.edu/law/clinical-law/clinics/housing-justice-project/" description="Court-based eviction defense support." />
          <Partner name="WA Human Rights Commission" contact="(800) 233-3247" href="https://www.hum.wa.gov" description="File housing discrimination complaints for free." />
        </div>
      </section>
    </main>
  );
}

function RightCard({ title, law, body, link }: { title: string; law: string; body: string; link: string }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold">{title}</h3>
        <span className="rounded bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-900">{law}</span>
      </div>
      <p className="text-sm text-muted-foreground">{body}</p>
      <a className="mt-2 inline-block text-sm font-semibold text-primary underline" href={link} target="_blank" rel="noreferrer">
        Read statute
      </a>
    </article>
  );
}

function Partner({ name, description, contact, href }: { name: string; description: string; contact: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="rounded-xl border border-border bg-card p-4 no-underline transition hover:border-emerald-400">
      <h3 className="text-sm font-bold text-foreground">{name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <p className="mt-2 text-sm font-semibold text-primary">{contact}</p>
    </a>
  );
}
