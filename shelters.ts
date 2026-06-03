/*
 * SHELTER RESOURCES — King County, WA
 * Covers: Shelter, RAP (Coordinated Entry), Programs, Safe Parking
 * Population: family, single_adult, youth, DV, veteran
 * County area: Seattle, South King, East King, Countywide
 */

export type Population = 'family' | 'single_adult' | 'youth' | 'DV' | 'veteran';
export type ResourceType = 'Shelter' | 'Shelter System' | 'Intake' | 'RAP' | 'Program' | 'Safe Parking';
export type CountyArea = 'Seattle' | 'South King' | 'East King' | 'Countywide';
export type DataConfidence = 'High' | 'Medium' | 'Low';
export type AccessMethod = 'walk-in' | 'call' | 'referral';

export interface ShelterResource {
  id: string;
  name: string;
  resource_type: ResourceType;
  population: Population[];
  county_area: CountyArea;
  address: string;
  phone: string;
  website?: string;
  how_to_enter: string;
  access_method: AccessMethod;
  hours: string;
  eligibility: string;
  last_verified_date: string;
  reality_notes: string;
  priority_score: number; // 1–10
  data_confidence: DataConfidence;
  lat: number;
  lng: number;
  // RAP-specific
  rap_appointment_process?: string;
  rap_documentation_policy?: string;
  rap_required_at_entry?: string;
  rap_assessment_type?: string;
  rap_priority_notes?: string;
  // RAP schedule windows
  rap_windows?: RAPWindow[];
}

export interface RAPWindow {
  day: string; // 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'
  start_hour: number; // 24h
  end_hour: number;
  location_name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  notes?: string;
}

export const RAP_WINDOWS: RAPWindow[] = [
  {
    day: 'Wednesday',
    start_hour: 11,
    end_hour: 13,
    location_name: 'Solid Ground RAP (Walk-in)',
    address: '1501 N 45th St, Seattle, WA 98103',
    lat: 47.6612,
    lng: -122.3476,
    phone: '(206) 694-6700',
    notes: 'Walk-in only. Arrive early — lines form before 11am.',
  },
  {
    day: 'Wednesday',
    start_hour: 13,
    end_hour: 16,
    location_name: 'YWCA Renton RAP',
    address: '1010 S 2nd St, Renton, WA 98057',
    lat: 47.4779,
    lng: -122.2059,
    phone: '(206) 461-4882',
    notes: 'Walk-in. South King County focus but open to all.',
  },
  {
    day: 'Tuesday',
    start_hour: 9,
    end_hour: 15,
    location_name: 'Multi-Service Center RAP',
    address: '1200 S 336th St, Federal Way, WA 98003',
    lat: 47.3073,
    lng: -122.3190,
    phone: '(253) 838-6810',
    notes: 'Walk-in Tue & Thu. South King County area.',
  },
  {
    day: 'Thursday',
    start_hour: 9,
    end_hour: 15,
    location_name: 'Multi-Service Center RAP',
    address: '1200 S 336th St, Federal Way, WA 98003',
    lat: 47.3073,
    lng: -122.3190,
    phone: '(253) 838-6810',
    notes: 'Walk-in Tue & Thu. South King County area.',
  },
];

export const SHELTER_RESOURCES: ShelterResource[] = [
  // ── IMMEDIATE CRISIS / HOTLINES ──
  {
    id: 'dv-hotline',
    name: 'King County DV Hotline (24/7)',
    resource_type: 'Intake',
    population: ['DV'],
    county_area: 'Countywide',
    address: 'Confidential — call for location',
    phone: '(206) 656-8423',
    website: 'https://www.kingcounty.gov/depts/community-human-services/housing/services/domestic-violence.aspx',
    how_to_enter: 'Call 24/7. Confidential shelter placement available immediately.',
    access_method: 'call',
    hours: '24/7',
    eligibility: 'Anyone experiencing domestic violence or abuse',
    last_verified_date: '2026-01-15',
    reality_notes: 'DV shelters are confidential. You will NOT be given an address until you are connected. This is by design for your safety.',
    priority_score: 10,
    data_confidence: 'High',
    lat: 47.6062,
    lng: -122.3321,
  },
  {
    id: 'line-211',
    name: '211 King County',
    resource_type: 'Intake',
    population: ['family', 'single_adult', 'youth', 'veteran'],
    county_area: 'Countywide',
    address: 'Phone/online — no physical location',
    phone: '211',
    website: 'https://www.211kingcounty.org',
    how_to_enter: 'Call 211 or text your ZIP code to 898-211. Available 24/7.',
    access_method: 'call',
    hours: '24/7',
    eligibility: 'Anyone in King County',
    last_verified_date: '2026-02-01',
    reality_notes: 'Wait times can be long. If you call after hours, leave a message and call back in the morning. 211 connects you to a live navigator who can check real-time bed availability.',
    priority_score: 9,
    data_confidence: 'High',
    lat: 47.6062,
    lng: -122.3321,
  },

  // ── FAMILY SHELTERS ──
  {
    id: 'marys-place-seattle',
    name: "Mary's Place Seattle",
    resource_type: 'Shelter System',
    population: ['family'],
    county_area: 'Seattle',
    address: '1155 N 130th St, Seattle, WA 98133',
    phone: '(206) 621-8474',
    website: 'https://www.marysplaceseattle.org',
    how_to_enter: 'Call intake line. Do NOT walk in without calling first. Intake line opens at 8am.',
    access_method: 'call',
    hours: 'Intake: Mon–Fri 8am–4pm',
    eligibility: 'Families with children. All genders welcome.',
    last_verified_date: '2026-01-20',
    reality_notes: "Mary's Place is the largest family shelter system in King County. Their intake line is often busy — call right at 8am. If you can't get through, try 211.",
    priority_score: 9,
    data_confidence: 'High',
    lat: 47.7189,
    lng: -122.3476,
  },
  {
    id: 'marys-place-family-center',
    name: "Mary's Place Family Center (Burien)",
    resource_type: 'Shelter',
    population: ['family'],
    county_area: 'South King',
    address: '16845 Ambaum Blvd SW, Burien, WA 98166',
    phone: '(206) 621-8474',
    website: 'https://www.marysplaceseattle.org',
    how_to_enter: 'Must call central intake first at (206) 621-8474.',
    access_method: 'call',
    hours: '24/7 residential',
    eligibility: 'Families with children',
    last_verified_date: '2026-01-20',
    reality_notes: 'South King County location. Same intake process as main campus.',
    priority_score: 8,
    data_confidence: 'High',
    lat: 47.4701,
    lng: -122.3476,
  },

  // ── YOUTH SHELTERS ──
  {
    id: 'roots-youth',
    name: 'ROOTS Young Adult Shelter',
    resource_type: 'Shelter',
    population: ['youth'],
    county_area: 'Seattle',
    address: '1415 NE 43rd St, Seattle, WA 98105',
    phone: '(206) 632-4135',
    website: 'https://www.rootsinfo.org',
    how_to_enter: 'Walk-in at 8pm. First-come, first-served. Doors open at 8pm, close at 10pm.',
    access_method: 'walk-in',
    hours: 'Nightly 8pm–8am',
    eligibility: 'Ages 18–25. No ID required.',
    last_verified_date: '2026-01-15',
    reality_notes: 'Walk-in only, no reservations. Arrive by 8:30pm — beds fill fast. No ID required to enter.',
    priority_score: 9,
    data_confidence: 'High',
    lat: 47.6579,
    lng: -122.3164,
  },
  {
    id: 'orion-youth',
    name: 'Orion Center (Youth)',
    resource_type: 'Shelter',
    population: ['youth'],
    county_area: 'Seattle',
    address: '1828 Bellevue Ave, Seattle, WA 98122',
    phone: '(206) 461-3589',
    website: 'https://www.youthcareseattle.org/programs/orion-center',
    how_to_enter: 'Walk-in during day hours for services. Overnight requires referral.',
    access_method: 'walk-in',
    hours: 'Day services: Mon–Fri 8am–4pm',
    eligibility: 'Ages 13–24',
    last_verified_date: '2026-01-10',
    reality_notes: 'Day drop-in center with meals, showers, case management. Overnight beds require referral through Coordinated Entry.',
    priority_score: 8,
    data_confidence: 'High',
    lat: 47.6140,
    lng: -122.3267,
  },
  {
    id: 'new-horizons-youth',
    name: 'New Horizons (Youth)',
    resource_type: 'Shelter',
    population: ['youth'],
    county_area: 'Seattle',
    address: '2902 2nd Ave, Seattle, WA 98121',
    phone: '(206) 374-0762',
    website: 'https://www.newhorizonsseattle.org',
    how_to_enter: 'Walk-in during open hours.',
    access_method: 'walk-in',
    hours: 'Mon–Fri 9am–5pm (day services)',
    eligibility: 'Ages 13–22',
    last_verified_date: '2025-12-01',
    reality_notes: 'Primarily day services. Emergency overnight beds are limited — call ahead.',
    priority_score: 7,
    data_confidence: 'Medium',
    lat: 47.6170,
    lng: -122.3510,
  },

  // ── SINGLE ADULT SHELTERS ──
  {
    id: 'compass-housing',
    name: 'Compass Housing Alliance',
    resource_type: 'Shelter',
    population: ['single_adult'],
    county_area: 'Seattle',
    address: '77 S Washington St, Seattle, WA 98104',
    phone: '(206) 474-1000',
    website: 'https://www.compasshousingalliance.org',
    how_to_enter: 'Call intake or walk-in. Some programs require referral through 211.',
    access_method: 'call',
    hours: 'Varies by program. Call for current availability.',
    eligibility: 'Single adults. Some programs for couples.',
    last_verified_date: '2026-01-05',
    reality_notes: 'Multiple shelter programs. Availability changes daily. Call 211 first to check bed availability before walking in.',
    priority_score: 7,
    data_confidence: 'Medium',
    lat: 47.6005,
    lng: -122.3321,
  },
  {
    id: 'desc-shelter',
    name: 'DESC (Downtown Emergency Service Center)',
    resource_type: 'Shelter',
    population: ['single_adult'],
    county_area: 'Seattle',
    address: '515 3rd Ave, Seattle, WA 98104',
    phone: '(206) 464-1570',
    website: 'https://www.desc.org',
    how_to_enter: 'Referral required through Coordinated Entry / RAP. Cannot walk in without referral.',
    access_method: 'referral',
    hours: '24/7 residential',
    eligibility: 'Single adults with behavioral health needs. Prioritizes highest-need individuals.',
    last_verified_date: '2026-01-10',
    reality_notes: 'DESC prioritizes people with serious mental illness and substance use disorders. You must go through RAP/Coordinated Entry to get a referral. Do not walk in expecting placement.',
    priority_score: 6,
    data_confidence: 'High',
    lat: 47.6015,
    lng: -122.3296,
  },
  {
    id: 'nightwatch-shelter',
    name: 'Nightwatch Emergency Shelter',
    resource_type: 'Shelter',
    population: ['single_adult'],
    county_area: 'Seattle',
    address: '1820 E Yesler Way, Seattle, WA 98122',
    phone: '(206) 323-4518',
    website: 'https://www.nightwatch.org',
    how_to_enter: 'Walk-in at 7pm. First-come, first-served.',
    access_method: 'walk-in',
    hours: 'Nightly 7pm–7am',
    eligibility: 'Single adults 18+',
    last_verified_date: '2025-11-15',
    reality_notes: 'Walk-in only. Beds fill fast — arrive by 6:30pm. Operated by faith communities on a rotating basis.',
    priority_score: 7,
    data_confidence: 'Medium',
    lat: 47.6050,
    lng: -122.3150,
  },

  // ── VETERAN RESOURCES ──
  {
    id: 'vets-place',
    name: "Vet's Place Central (VA Puget Sound)",
    resource_type: 'Program',
    population: ['veteran'],
    county_area: 'Seattle',
    address: '1660 S Columbian Way, Seattle, WA 98108',
    phone: '(206) 762-1010',
    website: 'https://www.va.gov/puget-sound-health-care',
    how_to_enter: 'Call VA Puget Sound. Veterans can also call HUD-VASH at (206) 764-2028.',
    access_method: 'call',
    hours: 'Mon–Fri 8am–4:30pm',
    eligibility: 'Veterans with DD-214 or service documentation. Some programs do not require documentation.',
    last_verified_date: '2026-01-20',
    reality_notes: 'HUD-VASH vouchers are the fastest path for veterans. Call the VA first — they have dedicated housing navigators.',
    priority_score: 9,
    data_confidence: 'High',
    lat: 47.5614,
    lng: -122.3034,
  },

  // ── EAST KING COUNTY RESOURCES ──
  {
    id: 'eastside-shelter',
    name: 'Eastside Shelter (Congregations for the Homeless)',
    resource_type: 'Shelter',
    population: ['single_adult'],
    county_area: 'East King',
    address: '1600 NE 8th St, Bellevue, WA 98008',
    phone: '(425) 289-7627',
    website: 'https://www.cfhomeless.org',
    how_to_enter: 'Walk-in at 7pm. Must arrive before 8pm. Call ahead to confirm space.',
    access_method: 'walk-in',
    hours: 'Nightly 7pm–7am',
    eligibility: 'Single adult men 18+. Bellevue/Eastside focus.',
    last_verified_date: '2026-02-01',
    reality_notes: 'The main men\'s shelter on the Eastside. Beds fill quickly. If you are in Bellevue, this is your first stop. Women should call 211 for Eastside options.',
    priority_score: 9,
    data_confidence: 'High',
    lat: 47.6173,
    lng: -122.1669,
  },
  {
    id: 'imagine-housing',
    name: 'Imagine Housing (East King)',
    resource_type: 'Program',
    population: ['family', 'single_adult'],
    county_area: 'East King',
    address: '10900 NE 8th St, Bellevue, WA 98004',
    phone: '(425) 747-8662',
    website: 'https://www.imaginehousing.org',
    how_to_enter: 'Call for intake. Permanent supportive housing — not emergency shelter.',
    access_method: 'call',
    hours: 'Mon–Fri 9am–5pm',
    eligibility: 'Low-income individuals and families. Prioritizes those exiting homelessness.',
    last_verified_date: '2025-12-15',
    reality_notes: 'Imagine Housing provides permanent affordable housing, not emergency shelter. Waitlists are long. Apply now even if you need shelter tonight.',
    priority_score: 6,
    data_confidence: 'High',
    lat: 47.6101,
    lng: -122.2015,
  },

  // ── RAP SITES ──
  {
    id: 'rap-solid-ground',
    name: 'Solid Ground RAP (Coordinated Entry)',
    resource_type: 'RAP',
    population: ['single_adult', 'family', 'youth', 'veteran'],
    county_area: 'Seattle',
    address: '1501 N 45th St, Seattle, WA 98103',
    phone: '(206) 694-6700',
    website: 'https://www.solid-ground.org',
    how_to_enter: 'Walk-in Wednesday 11am–1pm only. No appointment needed.',
    access_method: 'walk-in',
    hours: 'Wednesday 11am–1pm (walk-in)',
    eligibility: 'Literally homeless (outside, vehicle, or shelter). No ID required.',
    last_verified_date: '2026-02-01',
    reality_notes: 'Lines form before 11am. Bring any documents you have, but they are NOT required. You will complete a VI-SPDAT housing assessment.',
    priority_score: 8,
    data_confidence: 'High',
    lat: 47.6612,
    lng: -122.3476,
    rap_appointment_process: 'Walk-in only during scheduled hours. No appointment needed.',
    rap_documentation_policy: 'No ID required. Bring documents if you have them.',
    rap_required_at_entry: 'None required',
    rap_assessment_type: 'VI-SPDAT',
    rap_priority_notes: 'Wednesday 11am–1pm only. Arrive early.',
    rap_windows: [RAP_WINDOWS[0]],
  },
  {
    id: 'rap-ywca-renton',
    name: 'YWCA Renton RAP (Coordinated Entry)',
    resource_type: 'RAP',
    population: ['single_adult', 'family', 'DV', 'veteran'],
    county_area: 'South King',
    address: '1010 S 2nd St, Renton, WA 98057',
    phone: '(206) 461-4882',
    website: 'https://www.ywcaworks.org',
    how_to_enter: 'Walk-in Wednesday 1pm–4pm. No appointment needed.',
    access_method: 'walk-in',
    hours: 'Wednesday 1pm–4pm (walk-in)',
    eligibility: 'Literally homeless. South King County focus but open to all.',
    last_verified_date: '2026-02-01',
    reality_notes: 'South King County location. Good option if you are in Renton, Kent, or Auburn area.',
    priority_score: 8,
    data_confidence: 'High',
    lat: 47.4779,
    lng: -122.2059,
    rap_appointment_process: 'Walk-in only Wednesday 1–4pm.',
    rap_documentation_policy: 'No ID required.',
    rap_required_at_entry: 'None required',
    rap_assessment_type: 'VI-SPDAT',
    rap_priority_notes: 'Wednesday 1pm–4pm. South King County.',
    rap_windows: [RAP_WINDOWS[1]],
  },
  {
    id: 'rap-multi-service',
    name: 'Multi-Service Center RAP (Federal Way)',
    resource_type: 'RAP',
    population: ['single_adult', 'family', 'veteran'],
    county_area: 'South King',
    address: '1200 S 336th St, Federal Way, WA 98003',
    phone: '(253) 838-6810',
    website: 'https://www.multi-servicecenter.com',
    how_to_enter: 'Walk-in Tuesday and Thursday 9am–3pm.',
    access_method: 'walk-in',
    hours: 'Tuesday & Thursday 9am–3pm',
    eligibility: 'Literally homeless. South King County focus.',
    last_verified_date: '2026-01-15',
    reality_notes: 'Federal Way location. Serves South King County. Tuesday and Thursday walk-in hours.',
    priority_score: 8,
    data_confidence: 'High',
    lat: 47.3073,
    lng: -122.3190,
    rap_appointment_process: 'Walk-in Tue & Thu 9am–3pm.',
    rap_documentation_policy: 'No ID required.',
    rap_required_at_entry: 'None required',
    rap_assessment_type: 'VI-SPDAT',
    rap_priority_notes: 'Tuesday and Thursday 9am–3pm.',
    rap_windows: [RAP_WINDOWS[2], RAP_WINDOWS[3]],
  },

  // ── SAFE PARKING ──
  {
    id: 'safe-parking-bellevue',
    name: 'Safe Parking Program (Bellevue)',
    resource_type: 'Safe Parking',
    population: ['family', 'single_adult'],
    county_area: 'East King',
    address: 'Multiple locations — call for current sites',
    phone: '(425) 289-7627',
    website: 'https://www.cfhomeless.org',
    how_to_enter: 'Call Congregations for the Homeless to register. Must have valid vehicle registration and insurance.',
    access_method: 'call',
    hours: 'Overnight parking, varies by site',
    eligibility: 'People living in vehicles. Must have valid registration and insurance.',
    last_verified_date: '2025-12-01',
    reality_notes: 'Safe parking sites rotate. You must register in advance — you cannot just show up. Sites are in church parking lots.',
    priority_score: 6,
    data_confidence: 'Medium',
    lat: 47.6101,
    lng: -122.2015,
  },
  {
    id: 'safe-parking-seattle',
    name: 'Safe Parking Program (Seattle)',
    resource_type: 'Safe Parking',
    population: ['family', 'single_adult'],
    county_area: 'Seattle',
    address: 'Multiple locations — call for current sites',
    phone: '(206) 694-6700',
    website: 'https://www.solid-ground.org',
    how_to_enter: 'Contact Solid Ground to register. Must have valid vehicle registration.',
    access_method: 'call',
    hours: 'Overnight, varies by site',
    eligibility: 'People living in vehicles in Seattle',
    last_verified_date: '2025-11-01',
    reality_notes: 'Limited spots. Register in advance through Solid Ground.',
    priority_score: 5,
    data_confidence: 'Medium',
    lat: 47.6062,
    lng: -122.3321,
  },
];

// ── DECISION ENGINE ──

export interface ShelterInput {
  population: Population;
  sleepingSituation: 'outside' | 'vehicle' | 'shelter' | 'couch' | 'unsure';
  hasVehicle: boolean;
  day: string;
  hour: number; // 0–23
}

export interface ActionStep {
  priority: number;
  title: string;
  description: string;
  phone?: string;
  website?: string;
  resource_id?: string;
  is_rap?: boolean;
  is_emergency?: boolean;
  rap_window?: RAPWindow | null;
}

export interface ShelterPlan {
  steps: ActionStep[];
  rap_step: ActionStep | null;
  show_safe_parking: boolean;
  rap_eligible: boolean;
  message: string;
}

export function getNextRAP(day: string, hour: number): { window: RAPWindow | null; message: string } {
  // Check if currently in a RAP window
  if (day === 'Wednesday' && hour >= 11 && hour < 13) {
    return {
      window: RAP_WINDOWS[0],
      message: 'Solid Ground RAP is open RIGHT NOW (Wed 11am–1pm). Go now.',
    };
  }
  if (day === 'Wednesday' && hour >= 13 && hour < 16) {
    return {
      window: RAP_WINDOWS[1],
      message: 'YWCA Renton RAP is open RIGHT NOW (Wed 1pm–4pm). Go now.',
    };
  }
  if ((day === 'Tuesday' || day === 'Thursday') && hour >= 9 && hour < 15) {
    return {
      window: RAP_WINDOWS[2],
      message: 'Multi-Service Center RAP is open RIGHT NOW (Tue/Thu 9am–3pm). Go now.',
    };
  }

  // Find next upcoming window
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDayIndex = days.indexOf(day);

  const upcoming: Array<{ window: RAPWindow; daysAway: number; hoursAway: number }> = [];

  for (let offset = 0; offset <= 7; offset++) {
    const checkDayIndex = (currentDayIndex + offset) % 7;
    const checkDay = days[checkDayIndex];

    for (const w of RAP_WINDOWS) {
      if (w.day === checkDay) {
        const hoursAway = offset === 0
          ? (hour < w.start_hour ? w.start_hour - hour : 24 - hour + w.start_hour)
          : offset * 24 - hour + w.start_hour;

        if (offset === 0 && hour >= w.end_hour) continue; // already passed today

        upcoming.push({ window: w, daysAway: offset, hoursAway });
      }
    }
  }

  if (upcoming.length === 0) {
    return { window: null, message: 'Call RAP or leave a voicemail: (206) 694-6700' };
  }

  upcoming.sort((a, b) => a.hoursAway - b.hoursAway);
  const next = upcoming[0];

  const timeStr = `${next.window.start_hour > 12 ? next.window.start_hour - 12 : next.window.start_hour}${next.window.start_hour >= 12 ? 'pm' : 'am'}`;
  const dayLabel = next.daysAway === 0 ? 'today' : next.daysAway === 1 ? 'tomorrow' : `this ${next.window.day}`;

  return {
    window: next.window,
    message: `Next RAP: ${next.window.location_name} — ${dayLabel} at ${timeStr}`,
  };
}

export function isRAPEligible(input: ShelterInput): boolean {
  const literallyHomeless = ['outside', 'vehicle', 'shelter'].includes(input.sleepingSituation);
  return literallyHomeless || input.population === 'DV' || input.population === 'youth';
}

export function getShelterPlan(input: ShelterInput): ShelterPlan {
  const { population, sleepingSituation, hasVehicle, day, hour } = input;
  const rapEligible = isRAPEligible(input);
  const rapInfo = getNextRAP(day, hour);
  const showSafeParking = hasVehicle && (sleepingSituation === 'vehicle' || sleepingSituation === 'outside');

  const rapStep: ActionStep = {
    priority: 3,
    title: 'Get assessed for housing placement (RAP)',
    description: rapInfo.message,
    phone: rapInfo.window?.phone || '(206) 694-6700',
    resource_id: rapInfo.window ? `rap-${rapInfo.window.location_name.toLowerCase().replace(/\s+/g, '-')}` : undefined,
    is_rap: true,
    rap_window: rapInfo.window,
  };

  if (population === 'DV') {
    return {
      steps: [
        {
          priority: 1,
          title: 'Call the DV Hotline — available 24/7',
          description: 'This is the fastest path to safe, confidential shelter. You will NOT be given an address until you are connected. This is for your safety.',
          phone: '(206) 656-8423',
          resource_id: 'dv-hotline',
          is_emergency: true,
        },
        {
          priority: 2,
          title: 'If no answer, call 211',
          description: '211 can connect you to additional DV resources and emergency shelter options.',
          phone: '211',
          resource_id: 'line-211',
        },
      ],
      rap_step: rapEligible ? rapStep : null,
      show_safe_parking: showSafeParking,
      rap_eligible: rapEligible,
      message: 'Your safety is the priority. DV shelters are confidential — you will be guided to a safe location.',
    };
  }

  if (population === 'youth') {
    return {
      steps: [
        {
          priority: 1,
          title: 'Go to ROOTS Young Adult Shelter tonight',
          description: 'Walk-in at 8pm. No ID required. First-come, first-served — arrive by 8:30pm.',
          phone: '(206) 632-4135',
          resource_id: 'roots-youth',
        },
        {
          priority: 2,
          title: 'Orion Center (day services & referrals)',
          description: 'Open weekdays 8am–4pm. Meals, showers, case management, and referrals to overnight beds.',
          phone: '(206) 461-3589',
          resource_id: 'orion-youth',
        },
        {
          priority: 2,
          title: 'New Horizons (ages 13–22)',
          description: 'Day services and limited emergency overnight beds. Call ahead.',
          phone: '(206) 374-0762',
          resource_id: 'new-horizons-youth',
        },
      ],
      rap_step: rapEligible ? rapStep : null,
      show_safe_parking: showSafeParking,
      rap_eligible: rapEligible,
      message: 'Youth shelters are your fastest option tonight. No ID required at ROOTS.',
    };
  }

  if (population === 'family') {
    return {
      steps: [
        {
          priority: 1,
          title: "Call Mary's Place intake — opens at 8am",
          description: "Mary's Place is the largest family shelter system in King County. Call right at 8am — lines get busy fast. Do NOT walk in without calling.",
          phone: '(206) 621-8474',
          resource_id: 'marys-place-seattle',
        },
        {
          priority: 2,
          title: 'Call 211 for real-time bed availability',
          description: '211 navigators have live access to shelter bed counts. They can also check for family shelter options you may not know about.',
          phone: '211',
          resource_id: 'line-211',
        },
      ],
      rap_step: rapEligible ? rapStep : null,
      show_safe_parking: showSafeParking,
      rap_eligible: rapEligible,
      message: "Family shelter is available — but you must call, not walk in. Mary's Place intake opens at 8am.",
    };
  }

  if (population === 'veteran') {
    return {
      steps: [
        {
          priority: 1,
          title: 'Call VA Puget Sound — HUD-VASH program',
          description: 'Veterans have dedicated housing navigators. HUD-VASH vouchers are the fastest path. Call even if you think you may not qualify.',
          phone: '(206) 764-2028',
          resource_id: 'vets-place',
        },
        {
          priority: 2,
          title: 'Call 211 for emergency shelter tonight',
          description: '211 can connect you to veteran-specific emergency beds and other resources.',
          phone: '211',
          resource_id: 'line-211',
        },
      ],
      rap_step: rapEligible ? rapStep : null,
      show_safe_parking: showSafeParking,
      rap_eligible: rapEligible,
      message: 'Veterans have dedicated resources. Call the VA first — they have housing navigators who can move fast.',
    };
  }

  // Default: single adult
  return {
    steps: [
      {
        priority: 1,
        title: 'Call 211 for real-time shelter availability',
        description: '211 navigators have live bed counts. Call or text your ZIP to 898-211. Available 24/7.',
        phone: '211',
        resource_id: 'line-211',
      },
      {
        priority: 2,
        title: 'Try direct shelters (walk-in)',
        description: sleepingSituation === 'outside' || sleepingSituation === 'vehicle'
          ? 'Nightwatch opens at 7pm (walk-in). Compass Housing also has walk-in options — call first to check availability.'
          : 'Compass Housing and Nightwatch are your best direct options. Call ahead to check bed availability.',
        phone: '(206) 323-4518',
        resource_id: 'nightwatch-shelter',
      },
    ],
    rap_step: rapEligible ? rapStep : null,
    show_safe_parking: showSafeParking,
    rap_eligible: rapEligible,
    message: 'Call 211 first — they have real-time bed availability and can save you a wasted trip.',
  };
}
