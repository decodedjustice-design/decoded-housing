/**
 * SHELTER FINDER — Layer 1 UI
 * Design: Editorial Civic — forest green + amber, Playfair Display + DM Sans
 * Data source: Layer 1 dataset ONLY (18 records). No placeholders.
 *
 * Flow:
 *   Intro → Q1 (population) → Q2 (area) → Q3 (situation) → Results
 *
 * Results:
 *   Card 1 — Best Option (single top result)
 *   Card 2 — Next Options (2–4 ranked)
 *   Card 3 — Backup Options (deprioritized)
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Copy, Globe, ChevronRight, ArrowLeft, RefreshCw, CheckCircle2, AlertCircle, Clock, Shield, Zap } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useSevereWeather } from '@/hooks/useSevereWeather';
import EmergencyAlertCard from '@/components/EmergencyAlertCard';
import { runDecisionEngine, rerunWithout, UserInput } from '@/lib/decisionEngine';
import { PrintablePlan } from '@/components/PrintablePlan';
import { Layer1Record, PopulationServed, CountyArea } from '@/data/layer1_shelter';

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 'intro' | 'population' | 'area' | 'situation' | 'results';

interface PopOption {
  value: PopulationServed | 'not_sure';
  label: string;
  sub: string;
  icon: string;
}

interface AreaOption {
  value: CountyArea | 'not_sure';
  label: string;
  sub: string;
}

interface SituationOption {
  value: UserInput['situation'];
  label: string;
  sub: string;
  icon: string;
}

// ─── Options ──────────────────────────────────────────────────────────────────

const POP_OPTIONS: PopOption[] = [
  { value: 'Families',        label: 'Family with children',   sub: 'Parent or guardian with minor children', icon: '👨‍👩‍👧' },
  { value: 'Adults',          label: 'Single adult',           sub: 'Adult 18+ without children',             icon: '👤' },
  { value: 'Youth',           label: 'Young adult / youth',    sub: 'Ages 13–25',                             icon: '🧑' },
  { value: 'Women',           label: 'Woman',                  sub: 'Seeking women-only shelter',             icon: '🙋' },
  { value: 'Men',             label: 'Man',                    sub: 'Seeking men-only shelter',               icon: '🙋‍♂️' },
  { value: 'Vehicle dwellers',label: 'Living in vehicle',      sub: 'Car, RV, or van',                        icon: '🚗' },
  { value: 'not_sure',        label: 'Not sure',               sub: 'Show all options',                       icon: '❓' },
];

const AREA_OPTIONS: AreaOption[] = [
  { value: 'East King',   label: 'East King County',   sub: 'Bellevue, Kirkland, Redmond, Renton' },
  { value: 'South King',  label: 'South King County',  sub: 'Federal Way, Kent, Auburn, Burien' },
  { value: 'Seattle',     label: 'Seattle / North KC', sub: 'City of Seattle and north suburbs' },
  { value: 'not_sure',    label: 'Not sure / anywhere',sub: 'Show all King County options' },
];

const SITUATION_OPTIONS: SituationOption[] = [
  { value: 'outside',         label: 'Outside / unsheltered', sub: 'No roof tonight',                icon: '🌧️' },
  { value: 'vehicle',         label: 'In a vehicle',          sub: 'Car, RV, or van',                icon: '🚗' },
  { value: 'shelter_already', label: 'In a shelter already',  sub: 'Looking for a different option', icon: '🏠' },
  { value: 'couch',           label: 'Couch surfing',         sub: 'Temporary, unstable housing',    icon: '🛋️' },
  { value: 'not_sure',        label: 'Not sure',              sub: 'Show all options',               icon: '❓' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SPEED_LABEL: Record<string, string> = {
  immediate: 'Immediate',
  same_day: 'Same day',
  delayed: 'Delayed',
};

const BARRIER_LABEL: Record<string, string> = {
  low: 'Low barrier',
  medium: 'Medium barrier',
  high: 'High barrier',
};

const BARRIER_COLOR: Record<string, string> = {
  low: 'bg-emerald-100 text-emerald-800',
  medium: 'bg-amber-100 text-amber-800',
  high: 'bg-red-100 text-red-800',
};

const SPEED_COLOR: Record<string, string> = {
  immediate: 'bg-emerald-100 text-emerald-800',
  same_day: 'bg-amber-100 text-amber-800',
  delayed: 'bg-slate-100 text-slate-700',
};

const ENTRY_LABEL: Record<string, string> = {
  'call': 'Call to enter',
  'walk-in': 'Walk-in',
  'scheduled': 'Scheduled intake',
  'referral': 'Referral needed',
  'screened': 'Screening required',
};

function copyPhone(phone: string) {
  navigator.clipboard.writeText(phone).then(() => toast.success('Phone number copied'));
}

// ─── Resource Card ────────────────────────────────────────────────────────────

function ResourceCard({
  record,
  onDidNotWork,
  dismissed,
}: {
  record: Layer1Record;
  onDidNotWork: (id: string) => void;
  dismissed: boolean;
}) {
  const [confirming, setConfirming] = useState(false);

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="bg-white border border-[#E8E7E1] rounded-xl p-5 space-y-3"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-[#1B4332] font-bold text-base leading-snug">
            {record.program_name}
          </h3>
          <p className="text-[#6B7280] font-body text-xs mt-0.5">{record.address}</p>
        </div>
        <span className={`flex-shrink-0 text-xs font-body font-semibold px-2 py-0.5 rounded-full ${SPEED_COLOR[record.access_speed]}`}>
          {SPEED_LABEL[record.access_speed]}
        </span>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <span className={`text-xs font-body font-medium px-2 py-0.5 rounded-full ${BARRIER_COLOR[record.barrier_level]}`}>
          {BARRIER_LABEL[record.barrier_level]}
        </span>
        <span className="text-xs font-body font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
          {ENTRY_LABEL[record.entry_type] ?? record.entry_type}
        </span>
        {record.referral_required === 'yes' && (
          <span className="text-xs font-body font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
            Referral required
          </span>
        )}
      </div>

      {/* Instruction */}
      <p className="font-body text-sm text-[#374151] leading-relaxed">
        {record.how_to_enter}
      </p>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <a
          href={`tel:${record.contact_details.replace(/\D/g, '')}`}
          className="flex items-center gap-2 px-4 py-2 bg-[#1B4332] text-white rounded-lg font-body text-sm font-semibold hover:bg-[#2D6A4F] transition-colors"
        >
          <Phone className="w-3.5 h-3.5" />
          {record.contact_details}
        </a>
        <button
          onClick={() => copyPhone(record.contact_details)}
          className="flex items-center gap-1.5 px-3 py-2 border border-[#E8E7E1] rounded-lg font-body text-sm text-[#374151] hover:bg-[#F5F4EF] transition-colors"
        >
          <Copy className="w-3.5 h-3.5" />
          Copy
        </button>
      </div>

      {/* Feedback */}
      <div className="pt-1 border-t border-[#F0EFE9]">
        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            className="text-xs font-body text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
          >
            Did this work? →
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-xs font-body text-[#374151]">Did this help?</span>
            <button
              onClick={() => { setConfirming(false); toast.success('Glad it worked!'); }}
              className="flex items-center gap-1 text-xs font-body font-semibold text-emerald-700 hover:text-emerald-900"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Yes
            </button>
            <button
              onClick={() => { onDidNotWork(record.id); toast.info('Showing next option'); }}
              className="flex items-center gap-1 text-xs font-body font-semibold text-red-600 hover:text-red-800"
            >
              <AlertCircle className="w-3.5 h-3.5" /> No — show next
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Step Components ──────────────────────────────────────────────────────────

function IntroStep({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      key="intro"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className="max-w-lg mx-auto text-center space-y-6 py-8"
    >
      <div className="space-y-3">
        <p className="font-body text-xs font-semibold tracking-widest text-[#D4A017] uppercase">
          Decision Engine
        </p>
        <h1 className="font-display text-4xl font-bold text-white leading-tight">
          Get Shelter Now
        </h1>
        <p className="font-body text-[#A7C4B5] text-lg leading-relaxed">
          Answer 2 questions. We'll give you the fastest realistic path to shelter — not a long list.
        </p>
      </div>

      <div className="bg-white/10 border border-white/20 rounded-xl p-5 text-left space-y-3">
        <p className="font-body text-sm font-semibold text-white">How this works</p>
        <ul className="space-y-2">
          {[
            { icon: <Shield className="w-4 h-4" />, text: 'Tell us who needs shelter' },
            { icon: <Zap className="w-4 h-4" />, text: 'We rank by likelihood of success' },
            { icon: <CheckCircle2 className="w-4 h-4" />, text: 'You get the top 2–3 actions right now' },
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-[#A7C4B5] font-body text-sm">
              <span className="text-[#D4A017]">{item.icon}</span>
              {item.text}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-amber-900/30 border border-amber-700/40 rounded-lg p-3 text-left">
        <p className="font-body text-xs text-amber-200">
          <strong>This is not a housing application.</strong> This tool finds the fastest path to shelter tonight and gets you into Coordinated Entry (RAP) for longer-term housing.
        </p>
      </div>

      <button
        onClick={onStart}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#D4A017] text-[#1B4332] rounded-xl font-body font-bold text-lg hover:bg-[#E8B420] transition-colors shadow-lg"
      >
        Start — Find shelter now
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="grid grid-cols-2 gap-3">
        <a href="tel:211" className="flex items-center gap-2 px-4 py-3 bg-white/10 border border-white/20 rounded-xl font-body text-sm text-white hover:bg-white/20 transition-colors">
          <Phone className="w-4 h-4 text-[#D4A017]" />
          <div className="text-left">
            <div className="font-semibold">Call 211</div>
            <div className="text-[#A7C4B5] text-xs">24/7 navigator</div>
          </div>
        </a>
        <a href="tel:18006567867" className="flex items-center gap-2 px-4 py-3 bg-rose-900/30 border border-rose-700/40 rounded-xl font-body text-sm text-white hover:bg-rose-900/50 transition-colors">
          <Shield className="w-4 h-4 text-rose-300" />
          <div className="text-left">
            <div className="font-semibold">DV Hotline</div>
            <div className="text-rose-300 text-xs">24/7 confidential</div>
          </div>
        </a>
      </div>
    </motion.div>
  );
}

function QuestionStep<T extends string>({
  question,
  sub,
  options,
  onSelect,
  onBack,
  progress,
}: {
  question: string;
  sub: string;
  options: Array<{ value: T; label: string; sub: string; icon?: string }>;
  onSelect: (v: T) => void;
  onBack: () => void;
  progress: number; // 0–1
}) {
  return (
    <motion.div
      key={question}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      className="max-w-lg mx-auto space-y-5"
    >
      {/* Progress bar */}
      <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#D4A017] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <button onClick={onBack} className="flex items-center gap-1 text-[#A7C4B5] font-body text-sm hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div>
        <h2 className="font-display text-2xl font-bold text-white">{question}</h2>
        <p className="font-body text-[#A7C4B5] text-sm mt-1">{sub}</p>
      </div>

      <div className="space-y-2">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className="w-full flex items-center gap-4 px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-left hover:bg-white/20 hover:border-[#D4A017]/60 transition-all group"
          >
            {opt.icon && <span className="text-2xl flex-shrink-0">{opt.icon}</span>}
            <div className="flex-1 min-w-0">
              <div className="font-body font-semibold text-white text-sm">{opt.label}</div>
              <div className="font-body text-[#A7C4B5] text-xs mt-0.5">{opt.sub}</div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#A7C4B5] group-hover:text-[#D4A017] flex-shrink-0 transition-colors" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Results Screen ───────────────────────────────────────────────────────────

function ResultsScreen({
  input,
  onReset,
}: {
  input: UserInput;
  onReset: () => void;
}) {
  const [dismissed, setDismissed] = useState<string[]>([]);

  const results = dismissed.length === 0
    ? runDecisionEngine(input)
    : rerunWithout(input, dismissed);

  const handleDidNotWork = useCallback((id: string) => {
    setDismissed(prev => [...prev, id]);
  }, []);

  const totalMatched = (results.best ? 1 : 0) + results.next.length + results.backup.length;

  return (
    <motion.div
      key="results"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Your Shelter Plan</h2>
          <p className="font-body text-[#A7C4B5] text-sm mt-0.5">
            {totalMatched} resource{totalMatched !== 1 ? 's' : ''} matched · ranked by likelihood of success
          </p>
        </div>
        <div className="flex items-center gap-2">
          <PrintablePlan results={results} input={input as UserInput} />
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/10 border border-white/20 rounded-lg font-body text-sm text-white hover:bg-white/20 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Start over
          </button>
        </div>
      </div>

      {/* No results */}
      {!results.best && results.next.length === 0 && results.backup.length === 0 && (
        <div className="bg-white/10 border border-white/20 rounded-xl p-6 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
          <p className="font-body text-white font-semibold">No direct matches found</p>
          <p className="font-body text-[#A7C4B5] text-sm">Try calling 211 — they can navigate you to the right resource countywide.</p>
          <a href="tel:211" className="inline-flex items-center gap-2 px-5 py-3 bg-[#D4A017] text-[#1B4332] rounded-xl font-body font-bold hover:bg-[#E8B420] transition-colors">
            <Phone className="w-4 h-4" /> Call 211
          </a>
        </div>
      )}

      {/* Card 1 — Best Option */}
      {results.best && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#D4A017] text-[#1B4332] font-body font-bold text-xs">1</span>
            <div>
              <h3 className="font-body font-bold text-white text-sm">Best Immediate Option</h3>
              <p className="font-body text-[#A7C4B5] text-xs">Highest priority match for your situation</p>
            </div>
          </div>
          <AnimatePresence mode="wait">
            <ResourceCard
              key={results.best.id}
              record={results.best}
              onDidNotWork={handleDidNotWork}
              dismissed={dismissed.includes(results.best.id)}
            />
          </AnimatePresence>
        </section>
      )}

      {/* Card 2 — Next Options */}
      {results.next.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-700 text-white font-body font-bold text-xs">2</span>
            <div>
              <h3 className="font-body font-bold text-white text-sm">Next Best Options</h3>
              <p className="font-body text-[#A7C4B5] text-xs">Additional resources ranked by likelihood of success</p>
            </div>
          </div>
          <div className="space-y-3">
            <AnimatePresence>
              {results.next.map(r => (
                <ResourceCard
                  key={r.id}
                  record={r}
                  onDidNotWork={handleDidNotWork}
                  dismissed={dismissed.includes(r.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* Card 3 — Backup Options */}
      {results.backup.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-600 text-white font-body font-bold text-xs">3</span>
            <div>
              <h3 className="font-body font-bold text-white text-sm">Backup Options</h3>
              <p className="font-body text-[#A7C4B5] text-xs">Higher barriers or longer wait times — use if others are full</p>
            </div>
          </div>
          <div className="space-y-3">
            <AnimatePresence>
              {results.backup.map(r => (
                <ResourceCard
                  key={r.id}
                  record={r}
                  onDidNotWork={handleDidNotWork}
                  dismissed={dismissed.includes(r.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* Always-visible 211 fallback */}
      <div className="bg-white/10 border border-white/20 rounded-xl p-4 flex items-center justify-between gap-4">
        <div>
          <p className="font-body font-semibold text-white text-sm">Still need help?</p>
          <p className="font-body text-[#A7C4B5] text-xs">211 can navigate you to any King County resource, 24/7.</p>
        </div>
        <a href="tel:211" className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-[#D4A017] text-[#1B4332] rounded-lg font-body font-bold text-sm hover:bg-[#E8B420] transition-colors">
          <Phone className="w-3.5 h-3.5" /> Call 211
        </a>
      </div>

      {/* Correction link */}
      <div className="text-center pb-4">
        <button
          onClick={() => toast.info('Use the "Submit a correction" form below to flag outdated info.')}
          className="font-body text-xs text-[#A7C4B5] hover:text-white transition-colors underline underline-offset-2"
        >
          Something wrong with this data? Submit a correction
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ShelterFinder() {
  const [step, setStep] = useState<Step>('intro');
  const [input, setInput] = useState<Partial<UserInput>>({});

  const { status: severeWeather } = useSevereWeather();

  const handlePopulation = (v: PopulationServed | 'not_sure') => {
    setInput(prev => ({ ...prev, population: v }));
    setStep('area');
  };

  const handleArea = (v: CountyArea | 'not_sure') => {
    setInput(prev => ({ ...prev, county_area: v }));
    setStep('situation');
  };

  const handleSituation = (v: UserInput['situation']) => {
    setInput(prev => ({ ...prev, situation: v }));
    setStep('results');
  };

  const handleReset = () => {
    setInput({});
    setStep('intro');
  };

  const goBack = () => {
    if (step === 'area') setStep('population');
    else if (step === 'situation') setStep('area');
    else if (step === 'results') setStep('situation');
    else setStep('intro');
  };

  const finalInput: UserInput = {
    population: input.population ?? 'not_sure',
    county_area: input.county_area ?? 'not_sure',
    situation: input.situation ?? 'not_sure',
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1B4332]">
      <Navbar />

      {/* Emergency override banner */}
      {severeWeather?.active && (
        <div className="bg-red-600 text-white px-4 py-3">
          <div className="container">
            <div className="flex items-center gap-3">
              <span className="text-yellow-300 font-bold text-sm">🚨 Emergency Shelter Activated</span>
              <a href={severeWeather.source_url} target="_blank" rel="noopener noreferrer"
                className="ml-auto px-3 py-1 bg-white text-red-700 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors">
                KCRHA.org
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Hero header */}
      <div className="bg-[#1B4332] border-b border-white/10 py-8">
        <div className="container">
          <AnimatePresence mode="wait">
            {step === 'intro' && <IntroStep key="intro" onStart={() => setStep('population')} />}

            {step === 'population' && (
              <QuestionStep<PopulationServed | 'not_sure'>
                key="population"
                question="Who needs shelter?"
                sub="This determines which programs you're eligible for."
                options={POP_OPTIONS}
                onSelect={handlePopulation}
                onBack={goBack}
                progress={0.33}
              />
            )}

            {step === 'area' && (
              <QuestionStep<CountyArea | 'not_sure'>
                key="area"
                question="Where are you?"
                sub="We'll prioritize resources closest to you."
                options={AREA_OPTIONS}
                onSelect={handleArea}
                onBack={goBack}
                progress={0.66}
              />
            )}

            {step === 'situation' && (
              <QuestionStep<UserInput['situation']>
                key="situation"
                question="Where are you sleeping tonight?"
                sub="This helps us understand urgency."
                options={SITUATION_OPTIONS}
                onSelect={handleSituation}
                onBack={goBack}
                progress={0.9}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Results (outside the hero, on white bg) */}
      {step === 'results' && (
        <div className="flex-1 bg-[#1B4332] py-8">
          <div className="container">
            {/* Emergency card override */}
            {severeWeather?.active && (
              <div className="mb-6">
                <EmergencyAlertCard status={severeWeather} onRefresh={() => {}} onFallback={() => {}} />
              </div>
            )}
            <ResultsScreen input={finalInput} onReset={handleReset} />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
