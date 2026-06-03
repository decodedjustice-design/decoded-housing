/*
 * HELP CENTER — /help-center
 * FAQ, glossary, language access, contact
 */
import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle, BookOpen, Globe, Phone, Mail, Search,
  ChevronDown, ChevronUp, ArrowRight, ExternalLink
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const FAQ_CATEGORIES = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    faqs: [
      {
        q: 'What is Decoded Housing?',
        a: 'Decoded Housing is a free, community-maintained directory of affordable housing in East King County, Washington. We list ARCH units, MFTE apartments, Section 8 properties, transitional housing, and emergency shelters — all in one place.',
      },
      {
        q: 'Is this an official government website?',
        a: 'No. Decoded Housing is an independent community resource. We are not affiliated with KCHA, ARCH, or any government agency. Always verify information directly with the property or program.',
      },
      {
        q: 'How do I start looking for housing?',
        a: 'Start with the Eligibility Checker to understand which programs you qualify for, then use the Search page to find properties. You can filter by housing type, city, bedroom count, and AMI level.',
      },
      {
        q: 'Is this service free?',
        a: 'Yes, completely free. We never charge fees for listing information or resources.',
      },
    ],
  },
  {
    id: 'eligibility',
    title: 'Eligibility & Income',
    faqs: [
      {
        q: 'What is AMI (Area Median Income)?',
        a: 'AMI stands for Area Median Income — the midpoint income for a given area. Affordable housing programs use AMI percentages (30%, 50%, 60%, 80%) to set income limits. For example, a unit at "60% AMI" is available to households earning up to 60% of the area median income.',
      },
      {
        q: 'How is AMI calculated for King County?',
        a: 'HUD (the U.S. Department of Housing and Urban Development) calculates AMI annually for each metropolitan area. For King County in 2024, the 4-person household AMI is approximately $117,250.',
      },
      {
        q: 'What income counts toward AMI calculations?',
        a: 'Generally, all household income counts: wages, self-employment income, Social Security, SSI, child support, alimony, and most other regular income sources. Each program may have slightly different rules — ask the property manager.',
      },
      {
        q: 'Do I need to be a U.S. citizen to apply?',
        a: 'Requirements vary by program. Many affordable housing programs are open to non-citizens with eligible immigration status. Section 8 has specific citizenship requirements. Contact the program directly for details.',
      },
    ],
  },
  {
    id: 'applying',
    title: 'Applying for Housing',
    faqs: [
      {
        q: 'How do I apply for ARCH units?',
        a: 'ARCH units are managed by individual property owners. Contact the leasing office directly and ask specifically about "ARCH income-restricted units." Each property has its own application process.',
      },
      {
        q: 'How do I apply for MFTE units?',
        a: 'MFTE units are in market-rate buildings. Apply directly through the building\'s leasing office. Ask for their "affordable" or "MFTE" units — they may not be advertised prominently.',
      },
      {
        q: 'How do I get a Section 8 voucher?',
        a: 'Apply through KCHA (King County Housing Authority) when the waitlist is open. The waitlist opens rarely and fills quickly. Sign up for KCHA email alerts to be notified. Once you have a voucher, you can use it at any property that accepts Section 8.',
      },
      {
        q: 'What documents do I need to apply?',
        a: 'Most programs require: government-issued ID, Social Security card or ITIN, last 2-3 pay stubs, most recent tax return, bank statements, and rental history. Use our Document Checklist in the Applicant Portal to prepare.',
      },
      {
        q: 'Can I apply to multiple properties at once?',
        a: 'Yes, and we strongly recommend it. Affordable housing is competitive. Apply to as many eligible properties as possible and track your applications in our Applicant Portal.',
      },
    ],
  },
  {
    id: 'data',
    title: 'About Our Data',
    faqs: [
      {
        q: 'How current is the listing information?',
        a: 'We update listings regularly, but availability changes quickly. Always verify directly with the property before applying. Use the "Community Verified" signal to see recent reports from other users.',
      },
      {
        q: 'How can I report incorrect information?',
        a: 'Use the "Report an update" button on any property page, or email us. We review all reports and update listings promptly.',
      },
      {
        q: 'How do I add a property to the database?',
        a: 'Property owners and managers can submit listings via the Owner Hub. Community members can also suggest properties by emailing us. All submissions are reviewed before publishing.',
      },
    ],
  },
];

const GLOSSARY = [
  { term: 'AMI', def: 'Area Median Income. The midpoint income for a geographic area, used to set income limits for affordable housing programs.' },
  { term: 'ARCH', def: 'A Regional Coalition for Housing. A partnership of East King County cities that funds and oversees affordable housing development.' },
  { term: 'MFTE', def: 'Multifamily Tax Exemption. A program that gives property tax breaks to developers who include below-market units in their buildings.' },
  { term: 'Section 8', def: 'Also called the Housing Choice Voucher program. A federal subsidy where KCHA pays a portion of rent directly to the landlord.' },
  { term: 'HQS', def: 'Housing Quality Standards. The minimum habitability standards a unit must meet to accept Section 8 vouchers.' },
  { term: 'KCHA', def: 'King County Housing Authority. The local agency that administers Section 8 vouchers and public housing in King County.' },
  { term: 'HAP', def: 'Housing Assistance Payment. The monthly payment KCHA makes to a landlord on behalf of a Section 8 voucher holder.' },
  { term: 'Waitlist', def: 'A queue of applicants waiting for a unit or voucher to become available. Many affordable programs have long waitlists.' },
  { term: 'Income certification', def: 'The process of verifying a household\'s income to confirm eligibility for an affordable unit. Usually done at move-in and annually.' },
  { term: 'Fair market rent', def: 'HUD\'s estimate of the cost to rent a moderately-priced unit in a given area. Used to set Section 8 payment standards.' },
  { term: 'Just cause eviction', def: 'A law requiring landlords to have a specific, legally-recognized reason to evict a tenant. Washington State enacted this in 2021.' },
  { term: 'Transitional housing', def: 'Temporary housing (typically 6–24 months) with support services, designed to help people move to permanent housing.' },
  { term: 'Rapid Rehousing', def: 'A program that quickly moves people from homelessness into permanent housing with short-term rental assistance and services.' },
];

const LANGUAGES = [
  { lang: 'Spanish / Español', note: 'Llame al 211 y pida un intérprete.' },
  { lang: 'Vietnamese / Tiếng Việt', note: 'Gọi 211 và yêu cầu phiên dịch viên.' },
  { lang: 'Somali / Soomaali', note: 'Wac 211 oo codso turjumaan.' },
  { lang: 'Chinese / 中文', note: '请拨打211并要求口译员。' },
  { lang: 'Russian / Русский', note: 'Позвоните по номеру 211 и попросите переводчика.' },
  { lang: 'Amharic / አማርኛ', note: '211 ይደውሉ እና አስተርጓሚ ይጠይቁ።' },
  { lang: 'Tagalog / Filipino', note: 'Tumawag sa 211 at humingi ng interpreter.' },
  { lang: 'Korean / 한국어', note: '211에 전화하여 통역사를 요청하세요.' },
];

export default function HelpCenter() {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'faq' | 'glossary' | 'languages'>('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [, navigate] = useLocation();

  const currentCategory = FAQ_CATEGORIES.find(c => c.id === activeCategory);

  const filteredGlossary = GLOSSARY.filter(g =>
    g.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.def.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7]">
      <Navbar />

      <div className="bg-[#1B4332] text-white py-12">
        <div className="container">
          <div className="max-w-2xl">
            <span className="text-[#95D5A3] text-xs font-body font-semibold uppercase tracking-widest mb-3 block">Support</span>
            <h1 className="font-display text-4xl font-bold mb-3">Help Center</h1>
            <p className="text-[#D8F3DC] font-body text-lg">
              Frequently asked questions, housing glossary, and language access resources.
            </p>
          </div>
        </div>
      </div>

      <main className="flex-1 container py-12">
        {/* Tab switcher */}
        <div className="flex gap-1 bg-white rounded-xl border border-[#E8E7E1] p-1 mb-8 w-fit shadow-sm">
          {[
            { id: 'faq', label: 'FAQ', icon: <HelpCircle className="w-4 h-4" /> },
            { id: 'glossary', label: 'Glossary', icon: <BookOpen className="w-4 h-4" /> },
            { id: 'languages', label: 'Language Access', icon: <Globe className="w-4 h-4" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body font-medium transition-all ${
                activeTab === tab.id ? 'bg-[#1B4332] text-white shadow-sm' : 'text-[#374151] hover:bg-[#F0EFE9]'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ── FAQ ── */}
          {activeTab === 'faq' && (
            <motion.div key="faq" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                  <div className="sticky top-24 space-y-1">
                    {FAQ_CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-body font-medium transition-all ${
                          activeCategory === cat.id
                            ? 'bg-[#1B4332] text-white'
                            : 'text-[#374151] hover:bg-[#F0EFE9]'
                        }`}
                      >
                        {cat.title}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-3">
                  {currentCategory && (
                    <div>
                      <h2 className="font-display text-[#1B4332] text-2xl font-bold mb-5">{currentCategory.title}</h2>
                      <div className="space-y-3">
                        {currentCategory.faqs.map((faq, i) => {
                          const key = `${currentCategory.id}-${i}`;
                          const isExp = expandedFaq === key;
                          return (
                            <div key={key} className="bg-white rounded-xl border border-[#E8E7E1] overflow-hidden shadow-sm">
                              <button
                                className="w-full flex items-start justify-between gap-4 p-4 text-left hover:bg-[#FAFAF7] transition-colors"
                                onClick={() => setExpandedFaq(isExp ? null : key)}
                              >
                                <span className="font-body font-semibold text-[#374151] text-sm">{faq.q}</span>
                                {isExp ? <ChevronUp className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />}
                              </button>
                              {isExp && (
                                <div className="px-4 pb-4 border-t border-[#E8E7E1]">
                                  <p className="text-[#374151] text-sm font-body leading-relaxed mt-3">{faq.a}</p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── GLOSSARY ── */}
          {activeTab === 'glossary' && (
            <motion.div key="glossary" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="max-w-2xl">
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <input
                    type="text"
                    placeholder="Search terms..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-sm font-body border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332] bg-white"
                  />
                </div>
                <div className="space-y-3">
                  {filteredGlossary.map(item => (
                    <div key={item.term} className="bg-white rounded-xl border border-[#E8E7E1] p-4 shadow-sm">
                      <div className="font-display text-[#1B4332] font-bold text-base mb-1">{item.term}</div>
                      <p className="text-[#374151] text-sm font-body leading-relaxed">{item.def}</p>
                    </div>
                  ))}
                  {filteredGlossary.length === 0 && (
                    <div className="text-center py-8 text-[#9CA3AF] font-body text-sm">No terms found for "{searchQuery}"</div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── LANGUAGE ACCESS ── */}
          {activeTab === 'languages' && (
            <motion.div key="languages" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="max-w-2xl space-y-6">
                <div className="bg-[#1B4332] text-white rounded-2xl p-6">
                  <h3 className="font-display font-bold text-lg mb-2">Free interpreter services via 211</h3>
                  <p className="text-[#D8F3DC] text-sm font-body leading-relaxed mb-4">
                    Call 211 and ask for an interpreter in your language. This service is free and available 24/7. Operators can connect you to housing resources, rental assistance, and other services in your language.
                  </p>
                  <a href="tel:211" className="flex items-center gap-2 px-4 py-3 bg-white text-[#1B4332] rounded-xl font-body font-bold text-sm w-fit hover:bg-[#D8F3DC] transition-colors">
                    <Phone className="w-4 h-4" /> Call 211 — Free interpreter
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {LANGUAGES.map(lang => (
                    <div key={lang.lang} className="bg-white rounded-xl border border-[#E8E7E1] p-4 shadow-sm">
                      <div className="font-body font-bold text-[#374151] text-sm mb-1">{lang.lang}</div>
                      <p className="text-[#6B7280] text-xs font-body">{lang.note}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-[#F0EFE9] rounded-2xl p-5">
                  <h4 className="font-body font-semibold text-[#374151] text-sm mb-2">Other language resources</h4>
                  <div className="space-y-2">
                    {[
                      { name: 'DSHS Language Access Line', href: 'https://www.dshs.wa.gov/altsa/language-access', note: 'For DSHS services including benefits and childcare' },
                      { name: 'KCHA Language Access', href: 'https://www.kcha.org', note: 'KCHA provides interpretation for housing authority services' },
                      { name: 'Eastside Legal Assistance Program', href: 'https://www.elap.org', note: 'Legal aid with multilingual staff' },
                    ].map(item => (
                      <div key={item.name}>
                        <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#1B4332] font-body font-medium text-sm hover:underline">
                          <ExternalLink className="w-3.5 h-3.5" /> {item.name}
                        </a>
                        <p className="text-[#9CA3AF] text-xs font-body ml-5">{item.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contact section */}
        <div className="mt-12 bg-white rounded-2xl border border-[#E8E7E1] p-6 shadow-sm">
          <h2 className="font-display text-[#1B4332] text-xl font-bold mb-4">Still have questions?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href="mailto:info@decodedhousing.org"
              className="flex items-center gap-3 p-4 bg-[#F9FAFB] rounded-xl border border-[#E8E7E1] hover:border-[#52B788] hover:bg-[#F0FDF4] transition-all"
            >
              <div className="w-9 h-9 bg-[#D8F3DC] rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-[#1B4332]" />
              </div>
              <div>
                <div className="font-body font-semibold text-[#374151] text-sm">Email us</div>
                <div className="text-[#9CA3AF] text-xs font-body">info@decodedhousing.org</div>
              </div>
            </a>
            <a
              href="tel:211"
              className="flex items-center gap-3 p-4 bg-[#F9FAFB] rounded-xl border border-[#E8E7E1] hover:border-[#52B788] hover:bg-[#F0FDF4] transition-all"
            >
              <div className="w-9 h-9 bg-[#D8F3DC] rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4 text-[#1B4332]" />
              </div>
              <div>
                <div className="font-body font-semibold text-[#374151] text-sm">Call 211</div>
                <div className="text-[#9CA3AF] text-xs font-body">Free community helpline</div>
              </div>
            </a>
            <button
              onClick={() => navigate('/search')}
              className="flex items-center gap-3 p-4 bg-[#F9FAFB] rounded-xl border border-[#E8E7E1] hover:border-[#52B788] hover:bg-[#F0FDF4] transition-all text-left"
            >
              <div className="w-9 h-9 bg-[#D8F3DC] rounded-lg flex items-center justify-center flex-shrink-0">
                <Search className="w-4 h-4 text-[#1B4332]" />
              </div>
              <div>
                <div className="font-body font-semibold text-[#374151] text-sm">Search housing</div>
                <div className="text-[#9CA3AF] text-xs font-body">Browse all properties</div>
              </div>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
