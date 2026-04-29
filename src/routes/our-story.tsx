import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/our-story")({
  head: () => ({
    meta: [{ title: "Our Story — Why We Built This" }],
  }),
  component: OurStoryPage,
});

function OurStoryPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#1A1A18]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        .story-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(250,248,243,0.92); backdrop-filter: blur(12px); border-bottom: 1px solid #E0DDD6; padding: 0 40px; height: 60px; display: flex; align-items: center; justify-content: space-between; }
        .story-logo { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 700; color: #1B4332; text-decoration: none; letter-spacing: 0.3px; }
        .story-logo span { color: #52B788; }
        .story-back { font-size: 13px; color: #7A7268; text-decoration: none; display: flex; align-items: center; gap: 6px; }
      `}</style>

      <nav className="story-nav">
        <Link to="/" className="story-logo">
          Decoded<span>Housing</span>
        </Link>
        <Link to="/search" className="story-back">
          ← Find Housing
        </Link>
      </nav>

      <div className="mx-auto max-w-[820px] px-10 pb-20 pt-[140px]">
        <div className="mb-7 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[3px] text-[#52B788]">
          <span className="block h-px w-8 bg-[#52B788]" />
          Our story
        </div>
        <h1 className="mb-8 font-serif text-[clamp(44px,7vw,84px)] font-bold leading-[1.05] tracking-[-1px] text-[#1B4332]">
          Not Homeless.
          <br />
          <em className="text-[#C47A1A]">But Houseless.</em>
        </h1>
        <p className="max-w-[640px] border-l-[3px] border-[#52B788] pl-6 text-[19px] font-light leading-[1.75] text-[#3D3D38]">
          This platform was built by someone who lived the failure of the system — three months in a van with an
          infant, calling every number, hitting every wall. This is that story.
        </p>
      </div>

      <div className="mx-auto flex max-w-[820px] items-center gap-4 px-10">
        <span className="h-px flex-1 bg-[#E0DDD6]" />
        <span className="text-base text-[#E0DDD6]">◆</span>
        <span className="h-px flex-1 bg-[#E0DDD6]" />
      </div>

      <section className="mx-auto max-w-[820px] px-10 pb-[120px] pt-[60px] text-[17px] leading-[1.85] text-[#2E2E2B]">
        <p className="mb-4 mt-16 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[3px] text-[#7A7268]">
          <span>How it started</span><span className="h-px flex-1 bg-[#E0DDD6]" />
        </p>
        <p className="mb-6 font-light">My family lost our home to a landlord who refused rental assistance after COVID. He knew our mobile home — fully paid for — would be impossible to move in time. He chose to evict us, lied to us, and later we found out his actions were illegal. When we returned a month later to retrieve our belongings, everything we owned was outside in the mud — broken, stolen, or destroyed. Everything from our child's first year of life, gone.</p>
        <p className="mb-6 font-light">When we were evicted, our son was nine months old. He had been born premature, six weeks early, after a pregnancy so high-risk they feared we would both lose our lives.</p>
        <div className="relative my-[52px] border-l-4 border-[#C47A1A] py-10 pl-9 font-serif text-[clamp(22px,3.5vw,32px)] font-semibold italic leading-[1.4] text-[#1B4332]">I spent hours upon days upon weeks trying to find us somewhere to go. I contacted every nonprofit or government entity involved with the homeless, shelters, affordable housing and housing authorities from Thurston to Snohomish to Kitsap to Pierce to King County — and absolutely no one had a spot for us.</div>

        <p className="mb-4 mt-16 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[3px] text-[#7A7268]"><span>Three months in the van</span><span className="h-px flex-1 bg-[#E0DDD6]" /></p>
        <p className="mb-6 font-light">We accepted our fate. We took out the third-row seating, put a futon mattress in the back, blacked out the windows, and shoved everything we could along the sides — our clothes, the baby's toys. We would drive somewhere safe and park. I would put him to sleep in the back like everything was normal.</p>

        <div className="relative my-10 rounded-sm border border-[#E0DDD6] bg-white px-9 py-8 shadow-[0_2px_20px_rgba(27,67,50,0.05)]"><span className="absolute inset-y-0 left-0 w-1 bg-[#1B4332]" /><p className="font-serif text-[19px] italic leading-[1.7] text-[#1A1A18]">"I lay with our son, unable to sleep, keeping aware of any noises around us. My boyfriend and I both always aware of any people or police around the van. Both equally a danger to our way of living and survival."</p><p className="mt-3.5 font-mono text-[12px] tracking-wide text-[#7A7268]">Amber — founder, KC Housing Hub</p></div>
      </section>
    </div>
  );
}
