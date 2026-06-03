/**
 * LIVE CALLING ASSISTANT — Teleprompter Bottom Sheet
 * Design: Editorial Civic
 *
 * Features:
 *   - One-tap: clicking phone number opens bottom sheet with script simultaneously
 *   - Variable injection: [your name] → user's name, [property name] → property name
 *   - Outcome logging: post-call prompt → updates freshnessStore
 *   - Persists user name across sessions
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, X, ChevronRight, Check, MessageSquare, User, Mic, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { submitSignal, SignalType } from '@/lib/freshnessStore';

export interface ScriptTemplate {
  id: string;
  title: string;
  type: string;
  script: string;
  why: string;
  color: { bg: string; text: string; border: string };
}

interface CallingAssistantProps {
  script: ScriptTemplate;
  phoneNumber: string;
  propertyName?: string;
  propertyId?: string;
  onClose?: () => void;
}

const USER_NAME_KEY = 'decoded_housing_user_name';

function injectVariables(text: string, userName: string, propertyName: string): string {
  return text
    .replace(/\[your name\]/gi, userName || '[your name]')
    .replace(/\[name\]/gi, userName || '[your name]')
    .replace(/\[property name\]/gi, propertyName || '[property name]')
    .replace(/\[phone\]/gi, '[your phone number]')
    .replace(/\[phone number\]/gi, '[your phone number]');
}

export function CallingAssistant({ script, phoneNumber, propertyName = '', propertyId, onClose }: CallingAssistantProps) {
  const [userName, setUserName] = useState(() => {
    try { return localStorage.getItem(USER_NAME_KEY) || ''; } catch { return ''; }
  });
  const [editingName, setEditingName] = useState(!userName);
  const [nameInput, setNameInput] = useState(userName);
  const [callStarted, setCallStarted] = useState(false);
  const [showOutcome, setShowOutcome] = useState(false);
  const [step, setStep] = useState<'setup' | 'calling' | 'outcome'>('setup');

  const injectedScript = injectVariables(script.script, userName, propertyName);

  const saveName = () => {
    const trimmed = nameInput.trim();
    if (trimmed) {
      setUserName(trimmed);
      try { localStorage.setItem(USER_NAME_KEY, trimmed); } catch {}
      setEditingName(false);
    }
  };

  const handleCall = () => {
    window.location.href = `tel:${phoneNumber.replace(/\D/g, '')}`;
    setCallStarted(true);
    setStep('calling');
  };

  const handleOutcome = (outcome: SignalType | 'answered') => {
    if (propertyId && outcome !== 'answered') {
      submitSignal(propertyId, outcome as SignalType);
    }

    const messages: Record<string, string> = {
      waitlist_open: 'Waitlist open — marked as verified! 🟢',
      waitlist_full: 'Noted as full — High Competition badge added.',
      no_answer: 'No answer logged. After 3 reports, we flag for review.',
      answered: 'Great! Check back after your call.',
    };
    toast.success(messages[outcome] || 'Logged!');
    onClose?.();
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl border-t border-[#E8E7E1] max-h-[90vh] overflow-hidden flex flex-col"
      style={{ maxWidth: '640px', margin: '0 auto' }}
    >
      {/* Drag handle */}
      <div className="flex-shrink-0 flex justify-center pt-3 pb-1">
        <div className="w-10 h-1 bg-[#E5E7EB] rounded-full" />
      </div>

      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-[#F0EFE9]">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-body font-semibold px-2.5 py-1 rounded-full border"
            style={{ backgroundColor: script.color.bg, color: script.color.text, borderColor: script.color.border }}
          >
            {script.type}
          </span>
          <h3 className="font-display font-bold text-[#1B4332] text-base">{script.title}</h3>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors">
          <X className="w-4 h-4 text-[#6B7280]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Step: Setup */}
        {step === 'setup' && (
          <div className="p-5 space-y-5">
            {/* Name injection */}
            <div className="bg-[#F9FAFB] rounded-xl p-4 border border-[#E5E7EB]">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-[#1B4332]" />
                <span className="font-body font-semibold text-[#1B4332] text-sm">Your name (auto-fills script)</span>
              </div>
              {editingName ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && saveName()}
                    placeholder="Enter your first name..."
                    autoFocus
                    className="flex-1 px-3 py-2 text-sm font-body border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                  />
                  <button
                    onClick={saveName}
                    className="px-3 py-2 bg-[#1B4332] text-white rounded-lg font-body text-sm"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm text-[#1F2937] font-semibold">{userName}</span>
                  <button onClick={() => { setEditingName(true); setNameInput(userName); }} className="text-xs font-body text-[#6B7280] hover:text-[#1B4332] underline">
                    Change
                  </button>
                </div>
              )}
            </div>

            {/* Script teleprompter */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-body font-semibold text-[#374151] uppercase tracking-wider">Your Script</span>
                <span className="text-xs font-body text-[#9CA3AF]">Read this word-for-word</span>
              </div>
              <div className="bg-[#1B4332] rounded-xl p-5 relative">
                <Mic className="absolute top-3 right-3 w-4 h-4 text-[#52B788] opacity-60" />
                <p className="font-body text-white text-base leading-relaxed">
                  {injectedScript.split(/(\[.*?\])/g).map((part, i) => {
                    const isPlaceholder = part.startsWith('[') && part.endsWith(']');
                    return isPlaceholder ? (
                      <span key={i} className="bg-[#D97706] text-white px-1.5 py-0.5 rounded font-semibold text-sm mx-0.5">
                        {part}
                      </span>
                    ) : (
                      <span key={i}>{part}</span>
                    );
                  })}
                </p>
              </div>
            </div>

            {/* Why it works */}
            <div className="flex items-start gap-2 bg-[#FFFBEB] rounded-xl p-4 border border-[#FCD34D]/40">
              <MessageSquare className="w-4 h-4 text-[#D97706] flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-body font-semibold text-[#D97706] uppercase tracking-wider">Why this works</span>
                <p className="text-[#78350F] text-sm font-body leading-relaxed mt-1">{script.why}</p>
              </div>
            </div>

            {/* Call button */}
            <a
              href={`tel:${phoneNumber.replace(/\D/g, '')}`}
              onClick={() => { setCallStarted(true); setTimeout(() => setStep('calling'), 1500); }}
              className="flex items-center justify-center gap-3 w-full py-4 bg-[#1B4332] text-white rounded-xl font-body font-bold text-lg hover:bg-[#2D6A4F] transition-colors active:scale-[0.98]"
            >
              <Phone className="w-5 h-5" />
              Call {phoneNumber}
            </a>
          </div>
        )}

        {/* Step: Calling */}
        {step === 'calling' && (
          <div className="p-5 space-y-5">
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-[#D8F3DC] rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                <Phone className="w-8 h-8 text-[#1B4332]" />
              </div>
              <h3 className="font-display font-bold text-[#1B4332] text-xl mb-1">Calling {propertyName || 'property'}…</h3>
              <p className="font-body text-[#6B7280] text-sm">Keep this screen open. Your script is below.</p>
            </div>

            {/* Script reminder */}
            <div className="bg-[#1B4332] rounded-xl p-5">
              <p className="font-body text-white text-base leading-relaxed">
                {injectedScript.split(/(\[.*?\])/g).map((part, i) => {
                  const isPlaceholder = part.startsWith('[') && part.endsWith(']');
                  return isPlaceholder ? (
                    <span key={i} className="bg-[#D97706] text-white px-1.5 py-0.5 rounded font-semibold text-sm mx-0.5">
                      {part}
                    </span>
                  ) : (
                    <span key={i}>{part}</span>
                  );
                })}
              </p>
            </div>

            <button
              onClick={() => setStep('outcome')}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#D8F3DC] text-[#1B4332] rounded-xl font-body font-semibold hover:bg-[#B7E4C7] transition-colors"
            >
              Call finished — log outcome <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setStep('setup')}
              className="w-full flex items-center justify-center gap-2 py-2 text-[#6B7280] font-body text-sm hover:text-[#1B4332] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Back to script
            </button>
          </div>
        )}

        {/* Step: Outcome */}
        {step === 'outcome' && (
          <div className="p-5 space-y-4">
            <div className="text-center mb-2">
              <h3 className="font-display font-bold text-[#1B4332] text-xl mb-1">How did it go?</h3>
              <p className="font-body text-[#6B7280] text-sm">Your answer helps keep data fresh for everyone.</p>
            </div>

            <div className="space-y-3">
              {[
                {
                  outcome: 'waitlist_open' as SignalType,
                  label: 'Waitlist is open',
                  sub: 'They\'re accepting applications',
                  icon: '🟢',
                  style: 'border-[#52B788] bg-[#D8F3DC] text-[#1B4332]',
                },
                {
                  outcome: 'waitlist_full' as SignalType,
                  label: 'Waitlist is full / closed',
                  sub: 'No applications being accepted',
                  icon: '🔴',
                  style: 'border-orange-300 bg-orange-50 text-orange-800',
                },
                {
                  outcome: 'no_answer' as SignalType,
                  label: 'No answer / voicemail',
                  sub: 'Couldn\'t reach anyone',
                  icon: '📵',
                  style: 'border-[#E5E7EB] bg-[#F9FAFB] text-[#374151]',
                },
                {
                  outcome: 'answered' as 'answered',
                  label: 'Answered — still on the call',
                  sub: 'I\'ll log the outcome later',
                  icon: '📞',
                  style: 'border-[#E5E7EB] bg-[#F9FAFB] text-[#374151]',
                },
              ].map(item => (
                <button
                  key={item.outcome}
                  onClick={() => handleOutcome(item.outcome)}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border-2 text-left transition-all hover:scale-[1.01] active:scale-[0.99] ${item.style}`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="font-body font-semibold text-sm">{item.label}</div>
                    <div className="font-body text-xs opacity-70 mt-0.5">{item.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Trigger button ────────────────────────────────────────────────────────────

interface CallingAssistantTriggerProps {
  script: ScriptTemplate;
  phoneNumber: string;
  propertyName?: string;
  propertyId?: string;
  label?: string;
  className?: string;
}

export function CallingAssistantTrigger({
  script, phoneNumber, propertyName, propertyId, label, className,
}: CallingAssistantTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={className ?? 'flex items-center gap-2 px-4 py-2.5 bg-[#1B4332] text-white rounded-lg font-body font-semibold text-sm hover:bg-[#2D6A4F] transition-colors'}
      >
        <Phone className="w-4 h-4" />
        {label ?? `Call ${phoneNumber}`}
      </button>

      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/40 z-40"
            />
            <CallingAssistant
              script={script}
              phoneNumber={phoneNumber}
              propertyName={propertyName}
              propertyId={propertyId}
              onClose={() => setOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
}
