/*
 * SCRIPTS PAGE — Editorial Civic Design
 * Exact scripts users can copy for calling properties
 * Includes explanation of why each script works
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Phone, MessageSquare, ArrowRight } from 'lucide-react';
import { useLocation } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { CallingAssistantTrigger } from '@/components/CallingAssistant';

interface Script {
  id: string;
  title: string;
  scenario: string;
  script: string;
  why: string;
  type: 'ARCH' | 'MFTE' | 'Section 8' | 'Shelter' | 'Followup' | 'Voicemail' | 'RAP';
  color: { bg: string; text: string; border: string };
}

const SCRIPTS: Script[] = [
  {
    id: 'arch-initial',
    title: 'First Call — ARCH Units',
    scenario: 'You\'re calling a property for the first time to ask about ARCH income-restricted units.',
    script: `"Hi, my name is [your name]. I'm looking for an ARCH income-restricted unit. Do you currently have any available, or is there a waitlist I can join?"`,
    why: 'The key is saying "ARCH income-restricted unit" specifically. This tells the leasing agent you know what you\'re looking for. If you just ask "do you have anything available," they\'ll quote you market-rate prices. The word "ARCH" is the signal.',
    type: 'ARCH',
    color: { bg: '#D8F3DC', text: '#1B4332', border: '#95D5A3' },
  },
  {
    id: 'mfte-initial',
    title: 'First Call — MFTE Units',
    scenario: 'You\'re calling a newer building that participates in the MFTE program.',
    script: `"Hi, I'm looking for an MFTE income-qualified unit. I understand your building participates in the Multifamily Tax Exemption program. Do you have any income-qualified homes available, or a waitlist?"`,
    why: 'MFTE units are sometimes called "income-qualified homes" by leasing staff. Using both terms — MFTE and income-qualified — makes it clear you know what you\'re asking about. Newer buildings are more likely to have MFTE units.',
    type: 'MFTE',
    color: { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
  },
  {
    id: 'arch-followup',
    title: 'Follow-Up Call',
    scenario: 'You\'ve called before and they said nothing was available. You\'re following up.',
    script: `"Hi, I called a few weeks ago about ARCH income-restricted units. I wanted to check in — has anything opened up, or has the waitlist situation changed? My name is [name] and my number is [phone]."`,
    why: 'Persistence matters. Leasing staff turn over, and the person you talked to before may not have passed along your information. Calling back every 3–4 weeks keeps you on their radar. Units can open up quickly and fill just as fast.',
    type: 'Followup',
    color: { bg: '#F3F4F6', text: '#374151', border: '#D1D5DB' },
  },
  {
    id: 'voicemail',
    title: 'Voicemail Script',
    scenario: 'You got voicemail instead of a person.',
    script: `"Hi, my name is [your name] and I'm calling to ask about ARCH income-restricted units. I understand your building has affordable units available through the ARCH program. I'd love to learn about availability or get on a waitlist. My number is [phone number] and the best time to reach me is [time]. Thank you."`,
    why: 'Most people hang up when they get voicemail. Leaving a clear, specific message about ARCH units sets you apart. It also signals to the leasing agent that you\'re a serious, informed applicant — not someone who will need a lot of hand-holding.',
    type: 'Voicemail',
    color: { bg: '#EDE9FE', text: '#4C1D95', border: '#C4B5FD' },
  },
  {
    id: 'section8',
    title: 'Section 8 Voucher Call',
    scenario: 'You have a Section 8 voucher and are calling to ask if a property accepts it.',
    script: `"Hi, I have a Section 8 Housing Choice Voucher through KCHA and I'm looking for a [1BR/2BR] apartment. Does your property accept Section 8 vouchers? If so, do you have any units available or a waitlist?"`,
    why: 'Be upfront about having a voucher. Some properties accept them, some don\'t — there\'s no point wasting time if they don\'t. Asking directly saves everyone time and shows you know the process.',
    type: 'Section 8',
    color: { bg: '#DBEAFE', text: '#1E3A8A', border: '#93C5FD' },
  },
  {
    id: 'shelter',
    title: 'Calling a Shelter or Transitional Program',
    scenario: 'You need emergency or transitional housing immediately.',
    script: `"Hi, I'm looking for emergency shelter or transitional housing. Do you have any beds or units available? If not, can you tell me who I should call next? I'm trying to find housing as quickly as possible."`,
    why: 'Shelter staff are used to urgent situations. Being direct and asking for referrals even if they\'re full is important — they often know which nearby shelters have space. Always ask "who should I call next?"',
    type: 'Shelter',
    color: { bg: '#FFE4E6', text: '#9F1239', border: '#FCA5A5' },
  },
  {
    id: 'waitlist-add',
    title: 'Getting on a Waitlist',
    scenario: 'They told you nothing is available. You want to get on the waitlist.',
    script: `"I understand nothing is available right now. Can I be added to your waitlist? What information do you need from me? And roughly how long is the wait?"`,
    why: 'Never leave a call without asking to be added to the waitlist. Even a 2-year waitlist is worth joining — your situation may change, and being on multiple waitlists increases your chances. Always ask for the estimated wait time so you can prioritize.',
    type: 'Followup',
    color: { bg: '#F3F4F6', text: '#374151', border: '#D1D5DB' },
  },
  {
    id: 'rap-intake',
    title: 'Calling a RAP Site (Coordinated Entry)',
    scenario: 'You need to get into the Coordinated Entry system to access permanent housing. You are calling a RAP access point.',
    script: `"Hi, I'm looking to complete a housing assessment through Coordinated Entry. I understand you're a RAP access point. I'm currently [sleeping outside / in a shelter / in my car] and I need to get into the system. Can I come in for a walk-in assessment, or do I need an appointment?"`,
    why: 'RAP (Regional Access Point) is the front door to permanent housing in King County. You must be literally homeless — sleeping outside, in a shelter, or in a vehicle — to qualify. Saying "Coordinated Entry" and "RAP access point" signals you understand the system, which often gets you faster, more accurate help.',
    type: 'RAP',
    color: { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
  },
  {
    id: 'rap-followup',
    title: 'RAP Follow-Up After Assessment',
    scenario: 'You completed a housing assessment at a RAP site but haven\'t heard back. You\'re following up.',
    script: `"Hi, I completed a housing assessment at your location on [date]. My name is [name] and I was given a case number / reference number of [number if you have one]. I wanted to check on the status of my referral and find out if there are any next steps I should be taking. Can you help me?"`,
    why: 'After your assessment, you enter a queue. The system is slow and case managers are overloaded. Following up every 2–3 weeks keeps you visible. Always reference your assessment date and any case number you were given — it makes it much easier for staff to find your file.',
    type: 'RAP',
    color: { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
  },
  {
    id: 'shelter-full',
    title: 'When a Shelter Says They\'re Full',
    scenario: 'You called a shelter and they said they have no beds available tonight.',
    script: `"I understand you\'re full. Can you tell me which shelters nearby might have space tonight? And is there a number I should call to find out where beds are available — like 211?"`,
    why: 'Shelter staff know the local network. Even when they\'re full, they often know who has space. Always ask for a referral before hanging up. Calling 211 is also the fastest way to find real-time bed availability across King County — they have live counts.',
    type: 'Shelter',
    color: { bg: '#FFE4E6', text: '#9F1239', border: '#FCA5A5' },
  },
  {
    id: 'dv-shelter',
    title: 'Calling a DV Shelter (Confidential)',
    scenario: 'You are fleeing domestic violence and need to reach a confidential shelter.',
    script: `"Hi, I\'m in an unsafe situation at home and I need to find a safe place to stay tonight. I\'m looking for a domestic violence shelter. Can you help me, or can you give me the number for the 24-hour DV hotline?"`,
    why: 'DV shelters keep their addresses confidential for safety. You will not be given an address over the phone — you will be screened first. The 24-hour King County DV hotline is (206) 656-8423. They can connect you to a safe shelter and help you make a safety plan. You do not need to be in immediate danger to call.',
    type: 'Shelter',
    color: { bg: '#FFE4E6', text: '#9F1239', border: '#FCA5A5' },
  },
];

function ScriptCard({ script }: { script: Script }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(script.script.replace(/^"|"$/g, ''));
    setCopied(true);
    toast.success('Script copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Build a ScriptTemplate for the CallingAssistant
  const scriptTemplate = {
    id: script.id,
    title: script.title,
    type: script.type,
    script: script.script,
    why: script.why,
    color: script.color,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl border border-[#E8E7E1] overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 border-b border-[#F0EFE9]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span
              className="inline-flex items-center text-xs font-body font-semibold px-2.5 py-1 rounded-full border mb-2"
              style={{ backgroundColor: script.color.bg, color: script.color.text, borderColor: script.color.border }}
            >
              {script.type}
            </span>
            <h3 className="font-display text-[#1B4332] text-lg font-semibold">{script.title}</h3>
            <p className="text-[#6B7280] text-sm font-body mt-1">{script.scenario}</p>
          </div>
          <Phone className="w-5 h-5 text-[#9CA3AF] flex-shrink-0 mt-1" />
        </div>
      </div>

      {/* Script */}
      <div className="p-5 bg-[#F9FAFB] border-b border-[#F0EFE9]">
        <div className="flex items-start justify-between gap-3">
          <p className="font-body text-[#1F2937] text-sm leading-relaxed italic flex-1">
            {script.script}
          </p>
          <button
            onClick={handleCopy}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body font-medium transition-all ${
              copied
                ? 'bg-[#D8F3DC] text-[#1B4332] border border-[#95D5A3]'
                : 'bg-white text-[#374151] border border-[#E5E7EB] hover:border-[#52B788] hover:text-[#1B4332]'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Why it works + Live Call button */}
      <div className="p-5">
        <div className="flex items-start gap-2 mb-4">
          <MessageSquare className="w-4 h-4 text-[#D97706] flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-body font-semibold text-[#D97706] uppercase tracking-wider">Why this works</span>
            <p className="text-[#374151] text-sm font-body leading-relaxed mt-1">{script.why}</p>
          </div>
        </div>

        {/* Teleprompter CTA */}
        <div className="pt-4 border-t border-[#F0EFE9]">
          <CallingAssistantTrigger
            script={scriptTemplate}
            phoneNumber="(425) 747-3300"
            label="Practice with Live Teleprompter"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1B4332] text-white rounded-lg font-body font-semibold text-sm hover:bg-[#2D6A4F] transition-colors"
          />
          <p className="text-xs font-body text-[#9CA3AF] text-center mt-2">Opens script overlay — enter a real number when calling a property</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Scripts() {
  const [, navigate] = useLocation();
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filters = ['All', 'ARCH', 'MFTE', 'Section 8', 'Shelter', 'RAP', 'Followup', 'Voicemail'];
  const filtered = activeFilter === 'All' ? SCRIPTS : SCRIPTS.filter(s => s.type === activeFilter);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7]">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#1B4332] py-16">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <span className="inline-block bg-[#D97706]/20 text-[#FCD34D] text-xs font-body font-medium px-3 py-1 rounded-full border border-[#D97706]/30 mb-4 uppercase tracking-wider">
              Word-for-word scripts
            </span>
            <h1 className="font-display text-white text-4xl sm:text-5xl font-bold leading-tight mb-4">
              Exactly What to Say
            </h1>
            <p className="text-[#D8F3DC] font-body text-lg leading-relaxed">
              Copy these scripts verbatim. The specific words you use when calling a property determine whether you get a real answer or a runaround.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key insight banner */}
      <div className="bg-[#FFFBEB] border-b border-[#FCD34D]/40 py-4">
        <div className="container">
          <p className="text-[#78350F] font-body text-sm text-center">
            <strong>The #1 rule:</strong> Never ask "do you have anything available?" — always ask specifically for ARCH, MFTE, or income-restricted units.
          </p>
        </div>
      </div>

      <div className="container py-12">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-all border ${
                activeFilter === f
                  ? 'bg-[#1B4332] text-white border-[#1B4332]'
                  : 'bg-white text-[#374151] border-[#E5E7EB] hover:border-[#52B788]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Scripts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-12">
          {filtered.map(script => (
            <ScriptCard key={script.id} script={script} />
          ))}
        </div>

        {/* Tips section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#1B4332] rounded-2xl p-8 text-white"
        >
          <h2 className="font-display text-white text-2xl font-bold mb-6">General Tips for Every Call</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { tip: 'Call in the morning', detail: 'Leasing offices are less busy before 11am. You\'re more likely to get a real conversation.' },
              { tip: 'Call on the 1st of the month', detail: 'Units often become available at the start of a new month. Timing your calls can make a difference.' },
              { tip: 'Keep a log', detail: 'Track who you called, what they said, and when to follow up. A simple spreadsheet works fine.' },
              { tip: 'Be patient and polite', detail: 'Leasing agents are people. Being friendly and professional increases the chance they\'ll go the extra mile for you.' },
              { tip: 'Ask for a name', detail: 'Get the name of who you spoke with. It helps with follow-up calls and shows you\'re organized.' },
              { tip: 'Apply to multiple properties', detail: 'Don\'t put all your eggs in one basket. Apply to every property that fits your needs simultaneously.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-[#D97706] rounded-full flex items-center justify-center text-xs font-data font-bold text-white">
                  {i + 1}
                </div>
                <div>
                  <div className="font-body font-semibold text-white text-sm">{item.tip}</div>
                  <div className="text-[#95D5A3] text-xs font-body mt-0.5">{item.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <p className="text-[#6B7280] font-body mb-4">Ready to start calling? Find properties near you.</p>
          <button
            onClick={() => navigate('/search')}
            className="flex items-center gap-2 justify-center mx-auto px-6 py-3 bg-[#1B4332] text-white rounded-lg font-body font-medium hover:bg-[#2D6A4F] transition-colors"
          >
            Search properties <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
