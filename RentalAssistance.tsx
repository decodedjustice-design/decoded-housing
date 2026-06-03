/*
 * RENTAL ASSISTANCE — /rental-assistance
 * Section 8, ERA, King County subsidy programs
 */
import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import {
  DollarSign, ExternalLink, Phone, ArrowRight, CheckCircle2,
  Clock, AlertCircle, Info, ChevronDown, ChevronUp
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Program {
  id: string;
  name: string;
  agency: string;
  type: string;
  description: string;
  eligibility: string[];
  howToApply: string;
  phone?: string;
  website?: string;
  waitlistStatus: 'open' | 'closed' | 'unknown';
  maxAmi: number;
  amount?: string;
  color: string;
}

const PROGRAMS: Program[] = [
  {
    id: 'kcha-section8',
    name: 'Housing Choice Voucher (Section 8)',
    agency: 'King County Housing Authority (KCHA)',
    type: 'Voucher',
    description: 'Federal rental assistance that pays the difference between 30% of your income and the fair market rent. You find your own housing; KCHA pays the landlord directly.',
    eligibility: [
      'Income at or below 50% of King County AMI',
      'U.S. citizenship or eligible immigration status',
      'Pass criminal background screening',
      'No prior evictions from assisted housing',
    ],
    howToApply: 'Apply online at KCHA.org when the waitlist opens. Waitlist openings are rare — sign up for KCHA email alerts.',
    phone: '206-574-1100',
    website: 'https://www.kcha.org/housing/section-8',
    waitlistStatus: 'closed',
    maxAmi: 50,
    color: 'border-blue-200 bg-blue-50',
  },
  {
    id: 'era-king-county',
    name: 'Emergency Rental Assistance (ERA)',
    agency: 'King County',
    type: 'One-time Assistance',
    description: 'Short-term rental assistance for tenants at risk of eviction due to COVID-19 or financial hardship. Covers past-due rent, current rent, and utilities.',
    eligibility: [
      'Income at or below 80% AMI',
      'At risk of housing instability or homelessness',
      'Have a current lease or rental agreement',
      'King County resident',
    ],
    howToApply: 'Apply through the King County 2-1-1 system or directly at the program website. Funds are limited — apply as early as possible.',
    phone: '211',
    website: 'https://kingcounty.gov/en/dept/dcs/policies-programs/housing-homelessness-community-development/rental-assistance',
    waitlistStatus: 'open',
    maxAmi: 80,
    amount: 'Up to $5,000 per household',
    color: 'border-emerald-200 bg-emerald-50',
  },
  {
    id: 'arch-gap',
    name: 'ARCH Housing Trust Fund',
    agency: 'ARCH (A Regional Coalition for Housing)',
    type: 'Development Subsidy',
    description: 'Funds affordable housing development and preservation in East King County. Not a direct tenant program — but funds the ARCH units in our database.',
    eligibility: [
      'Applies to properties, not directly to tenants',
      'Tenants must meet income limits of the specific ARCH property',
    ],
    howToApply: 'Apply directly to ARCH-funded properties in our search portal. Each property has its own application process.',
    website: 'https://www.archhousing.org',
    waitlistStatus: 'unknown',
    maxAmi: 80,
    color: 'border-green-200 bg-green-50',
  },
  {
    id: 'bellevue-renter',
    name: 'City of Bellevue Renter Assistance',
    agency: 'City of Bellevue',
    type: 'Local Assistance',
    description: 'Short-term rental assistance for Bellevue residents facing eviction or housing instability. Administered through local nonprofits.',
    eligibility: [
      'Bellevue resident',
      'Income at or below 60% AMI',
      'Experiencing financial hardship',
    ],
    howToApply: 'Contact Bellevue\'s Human Services Division or call 211 to be connected to a local provider.',
    phone: '425-452-6168',
    website: 'https://bellevuewa.gov/city-government/departments/community-development/housing',
    waitlistStatus: 'unknown',
    maxAmi: 60,
    amount: 'Up to 3 months rent',
    color: 'border-purple-200 bg-purple-50',
  },
  {
    id: 'wshfc-hap',
    name: 'Washington State Housing Assistance Program',
    agency: 'Washington State Housing Finance Commission',
    type: 'State Program',
    description: 'State-level rental assistance and housing stability programs for low-income Washington residents.',
    eligibility: [
      'Washington State resident',
      'Income at or below 80% AMI',
      'Experiencing housing instability',
    ],
    howToApply: 'Apply through the WSHFC website or local partner agencies. Programs vary by county.',
    website: 'https://www.wshfc.org/managers/rentalassistance.htm',
    waitlistStatus: 'unknown',
    maxAmi: 80,
    color: 'border-amber-200 bg-amber-50',
  },
  {
    id: 'community-action',
    name: 'Eastside Community Assistance',
    agency: 'Eastside Human Services Forum',
    type: 'Nonprofit Assistance',
    description: 'Local nonprofit network providing emergency rental assistance, utility help, and case management for Eastside King County residents.',
    eligibility: [
      'Eastside King County resident (Bellevue, Kirkland, Redmond, Issaquah)',
      'Income at or below 200% of federal poverty level',
      'Experiencing crisis or emergency',
    ],
    howToApply: 'Call 211 or contact your local community center. Case managers can help identify the right program.',
    phone: '211',
    website: 'https://www.eastsidehsf.org',
    waitlistStatus: 'open',
    maxAmi: 80,
    color: 'border-rose-200 bg-rose-50',
  },
];

const STATUS_BADGE: Record<string, { label: string; color: string }> = {
  open: { label: 'Accepting applications', color: 'bg-emerald-100 text-emerald-700' },
  closed: { label: 'Waitlist closed', color: 'bg-red-100 text-red-700' },
  unknown: { label: 'Check directly', color: 'bg-gray-100 text-gray-600' },
};

export default function RentalAssistance() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7]">
      <Navbar />

      <div className="bg-[#1B4332] text-white py-12">
        <div className="container">
          <div className="max-w-2xl">
            <span className="text-[#95D5A3] text-xs font-body font-semibold uppercase tracking-widest mb-3 block">Support & Resources</span>
            <h1 className="font-display text-4xl font-bold mb-3">Rental Assistance & Subsidies</h1>
            <p className="text-[#D8F3DC] font-body text-lg">
              Section 8 vouchers, emergency rental assistance, and local subsidy programs for King County residents.
            </p>
          </div>
        </div>
      </div>

      {/* Alert */}
      <div className="bg-[#FEF3C7] border-b border-[#FCD34D]/40">
        <div className="container py-3">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-[#D97706] flex-shrink-0" />
            <p className="text-[#78350F] text-sm font-body">
              <strong>Call 211 first.</strong> Operators can connect you to the fastest available assistance in your area. Available 24/7 in multiple languages.
            </p>
          </div>
        </div>
      </div>

      <main className="flex-1 container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="font-display text-[#1B4332] text-2xl font-bold mb-6">Programs Available in King County</h2>
            <div className="space-y-4">
              {PROGRAMS.map((program, i) => {
                const isExpanded = expanded === program.id;
                const status = STATUS_BADGE[program.waitlistStatus];
                return (
                  <motion.div
                    key={program.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className={`bg-white rounded-xl border-2 ${program.color} overflow-hidden shadow-sm`}
                  >
                    <button
                      className="w-full flex items-start gap-4 p-5 text-left hover:bg-white/50 transition-colors"
                      onClick={() => setExpanded(isExpanded ? null : program.id)}
                    >
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                        <DollarSign className="w-5 h-5 text-[#1B4332]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <h3 className="font-display text-[#1B4332] font-bold text-base">{program.name}</h3>
                            <p className="text-[#6B7280] text-xs font-body mt-0.5">{program.agency}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-body font-semibold ${status.color}`}>
                              {status.label}
                            </span>
                            <span className="px-2 py-0.5 bg-white/60 rounded text-xs font-body text-[#6B7280]">
                              ≤{program.maxAmi}% AMI
                            </span>
                          </div>
                        </div>
                        <p className="text-[#374151] text-sm font-body mt-2 leading-relaxed line-clamp-2">
                          {program.description}
                        </p>
                        {program.amount && (
                          <span className="inline-block mt-2 px-2 py-0.5 bg-white/70 rounded text-xs font-body font-semibold text-[#1B4332]">
                            {program.amount}
                          </span>
                        )}
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-[#9CA3AF] flex-shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-[#9CA3AF] flex-shrink-0 mt-1" />}
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 border-t border-white/50">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
                          <div>
                            <h4 className="font-body font-semibold text-[#374151] text-sm mb-2">Eligibility Requirements</h4>
                            <ul className="space-y-1.5">
                              {program.eligibility.map((req, j) => (
                                <li key={j} className="flex items-start gap-2">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[#52B788] flex-shrink-0 mt-0.5" />
                                  <span className="text-[#374151] text-xs font-body">{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-body font-semibold text-[#374151] text-sm mb-2">How to Apply</h4>
                            <p className="text-[#374151] text-xs font-body leading-relaxed mb-3">{program.howToApply}</p>
                            <div className="space-y-2">
                              {program.phone && (
                                <a href={`tel:${program.phone}`} className="flex items-center gap-2 text-[#1B4332] font-body font-medium text-sm hover:underline">
                                  <Phone className="w-4 h-4" /> {program.phone}
                                </a>
                              )}
                              {program.website && (
                                <a href={program.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#1B4332] font-body font-medium text-sm hover:underline">
                                  <ExternalLink className="w-4 h-4" /> Visit website
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-[#1B4332] text-white rounded-2xl p-6">
              <h3 className="font-display font-bold text-lg mb-3">Start with 211</h3>
              <p className="text-[#D8F3DC] text-sm font-body leading-relaxed mb-4">
                Call or text 211 to be connected to a live operator who can identify the fastest available assistance for your situation. Available in Spanish, Vietnamese, Somali, and more.
              </p>
              <a href="tel:211" className="flex items-center gap-2 px-4 py-3 bg-white text-[#1B4332] rounded-xl font-body font-bold text-base hover:bg-[#D8F3DC] transition-colors">
                <Phone className="w-5 h-5" /> Call 211
              </a>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8E7E1] p-6 shadow-sm">
              <h3 className="font-display text-[#1B4332] font-bold text-base mb-3">Know Your Rights</h3>
              <p className="text-[#6B7280] text-sm font-body leading-relaxed mb-3">
                Landlords cannot evict you for applying for rental assistance. Learn about your protections.
              </p>
              <button onClick={() => navigate('/tenant-rights')} className="text-[#1B4332] font-body font-medium text-sm flex items-center gap-1 hover:text-[#2D6A4F]">
                Tenant rights guide <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#FFFBEB] border border-[#FCD34D]/40 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <Info className="w-4 h-4 text-[#D97706] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-body font-semibold text-[#92400E] text-sm mb-1">Section 8 waitlist tip</h4>
                  <p className="text-[#78350F] text-xs font-body leading-relaxed">
                    KCHA's Section 8 waitlist opens rarely and fills within hours. Sign up for KCHA email alerts at kcha.org to be notified the moment it opens.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8E7E1] p-5 shadow-sm">
              <h4 className="font-body font-semibold text-[#374151] text-sm mb-3">Also explore</h4>
              <div className="space-y-2">
                {[
                  { label: 'Search affordable housing', href: '/search' },
                  { label: 'Check your eligibility', href: '/eligibility' },
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
