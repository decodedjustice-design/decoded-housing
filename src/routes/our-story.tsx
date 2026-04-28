import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, AlertTriangle, ClipboardList } from "lucide-react";

export const Route = createFileRoute("/our-story")({
  head: () => ({
    meta: [
      { title: "Our Story — Why We Built Decoded Housing" },
      {
        name: "description",
        content:
          "Built by a family who lived three months in a van after the housing system failed them. This is why every feature on Decoded Housing exists.",
      },
      { property: "og:title", content: "Our Story — Why We Built Decoded Housing" },
      {
        property: "og:description",
        content:
          "Not homeless. Houseless. The story behind King County's affordable housing hub — built from inside the failure of the system.",
      },
    ],
  }),
  component: OurStoryPage,
});

function Chapter({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-16 mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[3px] text-muted-foreground">
      <span>{children}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-6 text-[17px] font-light leading-[1.85] text-foreground/85">{children}</p>
  );
}

function Moment({ quote, context }: { quote: string; context: string }) {
  return (
    <div className="relative my-10 rounded-sm border border-border bg-card px-9 py-8 shadow-[0_2px_20px_rgba(27,67,50,0.05)]">
      <span className="absolute inset-y-0 left-0 w-1 rounded-l-sm bg-primary" />
      <p className="font-serif text-[19px] italic leading-[1.7] text-foreground">"{quote}"</p>
      <p className="mt-3.5 font-mono text-[12px] tracking-wide text-muted-foreground">{context}</p>
    </div>
  );
}

const failures = [
  'Called 211 — told not to expect a callback. "Everything is full." Coordinated Entry had no help to give.',
  "Denied housing by a nonprofit for a criminal record that doesn't exist. No explanation. No appeal. No adverse action letter.",
  'Denied by a property for "income" — illegal under Washington State law, because WA requires landlords to accept any lawful income source, including vouchers.',
  'Denied a second time — same property, "reprocessed" — this time for his criminal record, not mine. Three misdemeanors not mentioned the first time. His name is Edgar. He is Mexican. Their criteria changed when they met him in person.',
  "Held a KCHA housing voucher — a guaranteed payment to a landlord — for three months and still could not find anyone willing to rent to us.",
  "The Coordinated Entry system — which receives federal HUD funding and forces all nonprofits to participate — told families with infants that single adult drug addicts are the priority. In writing. With our tax dollars.",
];

const built = [
  {
    icon: "🔍",
    title: "The Shelter Finder with real ranked results",
    desc: "Because 211 gave me a list of numbers that all led back to one place with no help. You deserve to know what's actually available before you call.",
  },
  {
    icon: "📋",
    title: "The Eligibility Checker",
    desc: "Because I didn't know what programs we qualified for. No one told me. I had to learn the AMI system, the income limits, the program tiers — on my own, in a van, with a baby.",
  },
  {
    icon: "📞",
    title: "Phone Scripts with the exact words to use",
    desc: "Because ARCH units are invisible unless you call and use the right language. The building's website will never show you those units. You have to ask — and you have to know how to ask.",
  },
  {
    icon: "⚖️",
    title: "Tenant Rights & Fair Housing resources",
    desc: "Because I was denied for income source — which is illegal in Washington State. I knew the law. Most people don't. I'm putting it where they can find it.",
  },
  {
    icon: "🏗️",
    title: "The full property database — every program, every provider",
    desc: "Because I called every number. Not all of them are in the same place. They should be. ARCH, MFTE, LIHTC, HUD, LIHI, Mercy, Imagine Housing — all of it, in one place, with real contact info.",
  },
  {
    icon: "🚨",
    title: "Fraud & discrimination reporting",
    desc: "Because what happened to Edgar — the criteria that changed when they met him — happens every day. There should be somewhere to report it that isn't a phone tree that goes nowhere.",
  },
];

function OurStoryPage() {
  return (
    <div className="bg-background text-foreground">
      {/* HERO */}
      <section className="mx-auto max-w-[820px] px-6 pb-20 pt-20 sm:px-10">
        <div className="mb-7 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[3px] text-primary">
          <span className="block h-px w-8 bg-primary" />
          Our story
        </div>
        <h1 className="font-serif text-[clamp(44px,7vw,84px)] font-bold leading-[1.05] tracking-tight text-primary">
          Not Homeless.
          <br />
          But <em className="italic text-[hsl(28_75%_42%)]">Houseless.</em>
        </h1>
        <p className="mt-8 max-w-[640px] border-l-[3px] border-primary/70 pl-6 text-[19px] font-light leading-[1.75] text-foreground/80">
          This platform was built by someone who lived the failure of the system — three months in a van with an infant,
          calling every number, hitting every wall. This is that story.
        </p>
      </section>

      <div className="mx-auto flex max-w-[820px] items-center gap-4 px-6 sm:px-10">
        <span className="h-px flex-1 bg-border" />
        <span className="text-base text-border">◆</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      {/* CONTENT */}
      <section className="mx-auto max-w-[820px] px-6 pb-24 pt-16 sm:px-10">
        <Chapter>How it started</Chapter>
        <Body>
          My family lost our home to a landlord who refused rental assistance after COVID. He knew our mobile home —
          fully paid for — would be impossible to move in time. He chose to evict us, lied to us, and later we found out
          his actions were illegal. When we returned a month later to retrieve our belongings, everything we owned was
          outside in the mud — broken, stolen, or destroyed. Everything from our child's first year of life, gone.
        </Body>
        <Body>
          When we were evicted, our son was nine months old. He had been born premature, six weeks early, after a
          pregnancy so high-risk they feared we would both lose our lives.
        </Body>
        <Body>
          I spent hours upon days upon weeks trying to find us somewhere to go. I contacted every nonprofit or
          government entity involved with the homeless, shelters, affordable housing and housing authorities from
          Thurston to Snohomish to Kitsap to Pierce to King County — and absolutely no one had a spot for us.
        </Body>

        <Chapter>Three months in the van</Chapter>
        <Body>
          We accepted our fate. We took out the third-row seating, put a futon mattress in the back, blacked out the
          windows, and shoved everything we could along the sides — our clothes, the baby's toys. We would drive
          somewhere safe and park. I would put him to sleep in the back like everything was normal.
        </Body>

        <Moment
          quote="I lay with our son, unable to sleep, keeping aware of any noises around us. My boyfriend and I both always aware of any people or police around the van. Both equally a danger to our way of living and survival."
          context="Amber — founder, Decoded Housing"
        />

        <Body>
          Gas was $5 a gallon. It cost us $50 a day just to keep the van warm enough for the baby. Our food stamps were
          running out because we had nowhere to cook or store food. My boyfriend couldn't go to work — he didn't want
          to leave us out there alone.
        </Body>
        <Body>
          I called the family shelter line every morning at 8am. I was put on a list, right behind all the other
          families who never got a call back. I was told not to expect one.
        </Body>

        <Chapter>The night the phone rang</Chapter>
        <Body>
          One night we glided into a gas station on fumes. We knew we had about two hours before the attendant would
          notice us, then the police would come. I was making the bed as warm as possible with blankets, putting paper
          towels in the slots of the hatch, taping over the gaps to keep the cold out. The only part of my son you
          could see was his little round face — his big eyes looking at me with complete innocence.
        </Body>

        <Moment
          quote="My phone rang. It was almost 9pm. I did not want to answer. Then I heard: 'Is this Amber? We have activated our emergency services, and we have a place for your family tonight. Can you make it to Bellevue?'"
          context="The call from Mary's Place — after two months in the van"
        />

        <Body>
          We got to Mary's Place late at night, exhausted — mentally and physically drained. We needed showers and warm
          food. We hadn't slept in a bed in months. Our son cried to go back to the van to sleep. That was the home he
          had come accustomed to. It took weeks to get him used to being indoors. At almost two years old, he still
          sleeps snuggled under my chin every night, hands wrapped in my hair, as close to my body as possible. His
          walking was delayed until he was almost 15 months old — because he couldn't get up and practice in the van.
        </Body>

        <Chapter>What the system did next</Chapter>
        <Body>
          We were referred to an apartment through a nonprofit. I spent a week collecting every document they asked
          for. We did the intake over the phone. We were going to finally have a home.
        </Body>
        <Body>
          I never got the callback. When I called to check, I was told we were denied for criminal history — for both
          of us. I have never been convicted of anything in my life. No adverse letter. No explanation. Nothing. They
          said since they were a nonprofit, they didn't have to follow standard rules. We found this out on our son's
          first birthday.
        </Body>

        <div className="my-12 rounded text-primary-foreground" style={{ background: "hsl(155 47% 15%)" }}>
          <div className="px-10 py-9">
            <h3 className="mb-5 font-serif text-[26px] font-bold leading-tight text-white">
              What the system actually did to us
            </h3>
            <ul className="flex flex-col gap-3">
              {failures.map((f, i) => (
                <li key={i} className="flex items-start gap-3.5 text-[15px] leading-relaxed text-[#C8E6CC]">
                  <span className="mt-0.5 flex-shrink-0 rounded border border-[rgba(82,183,136,0.3)] bg-[rgba(82,183,136,0.15)] px-1.5 py-0.5 font-mono text-[11px] text-[#52B788]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Body>
          HUD released a study in 2023 that confirmed everything I experienced. To anyone reading that report: the
          impact won't be the same as for someone who has lived through it. Every concern pointed out is a mistake, and
          some mistakes that are being ignored and continually made. Think about what those mistakes cost the families
          seeking help. Maybe their warmth. Maybe their pride. Maybe their sanity. Maybe their life.
        </Body>
        <Body>The report is more than words and statistics on paper. To some of us, it's our lives.</Body>

        <Chapter>What we built from it</Chapter>

        <div className="my-12 rounded border border-border bg-muted/40 px-10 py-9">
          <h3 className="mb-2 font-serif text-[26px] font-bold text-primary">
            Every feature on this platform came from something that happened to us.
          </h3>
          <p className="mb-6 text-[13px] text-muted-foreground">
            This isn't a government project. It wasn't built by a committee. It was built by someone who made every
            call, hit every wall, and kept a list.
          </p>
          <div>
            {built.map((b, i) => (
              <div
                key={i}
                className="flex items-start gap-4 border-b border-border py-3.5 last:border-b-0"
              >
                <div className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-md bg-primary/10 text-base">
                  {b.icon}
                </div>
                <div>
                  <div className="mb-1 text-sm font-semibold text-primary">{b.title}</div>
                  <div className="text-[13px] leading-snug text-muted-foreground">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Christian */}
        <div className="-mx-6 my-16 border-y border-border bg-card px-6 py-20 text-center sm:-mx-10 sm:px-10">
          <div className="font-serif text-[clamp(36px,6vw,64px)] font-bold italic leading-[1.1] text-primary">
            For Christian.
          </div>
          <p className="mx-auto mt-5 max-w-[560px] text-[17px] font-light leading-[1.8] text-foreground/80">
            He deserved more than a hang-up. More than "sorry, we're full." He deserved warmth. He deserved a home. He
            deserved more thought than an auto-denial based on criteria that had nothing to do with whether we would be
            good neighbors.
            <br />
            <br />
            He is why this exists. He is why it will keep growing.
          </p>
        </div>

        {/* Closing */}
        <div className="mt-16 border-t-2 border-primary pt-12">
          <h2 className="mb-6 font-serif text-[clamp(28px,4vw,44px)] font-bold leading-tight text-primary">
            This platform exists because the system failed us — and we are not the only ones.
          </h2>
          <Body>
            Thirty-three percent of Americans have a credit score below 650. One third hold some kind of criminal
            record. After COVID, a third of this country cannot rent a decent, safe home. These are not bad people.
            They are people who fell between the cracks of every program that was supposed to catch them.
          </Body>
          <Body>
            We have drug addicts sitting in homes, living a great life, while babies are crying cold and scared
            outside. Does anyone not understand how morally wrong that is?
          </Body>
          <Body>
            Landlords decide — mostly with bias and prejudice — who they will rent to. The law is a laughing matter to
            them. That is a large factor in the homeless crisis in Western Washington.
          </Body>
          <Body>
            In the end, we found a home. We were blessed to find a company that understands equality, compassion, and
            empathy within their business practices. We love you, Mary's Place — the St. Theresa of Seattle. We love
            you, VCCC. You are proof that it doesn't have to be this way.
          </Body>
          <Body>The industry can have compassion and still thrive. The others who lack it are not justified.</Body>

          <div className="mt-12 flex flex-wrap items-end gap-6">
            <div>
              <div className="font-serif text-[28px] font-semibold italic leading-tight text-primary">Amber</div>
              <div className="mt-1 font-mono text-[12px] tracking-wide text-muted-foreground">
                Founder · Decoded Housing · Bellevue, WA
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary px-6 py-16 text-center sm:px-10">
        <h2 className="mb-3 font-serif text-[clamp(28px,4vw,44px)] font-bold text-primary-foreground">
          Now let's find you a home.
        </h2>
        <p className="mx-auto mb-8 max-w-[500px] text-base font-light text-primary-foreground/80">
          The database is free. The phone scripts are free. The eligibility checker is free. All of it.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/search"
            className="inline-flex items-center gap-2 rounded bg-background px-8 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-muted"
          >
            <Search className="h-4 w-4" /> Search Housing
          </Link>
          <Link
            to="/shelter"
            className="inline-flex items-center gap-2 rounded border border-primary-foreground/35 px-8 py-3.5 text-sm text-primary-foreground transition-colors hover:border-primary-foreground"
          >
            <AlertTriangle className="h-4 w-4" /> Get Shelter Now
          </Link>
          <Link
            to="/apply"
            className="inline-flex items-center gap-2 rounded border border-primary-foreground/35 px-8 py-3.5 text-sm text-primary-foreground transition-colors hover:border-primary-foreground"
          >
            <ClipboardList className="h-4 w-4" /> Check Eligibility
          </Link>
        </div>
      </section>
    </div>
  );
}