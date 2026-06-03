/*
 * SUPPORTIVE SERVICES — /supportive-services
 * Childcare, transportation, employment training, wrap-around services
 */
import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import {
  Heart, Baby, Bus, Briefcase, BookOpen, Utensils, Stethoscope,
  Phone, ExternalLink, ArrowRight, ChevronDown, ChevronUp, Globe
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface ServiceCategory {
  id: string;
  icon: React.ReactNode;
  title: string;
  color: string;
  services: Service[];
}

interface Service {
  name: string;
  description: string;
  phone?: string;
  website?: string;
  serves: string;
  languages?: string[];
}

const CATEGORIES: ServiceCategory[] = [
  {
    id: 'childcare',
    icon: <Baby className="w-5 h-5" />,
    title: 'Childcare & Early Learning',
    color: 'bg-pink-50 border-pink-200 text-pink-700',
    services: [
      {
        name: 'DCYF Child Care Subsidy (CCAP)',
        description: 'State-funded childcare subsidy for low-income working families. Covers licensed childcare centers and family providers.',
        phone: '1-888-270-0660',
        website: 'https://www.dcyf.wa.gov/services/early-learning/childcare-financial-assistance',
        serves: 'All of Washington',
        languages: ['Spanish', 'Vietnamese', 'Somali', 'Chinese'],
      },
      {
        name: 'Eastside Baby Corner',
        description: 'Free baby and children\'s supplies, clothing, and equipment for low-income families on the Eastside.',
        phone: '425-865-0234',
        website: 'https://www.eastsidebabycorner.org',
        serves: 'East King County',
      },
      {
        name: 'Bellevue School District Head Start',
        description: 'Free early childhood education for income-eligible 3–5 year olds. Transportation provided.',
        phone: '425-456-4000',
        website: 'https://bsd405.org',
        serves: 'Bellevue',
      },
      {
        name: 'Hopelink Early Childhood Services',
        description: 'Childcare referrals, parenting support, and early learning resources for Eastside families.',
        phone: '425-943-6700',
        website: 'https://www.hopelink.org',
        serves: 'East King County',
        languages: ['Spanish', 'Russian'],
      },
    ],
  },
  {
    id: 'transit',
    icon: <Bus className="w-5 h-5" />,
    title: 'Transportation Assistance',
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    services: [
      {
        name: 'ORCA LIFT (Reduced Fare)',
        description: 'Reduced-fare transit card for income-eligible riders. 50% off all King County Metro, Sound Transit, and Community Transit fares.',
        phone: '206-553-3060',
        website: 'https://orcalift.org',
        serves: 'King County',
        languages: ['Spanish', 'Vietnamese', 'Chinese', 'Somali'],
      },
      {
        name: 'Hopelink Transportation',
        description: 'Non-emergency medical transportation and volunteer driver program for Eastside residents.',
        phone: '425-943-6700',
        website: 'https://www.hopelink.org/services/transportation',
        serves: 'East King County',
      },
      {
        name: 'Sound Transit Link Light Rail',
        description: 'East Link (2 Line) connects Bellevue, Redmond, and Issaquah to Seattle. Use ORCA LIFT for reduced fares.',
        phone: '888-889-6368',
        website: 'https://www.soundtransit.org',
        serves: 'East King County + Seattle',
      },
      {
        name: 'King County Metro Reduced Fare',
        description: 'Youth, senior, and disabled reduced fares. Free rides for youth under 18 on Metro buses.',
        phone: '206-553-3000',
        website: 'https://kingcounty.gov/metro',
        serves: 'King County',
      },
    ],
  },
  {
    id: 'employment',
    icon: <Briefcase className="w-5 h-5" />,
    title: 'Employment & Job Training',
    color: 'bg-amber-50 border-amber-200 text-amber-700',
    services: [
      {
        name: 'WorkSource Eastside',
        description: 'Free job placement, resume help, career counseling, and training for unemployed and underemployed workers.',
        phone: '425-289-0560',
        website: 'https://worksourceeastside.com',
        serves: 'East King County',
        languages: ['Spanish', 'Vietnamese', 'Somali'],
      },
      {
        name: 'Hopelink Employment Services',
        description: 'Job readiness training, interview coaching, and employment placement for low-income Eastside residents.',
        phone: '425-943-6700',
        website: 'https://www.hopelink.org/services/employment',
        serves: 'East King County',
      },
      {
        name: 'Bellevue College Workforce Education',
        description: 'Short-term training programs in healthcare, tech, and trades. Financial aid available.',
        phone: '425-564-2263',
        website: 'https://www.bellevuecollege.edu/workforce',
        serves: 'Eastside',
      },
      {
        name: 'ANEW (Apprenticeship & Non-Traditional Employment for Women)',
        description: 'Pre-apprenticeship training for women and people of color in construction and trades.',
        phone: '253-235-2639',
        website: 'https://www.anewcareer.org',
        serves: 'King County',
      },
    ],
  },
  {
    id: 'food',
    icon: <Utensils className="w-5 h-5" />,
    title: 'Food Assistance',
    color: 'bg-green-50 border-green-200 text-green-700',
    services: [
      {
        name: 'Hopelink Food Bank',
        description: 'Free groceries for Eastside families. No income verification required at most locations.',
        phone: '425-943-6700',
        website: 'https://www.hopelink.org/services/food',
        serves: 'Bellevue, Kirkland, Redmond, Issaquah',
        languages: ['Spanish', 'Russian', 'Vietnamese'],
      },
      {
        name: 'SNAP (Food Stamps) — DSHS',
        description: 'Federal food assistance program. Apply online or at your local DSHS Community Services Office.',
        phone: '877-501-2233',
        website: 'https://www.dshs.wa.gov/esa/community-services-offices',
        serves: 'All of Washington',
        languages: ['Spanish', 'Vietnamese', 'Somali', 'Chinese', 'Russian'],
      },
      {
        name: 'WIC (Women, Infants & Children)',
        description: 'Nutrition support, food vouchers, and breastfeeding help for pregnant women and children under 5.',
        phone: '800-841-1410',
        website: 'https://www.doh.wa.gov/YouandYourFamily/WIC',
        serves: 'All of Washington',
      },
    ],
  },
  {
    id: 'health',
    icon: <Stethoscope className="w-5 h-5" />,
    title: 'Healthcare & Mental Health',
    color: 'bg-teal-50 border-teal-200 text-teal-700',
    services: [
      {
        name: 'HealthPoint Community Health Centers',
        description: 'Sliding-scale primary care, dental, and behavioral health services. No one turned away for inability to pay.',
        phone: '425-277-1600',
        website: 'https://www.healthpointchc.org',
        serves: 'Renton, Auburn, Kent, Federal Way',
        languages: ['Spanish', 'Vietnamese', 'Somali'],
      },
      {
        name: 'Apple Health (Medicaid) — HCA',
        description: 'Free or low-cost health insurance for low-income Washington residents. Apply online at wahealthplanfinder.org.',
        phone: '855-923-4633',
        website: 'https://www.wahealthplanfinder.org',
        serves: 'All of Washington',
        languages: ['Spanish', 'Vietnamese', 'Somali', 'Chinese'],
      },
      {
        name: 'Crisis Connections — Mental Health',
        description: '24/7 mental health crisis line for King County. Free, confidential, multilingual.',
        phone: '866-427-4747',
        website: 'https://www.crisisconnections.org',
        serves: 'King County',
        languages: ['Spanish', 'Vietnamese', 'Somali'],
      },
    ],
  },
  {
    id: 'education',
    icon: <BookOpen className="w-5 h-5" />,
    title: 'Education & Language',
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    services: [
      {
        name: 'Bellevue College ESL / Adult Education',
        description: 'Free English as a Second Language classes, GED preparation, and adult basic education.',
        phone: '425-564-2263',
        website: 'https://www.bellevuecollege.edu/continuinged/english-language-learning',
        serves: 'Eastside',
        languages: ['Spanish', 'Vietnamese', 'Somali', 'Chinese', 'Russian'],
      },
      {
        name: 'Hopelink Adult Education',
        description: 'ESL classes, digital literacy, and citizenship preparation for Eastside immigrants and refugees.',
        phone: '425-943-6700',
        website: 'https://www.hopelink.org',
        serves: 'East King County',
      },
      {
        name: 'King County Library System',
        description: 'Free library cards, digital resources, ESL programs, and job search assistance at all branches.',
        phone: '425-462-9600',
        website: 'https://kcls.org',
        serves: 'King County',
        languages: ['Spanish', 'Vietnamese', 'Somali', 'Chinese'],
      },
    ],
  },
];

export default function SupportiveServices() {
  const [activeCategory, setActiveCategory] = useState<string>('childcare');
  const [, navigate] = useLocation();

  const current = CATEGORIES.find(c => c.id === activeCategory);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7]">
      <Navbar />

      <div className="bg-[#1B4332] text-white py-12">
        <div className="container">
          <div className="max-w-2xl">
            <span className="text-[#95D5A3] text-xs font-body font-semibold uppercase tracking-widest mb-3 block">Support & Resources</span>
            <h1 className="font-display text-4xl font-bold mb-3">Supportive Services</h1>
            <p className="text-[#D8F3DC] font-body text-lg">
              Childcare, transportation, employment training, food, healthcare, and education resources for King County residents.
            </p>
          </div>
        </div>
      </div>

      <main className="flex-1 container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Category nav */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all border ${
                    activeCategory === cat.id
                      ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-md'
                      : 'bg-white text-[#374151] border-[#E8E7E1] hover:border-[#52B788] hover:text-[#1B4332]'
                  }`}
                >
                  <span className={activeCategory === cat.id ? 'text-white' : 'text-[#1B4332]'}>{cat.icon}</span>
                  <span className="font-body font-medium text-sm">{cat.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="lg:col-span-3">
            {current && (
              <motion.div key={current.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className={`flex items-center gap-3 p-4 rounded-xl border mb-6 ${current.color}`}>
                  {current.icon}
                  <h2 className="font-display font-bold text-xl">{current.title}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {current.services.map((service, i) => (
                    <motion.div
                      key={service.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * i }}
                      className="bg-white rounded-xl border border-[#E8E7E1] p-5 shadow-sm"
                    >
                      <h3 className="font-display text-[#1B4332] font-bold text-sm leading-tight mb-2">{service.name}</h3>
                      <p className="text-[#6B7280] text-xs font-body leading-relaxed mb-3">{service.description}</p>
                      <p className="text-[#9CA3AF] text-[10px] font-body mb-2">📍 {service.serves}</p>
                      {service.languages && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {service.languages.map(lang => (
                            <span key={lang} className="px-1.5 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-body rounded-full border border-purple-200">
                              {lang}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex flex-col gap-1.5">
                        {service.phone && (
                          <a href={`tel:${service.phone.replace(/[^0-9]/g, '')}`} className="flex items-center gap-2 text-[#1B4332] font-body font-medium text-xs hover:underline">
                            <Phone className="w-3.5 h-3.5" /> {service.phone}
                          </a>
                        )}
                        {service.website && (
                          <a href={service.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#1B4332] font-body font-medium text-xs hover:underline">
                            <ExternalLink className="w-3.5 h-3.5" /> Visit website
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Language access note */}
            <div className="mt-8 bg-[#EDE9FE] border border-purple-200 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-purple-700 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-body font-semibold text-purple-900 text-sm mb-1">Need help in another language?</h4>
                  <p className="text-purple-800 text-xs font-body leading-relaxed mb-2">
                    Many of these services are available in Spanish, Vietnamese, Somali, Chinese, Russian, and other languages. Call 211 and ask for an interpreter — it's free.
                  </p>
                  <button onClick={() => navigate('/help-center')} className="text-purple-700 font-body font-medium text-xs flex items-center gap-1 hover:text-purple-900">
                    Language access resources <ArrowRight className="w-3.5 h-3.5" />
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
