/*
 * ELIGIBILITY CHECKER — /eligibility
 * Step-by-step AMI quiz: household size → income → qualifying programs
 * Uses King County 2024 AMI data from amiCalc.ts
 */
import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, DollarSign, CheckCircle2, ArrowRight, ArrowLeft,
  Search, FileText, Phone, AlertCircle, Info, ChevronDown
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AMI_LIMITS, getEligibleTiers, formatIncome, AmiTier } from '@/lib/amiCalc';

type Step = 'intro' | 'household' | 'income' | 'results';

interface Program {
  name: string;
  type: string;
  description: string;
  amiMax: number;
  href: string;
  cta: string;
  color: string;
}

const PROGRAMS: Program[] = [
  {
    name: 'Emergency Shelter',
    type: 'Immediate',
    description: 'Immediate shelter for people experiencing homelessness. No income requirement.',
    amiMax: 30,
    href: '/shelter-finder',
    cta: 'Find shelter now',
    color: 'bg-red-50 border-red-200 text-red-700',
  },
  {
    name: 'ARCH Income-Restricted Units',
    type: 'Rental',
    description: 'Below-market rental units in Bellevue, Kirkland, Redmond, and Issaquah. Must ask the leasing office directly.',
    amiMax: 80,
    href: '/search?types=ARCH',
    cta: 'Search ARCH listings',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  },
  {
    name: 'MFTE (Multifamily Tax Exemption)',
    type: 'Rental',
    description: 'Below-market units in newer apartment buildings. Available in Seattle and Eastside cities.',
    amiMax: 80,
    href: '/search?types=MFTE',
    cta: 'Search MFTE listings',
    color: 'bg-blue-50 border-blue-200 text-blue-700',
  },
  {
    name: 'Section 8 / Housing Choice Voucher',
    type: 'Voucher',
    description: 'KCHA vouchers that subsidize rent in private market housing. Waitlist is often closed.',
    amiMax: 50,
    href: '/rental-assistance',
    cta: 'Learn about vouchers',
    color: 'bg-purple-50 border-purple-200 text-purple-700',
  },
  {
    name: 'Emergency Rental Assistance (ERA)',
    type: 'Assistance',
    description: 'One-time or short-term rental assistance for people at risk of eviction.',
    amiMax: 80,
    href: '/rental-assistance',
    cta: 'Apply for assistance',
    color: 'bg-amber-50 border-amber-200 text-amber-700',
  },
  {
    name: 'Transitional Housing',
    type: 'Transitional',
    description: 'Temporary housing with support services for people moving out of homelessness.',
    amiMax: 50,
    href: '/search?types=Transitional',
    cta: 'Find transitional housing',
    color: 'bg-teal-50 border-teal-200 text-teal-700',
  },
];

const INCOME_PRESETS = [
  { label: 'Under $25,000', value: 24000 },
  { label: '$25,000 – $40,000', value: 32000 },
  { label: '$40,000 – $55,000', value: 47000 },
  { label: '$55,000 – $75,000', value: 65000 },
  { label: '$75,000 – $95,000', value: 85000 },
  { label: 'Over $95,000', value: 100000 },
];

const AMI_TIER_LABELS: Record<number, string> = {
  30: 'Extremely Low Income (≤30% AMI)',
  50: 'Very Low Income (≤50% AMI)',
  60: 'Low Income (≤60% AMI)',
  80: 'Moderate Income (≤80% AMI)',
  100: 'Middle Income (≤100% AMI)',
  120: 'Above Median (≤120% AMI)',
};

export default function Eligibility() {
  const [step, setStep] = useState<Step>('intro');
  const [householdSize, setHouseholdSize] = useState<number>(1);
  const [annualIncome, setAnnualIncome] = useState<number | null>(null);
  const [incomeInput, setIncomeInput] = useState('');
  const [, navigate] = useLocation();

  const eligibleTiers = annualIncome !== null ? getEligibleTiers(householdSize, annualIncome) : [];
  const maxTier = eligibleTiers.length > 0 ? Math.max(...eligibleTiers) : null;
  const qualifyingPrograms = PROGRAMS.filter(p => maxTier !== null && p.amiMax >= maxTier);

  const handleIncomeSubmit = () => {
    const raw = incomeInput.replace(/[^0-9]/g, '');
    const val = parseInt(raw, 10);
    if (!isNaN(val) && val >= 0) {
      setAnnualIncome(val);
      setStep('results');
    }
  };

  const handlePreset = (val: number) => {
    setAnnualIncome(val);
    setIncomeInput(val.toString());
    setStep('results');
  };

  const amiLimitForHousehold = (tier: number) => {
    const idx = Math.min(Math.max(householdSize, 1), 8) - 1;
    return AMI_LIMITS[tier]?.[idx] ?? 0;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7]">
      <Navbar />

      {/* Header */}
      <div className="bg-[#1B4332] text-white py-12">
        <div className="container">
          <div className="max-w-2xl">
            <span className="text-[#95D5A3] text-xs font-body font-semibold uppercase tracking-widest mb-3 block">Find Housing</span>
            <h1 className="font-display text-4xl font-bold mb-3">Eligibility Checker</h1>
            <p className="text-[#D8F3DC] font-body text-lg">
              Answer two questions to see which affordable housing programs you qualify for in King County.
            </p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white border-b border-[#E8E7E1]">
        <div className="container py-4">
          <div className="flex items-center gap-4 max-w-xl">
            {(['intro', 'household', 'income', 'results'] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-body font-bold transition-colors ${
                  step === s ? 'bg-[#1B4332] text-white' :
                  (['intro', 'household', 'income', 'results'] as Step[]).indexOf(step) > i ? 'bg-[#52B788] text-white' :
                  'bg-[#E8E7E1] text-[#9CA3AF]'
                }`}>
                  {(['intro', 'household', 'income', 'results'] as Step[]).indexOf(step) > i
                    ? <CheckCircle2 className="w-4 h-4" />
                    : i + 1}
                </div>
                <span className={`text-xs font-body hidden sm:inline ${step === s ? 'text-[#1B4332] font-semibold' : 'text-[#9CA3AF]'}`}>
                  {s === 'intro' ? 'Start' : s === 'household' ? 'Household' : s === 'income' ? 'Income' : 'Results'}
                </span>
                {i < 3 && <div className="w-8 h-px bg-[#E8E7E1]" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 container py-12">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {/* INTRO */}
            {step === 'intro' && (
              <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="bg-white rounded-2xl border border-[#E8E7E1] p-8 shadow-sm">
                  <div className="w-14 h-14 bg-[#D8F3DC] rounded-2xl flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-7 h-7 text-[#1B4332]" />
                  </div>
                  <h2 className="font-display text-[#1B4332] text-2xl font-bold mb-3">How this works</h2>
                  <p className="text-[#374151] font-body leading-relaxed mb-6">
                    We'll ask you two questions — household size and annual income — and show you every affordable housing program in King County that you likely qualify for, with direct links to apply.
                  </p>
                  <div className="space-y-3 mb-8">
                    {[
                      'Based on HUD 2024 King County income limits',
                      'No personal information collected or stored',
                      'Results include ARCH, MFTE, Section 8, and more',
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-[#52B788] flex-shrink-0" />
                        <span className="text-[#374151] font-body text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setStep('household')}
                    className="w-full py-3.5 bg-[#1B4332] text-white rounded-xl font-body font-semibold text-base hover:bg-[#2D6A4F] transition-colors flex items-center justify-center gap-2"
                  >
                    Check my eligibility <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-4 p-4 bg-[#FFFBEB] border border-[#FCD34D]/40 rounded-xl flex items-start gap-3">
                  <Info className="w-4 h-4 text-[#D97706] flex-shrink-0 mt-0.5" />
                  <p className="text-[#78350F] text-sm font-body">
                    This tool provides general guidance only. Actual eligibility is determined by each property or program. Always verify directly.
                  </p>
                </div>
              </motion.div>
            )}

            {/* HOUSEHOLD SIZE */}
            {step === 'household' && (
              <motion.div key="household" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="bg-white rounded-2xl border border-[#E8E7E1] p-8 shadow-sm">
                  <div className="w-14 h-14 bg-[#D8F3DC] rounded-2xl flex items-center justify-center mb-6">
                    <Users className="w-7 h-7 text-[#1B4332]" />
                  </div>
                  <h2 className="font-display text-[#1B4332] text-2xl font-bold mb-2">How many people are in your household?</h2>
                  <p className="text-[#6B7280] font-body text-sm mb-8">Include yourself and everyone who will live with you.</p>
                  <div className="grid grid-cols-4 gap-3 mb-8">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                      <button
                        key={n}
                        onClick={() => setHouseholdSize(n)}
                        className={`py-4 rounded-xl font-display text-xl font-bold transition-all ${
                          householdSize === n
                            ? 'bg-[#1B4332] text-white shadow-md scale-105'
                            : 'bg-[#F9FAFB] text-[#374151] border border-[#E5E7EB] hover:border-[#52B788] hover:bg-[#D8F3DC]'
                        }`}
                      >
                        {n}{n === 8 ? '+' : ''}
                      </button>
                    ))}
                  </div>
                  <div className="p-4 bg-[#F0FDF4] rounded-xl border border-[#BBF7D0] mb-6">
                    <p className="text-[#166534] text-sm font-body">
                      <strong>Selected: {householdSize} person{householdSize > 1 ? 's' : ''}</strong> — 80% AMI limit is <strong>{formatIncome(amiLimitForHousehold(80))}/year</strong>
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep('intro')}
                      className="flex items-center gap-2 px-5 py-3 border border-[#E5E7EB] text-[#374151] rounded-xl font-body font-medium hover:bg-[#F9FAFB] transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      onClick={() => setStep('income')}
                      className="flex-1 py-3 bg-[#1B4332] text-white rounded-xl font-body font-semibold hover:bg-[#2D6A4F] transition-colors flex items-center justify-center gap-2"
                    >
                      Continue <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* INCOME */}
            {step === 'income' && (
              <motion.div key="income" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="bg-white rounded-2xl border border-[#E8E7E1] p-8 shadow-sm">
                  <div className="w-14 h-14 bg-[#D8F3DC] rounded-2xl flex items-center justify-center mb-6">
                    <DollarSign className="w-7 h-7 text-[#1B4332]" />
                  </div>
                  <h2 className="font-display text-[#1B4332] text-2xl font-bold mb-2">What is your household's annual income?</h2>
                  <p className="text-[#6B7280] font-body text-sm mb-6">Include all income sources for all household members. Use gross (before-tax) income.</p>

                  {/* Quick presets */}
                  <div className="grid grid-cols-2 gap-2 mb-5">
                    {INCOME_PRESETS.map(preset => (
                      <button
                        key={preset.value}
                        onClick={() => handlePreset(preset.value)}
                        className="px-4 py-3 text-left rounded-xl border border-[#E5E7EB] hover:border-[#52B788] hover:bg-[#D8F3DC] transition-all font-body text-sm text-[#374151]"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  <div className="relative mb-2">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] font-body text-lg">$</span>
                    <input
                      type="text"
                      placeholder="Enter exact amount (e.g. 52000)"
                      value={incomeInput}
                      onChange={e => setIncomeInput(e.target.value.replace(/[^0-9]/g, ''))}
                      onKeyDown={e => e.key === 'Enter' && handleIncomeSubmit()}
                      className="w-full pl-8 pr-4 py-3.5 border border-[#E5E7EB] rounded-xl font-body text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-transparent"
                    />
                  </div>
                  <p className="text-[#9CA3AF] text-xs font-body mb-6">Or type your exact annual income above and press Enter.</p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep('household')}
                      className="flex items-center gap-2 px-5 py-3 border border-[#E5E7EB] text-[#374151] rounded-xl font-body font-medium hover:bg-[#F9FAFB] transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      onClick={handleIncomeSubmit}
                      disabled={!incomeInput}
                      className="flex-1 py-3 bg-[#1B4332] text-white rounded-xl font-body font-semibold hover:bg-[#2D6A4F] transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      See my results <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* RESULTS */}
            {step === 'results' && annualIncome !== null && (
              <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                {/* Summary card */}
                <div className={`rounded-2xl p-6 mb-6 ${maxTier !== null ? 'bg-[#D8F3DC] border border-[#52B788]' : 'bg-[#FEF3C7] border border-[#FCD34D]'}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${maxTier !== null ? 'bg-[#1B4332]' : 'bg-[#D97706]'}`}>
                      {maxTier !== null ? <CheckCircle2 className="w-6 h-6 text-white" /> : <AlertCircle className="w-6 h-6 text-white" />}
                    </div>
                    <div>
                      <h2 className={`font-display text-xl font-bold mb-1 ${maxTier !== null ? 'text-[#1B4332]' : 'text-[#92400E]'}`}>
                        {maxTier !== null
                          ? `You qualify for programs up to ${maxTier}% AMI`
                          : 'Your income may exceed most program limits'}
                      </h2>
                      <p className={`font-body text-sm ${maxTier !== null ? 'text-[#2D6A4F]' : 'text-[#78350F]'}`}>
                        Household of {householdSize} · {formatIncome(annualIncome)}/year
                        {maxTier !== null ? ` · ${AMI_TIER_LABELS[maxTier]}` : ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* AMI breakdown table */}
                <div className="bg-white rounded-2xl border border-[#E8E7E1] p-6 mb-6 shadow-sm">
                  <h3 className="font-display text-[#1B4332] font-bold text-base mb-4">King County 2024 Income Limits — {householdSize}-Person Household</h3>
                  <div className="space-y-2">
                    {([30, 50, 60, 80, 100, 120] as AmiTier[]).map(tier => {
                      const limit = amiLimitForHousehold(tier);
                      const qualifies = annualIncome <= limit;
                      return (
                        <div key={tier} className={`flex items-center justify-between p-3 rounded-lg ${qualifies ? 'bg-[#F0FDF4] border border-[#BBF7D0]' : 'bg-[#F9FAFB] border border-[#E5E7EB]'}`}>
                          <div className="flex items-center gap-3">
                            {qualifies
                              ? <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                              : <div className="w-4 h-4 rounded-full border-2 border-[#D1D5DB]" />}
                            <span className={`font-body text-sm font-medium ${qualifies ? 'text-[#166534]' : 'text-[#9CA3AF]'}`}>
                              {tier}% AMI
                            </span>
                          </div>
                          <span className={`font-body text-sm ${qualifies ? 'text-[#166534] font-semibold' : 'text-[#9CA3AF]'}`}>
                            ≤ {formatIncome(limit)}/yr
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Qualifying programs */}
                {qualifyingPrograms.length > 0 ? (
                  <div className="mb-6">
                    <h3 className="font-display text-[#1B4332] font-bold text-xl mb-4">Programs You May Qualify For</h3>
                    <div className="space-y-3">
                      {qualifyingPrograms.map(program => (
                        <div key={program.name} className={`p-5 rounded-xl border ${program.color}`}>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-display font-bold text-base">{program.name}</h4>
                                <span className="px-2 py-0.5 bg-white/60 rounded text-xs font-body font-medium">{program.type}</span>
                              </div>
                              <p className="font-body text-sm opacity-80 leading-relaxed">{program.description}</p>
                            </div>
                            <button
                              onClick={() => navigate(program.href)}
                              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-white/70 rounded-lg text-sm font-body font-medium hover:bg-white transition-colors"
                            >
                              {program.cta} <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#FEF3C7] border border-[#FCD34D] rounded-2xl p-6 mb-6">
                    <h3 className="font-display text-[#92400E] font-bold text-lg mb-2">Your income may exceed most program limits</h3>
                    <p className="text-[#78350F] font-body text-sm leading-relaxed mb-4">
                      At {formatIncome(annualIncome)}/year for a {householdSize}-person household, you may be above the income limits for most subsidized programs. However, some market-rate affordable options may still be available.
                    </p>
                    <button onClick={() => navigate('/search')} className="text-[#D97706] font-body font-medium text-sm flex items-center gap-1">
                      Browse all listings <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Next steps */}
                <div className="bg-white rounded-2xl border border-[#E8E7E1] p-6 shadow-sm mb-6">
                  <h3 className="font-display text-[#1B4332] font-bold text-base mb-4">Next Steps</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { icon: <Search className="w-4 h-4" />, label: 'Search listings', href: '/search' },
                      { icon: <FileText className="w-4 h-4" />, label: 'How to apply', href: '/how-to-apply' },
                      { icon: <Phone className="w-4 h-4" />, label: 'Phone scripts', href: '/scripts' },
                    ].map(item => (
                      <button
                        key={item.href}
                        onClick={() => navigate(item.href)}
                        className="flex items-center gap-3 p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] hover:border-[#52B788] hover:bg-[#D8F3DC] transition-all font-body text-sm text-[#374151] font-medium"
                      >
                        <span className="text-[#1B4332]">{item.icon}</span>
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => { setStep('intro'); setAnnualIncome(null); setIncomeInput(''); setHouseholdSize(1); }}
                  className="text-[#6B7280] font-body text-sm hover:text-[#1B4332] transition-colors"
                >
                  ← Start over
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
