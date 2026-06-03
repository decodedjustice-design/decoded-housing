/*
 * DATA & IMPACT — /data-impact
 * Housing statistics, AMI charts, affordability gap analysis
 */
import { useMemo } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, Users, Home, ArrowRight, ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import propertiesData from '@/data/properties.json';
import { Property, HOUSING_TYPES, HOUSING_TYPE_COLORS } from '@/lib/types';

const allProperties = propertiesData as Property[];

const AMI_INCOME_2024: Record<string, number[]> = {
  '30%': [24650, 28150, 31700, 35200, 38000, 40850, 43650, 46500],
  '50%': [41050, 46900, 52750, 58600, 63300, 68000, 72700, 77400],
  '60%': [49260, 56280, 63300, 70320, 75960, 81600, 87240, 92880],
  '80%': [65650, 75000, 84400, 93750, 101250, 108750, 116250, 123750],
  '100%': [82100, 93800, 105550, 117250, 126650, 136050, 145450, 154850],
  '120%': [98520, 112560, 126600, 140700, 151980, 163260, 174540, 185820],
};

const MARKET_RENTS = [
  { bedroom: 'Studio', marketRent: 1850, ami50Rent: 1026, ami60Rent: 1232, ami80Rent: 1641 },
  { bedroom: '1 BR', marketRent: 2250, ami50Rent: 1100, ami60Rent: 1320, ami80Rent: 1760 },
  { bedroom: '2 BR', marketRent: 2850, ami50Rent: 1319, ami60Rent: 1583, ami80Rent: 2110 },
  { bedroom: '3 BR', marketRent: 3400, ami50Rent: 1524, ami60Rent: 1829, ami80Rent: 2438 },
];

const CITY_STATS = [
  { city: 'Bellevue', units: 0, population: 148164, medianRent: 2650, medianIncome: 112000 },
  { city: 'Kirkland', units: 0, population: 92175, medianRent: 2350, medianIncome: 105000 },
  { city: 'Redmond', units: 0, population: 73256, medianRent: 2450, medianIncome: 118000 },
  { city: 'Issaquah', units: 0, population: 40000, medianRent: 2200, medianIncome: 108000 },
  { city: 'Renton', units: 0, population: 106785, medianRent: 1950, medianIncome: 82000 },
  { city: 'Sammamish', units: 0, population: 69000, medianRent: 2550, medianIncome: 145000 },
];

export default function DataImpact() {
  const [, navigate] = useLocation();

  const stats = useMemo(() => {
    const totalUnits = allProperties.reduce((sum, p) => sum + p.affordable_units, 0);
    const verifiedCount = allProperties.filter(p => p.verified).length;
    const likelyAvailable = allProperties.filter(p => p.likely_available).length;
    const typeBreakdown = HOUSING_TYPES.map(t => ({
      type: t,
      count: allProperties.filter(p => p.housing_types.includes(t)).length,
      units: allProperties.filter(p => p.housing_types.includes(t)).reduce((s, p) => s + p.affordable_units, 0),
    }));
    const cityBreakdown = CITY_STATS.map(c => ({
      ...c,
      units: allProperties.filter(p => p.city === c.city).reduce((s, p) => s + p.affordable_units, 0),
      properties: allProperties.filter(p => p.city === c.city).length,
    }));
    return { totalUnits, verifiedCount, likelyAvailable, typeBreakdown, cityBreakdown };
  }, []);

  const maxCityUnits = Math.max(...stats.cityBreakdown.map(c => c.units), 1);
  const maxTypeUnits = Math.max(...stats.typeBreakdown.map(t => t.units), 1);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7]">
      <Navbar />

      <div className="bg-[#1B4332] text-white py-12">
        <div className="container">
          <div className="max-w-2xl">
            <span className="text-[#95D5A3] text-xs font-body font-semibold uppercase tracking-widest mb-3 block">Transparency</span>
            <h1 className="font-display text-4xl font-bold mb-3">Data & Impact</h1>
            <p className="text-[#D8F3DC] font-body text-lg">
              Affordable housing statistics for East King County — what's in our database, AMI income limits, and the affordability gap.
            </p>
          </div>
        </div>
      </div>

      <main className="flex-1 container py-12 space-y-12">

        {/* Top stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Properties in database', value: allProperties.length, icon: <Home className="w-5 h-5" />, color: 'bg-[#D8F3DC] text-[#1B4332]' },
            { label: 'Affordable units tracked', value: stats.totalUnits.toLocaleString(), icon: <Users className="w-5 h-5" />, color: 'bg-blue-50 text-blue-700' },
            { label: 'Verified listings', value: stats.verifiedCount, icon: <BarChart2 className="w-5 h-5" />, color: 'bg-amber-50 text-amber-700' },
            { label: 'Likely available now', value: stats.likelyAvailable, icon: <TrendingUp className="w-5 h-5" />, color: 'bg-purple-50 text-purple-700' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="bg-white rounded-2xl border border-[#E8E7E1] p-5 shadow-sm"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="font-display text-3xl font-bold text-[#1B4332] mb-1">{stat.value}</div>
              <div className="text-[#6B7280] text-xs font-body">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Housing type breakdown */}
        <div className="bg-white rounded-2xl border border-[#E8E7E1] p-6 shadow-sm">
          <h2 className="font-display text-[#1B4332] text-xl font-bold mb-5">Units by Housing Category</h2>
          <div className="space-y-4">
            {stats.typeBreakdown.map(item => {
              const colors = HOUSING_TYPE_COLORS[item.type];
              const pct = Math.round((item.units / maxTypeUnits) * 100);
              return (
                <div key={item.type}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-body font-bold"
                        style={{ backgroundColor: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
                      >
                        {item.type}
                      </span>
                      <span className="text-[#6B7280] text-xs font-body">{item.count} properties</span>
                    </div>
                    <span className="font-display font-bold text-[#1B4332] text-sm">{item.units} units</span>
                  </div>
                  <div className="h-3 bg-[#F0EFE9] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: colors.border }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* City breakdown */}
        <div className="bg-white rounded-2xl border border-[#E8E7E1] p-6 shadow-sm">
          <h2 className="font-display text-[#1B4332] text-xl font-bold mb-5">Affordable Units by City</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8E7E1]">
                  {['City', 'Properties', 'Affordable Units', 'Median Rent', 'Median Income', 'Affordability'].map(h => (
                    <th key={h} className="text-left py-2 px-3 text-xs font-body font-semibold text-[#6B7280] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.cityBreakdown.sort((a, b) => b.units - a.units).map((city, i) => {
                  const pct = Math.round((city.units / maxCityUnits) * 100);
                  const affordabilityRatio = city.medianRent * 12 / city.medianIncome;
                  return (
                    <tr key={city.city} className="border-b border-[#F0EFE9] hover:bg-[#FAFAF7] transition-colors">
                      <td className="py-3 px-3 font-body font-semibold text-[#1B4332] text-sm">{city.city}</td>
                      <td className="py-3 px-3 text-[#374151] text-sm font-body">{city.properties}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-[#F0EFE9] rounded-full overflow-hidden">
                            <div className="h-full bg-[#52B788] rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[#374151] text-sm font-body">{city.units}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-[#374151] text-sm font-body">${city.medianRent.toLocaleString()}/mo</td>
                      <td className="py-3 px-3 text-[#374151] text-sm font-body">${city.medianIncome.toLocaleString()}/yr</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-body font-semibold ${
                          affordabilityRatio > 0.35 ? 'bg-red-100 text-red-700' :
                          affordabilityRatio > 0.30 ? 'bg-amber-100 text-amber-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {Math.round(affordabilityRatio * 100)}% of income
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-[#9CA3AF] text-xs font-body mt-3">* Median rent and income from U.S. Census ACS 2022 estimates. Affordability = annual rent ÷ median household income.</p>
        </div>

        {/* AMI income limits */}
        <div className="bg-white rounded-2xl border border-[#E8E7E1] p-6 shadow-sm">
          <h2 className="font-display text-[#1B4332] text-xl font-bold mb-2">2024 AMI Income Limits — King County</h2>
          <p className="text-[#6B7280] text-sm font-body mb-5">Annual income limits by household size and AMI tier. Source: HUD FY2024.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8E7E1]">
                  <th className="text-left py-2 px-3 text-xs font-body font-semibold text-[#6B7280] uppercase tracking-wider">AMI Tier</th>
                  {[1,2,3,4,5,6,7,8].map(n => (
                    <th key={n} className="text-right py-2 px-2 text-xs font-body font-semibold text-[#6B7280] uppercase tracking-wider">{n} person</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(AMI_INCOME_2024).map(([tier, limits], i) => (
                  <tr key={tier} className={`border-b border-[#F0EFE9] ${i % 2 === 0 ? 'bg-[#FAFAF7]' : 'bg-white'}`}>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-body font-bold ${
                        tier === '30%' ? 'bg-red-100 text-red-700' :
                        tier === '50%' ? 'bg-orange-100 text-orange-700' :
                        tier === '60%' ? 'bg-amber-100 text-amber-700' :
                        tier === '80%' ? 'bg-yellow-100 text-yellow-700' :
                        tier === '100%' ? 'bg-lime-100 text-lime-700' :
                        'bg-green-100 text-green-700'
                      }`}>{tier} AMI</span>
                    </td>
                    {limits.map((limit, j) => (
                      <td key={j} className="py-2.5 px-2 text-right text-xs font-body text-[#374151]">
                        ${limit.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rent vs AMI */}
        <div className="bg-white rounded-2xl border border-[#E8E7E1] p-6 shadow-sm">
          <h2 className="font-display text-[#1B4332] text-xl font-bold mb-2">Affordability Gap: Market vs. Restricted Rents</h2>
          <p className="text-[#6B7280] text-sm font-body mb-5">Estimated monthly rents in Bellevue/Eastside, 2024.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8E7E1]">
                  {['Unit Size', 'Market Rent', '50% AMI Rent', '60% AMI Rent', '80% AMI Rent', 'Savings at 60%'].map(h => (
                    <th key={h} className="text-left py-2 px-3 text-xs font-body font-semibold text-[#6B7280] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MARKET_RENTS.map((row, i) => (
                  <tr key={row.bedroom} className={`border-b border-[#F0EFE9] ${i % 2 === 0 ? 'bg-[#FAFAF7]' : 'bg-white'}`}>
                    <td className="py-3 px-3 font-body font-semibold text-[#374151]">{row.bedroom}</td>
                    <td className="py-3 px-3 font-body text-[#374151]">${row.marketRent.toLocaleString()}</td>
                    <td className="py-3 px-3 font-body text-orange-700">${row.ami50Rent.toLocaleString()}</td>
                    <td className="py-3 px-3 font-body text-amber-700">${row.ami60Rent.toLocaleString()}</td>
                    <td className="py-3 px-3 font-body text-yellow-700">${row.ami80Rent.toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <span className="font-body font-bold text-emerald-700">
                        ${(row.marketRent - row.ami60Rent).toLocaleString()}/mo
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[#9CA3AF] text-xs font-body mt-3">* AMI rents calculated at 30% of gross income for each AMI tier. Market rents are median estimates for Bellevue/Eastside, 2024.</p>
        </div>

        {/* Sources */}
        <div className="bg-[#F0EFE9] rounded-2xl p-6">
          <h3 className="font-display text-[#1B4332] font-bold text-base mb-3">Data Sources</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: 'HUD FY2024 Income Limits', href: 'https://www.huduser.gov/portal/datasets/il.html' },
              { name: 'ARCH Affordable Housing Database', href: 'https://www.archhousing.org' },
              { name: 'KCHA Property Database', href: 'https://www.kcha.org' },
              { name: 'U.S. Census Bureau ACS 2022', href: 'https://data.census.gov' },
              { name: 'Washington State OFM Population', href: 'https://ofm.wa.gov/washington-data-research/population-demographics' },
              { name: 'Zillow Research — Rent Index', href: 'https://www.zillow.com/research' },
            ].map(source => (
              <a key={source.name} href={source.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#1B4332] font-body text-sm hover:underline">
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" /> {source.name}
              </a>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
