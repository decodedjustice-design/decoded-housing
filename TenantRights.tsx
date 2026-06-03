/*
 * TENANT RIGHTS — /tenant-rights
 * Fair housing laws, eviction prevention, legal advocacy links
 */
import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import {
  Scale, Phone, ExternalLink, ArrowRight, CheckCircle2,
  AlertCircle, ChevronDown, ChevronUp, Shield, FileText, Info
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const RIGHTS = [
  {
    title: 'Right to a Habitable Home',
    summary: 'Your landlord must maintain the rental in a safe, livable condition.',
    details: [
      'Working heat, plumbing, and electricity',
      'Weatherproofing and structural integrity',
      'Freedom from pest infestations',
      'Functioning smoke and carbon monoxide detectors',
    ],
    law: 'RCW 59.18.060 — Washington Residential Landlord-Tenant Act',
  },
  {
    title: 'Right to Notice Before Entry',
    summary: 'Landlords must give at least 2 days written notice before entering your unit (except emergencies).',
    details: [
      'Minimum 2 days advance written notice required',
      'Entry must be at reasonable times',
      'Emergency entry allowed without notice',
      'You can refuse entry if proper notice was not given',
    ],
    law: 'RCW 59.18.150',
  },
  {
    title: 'Protection Against Retaliation',
    summary: 'Your landlord cannot retaliate against you for exercising your legal rights.',
    details: [
      'Cannot raise rent or reduce services in response to a complaint',
      'Cannot threaten eviction for reporting code violations',
      'Cannot harass you for organizing with other tenants',
      'Retaliation is presumed if action taken within 90 days of protected activity',
    ],
    law: 'RCW 59.18.240',
  },
  {
    title: 'Security Deposit Protections',
    summary: 'Strict rules govern how landlords can collect and return security deposits.',
    details: [
      'Landlord must provide written checklist of existing conditions at move-in',
      'Must return deposit within 21 days of move-out',
      'Must provide itemized statement for any deductions',
      'Normal wear and tear cannot be deducted',
    ],
    law: 'RCW 59.18.260 – 59.18.285',
  },
  {
    title: 'Eviction Protections',
    summary: 'You cannot be evicted without proper legal process and just cause.',
    details: [
      'Landlord must provide written notice (3, 10, or 20 days depending on reason)',
      'Must file an unlawful detainer lawsuit in court to evict you',
      'You have the right to respond and appear in court',
      'Self-help eviction (changing locks, removing belongings) is illegal',
      'Just Cause Eviction Protection applies in many King County cities',
    ],
    law: 'RCW 59.18.650 — Just Cause Eviction',
  },
  {
    title: 'Fair Housing Rights',
    summary: 'You cannot be discriminated against based on protected characteristics.',
    details: [
      'Federal: race, color, national origin, religion, sex, disability, familial status',
      'Washington State adds: sexual orientation, gender identity, veteran status, citizenship',
      'King County adds: source of income (Section 8 vouchers must be accepted)',
      'Bellevue and other cities may have additional protections',
    ],
    law: 'Fair Housing Act + RCW 49.60 (Washington Law Against Discrimination)',
  },
];

const LEGAL_RESOURCES = [
  {
    name: 'Tenants Union of Washington State',
    description: 'Free counseling, workshops, and advocacy for renters across Washington.',
    phone: '206-723-0500',
    website: 'https://tenantsunion.org',
    type: 'Advocacy',
    serves: 'All of Washington',
  },
  {
    name: 'Eastside Legal Assistance Program (ELAP)',
    description: 'Free civil legal aid for low-income residents of East King County, including housing cases.',
    phone: '425-747-7274',
    website: 'https://www.elap.org',
    type: 'Legal Aid',
    serves: 'East King County',
  },
  {
    name: 'King County Bar Association Lawyer Referral',
    description: 'Referral to attorneys who handle landlord-tenant disputes. $30 initial consultation.',
    phone: '206-267-7010',
    website: 'https://www.kcba.org/For-the-Public/Free-Legal-Assistance/Neighborhood-Legal-Clinics',
    type: 'Referral',
    serves: 'King County',
  },
  {
    name: 'Northwest Justice Project',
    description: 'Free civil legal assistance for low-income people, including eviction defense.',
    phone: '888-201-1014',
    website: 'https://nwjustice.org',
    type: 'Legal Aid',
    serves: 'All of Washington',
  },
  {
    name: 'HUD Housing Discrimination Hotline',
    description: 'Report fair housing violations and discrimination complaints.',
    phone: '800-669-9777',
    website: 'https://www.hud.gov/program_offices/fair_housing_equal_opp/online-complaint',
    type: 'Federal',
    serves: 'Nationwide',
  },
  {
    name: 'Washington State Attorney General — Landlord-Tenant',
    description: 'File complaints about landlord violations and get information on your rights.',
    phone: '800-551-4636',
    website: 'https://www.atg.wa.gov/landlord-tenant',
    type: 'State Agency',
    serves: 'All of Washington',
  },
];

const EVICTION_STEPS = [
  { step: 1, title: 'Receive written notice', desc: 'Landlord must give written notice — 3 days (nonpayment), 10 days (lease violation), or 20 days (no-cause, if allowed).' },
  { step: 2, title: 'Respond or cure', desc: 'You may be able to pay overdue rent or fix the lease violation within the notice period to stop the eviction.' },
  { step: 3, title: 'Unlawful detainer lawsuit', desc: 'If you don\'t respond, landlord files in court. You will receive a summons — respond within 7 days.' },
  { step: 4, title: 'Court hearing', desc: 'You have the right to appear and present your defense. Get legal help immediately if you receive a summons.' },
  { step: 5, title: 'Writ of restitution', desc: 'If the court rules against you, a writ is issued. You typically have 3 days to vacate.' },
];

export default function TenantRights() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7]">
      <Navbar />

      <div className="bg-[#1B4332] text-white py-12">
        <div className="container">
          <div className="max-w-2xl">
            <span className="text-[#95D5A3] text-xs font-body font-semibold uppercase tracking-widest mb-3 block">Support & Resources</span>
            <h1 className="font-display text-4xl font-bold mb-3">Tenant Rights & Legal Aid</h1>
            <p className="text-[#D8F3DC] font-body text-lg">
              Know your rights under Washington State law — and where to get free help if your rights are violated.
            </p>
          </div>
        </div>
      </div>

      {/* Emergency banner */}
      <div className="bg-red-50 border-b border-red-200">
        <div className="container py-3">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <p className="text-red-800 text-sm font-body">
              <strong>Facing eviction?</strong> Call ELAP at <a href="tel:4257477274" className="underline font-semibold">425-747-7274</a> or the Tenants Union at <a href="tel:2067230500" className="underline font-semibold">206-723-0500</a> immediately. Do not ignore a court summons.
            </p>
          </div>
        </div>
      </div>

      <main className="flex-1 container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">

            {/* Your Rights */}
            <div>
              <h2 className="font-display text-[#1B4332] text-2xl font-bold mb-5">Your Rights as a Renter</h2>
              <div className="space-y-3">
                {RIGHTS.map((right, i) => {
                  const isExp = expanded === right.title;
                  return (
                    <motion.div
                      key={right.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * i }}
                      className="bg-white rounded-xl border border-[#E8E7E1] shadow-sm overflow-hidden"
                    >
                      <button
                        className="w-full flex items-start gap-4 p-5 text-left hover:bg-[#FAFAF7] transition-colors"
                        onClick={() => setExpanded(isExp ? null : right.title)}
                      >
                        <div className="w-8 h-8 bg-[#D8F3DC] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Scale className="w-4 h-4 text-[#1B4332]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-display text-[#1B4332] font-bold text-base">{right.title}</h3>
                          <p className="text-[#6B7280] text-sm font-body mt-0.5">{right.summary}</p>
                        </div>
                        {isExp ? <ChevronUp className="w-4 h-4 text-[#9CA3AF] flex-shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-[#9CA3AF] flex-shrink-0 mt-1" />}
                      </button>
                      {isExp && (
                        <div className="px-5 pb-5 border-t border-[#E8E7E1]">
                          <ul className="space-y-2 mt-4 mb-3">
                            {right.details.map((d, j) => (
                              <li key={j} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#52B788] flex-shrink-0 mt-0.5" />
                                <span className="text-[#374151] text-sm font-body">{d}</span>
                              </li>
                            ))}
                          </ul>
                          <p className="text-[#9CA3AF] text-xs font-body italic">{right.law}</p>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Eviction process */}
            <div>
              <h2 className="font-display text-[#1B4332] text-2xl font-bold mb-5">The Eviction Process in Washington</h2>
              <div className="relative">
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-[#E8E7E1]" />
                <div className="space-y-4">
                  {EVICTION_STEPS.map((step, i) => (
                    <motion.div
                      key={step.step}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="relative pl-14"
                    >
                      <div className="absolute left-0 w-10 h-10 bg-[#1B4332] text-white rounded-full flex items-center justify-center font-display font-bold text-sm">
                        {step.step}
                      </div>
                      <div className="bg-white rounded-xl border border-[#E8E7E1] p-4 shadow-sm">
                        <h4 className="font-display text-[#1B4332] font-bold text-base mb-1">{step.title}</h4>
                        <p className="text-[#374151] text-sm font-body leading-relaxed">{step.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Legal resources */}
            <div>
              <h2 className="font-display text-[#1B4332] text-2xl font-bold mb-5">Free Legal Help</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {LEGAL_RESOURCES.map((org, i) => (
                  <motion.div
                    key={org.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="bg-white rounded-xl border border-[#E8E7E1] p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-display text-[#1B4332] font-bold text-sm leading-tight">{org.name}</h4>
                      <span className="px-2 py-0.5 bg-[#F0EFE9] text-[#6B7280] text-[10px] font-body font-semibold rounded-full flex-shrink-0">{org.type}</span>
                    </div>
                    <p className="text-[#6B7280] text-xs font-body leading-relaxed mb-3">{org.description}</p>
                    <p className="text-[#9CA3AF] text-[10px] font-body mb-3">Serves: {org.serves}</p>
                    <div className="flex flex-col gap-1.5">
                      {org.phone && (
                        <a href={`tel:${org.phone.replace(/[^0-9]/g, '')}`} className="flex items-center gap-2 text-[#1B4332] font-body font-medium text-xs hover:underline">
                          <Phone className="w-3.5 h-3.5" /> {org.phone}
                        </a>
                      )}
                      <a href={org.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#1B4332] font-body font-medium text-xs hover:underline">
                        <ExternalLink className="w-3.5 h-3.5" /> Visit website
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-red-600 text-white rounded-2xl p-6">
              <h3 className="font-display font-bold text-lg mb-2">Facing eviction?</h3>
              <p className="text-red-100 text-sm font-body leading-relaxed mb-4">
                Act immediately. You have rights. Do not ignore notices or court summons.
              </p>
              <a href="tel:4257477274" className="flex items-center gap-2 px-4 py-3 bg-white text-red-700 rounded-xl font-body font-bold text-sm hover:bg-red-50 transition-colors mb-2">
                <Phone className="w-4 h-4" /> ELAP: 425-747-7274
              </a>
              <a href="tel:2067230500" className="flex items-center gap-2 px-4 py-3 bg-white/20 text-white rounded-xl font-body font-medium text-sm hover:bg-white/30 transition-colors">
                <Phone className="w-4 h-4" /> Tenants Union: 206-723-0500
              </a>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8E7E1] p-5 shadow-sm">
              <h4 className="font-body font-semibold text-[#374151] text-sm mb-3">Quick reference</h4>
              <div className="space-y-2">
                {[
                  { label: 'Notice required to enter', value: '2 days' },
                  { label: 'Deposit return deadline', value: '21 days' },
                  { label: 'Nonpayment notice', value: '3 days' },
                  { label: 'Lease violation notice', value: '10 days' },
                  { label: 'No-cause notice (if allowed)', value: '20 days' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-[#F0EFE9] last:border-0">
                    <span className="text-[#6B7280] text-xs font-body">{item.label}</span>
                    <span className="text-[#1B4332] text-xs font-body font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#FFFBEB] border border-[#FCD34D]/40 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <Info className="w-4 h-4 text-[#D97706] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-body font-semibold text-[#92400E] text-sm mb-1">Source of income protection</h4>
                  <p className="text-[#78350F] text-xs font-body leading-relaxed">
                    In King County, landlords cannot refuse to rent to you because you have a Section 8 voucher. This is illegal discrimination.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8E7E1] p-5 shadow-sm">
              <h4 className="font-body font-semibold text-[#374151] text-sm mb-3">Related resources</h4>
              <div className="space-y-2">
                {[
                  { label: 'Rental assistance programs', href: '/rental-assistance' },
                  { label: 'Tenant portal', href: '/tenant-portal' },
                  { label: 'Supportive services', href: '/supportive-services' },
                ].map(link => (
                  <button key={link.href} onClick={() => navigate(link.href)} className="w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-sm font-body text-[#374151] hover:bg-[#F0EFE9] hover:text-[#1B4332] transition-colors">
                    {link.label} <ArrowRight className="w-4 h-4 text-[#9CA3AF]" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
