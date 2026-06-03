/*
 * HOW IT WORKS PAGE — Editorial Civic Design
 * Explains why affordable housing is hidden, ARCH vs MFTE, and why direct contact is required
 */
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { ArrowRight, ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const HOW_IT_WORKS_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663342387877/3nNbT3jBTC4Jirx7fWDuwg/how-it-works-bg-RzYGWpe7GU6uUthoco5CN4.webp';

export default function HowItWorks() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7]">
      <Navbar />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={HOW_IT_WORKS_BG} alt="Affordable housing interior" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#1B4332]/85" />
        </div>
        <div className="relative container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <span className="inline-block bg-[#D97706]/20 text-[#FCD34D] text-xs font-body font-medium px-3 py-1 rounded-full border border-[#D97706]/30 mb-4 uppercase tracking-wider">
              The real story
            </span>
            <h1 className="font-display text-white text-4xl sm:text-5xl font-bold leading-tight mb-4">
              Why Is Affordable Housing So Hard to Find?
            </h1>
            <p className="text-[#D8F3DC] font-body text-lg leading-relaxed">
              It's not that there isn't enough of it. It's that the system isn't designed to help you find it. Here's what's actually going on.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container py-16 max-w-4xl mx-auto">
        <div className="space-y-16">

          {/* Section 1 */}
          <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-10 h-10 bg-[#1B4332] rounded-full flex items-center justify-center text-white font-data font-bold">1</div>
              <h2 className="font-display text-[#1B4332] text-2xl font-bold leading-snug">
                Affordable units are hidden in plain sight
              </h2>
            </div>
            <div className="ml-14 space-y-4">
              <p className="text-[#374151] font-body leading-relaxed">
                When a developer builds a new apartment building in Bellevue, they often receive tax breaks or public subsidies in exchange for setting aside a percentage of units at below-market rents. These are called <strong>ARCH units</strong> (A Regional Coalition for Housing) or <strong>MFTE units</strong> (Multifamily Tax Exemption).
              </p>
              <p className="text-[#374151] font-body leading-relaxed">
                Here's the problem: <strong>these units are almost never advertised.</strong> The building's website shows the market-rate units. The leasing agent's default response is to quote you the full price. The affordable units exist — they're just not surfaced unless you ask.
              </p>
              <div className="bg-[#FFFBEB] border-l-4 border-[#D97706] rounded-r-xl p-4">
                <p className="text-[#78350F] font-body text-sm leading-relaxed">
                  <strong>Real example:</strong> A 200-unit building in downtown Bellevue might have 20 ARCH units at 80% AMI. Those 20 units are not listed on Apartments.com. They're not on the building's website. You have to call and specifically ask for them.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Section 2: ARCH vs MFTE */}
          <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-10 h-10 bg-[#1B4332] rounded-full flex items-center justify-center text-white font-data font-bold">2</div>
              <h2 className="font-display text-[#1B4332] text-2xl font-bold leading-snug">
                ARCH vs. MFTE: What's the difference?
              </h2>
            </div>
            <div className="ml-14">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                <div className="bg-white rounded-xl border border-[#95D5A3] p-5">
                  <div className="inline-flex items-center bg-[#D8F3DC] text-[#1B4332] text-sm font-body font-semibold px-3 py-1 rounded-full border border-[#95D5A3] mb-3">
                    ARCH
                  </div>
                  <h3 className="font-display text-[#1B4332] font-semibold text-base mb-2">A Regional Coalition for Housing</h3>
                  <ul className="space-y-2 text-[#374151] text-sm font-body">
                    <li className="flex items-start gap-2"><span className="text-[#52B788] mt-0.5">✓</span> Partnership of East King County cities</li>
                    <li className="flex items-start gap-2"><span className="text-[#52B788] mt-0.5">✓</span> Income limits: typically 50–80% AMI</li>
                    <li className="flex items-start gap-2"><span className="text-[#52B788] mt-0.5">✓</span> Found in both older and newer buildings</li>
                    <li className="flex items-start gap-2"><span className="text-[#52B788] mt-0.5">✓</span> Must apply directly with the property</li>
                    <li className="flex items-start gap-2"><span className="text-[#D97706] mt-0.5">!</span> Not always advertised — you must ask</li>
                  </ul>
                </div>
                <div className="bg-white rounded-xl border border-[#FCD34D] p-5">
                  <div className="inline-flex items-center bg-[#FEF3C7] text-[#92400E] text-sm font-body font-semibold px-3 py-1 rounded-full border border-[#FCD34D] mb-3">
                    MFTE
                  </div>
                  <h3 className="font-display text-[#1B4332] font-semibold text-base mb-2">Multifamily Tax Exemption</h3>
                  <ul className="space-y-2 text-[#374151] text-sm font-body">
                    <li className="flex items-start gap-2"><span className="text-[#52B788] mt-0.5">✓</span> State program, city-administered</li>
                    <li className="flex items-start gap-2"><span className="text-[#52B788] mt-0.5">✓</span> Income limits: typically 65–80% AMI</li>
                    <li className="flex items-start gap-2"><span className="text-[#52B788] mt-0.5">✓</span> Usually in newer, nicer buildings</li>
                    <li className="flex items-start gap-2"><span className="text-[#52B788] mt-0.5">✓</span> Rents are set below market rate</li>
                    <li className="flex items-start gap-2"><span className="text-[#D97706] mt-0.5">!</span> Ask for "income-qualified" or "MFTE" units</li>
                  </ul>
                </div>
              </div>
              <div className="bg-[#F9FAFB] rounded-xl border border-[#E8E7E1] p-5">
                <h4 className="font-display text-[#1B4332] font-semibold text-base mb-2">AMI — What Does It Mean?</h4>
                <p className="text-[#374151] font-body text-sm leading-relaxed mb-3">
                  AMI stands for Area Median Income. In King County, the 2025 AMI for a single person is approximately $107,000/year. So 80% AMI = $85,600/year for one person.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm font-body">
                    <thead>
                      <tr className="border-b border-[#E8E7E1]">
                        <th className="text-left py-2 pr-4 text-[#6B7280] font-medium">Household Size</th>
                        <th className="text-right py-2 pr-4 text-[#6B7280] font-medium">50% AMI</th>
                        <th className="text-right py-2 pr-4 text-[#6B7280] font-medium">80% AMI</th>
                        <th className="text-right py-2 text-[#6B7280] font-medium">100% AMI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['1 person', '$53,500', '$85,600', '$107,000'],
                        ['2 people', '$61,100', '$97,800', '$122,200'],
                        ['3 people', '$68,750', '$110,000', '$137,500'],
                        ['4 people', '$76,400', '$122,200', '$152,800'],
                      ].map(([size, ami50, ami80, ami100]) => (
                        <tr key={size} className="border-b border-[#F0EFE9]">
                          <td className="py-2 pr-4 text-[#374151] font-medium">{size}</td>
                          <td className="py-2 pr-4 text-right font-data text-[#1B4332]">{ami50}</td>
                          <td className="py-2 pr-4 text-right font-data text-[#1B4332]">{ami80}</td>
                          <td className="py-2 text-right font-data text-[#1B4332]">{ami100}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-[#9CA3AF] text-xs font-body mt-2">Approximate 2025 King County figures. Verify current limits at archhousing.org.</p>
              </div>
            </div>
          </motion.section>

          {/* Section 3: Section 8 */}
          <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-10 h-10 bg-[#1B4332] rounded-full flex items-center justify-center text-white font-data font-bold">3</div>
              <h2 className="font-display text-[#1B4332] text-2xl font-bold leading-snug">
                Section 8 is different — and harder
              </h2>
            </div>
            <div className="ml-14 space-y-4">
              <p className="text-[#374151] font-body leading-relaxed">
                Section 8 (officially the Housing Choice Voucher Program) is administered by the King County Housing Authority (KCHA). Unlike ARCH and MFTE, you don't apply to a specific property — you apply for a <em>voucher</em>, then find a landlord who accepts it.
              </p>
              <div className="bg-[#DBEAFE] border-l-4 border-[#93C5FD] rounded-r-xl p-4">
                <p className="text-[#1E3A8A] font-body text-sm leading-relaxed">
                  <strong>Important:</strong> KCHA's Section 8 waitlist is currently closed. When it reopens, it typically receives tens of thousands of applications within days. Sign up for KCHA notifications at <a href="https://www.kcha.org" target="_blank" rel="noopener noreferrer" className="underline">kcha.org</a>.
                </p>
              </div>
              <p className="text-[#374151] font-body leading-relaxed">
                If you already have a voucher, the properties in our database that accept Section 8 are a good starting point. Call them directly and ask if they're currently accepting vouchers.
              </p>
            </div>
          </motion.section>

          {/* Section 4: Why direct contact */}
          <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-10 h-10 bg-[#1B4332] rounded-full flex items-center justify-center text-white font-data font-bold">4</div>
              <h2 className="font-display text-[#1B4332] text-2xl font-bold leading-snug">
                Why you have to contact properties directly
              </h2>
            </div>
            <div className="ml-14 space-y-4">
              <p className="text-[#374151] font-body leading-relaxed">
                There is no central waitlist for ARCH or MFTE housing. Each property manages its own waitlist independently. ARCH does not track vacancies. The City of Bellevue does not maintain a real-time availability database.
              </p>
              <p className="text-[#374151] font-body leading-relaxed">
                This means the only way to know if a unit is available is to call the leasing office directly. And the only way to get on a waitlist is to call and ask to be added.
              </p>
              <div className="bg-[#1B4332] rounded-xl p-5 text-white">
                <h4 className="font-display text-white font-bold text-base mb-3">The strategy that works:</h4>
                <ol className="space-y-2">
                  {[
                    'Use Decoded Housing to find properties in your target city.',
                    'Call each property and ask specifically for ARCH or MFTE units.',
                    'Ask to be added to the waitlist even if nothing is available.',
                    'Follow up every 2–4 weeks.',
                    'Keep a spreadsheet of who you called and what they said.',
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-[#D8F3DC] text-sm font-body">
                      <span className="flex-shrink-0 w-5 h-5 bg-[#D97706] rounded-full flex items-center justify-center text-xs font-data font-bold text-white">{i + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </motion.section>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#FAFAF7] rounded-2xl border border-[#E8E7E1] p-8 text-center"
          >
            <h3 className="font-display text-[#1B4332] text-2xl font-bold mb-3">Ready to start?</h3>
            <p className="text-[#6B7280] font-body mb-6">Search the database, find properties near you, and use our phone scripts to know exactly what to say.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/search')}
                className="flex items-center gap-2 justify-center px-6 py-3 bg-[#1B4332] text-white rounded-lg font-body font-medium hover:bg-[#2D6A4F] transition-colors"
              >
                Search properties <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/scripts')}
                className="flex items-center gap-2 justify-center px-6 py-3 bg-white text-[#1B4332] rounded-lg font-body font-medium border border-[#1B4332] hover:bg-[#D8F3DC] transition-colors"
              >
                Get phone scripts
              </button>
            </div>
          </motion.div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
