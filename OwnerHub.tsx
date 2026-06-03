/*
 * OWNER HUB — /owner-hub
 * For property owners and landlords: MFTE program, listing submission, KCHA landlord portal
 */
import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import {
  Building2, DollarSign, CheckCircle2, ExternalLink, Phone,
  ArrowRight, FileText, Users, Shield, Star, Info, ChevronDown, ChevronUp
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PROGRAMS = [
  {
    id: 'mfte',
    title: 'Multifamily Tax Exemption (MFTE)',
    badge: 'Tax Incentive',
    badgeColor: 'bg-blue-100 text-blue-700',
    summary: 'Receive a 12-year property tax exemption on the residential portion of your building in exchange for renting 20% of units at below-market rates.',
    benefits: [
      '12-year exemption on residential improvements',
      'Retain full market-rate income on 80% of units',
      'Attract stable, long-term tenants',
      'Contribute to community housing goals',
    ],
    requirements: [
      'Property must be in a designated MFTE zone',
      '20% of units must be affordable at 65–80% AMI',
      'Must maintain affordability for the full 12-year term',
      'Annual income certification of tenants required',
    ],
    contact: 'Contact your city\'s planning department to apply. Bellevue: 425-452-6800',
    website: 'https://bellevuewa.gov/city-government/departments/community-development/housing/multifamily-tax-exemption',
    phone: '425-452-6800',
  },
  {
    id: 'arch',
    title: 'ARCH Affordable Housing Program',
    badge: 'Partnership',
    badgeColor: 'bg-green-100 text-green-700',
    summary: 'Partner with ARCH to include income-restricted units in your development. ARCH provides funding, technical assistance, and marketing support.',
    benefits: [
      'Access to ARCH Housing Trust Fund grants and loans',
      'Technical assistance with affordable unit design',
      'Marketing support to fill affordable units',
      'Connection to qualified applicants',
    ],
    requirements: [
      'New construction or substantial rehabilitation',
      'Minimum 10–20% affordable units (varies by program)',
      'Income and rent restrictions for 50+ years',
      'Annual compliance reporting',
    ],
    contact: 'Contact ARCH directly to discuss your project.',
    website: 'https://www.archhousing.org',
    phone: '425-861-3677',
  },
  {
    id: 'kcha-landlord',
    title: 'KCHA Section 8 Landlord Program',
    badge: 'Voucher Program',
    badgeColor: 'bg-purple-100 text-purple-700',
    summary: 'Accept Section 8 Housing Choice Vouchers and receive guaranteed monthly rent payments directly from KCHA, plus free property inspections.',
    benefits: [
      'Guaranteed rent payments from KCHA',
      'Access to a large pool of pre-screened tenants',
      'Free annual property inspections',
      'Landlord damage claim fund available',
      'Dedicated landlord services team',
    ],
    requirements: [
      'Unit must pass HQS inspection',
      'Rent must be at or below fair market rent',
      'Must sign a Housing Assistance Payment (HAP) contract',
      'Cannot discriminate based on source of income',
    ],
    contact: 'Contact KCHA Landlord Services to get started.',
    website: 'https://www.kcha.org/landlords',
    phone: '206-214-1300',
  },
];

const FAQ = [
  {
    q: 'How do I list my property on Decoded Housing?',
    a: 'Use the "Submit a Listing" form below. Our team reviews all submissions for accuracy before publishing. Listings are free for affordable housing properties.',
  },
  {
    q: 'What is the difference between MFTE and ARCH?',
    a: 'MFTE is a city-administered tax exemption program for market-rate developers who include affordable units. ARCH is a regional coalition that provides direct funding and technical assistance for affordable housing development.',
  },
  {
    q: 'Can I accept Section 8 vouchers for only some of my units?',
    a: 'Yes. You can choose which units to make available for Section 8 tenants. However, in King County, you cannot refuse to rent to a qualified applicant solely because they have a voucher.',
  },
  {
    q: 'What are the income limits for MFTE units?',
    a: 'MFTE income limits vary by city and program. Typically, units are restricted to households earning 65–80% of Area Median Income (AMI). Contact your city\'s housing office for current limits.',
  },
  {
    q: 'How long does the MFTE application process take?',
    a: 'The MFTE application process typically takes 3–6 months from initial inquiry to approval. Start early in your development process.',
  },
];

export default function OwnerHub() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7]">
      <Navbar />

      <div className="bg-[#1B4332] text-white py-12">
        <div className="container">
          <div className="max-w-2xl">
            <span className="text-[#95D5A3] text-xs font-body font-semibold uppercase tracking-widest mb-3 block">For Property Owners</span>
            <h1 className="font-display text-4xl font-bold mb-3">Owner & Landlord Hub</h1>
            <p className="text-[#D8F3DC] font-body text-lg">
              Participate in affordable housing programs, list your property, and connect with KCHA and ARCH.
            </p>
          </div>
        </div>
      </div>

      <main className="flex-1 container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">

            {/* Programs */}
            <div>
              <h2 className="font-display text-[#1B4332] text-2xl font-bold mb-5">Affordable Housing Programs for Owners</h2>
              <div className="space-y-4">
                {PROGRAMS.map((prog, i) => {
                  const isExp = expanded === prog.id;
                  return (
                    <motion.div
                      key={prog.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="bg-white rounded-xl border border-[#E8E7E1] shadow-sm overflow-hidden"
                    >
                      <button
                        className="w-full flex items-start gap-4 p-5 text-left hover:bg-[#FAFAF7] transition-colors"
                        onClick={() => setExpanded(isExp ? null : prog.id)}
                      >
                        <div className="w-10 h-10 bg-[#D8F3DC] rounded-xl flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-5 h-5 text-[#1B4332]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-display text-[#1B4332] font-bold text-base">{prog.title}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-body font-semibold ${prog.badgeColor}`}>{prog.badge}</span>
                          </div>
                          <p className="text-[#6B7280] text-sm font-body leading-relaxed">{prog.summary}</p>
                        </div>
                        {isExp ? <ChevronUp className="w-4 h-4 text-[#9CA3AF] flex-shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-[#9CA3AF] flex-shrink-0 mt-1" />}
                      </button>
                      {isExp && (
                        <div className="px-5 pb-5 border-t border-[#E8E7E1]">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
                            <div>
                              <h4 className="font-body font-semibold text-[#374151] text-sm mb-2">Benefits</h4>
                              <ul className="space-y-1.5">
                                {prog.benefits.map((b, j) => (
                                  <li key={j} className="flex items-start gap-2">
                                    <Star className="w-3.5 h-3.5 text-[#D4A017] flex-shrink-0 mt-0.5" />
                                    <span className="text-[#374151] text-xs font-body">{b}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-body font-semibold text-[#374151] text-sm mb-2">Requirements</h4>
                              <ul className="space-y-1.5">
                                {prog.requirements.map((r, j) => (
                                  <li key={j} className="flex items-start gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#52B788] flex-shrink-0 mt-0.5" />
                                    <span className="text-[#374151] text-xs font-body">{r}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-[#E8E7E1] flex flex-wrap gap-3">
                            {prog.phone && (
                              <a href={`tel:${prog.phone.replace(/[^0-9]/g, '')}`} className="flex items-center gap-2 text-[#1B4332] font-body font-medium text-sm hover:underline">
                                <Phone className="w-4 h-4" /> {prog.phone}
                              </a>
                            )}
                            <a href={prog.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#1B4332] font-body font-medium text-sm hover:underline">
                              <ExternalLink className="w-4 h-4" /> Visit website
                            </a>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="font-display text-[#1B4332] text-2xl font-bold mb-5">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {FAQ.map((item, i) => (
                  <div key={i} className="bg-white rounded-xl border border-[#E8E7E1] overflow-hidden shadow-sm">
                    <button
                      className="w-full flex items-start justify-between gap-4 p-4 text-left hover:bg-[#FAFAF7] transition-colors"
                      onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    >
                      <span className="font-body font-semibold text-[#374151] text-sm">{item.q}</span>
                      {expandedFaq === i ? <ChevronUp className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />}
                    </button>
                    {expandedFaq === i && (
                      <div className="px-4 pb-4 border-t border-[#E8E7E1]">
                        <p className="text-[#374151] text-sm font-body leading-relaxed mt-3">{item.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-[#1B4332] text-white rounded-2xl p-6">
              <h3 className="font-display font-bold text-lg mb-2">List Your Property</h3>
              <p className="text-[#D8F3DC] text-sm font-body leading-relaxed mb-4">
                Have affordable units available? Submit your property to be listed on Decoded Housing — free for income-restricted units.
              </p>
              <a
                href="mailto:info@decodedhousing.org?subject=Property Listing Submission"
                className="flex items-center gap-2 px-4 py-3 bg-white text-[#1B4332] rounded-xl font-body font-bold text-sm hover:bg-[#D8F3DC] transition-colors"
              >
                <FileText className="w-4 h-4" /> Submit a listing
              </a>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8E7E1] p-5 shadow-sm">
              <h4 className="font-body font-semibold text-[#374151] text-sm mb-3">Key contacts</h4>
              <div className="space-y-3">
                {[
                  { name: 'ARCH', role: 'Affordable housing development', phone: '425-861-3677', href: 'https://www.archhousing.org' },
                  { name: 'KCHA Landlord Services', role: 'Section 8 program', phone: '206-214-1300', href: 'https://www.kcha.org/landlords' },
                  { name: 'Bellevue Housing', role: 'MFTE program', phone: '425-452-6800', href: 'https://bellevuewa.gov' },
                ].map(c => (
                  <div key={c.name} className="pb-3 border-b border-[#F0EFE9] last:border-0 last:pb-0">
                    <div className="font-body font-semibold text-[#374151] text-xs">{c.name}</div>
                    <div className="text-[#9CA3AF] text-[10px] font-body mb-1">{c.role}</div>
                    <a href={`tel:${c.phone.replace(/[^0-9]/g, '')}`} className="text-[#1B4332] text-xs font-body font-medium flex items-center gap-1 hover:underline">
                      <Phone className="w-3 h-3" /> {c.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#FFFBEB] border border-[#FCD34D]/40 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <Info className="w-4 h-4 text-[#D97706] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-body font-semibold text-[#92400E] text-sm mb-1">Source of income law</h4>
                  <p className="text-[#78350F] text-xs font-body leading-relaxed">
                    In King County, it is illegal to refuse to rent to a qualified applicant because they have a Section 8 voucher. Violations can result in fines and legal action.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
