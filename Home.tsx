/*
 * HOME PAGE — Affordable Housing Hub
 * Three-audience entry: Residents / Tenants / Owners
 * Sections: Hero → Audience Paths → Stats → Housing Types → Featured → Resources → Shelter CTA → Tip
 */
import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  Search, ArrowRight, CheckCircle2, MapPin, Phone, Lightbulb,
  ChevronRight, DollarSign, Scale, Heart, User, Building2,
  BarChart3, Globe, HelpCircle, AlertTriangle, FileText, CheckSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HousingTypeBadge from '@/components/HousingTypeBadge';
import PropertyCard from '@/components/PropertyCard';
import { HousingType, HOUSING_TYPES, HOUSING_TYPE_COLORS } from '@/lib/types';
import propertiesData from '@/data/properties.json';

const HERO_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663342387877/3nNbT3jBTC4Jirx7fWDuwg/hero-main-V3YtVxwzpkhuZ9qV5SqEaM.webp';
const TOPO_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663342387877/3nNbT3jBTC4Jirx7fWDuwg/hero-map-bg-g4CUFpQxNZ7JKNJjcq6d2F.webp';
const COMMUNITY_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663342387877/3nNbT3jBTC4Jirx7fWDuwg/community-residents-Evhoni2mMtLvGKWQfH9KAe.webp';

const HOUSING_TYPE_DESCRIPTIONS: Record<HousingType, string> = {
  'ARCH': 'Income-restricted units in market-rate buildings. Must ask for them directly.',
  'MFTE': 'Multifamily Tax Exemption units. Below-market rent in newer buildings.',
  'Section 8': 'Voucher-based housing. Bring your KCHA voucher and apply directly.',
  'Transitional': 'Temporary housing with support services for people in transition.',
  'Shelter': 'Emergency and short-term shelter options in East King County.',
};

const AUDIENCE_PATHS = [
  {
    icon: <Search className="w-6 h-6" />,
    title: 'I need housing',
    subtitle: 'Find & apply for affordable units',
    color: 'bg-[#1B4332]',
    links: [
      { href: '/search', label: 'Search all listings' },
      { href: '/eligibility', label: 'Check eligibility' },
      { href: '/how-to-apply', label: 'How to apply' },
    ],
  },
  {
    icon: <User className="w-6 h-6" />,
    title: "I'm a current tenant",
    subtitle: 'Manage your housing & get support',
    color: 'bg-[#2D6A4F]',
    links: [
      { href: '/tenant-portal', label: 'Tenant portal' },
      { href: '/tenant-rights', label: 'Know your rights' },
      { href: '/rental-assistance', label: 'Get rental assistance' },
    ],
  },
  {
    icon: <Building2 className="w-6 h-6" />,
    title: "I'm a property owner",
    subtitle: 'List units & learn about incentives',
    color: 'bg-[#52B788]',
    links: [
      { href: '/owner-hub', label: 'Owner & developer hub' },
      { href: '/data-impact', label: 'View impact data' },
    ],
  },
];

const RESOURCE_CARDS = [
  {
    icon: <DollarSign className="w-5 h-5" />,
    title: 'Rental Assistance',
    desc: 'Section 8 vouchers, Emergency Rental Assistance, and King County subsidy programs.',
    href: '/rental-assistance',
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  },
  {
    icon: <Scale className="w-5 h-5" />,
    title: 'Tenant Rights',
    desc: 'Fair housing laws, eviction prevention resources, and legal advocacy links.',
    href: '/tenant-rights',
    color: 'text-blue-700 bg-blue-50 border-blue-200',
  },
  {
    icon: <Heart className="w-5 h-5" />,
    title: 'Supportive Services',
    desc: 'Childcare, transportation assistance, employment training, and wrap-around support.',
    href: '/supportive-services',
    color: 'text-rose-700 bg-rose-50 border-rose-200',
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: 'Language Access',
    desc: 'Resources in Spanish, Vietnamese, Somali, Chinese, and other King County languages.',
    href: '/help-center',
    color: 'text-purple-700 bg-purple-50 border-purple-200',
  },
  {
    icon: <HelpCircle className="w-5 h-5" />,
    title: 'Help Center',
    desc: 'In-person help locations, community partners, and direct contact directory.',
    href: '/help-center',
    color: 'text-amber-700 bg-amber-50 border-amber-200',
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: 'Data & Impact',
    desc: 'People housed, wait times, geographic distribution, and program metrics.',
    href: '/data-impact',
    color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<HousingType[]>([]);
  const [, navigate] = useLocation();

  const properties = propertiesData as any[];
  const featuredProperties = properties
    .filter(p => p.verified && p.likely_available)
    .slice(0, 3);

  const stats = {
    total: properties.length,
    bellevue: properties.filter(p => p.city === 'Bellevue').length,
    verified: properties.filter(p => p.verified).length,
    cities: Array.from(new Set(properties.map((p: any) => p.city))).length,
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedTypes.length > 0) params.set('types', selectedTypes.join(','));
    navigate(`/search?${params.toString()}`);
  };

  const toggleType = (type: HousingType) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7]">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-[580px] lg:min-h-[660px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Bellevue WA affordable housing" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B4332]/92 via-[#1B4332]/72 to-[#1B4332]/20" />
        </div>

        <div className="relative container py-16 lg:py-24">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-2 bg-[#D97706]/20 text-[#FCD34D] text-sm font-body font-medium px-3 py-1 rounded-full border border-[#D97706]/30 mb-4">
                <span className="w-1.5 h-1.5 bg-[#FCD34D] rounded-full animate-pulse" />
                King County Affordable Housing Hub
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-white text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4"
            >
              Find Housing
              <br />
              <span className="text-[#FCD34D] italic">That's Actually</span>
              <br />
              Available.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[#D8F3DC] text-lg font-body leading-relaxed mb-8"
            >
              ARCH, MFTE, Section 8, transitional housing, and shelters across King County. With eligibility tools, phone scripts, and step-by-step guidance.
            </motion.p>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl shadow-2xl p-4"
            >
              <div className="flex gap-3 mb-3">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <input
                    type="text"
                    placeholder="Enter city or ZIP code (e.g. Bellevue, 98004)"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-9 pr-4 py-2.5 text-sm font-body text-[#1F2937] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#1B4332] text-white rounded-lg font-body font-medium text-sm hover:bg-[#2D6A4F] transition-colors"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-[#6B7280] font-body self-center">Filter by:</span>
                {HOUSING_TYPES.map(type => {
                  const colors = HOUSING_TYPE_COLORS[type];
                  const active = selectedTypes.includes(type);
                  return (
                    <button
                      key={type}
                      onClick={() => toggleType(type)}
                      className="px-3 py-1 rounded-full text-xs font-body font-medium transition-all"
                      style={{
                        backgroundColor: active ? colors.bg : '#F9FAFB',
                        color: active ? colors.text : '#6B7280',
                        border: `1px solid ${active ? colors.border : '#E5E7EB'}`,
                      }}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── AUDIENCE PATHS ── */}
      <section className="py-12 bg-white border-b border-[#E8E7E1]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {AUDIENCE_PATHS.map((path, i) => (
              <motion.div
                key={path.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="rounded-xl border border-[#E8E7E1] overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className={`${path.color} p-5 flex items-center gap-3`}>
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white">
                    {path.icon}
                  </div>
                  <div>
                    <h3 className="font-display text-white font-bold text-base leading-tight">{path.title}</h3>
                    <p className="text-white/80 text-xs font-body">{path.subtitle}</p>
                  </div>
                </div>
                <div className="p-4 bg-[#FAFAF7]">
                  <ul className="space-y-1.5">
                    {path.links.map(link => (
                      <li key={link.href}>
                        <button
                          onClick={() => navigate(link.href)}
                          className="w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-sm font-body text-[#374151] hover:bg-white hover:text-[#1B4332] hover:shadow-sm transition-all group"
                        >
                          {link.label}
                          <ChevronRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#1B4332] transition-colors" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-[#1B4332] text-white py-6">
        <div className="container">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: stats.total, label: 'Properties Listed' },
              { value: stats.bellevue, label: 'In Bellevue' },
              { value: stats.verified, label: 'Verified Listings' },
              { value: stats.cities, label: 'Cities Covered' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
                <div className="font-display text-3xl font-bold text-[#FCD34D]">{stat.value}</div>
                <div className="text-[#95D5A3] text-sm font-body mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOUSING TYPES ── */}
      <section className="py-16 bg-[#FAFAF7]">
        <div className="container">
          <div className="mb-10">
            <h2 className="font-display text-[#1B4332] text-3xl font-bold mb-2">What We Track</h2>
            <p className="text-[#6B7280] font-body">Five types of affordable housing — each with different rules, income limits, and how to apply.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {HOUSING_TYPES.map((type, i) => {
              const colors = HOUSING_TYPE_COLORS[type];
              const count = properties.filter((p: any) => p.housing_types.includes(type)).length;
              return (
                <motion.button
                  key={type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  onClick={() => navigate(`/search?types=${type}`)}
                  className="text-left p-5 bg-white rounded-xl border border-[#E8E7E1] hover:border-[#52B788] hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full text-sm font-body font-semibold"
                      style={{ backgroundColor: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}>
                      {type}
                    </span>
                    <span className="font-display text-lg font-bold text-[#1B4332]">{count}</span>
                  </div>
                  <p className="text-[#6B7280] text-sm font-body leading-relaxed">{HOUSING_TYPE_DESCRIPTIONS[type]}</p>
                  <div className="mt-3 flex items-center gap-1 text-[#1B4332] text-sm font-body font-medium group-hover:gap-2 transition-all">
                    Browse {type} listings <ChevronRight className="w-4 h-4" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURED PROPERTIES ── */}
      {featuredProperties.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display text-[#1B4332] text-3xl font-bold mb-1">Likely Available Now</h2>
                <p className="text-[#6B7280] font-body text-sm">Verified properties with higher odds of having open units or waitlists.</p>
              </div>
              <button
                onClick={() => navigate('/search')}
                className="hidden sm:flex items-center gap-2 text-[#1B4332] font-body font-medium text-sm hover:text-[#2D6A4F] transition-colors"
              >
                View all <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredProperties.map((property: any, i: number) => (
                <motion.div key={property.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SUPPORT RESOURCES GRID ── */}
      <section className="py-16 bg-[#FAFAF7]">
        <div className="container">
          <div className="mb-10">
            <h2 className="font-display text-[#1B4332] text-3xl font-bold mb-2">Support & Resources</h2>
            <p className="text-[#6B7280] font-body">Beyond listings — help with assistance, rights, services, and navigation.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {RESOURCE_CARDS.map((card, i) => (
              <motion.button
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                onClick={() => navigate(card.href)}
                className={`text-left p-5 rounded-xl border ${card.color} hover:shadow-md transition-all group`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-white/60 flex items-center justify-center">
                    {card.icon}
                  </div>
                  <h3 className="font-display font-bold text-base">{card.title}</h3>
                </div>
                <p className="text-sm font-body leading-relaxed opacity-80">{card.desc}</p>
                <div className="mt-3 flex items-center gap-1 text-sm font-body font-medium group-hover:gap-2 transition-all">
                  Learn more <ChevronRight className="w-4 h-4" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS TEASER ── */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ backgroundImage: `url(${TOPO_BG})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-[#FAFAF7]/90" />
        <div className="relative container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-[#1B4332] text-3xl font-bold mb-4">Why Is Affordable Housing So Hard to Find?</h2>
            <p className="text-[#374151] font-body leading-relaxed mb-8">
              ARCH and MFTE units are real — they exist in buildings you walk past every day. But they're not listed on Zillow or Apartments.com. You have to call and ask. We tell you exactly what to say.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              {[
                { icon: '🔍', title: 'Hidden inventory', desc: 'Affordable units are rarely advertised. They fill through direct calls and word of mouth.' },
                { icon: '📞', title: 'Call directly', desc: 'You must contact the leasing office and ask specifically for ARCH or MFTE units.' },
                { icon: '💬', title: 'Use the right words', desc: 'Saying "I\'m looking for an ARCH unit" gets a different response than asking about availability.' },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-[#E8E7E1] text-left">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <h3 className="font-display text-[#1B4332] font-semibold text-base mb-1">{item.title}</h3>
                  <p className="text-[#6B7280] text-sm font-body">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/how-to-apply')}
                className="px-6 py-3 bg-[#1B4332] text-white rounded-lg font-body font-medium hover:bg-[#2D6A4F] transition-colors"
              >
                How to apply
              </button>
              <button
                onClick={() => navigate('/scripts')}
                className="px-6 py-3 bg-white text-[#1B4332] rounded-lg font-body font-medium border border-[#1B4332] hover:bg-[#D8F3DC] transition-colors flex items-center gap-2 justify-center"
              >
                <Phone className="w-4 h-4" />
                Get the phone scripts
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMMUNITY SECTION ── */}
      <section className="py-0 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative h-64 lg:h-auto overflow-hidden">
            <img src={COMMUNITY_IMG} alt="Diverse residents in a modern Pacific Northwest apartment" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1B4332]/30 to-transparent" />
          </div>
          <div className="bg-[#1B4332] p-10 lg:p-14 flex flex-col justify-center">
            <span className="text-[#95D5A3] text-xs font-body font-semibold uppercase tracking-widest mb-4">Our mission</span>
            <h2 className="font-display text-white text-3xl lg:text-4xl font-bold leading-tight mb-5">
              Affordable housing exists.<br />We help you find it.
            </h2>
            <p className="text-[#D8F3DC] font-body leading-relaxed mb-6">
              Decoded Housing Hub is a free resource built for King County residents. We track ARCH, MFTE, Section 8, transitional housing, and shelters — and we tell you exactly what to say when you call.
            </p>
            <div className="space-y-3">
              {[
                'Real data from City of Bellevue, ARCH, and KCHA',
                'Eligibility checker and step-by-step application guide',
                'Word-for-word phone scripts you can copy',
                'Tenant rights, rental assistance, and supportive services',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#52B788] flex-shrink-0" />
                  <span className="text-[#D8F3DC] font-body text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── GET SHELTER NOW BANNER ── */}
      <section className="py-10 bg-red-600">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <h2 className="font-display text-white text-2xl font-bold mb-1">Need shelter tonight?</h2>
              <p className="text-red-100 font-body text-sm">Answer 3 questions. Get the fastest realistic path to shelter — not a long list.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <button
                onClick={() => navigate('/shelter-finder')}
                className="flex items-center gap-2 px-6 py-3 bg-white text-red-700 rounded-xl font-body font-bold text-base hover:bg-red-50 transition-colors shadow-lg"
              >
                Get Shelter Now <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/shelter-map')}
                className="flex items-center gap-2 px-5 py-3 bg-red-700 text-white rounded-xl font-body font-medium text-sm hover:bg-red-800 transition-colors border border-red-500"
              >
                <MapPin className="w-4 h-4" />
                View shelter map
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── INSIDER TIP ── */}
      <section className="py-12 bg-[#FFFBEB] border-y border-[#FCD34D]/40">
        <div className="container">
          <div className="flex items-start gap-4 max-w-3xl mx-auto">
            <div className="flex-shrink-0 w-10 h-10 bg-[#D97706] rounded-full flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-display text-[#92400E] font-bold text-lg mb-1">The #1 Insider Tip</h3>
              <p className="text-[#78350F] font-body leading-relaxed">
                When you call a property, don't ask "do you have any apartments available?" Ask: <strong>"Do you have any ARCH income-restricted units available, or a waitlist I can join?"</strong> This one sentence change dramatically increases your chances of getting a real answer.
              </p>
              <button
                onClick={() => navigate('/scripts')}
                className="mt-3 text-[#D97706] font-body font-medium text-sm hover:text-[#B45309] flex items-center gap-1"
              >
                See all phone scripts <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
