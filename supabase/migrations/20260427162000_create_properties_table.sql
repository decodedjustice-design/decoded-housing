CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text NOT NULL,
  address text NOT NULL,
  types text[] NOT NULL DEFAULT '{}',
  ami text[] NOT NULL DEFAULT '{}',
  units text[] NOT NULL DEFAULT '{}',
  affordable int NOT NULL DEFAULT 0,
  verified boolean NOT NULL DEFAULT false,
  waitlist boolean NOT NULL DEFAULT false,
  likely boolean NOT NULL DEFAULT false,
  voucher boolean NOT NULL DEFAULT false,
  transit_station text,
  transit_distance double precision,
  transit_label text,
  updated_days int NOT NULL DEFAULT 0,
  insider text,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'properties'
      AND policyname = 'Properties are viewable by everyone'
  ) THEN
    CREATE POLICY "Properties are viewable by everyone"
      ON public.properties
      FOR SELECT
      USING (true);
  END IF;
END
$$;

INSERT INTO public.properties (
  name, city, address, types, ami, units, affordable, verified, waitlist, likely, voucher,
  transit_station, transit_distance, transit_label, updated_days, insider, image_url
)
SELECT *
FROM (
  VALUES
    ('Othello Square Apartments', 'Seattle', '7321 Martin Luther King Jr Way S, Seattle, WA', ARRAY['MFTE','Section 8'], ARRAY['30 AMI','60 AMI'], ARRAY['1BR','2BR','3BR'], 68, true, true, true, true, 'Othello Station', 0.20, '4 min walk to Link', 2, 'Leasing staff responds fastest Tues/Wed mornings.', NULL),
    ('Patricia Apartments', 'Renton', '250 Burnett Ave S, Renton, WA', ARRAY['ARCH','Tax Credit'], ARRAY['50 AMI','80 AMI'], ARRAY['Studio','1BR','2BR'], 43, true, true, false, false, 'Renton Transit Center', 0.35, '7 min walk to transit center', 5, 'Most move-ins happen in first week of month.', NULL),
    ('Greenbridge Family Homes', 'White Center', '9800 8th Ave SW, Seattle, WA', ARRAY['Section 8','Public Housing'], ARRAY['30 AMI','50 AMI'], ARRAY['2BR','3BR','4BR'], 97, true, true, true, true, 'Delridge & Roxbury', 0.45, '10 min walk to RapidRide H', 1, 'Families with vouchers are prioritized when units open.', NULL),
    ('Madrona Ridge', 'Kent', '25420 104th Ave SE, Kent, WA', ARRAY['ARCH'], ARRAY['60 AMI'], ARRAY['1BR','2BR'], 31, false, true, false, false, 'Kent Station', 0.60, '14 min walk to Sounder', 8, 'Waitlist moves slowly for one-bedrooms.', NULL),
    ('Cedar River Court', 'Tukwila', '14555 Interurban Ave S, Tukwila, WA', ARRAY['MFTE','Tax Credit'], ARRAY['40 AMI','60 AMI'], ARRAY['Studio','1BR','2BR','3BR'], 55, true, false, true, false, 'Tukwila Intl Blvd Station', 0.30, '6 min walk to Link and bus', 3, 'Call after 10am for same-day updates.', NULL),
    ('Plaza Roberto Maestas', 'Seattle', '2601 17th Ave S, Seattle, WA', ARRAY['Section 8','Supportive Housing'], ARRAY['30 AMI','60 AMI'], ARRAY['1BR','2BR','3BR'], 72, true, true, true, true, 'Beacon Hill Station', 0.25, '5 min walk to Link', 2, 'Spanish-language support available onsite.', NULL),
    ('Northgate Commons', 'Seattle', '401 NE Northgate Way, Seattle, WA', ARRAY['MFTE'], ARRAY['60 AMI','80 AMI'], ARRAY['Studio','1BR'], 36, true, false, false, false, 'Northgate Station', 0.15, '3 min walk to Link', 6, 'Studios open most often in summer.', NULL),
    ('BelRed Family Terrace', 'Bellevue', '13620 NE Bel-Red Rd, Bellevue, WA', ARRAY['ARCH','Section 8'], ARRAY['30 AMI','50 AMI','60 AMI'], ARRAY['2BR','3BR'], 49, true, true, true, true, 'BelRed Station', 0.40, '8 min walk to Link', 4, 'Voucher holders should mention portability at intake.', NULL),
    ('Kirkland Crossings', 'Kirkland', '10733 Northup Way, Kirkland, WA', ARRAY['ARCH'], ARRAY['50 AMI','60 AMI'], ARRAY['1BR','2BR'], 27, true, false, false, false, 'South Kirkland Park & Ride', 0.50, '11 min walk to frequent bus', 7, 'Two-bedroom turnover is higher than one-bedroom.', NULL),
    ('Rainier Vista Homes', 'Seattle', '4520 Martin Luther King Jr Way S, Seattle, WA', ARRAY['Public Housing','Section 8'], ARRAY['30 AMI','50 AMI'], ARRAY['2BR','3BR','4BR'], 112, true, true, true, true, 'Columbia City Station', 0.22, '4 min walk to Link', 1, 'Applicants with complete paperwork move faster.', NULL)
) AS seed (
  name, city, address, types, ami, units, affordable, verified, waitlist, likely, voucher,
  transit_station, transit_distance, transit_label, updated_days, insider, image_url
)
WHERE NOT EXISTS (
  SELECT 1 FROM public.properties existing WHERE existing.name = seed.name
);
