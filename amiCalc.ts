/**
 * AMI ELIGIBILITY CALCULATOR
 * King County 2024 Area Median Income limits
 * Source: HUD FY2024 Income Limits, King County WA
 *
 * Household sizes 1–8 persons
 * AMI tiers: 30%, 50%, 60%, 80%, 100%, 120%
 */

// King County 2024 AMI income limits by household size (annual $)
// [1-person, 2-person, 3-person, 4-person, 5-person, 6-person, 7-person, 8-person]
export const AMI_LIMITS: Record<number, number[]> = {
  30:  [28450, 32500, 36600, 40650, 43900, 47150, 50400, 53650],
  50:  [47400, 54150, 60900, 67650, 73100, 78500, 83900, 89300],
  60:  [56880, 64980, 73080, 81180, 87720, 94200, 100680, 107160],
  80:  [75800, 86650, 97450, 108250, 116950, 125650, 134350, 143000],
  100: [94750, 108250, 121800, 135300, 146150, 157000, 167800, 178650],
  120: [113700, 129900, 146160, 162360, 175380, 188400, 201360, 214320],
};

export type AmiTier = 30 | 50 | 60 | 80 | 100 | 120;

/**
 * Given household size and annual income, return the highest AMI tier the household qualifies for.
 * Returns null if income exceeds 120% AMI.
 */
export function getMaxAmiTier(householdSize: number, annualIncome: number): AmiTier | null {
  const idx = Math.min(Math.max(householdSize, 1), 8) - 1;
  const tiers: AmiTier[] = [30, 50, 60, 80, 100, 120];
  let maxTier: AmiTier | null = null;
  for (const tier of tiers) {
    if (annualIncome <= AMI_LIMITS[tier][idx]) {
      maxTier = tier;
    }
  }
  return maxTier;
}

/**
 * Given household size and annual income, return all AMI tiers the household qualifies for.
 */
export function getEligibleTiers(householdSize: number, annualIncome: number): AmiTier[] {
  const idx = Math.min(Math.max(householdSize, 1), 8) - 1;
  const tiers: AmiTier[] = [30, 50, 60, 80, 100, 120];
  return tiers.filter(tier => annualIncome <= AMI_LIMITS[tier][idx]);
}

/**
 * Parse an AMI level string like "50 AMI", "80% AMI", "80 AMI" → numeric tier
 */
export function parseAmiLevel(level: string): AmiTier | null {
  const match = level.match(/(\d+)/);
  if (!match) return null;
  const n = parseInt(match[1], 10);
  if ([30, 50, 60, 80, 100, 120].includes(n)) return n as AmiTier;
  return null;
}

/**
 * Check if a property's AMI levels overlap with the user's eligible tiers.
 * Returns 'eligible' | 'over_income' | 'unknown'
 */
export function checkPropertyEligibility(
  propertyAmiLevels: string[],
  householdSize: number,
  annualIncome: number
): 'eligible' | 'over_income' | 'unknown' {
  if (!propertyAmiLevels || propertyAmiLevels.length === 0) return 'unknown';
  const eligibleTiers = getEligibleTiers(householdSize, annualIncome);
  const propertyTiers = propertyAmiLevels
    .map(parseAmiLevel)
    .filter((t): t is AmiTier => t !== null);

  if (propertyTiers.length === 0) return 'unknown';
  const hasMatch = propertyTiers.some(t => eligibleTiers.includes(t));
  return hasMatch ? 'eligible' : 'over_income';
}

/**
 * Format income as currency string
 */
export function formatIncome(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}
