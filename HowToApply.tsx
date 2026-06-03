/*
 * HOW TO APPLY — /how-to-apply
 * Visual application roadmap with document checklist
 * Covers ARCH, MFTE, Section 8, and general affordable housing
 */
import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import {
  CheckCircle2, Circle, Search, Phone, FileText, Clock,
  Home, ArrowRight, Download, Printer, AlertCircle, Info,
  ChevronDown, ChevronUp, CheckSquare, Square
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Step {
  number: number;
  title: string;
  duration: string;
  description: string;
  tips: string[];
  icon: React.ReactNode;
}

interface DocItem {
  id: string;
  label: string;
  required: boolean;
  note?: string;
}

interface DocCategory {
  title: string;
  icon: string;
  items: DocItem[];
}

const STEPS: Step[] = [
  {
    number: 1,
    title: 'Check your eligibility',
    duration: '5 minutes',
    description: 'Use our eligibility checker to find out which programs you qualify for based on household size and income.',
    tips: [
      'Use gross (before-tax) household income',
      'Include all household members who will live with you',
      'ARCH and MFTE have different AMI limits — check both',
    ],
    icon: <CheckCircle2 className="w-6 h-6" />,
  },
  {
    number: 2,
    title: 'Gather your documents',
    duration: '1–3 days',
    description: 'Collect the documents listed below before you start applying. Having them ready prevents delays.',
    tips: [
      'Scan or photograph all documents — you\'ll submit them multiple times',
      'Keep a digital folder with all documents organized',
      'Some properties accept bank statements in place of pay stubs',
    ],
    icon: <FileText className="w-6 h-6" />,
  },
  {
    number: 3,
    title: 'Search and identify properties',
    duration: '1–2 weeks',
    description: 'Use the search portal to find properties that match your eligibility. Look for properties with open waitlists or "likely available" status.',
    tips: [
      'Filter by housing type (ARCH, MFTE, Section 8)',
      'Check the AMI level — it must match your income',
      'Note the contact info for each property you want to call',
    ],
    icon: <Search className="w-6 h-6" />,
  },
  {
    number: 4,
    title: 'Call the leasing office',
    duration: '15–30 min per property',
    description: 'Call each property and ask specifically for income-restricted units. Use our phone scripts to know exactly what to say.',
    tips: [
      'Ask: "Do you have any ARCH income-restricted units available, or a waitlist I can join?"',
      'Call in the morning — leasing offices are busiest after 2pm',
      'If no answer, call back 2–3 times before moving on',
    ],
    icon: <Phone className="w-6 h-6" />,
  },
  {
    number: 5,
    title: 'Submit your application',
    duration: '1–2 hours per property',
    description: 'Complete the application form for each property. Most applications are online; some require in-person submission.',
    tips: [
      'Apply to multiple properties simultaneously — don\'t wait for one response',
      'Pay the application fee if required (typically $35–$50)',
      'Keep a copy of every application you submit',
    ],
    icon: <CheckSquare className="w-6 h-6" />,
  },
  {
    number: 6,
    title: 'Wait and follow up',
    duration: 'Weeks to months',
    description: 'Waitlists can be long. Follow up every 30–60 days to confirm your place on the list.',
    tips: [
      'Ask for a waitlist confirmation number or email',
      'Update your contact info if it changes',
      'Continue applying to other properties while you wait',
    ],
    icon: <Clock className="w-6 h-6" />,
  },
  {
    number: 7,
    title: 'Complete income verification',
    duration: '1–2 weeks',
    description: 'When a unit becomes available, the property will ask you to verify your income. This is when your documents are critical.',
    tips: [
      'Respond within 24–48 hours — units go fast',
      'Have all documents ready to submit immediately',
      'Ask about the move-in timeline before accepting',
    ],
    icon: <Home className="w-6 h-6" />,
  },
];

const DOC_CATEGORIES: DocCategory[] = [
  {
    title: 'Identity',
    icon: '🪪',
    items: [
      { id: 'id-govt', label: 'Government-issued photo ID (driver\'s license, passport, or state ID)', required: true },
      { id: 'id-social', label: 'Social Security card or ITIN documentation', required: true },
      { id: 'id-birth', label: 'Birth certificates for all household members', required: false, note: 'Required for some programs' },
    ],
  },
  {
    title: 'Income & Employment',
    icon: '💼',
    items: [
      { id: 'inc-paystubs', label: 'Last 2–3 pay stubs (all jobs)', required: true },
      { id: 'inc-tax', label: 'Most recent federal tax return (Form 1040)', required: true },
      { id: 'inc-w2', label: 'W-2 or 1099 forms from last year', required: true },
      { id: 'inc-employer', label: 'Employer verification letter (if requested)', required: false },
      { id: 'inc-selfempl', label: 'Profit & loss statement (if self-employed)', required: false, note: 'Required if self-employed' },
      { id: 'inc-benefits', label: 'Benefit award letters (SSI, SSDI, unemployment, child support)', required: false, note: 'Required if applicable' },
    ],
  },
  {
    title: 'Rental History',
    icon: '🏠',
    items: [
      { id: 'rent-landlord', label: 'Current landlord contact info', required: true },
      { id: 'rent-history', label: 'Rental history for last 2–3 years', required: true },
      { id: 'rent-lease', label: 'Copy of current lease', required: false },
      { id: 'rent-refs', label: 'Landlord reference letters', required: false, note: 'Helpful but not always required' },
    ],
  },
  {
    title: 'Financial',
    icon: '🏦',
    items: [
      { id: 'fin-bank', label: 'Last 2–3 months of bank statements (all accounts)', required: true },
      { id: 'fin-assets', label: 'Documentation of other assets (retirement accounts, investments)', required: false, note: 'Required for some programs' },
    ],
  },
  {
    title: 'Household Members',
    icon: '👨‍👩‍👧',
    items: [
      { id: 'hh-all', label: 'ID and income documentation for all adult household members', required: true },
      { id: 'hh-custody', label: 'Custody documentation (if applicable)', required: false },
      { id: 'hh-student', label: 'Student status verification (if applicable)', required: false, note: 'Full-time students have special rules' },
    ],
  },
];

export default function HowToApply() {
  const [checkedDocs, setCheckedDocs] = useState<Set<string>>(new Set());
  const [expandedStep, setExpandedStep] = useState<number | null>(1);
  const [, navigate] = useLocation();

  const toggleDoc = (id: string) => {
    setCheckedDocs(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const totalRequired = DOC_CATEGORIES.flatMap(c => c.items).filter(i => i.required).length;
  const checkedRequired = DOC_CATEGORIES.flatMap(c => c.items).filter(i => i.required && checkedDocs.has(i.id)).length;
  const progress = Math.round((checkedRequired / totalRequired) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7]">
      <Navbar />

      {/* Header */}
      <div className="bg-[#1B4332] text-white py-12">
        <div className="container">
          <div className="max-w-2xl">
            <span className="text-[#95D5A3] text-xs font-body font-semibold uppercase tracking-widest mb-3 block">Find Housing</span>
            <h1 className="font-display text-4xl font-bold mb-3">How to Apply</h1>
            <p className="text-[#D8F3DC] font-body text-lg">
              A step-by-step guide to applying for affordable housing in King County — from eligibility check to move-in.
            </p>
          </div>
        </div>
      </div>

      <main className="flex-1 container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Steps */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-[#1B4332] text-2xl font-bold mb-6">The Application Roadmap</h2>
            <div className="space-y-3">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="bg-white rounded-xl border border-[#E8E7E1] overflow-hidden shadow-sm"
                >
                  <button
                    className="w-full flex items-center gap-4 p-5 text-left hover:bg-[#FAFAF7] transition-colors"
                    onClick={() => setExpandedStep(expandedStep === step.number ? null : step.number)}
                  >
                    <div className="w-10 h-10 bg-[#1B4332] text-white rounded-xl flex items-center justify-center flex-shrink-0 font-display font-bold text-base">
                      {step.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-display text-[#1B4332] font-bold text-base">{step.title}</h3>
                        <span className="px-2 py-0.5 bg-[#F0EFE9] text-[#6B7280] text-xs font-body rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {step.duration}
                        </span>
                      </div>
                    </div>
                    {expandedStep === step.number
                      ? <ChevronUp className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />}
                  </button>
                  {expandedStep === step.number && (
                    <div className="px-5 pb-5 border-t border-[#E8E7E1]">
                      <p className="text-[#374151] font-body text-sm leading-relaxed mt-4 mb-4">{step.description}</p>
                      <div className="space-y-2">
                        {step.tips.map((tip, j) => (
                          <div key={j} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-[#52B788] rounded-full mt-1.5 flex-shrink-0" />
                            <span className="text-[#6B7280] font-body text-sm">{tip}</span>
                          </div>
                        ))}
                      </div>
                      {step.number === 1 && (
                        <button onClick={() => navigate('/eligibility')} className="mt-4 flex items-center gap-2 text-[#1B4332] font-body font-medium text-sm hover:text-[#2D6A4F]">
                          Check eligibility now <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                      {step.number === 4 && (
                        <button onClick={() => navigate('/scripts')} className="mt-4 flex items-center gap-2 text-[#1B4332] font-body font-medium text-sm hover:text-[#2D6A4F]">
                          Get phone scripts <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                      {step.number === 3 && (
                        <button onClick={() => navigate('/search')} className="mt-4 flex items-center gap-2 text-[#1B4332] font-body font-medium text-sm hover:text-[#2D6A4F]">
                          Search properties <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Common mistakes */}
            <div className="mt-8 bg-[#FEF3C7] border border-[#FCD34D]/40 rounded-2xl p-6">
              <h3 className="font-display text-[#92400E] font-bold text-lg mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Common Mistakes That Delay Applications
              </h3>
              <div className="space-y-3">
                {[
                  { mistake: 'Asking "do you have availability?" instead of asking for ARCH/MFTE units specifically', fix: 'Use our phone scripts' },
                  { mistake: 'Submitting incomplete income documentation', fix: 'Use the document checklist →' },
                  { mistake: 'Applying to only one property at a time', fix: 'Apply to 5–10 simultaneously' },
                  { mistake: 'Not following up on the waitlist', fix: 'Set a calendar reminder every 30 days' },
                  { mistake: 'Missing the income verification deadline when a unit opens', fix: 'Respond within 24 hours' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-xs font-bold">✕</span>
                    </div>
                    <div>
                      <span className="text-[#78350F] font-body text-sm">{item.mistake}</span>
                      <span className="text-[#D97706] font-body text-sm font-medium"> — {item.fix}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Document Checklist */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl border border-[#E8E7E1] shadow-sm overflow-hidden">
                <div className="bg-[#1B4332] p-5">
                  <h3 className="font-display text-white font-bold text-lg mb-1">Document Checklist</h3>
                  <p className="text-[#95D5A3] text-sm font-body">Check off documents as you gather them</p>
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[#D8F3DC] text-xs font-body">{checkedRequired} of {totalRequired} required docs</span>
                      <span className="text-[#FCD34D] text-xs font-body font-semibold">{progress}%</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#52B788] rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 max-h-[60vh] overflow-y-auto">
                  {DOC_CATEGORIES.map(cat => (
                    <div key={cat.title} className="mb-5">
                      <h4 className="font-body font-semibold text-[#374151] text-sm mb-2 flex items-center gap-2">
                        <span>{cat.icon}</span> {cat.title}
                      </h4>
                      <div className="space-y-2">
                        {cat.items.map(item => (
                          <label key={item.id} className="flex items-start gap-2.5 cursor-pointer group">
                            <button
                              onClick={() => toggleDoc(item.id)}
                              className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded border transition-colors ${
                                checkedDocs.has(item.id)
                                  ? 'bg-[#1B4332] border-[#1B4332]'
                                  : 'border-[#D1D5DB] group-hover:border-[#52B788]'
                              } flex items-center justify-center`}
                            >
                              {checkedDocs.has(item.id) && <CheckCircle2 className="w-3 h-3 text-white" />}
                            </button>
                            <div>
                              <span className={`font-body text-xs leading-relaxed ${checkedDocs.has(item.id) ? 'text-[#9CA3AF] line-through' : 'text-[#374151]'}`}>
                                {item.label}
                                {item.required && <span className="text-red-500 ml-1">*</span>}
                              </span>
                              {item.note && (
                                <div className="text-[#9CA3AF] text-xs font-body mt-0.5">{item.note}</div>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  <p className="text-[#9CA3AF] text-xs font-body mt-2">* Required for most applications</p>
                </div>

                <div className="p-4 border-t border-[#E8E7E1] space-y-2">
                  <button
                    onClick={() => navigate('/applicant-portal')}
                    className="w-full py-2.5 bg-[#1B4332] text-white rounded-lg font-body font-medium text-sm hover:bg-[#2D6A4F] transition-colors flex items-center justify-center gap-2"
                  >
                    Save progress in portal <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="w-full py-2.5 border border-[#E5E7EB] text-[#374151] rounded-lg font-body font-medium text-sm hover:bg-[#F9FAFB] transition-colors flex items-center justify-center gap-2"
                  >
                    <Printer className="w-4 h-4" /> Print checklist
                  </button>
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
