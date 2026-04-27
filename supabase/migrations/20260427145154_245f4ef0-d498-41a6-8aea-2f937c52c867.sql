
CREATE TABLE public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('food','utilities','furniture','rental','legal')),
  subcategory text,
  description text,
  city text,
  zip text,
  address text,
  phone text,
  website text,
  eligibility text,
  hours text,
  priority_level int NOT NULL DEFAULT 3 CHECK (priority_level BETWEEN 1 AND 3),
  verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Resources are viewable by everyone"
  ON public.resources
  FOR SELECT
  USING (true);

CREATE INDEX idx_resources_category ON public.resources(category);
CREATE INDEX idx_resources_city ON public.resources(city);
CREATE INDEX idx_resources_priority ON public.resources(priority_level);

INSERT INTO public.resources (name, category, subcategory, description, city, zip, address, phone, website, eligibility, hours, priority_level, verified) VALUES
-- FOOD
('Hopelink Redmond Food Bank', 'food', 'food_bank', 'Free groceries, fresh produce, and household essentials for King County residents.', 'Redmond', '98052', '8990 154th Ave NE, Redmond, WA', '425-869-6000', 'https://www.hopelink.org', 'King County residents — no ID required for first visit', 'Tue 10am–2pm, Thu 2pm–6pm, Sat 9am–12pm', 1, true),
('Food Lifeline', 'food', 'food_bank', 'Regional food bank distributing meals to 300+ partner agencies across Western Washington.', 'Seattle', '98108', '815 S 96th St, Seattle, WA', '206-545-6600', 'https://foodlifeline.org', 'Open to anyone in need', 'Mon–Fri 8am–4pm', 2, true),
('Senior Farmers Market Nutrition Program (SFMNP)', 'food', 'farmers_market', '$80 in checks per season for low-income seniors to spend at participating farmers markets.', 'Bellevue', '98004', 'King County wide', '206-263-9100', 'https://kingcounty.gov/sfmnp', 'Age 60+, income at or below 185% FPL', 'Seasonal — June through October', 2, true),

-- UTILITIES
('LIHEAP — Hopelink / Byrd Barr Place', 'utilities', 'liheap', 'Federal Low-Income Home Energy Assistance — one-time annual grant toward heating costs.', 'Redmond', '98052', '8990 154th Ave NE, Redmond, WA', '425-869-6000', 'https://www.hopelink.org/need-help/energy-assistance', 'Income at or below 150% FPL', 'Appointments Oct–May', 1, true),
('Puget Sound Energy HELP Program', 'utilities', 'pse_help', 'Up to $1,000 per year toward PSE gas or electric bills for income-qualified customers.', 'Bellevue', '98004', 'PSE service area', '1-866-223-5425', 'https://www.pse.com/help', 'Active PSE account, income at or below 80% AMI', 'Apply year-round', 2, true),
('Bellevue Utility Discount Program', 'utilities', 'water_discount', '40–60% discount on Bellevue water, sewer, and storm utility bills.', 'Bellevue', '98004', '450 110th Ave NE, Bellevue, WA', '425-452-6932', 'https://bellevuewa.gov/utility-discount', 'Bellevue resident, income-qualified', 'Apply anytime — Mon–Fri 8am–5pm', 2, true),

-- FURNITURE
('Northwest Furniture Bank', 'furniture', 'furniture_bank', 'Free furniture for families transitioning out of homelessness or crisis.', 'Tacoma', '98421', '117 Puyallup Ave, Tacoma, WA', '253-302-3868', 'https://nwfurniturebank.org', 'Referral from caseworker required', 'By appointment', 2, true),
('St. Vincent de Paul — Furniture Vouchers', 'furniture', 'voucher_program', 'Vouchers for beds, dressers, tables, and household goods at SVdP thrift stores.', 'Kirkland', '98033', '13445 NE 175th St, Woodinville, WA', '206-767-6449', 'https://svdpseattle.org', 'Income-qualified, by referral', 'Mon–Fri 9am–4pm', 2, true),
('Essentials First', 'furniture', 'community', 'Provides essential household items — beds, kitchenware, linens — to families moving into housing.', 'Redmond', '98052', 'Eastside service area', '425-749-0190', 'https://essentialsfirst.org', 'Referral from social services partner', 'By appointment', 2, true),
('Buy Nothing Project', 'furniture', 'community', 'Hyper-local gift economy — request furniture, baby gear, household items from neighbors.', 'Redmond', '98052', 'Local Facebook groups', NULL, 'https://buynothingproject.org', 'Open to all — join your neighborhood group', '24/7 online', 3, true),

-- RENTAL / SAFETY NET
('Keep King County Housed (KKCH)', 'rental', 'eviction_prevention', 'Emergency rent assistance and eviction prevention for King County tenants.', 'Seattle', '98104', 'King County wide', '206-454-1051', 'https://kingcounty.gov/kkch', 'Risk of eviction, income at or below 50% AMI', 'Apply online — funding waves monthly', 1, true),
('United Way of King County — Rent Help', 'rental', 'rent_assistance', 'Up to 3 months past-due rent assistance for households facing eviction.', 'Seattle', '98104', '720 2nd Ave, Seattle, WA', '206-461-3700', 'https://www.uwkc.org/need-help/rent', 'Past-due rent notice, income-qualified', 'Apply online — rolling intake', 1, true),
('KCHA Housing Choice Voucher Program', 'rental', 'voucher_program', 'Section 8 housing vouchers — pay 30% of income toward rent at participating units.', 'Tukwila', '98188', '600 Andover Park W, Tukwila, WA', '206-574-1100', 'https://www.kcha.org/housing/voucher', 'Income at or below 50% AMI; waitlist opens periodically', 'Mon–Fri 8am–5pm', 2, true);
