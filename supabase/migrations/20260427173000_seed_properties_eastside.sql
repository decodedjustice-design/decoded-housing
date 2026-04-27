CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  city text,
  address text,
  types text[],
  ami text[],
  units text[],
  affordable int,
  verified boolean,
  waitlist boolean,
  likely boolean,
  voucher boolean,
  transit_station text,
  transit_distance double precision,
  transit_label text,
  updated_days int,
  insider text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS affordable int;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS waitlist boolean;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS likely boolean;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS transit_station text;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS transit_label text;

DELETE FROM public.properties;

INSERT INTO public.properties (
  name, city, address, types, ami, units, affordable,
  verified, waitlist, likely, voucher,
  transit_station, transit_distance, transit_label,
  updated_days, insider, image_url
) VALUES
(
  'Vue 22 Bellevue',
  'Bellevue',
  '3690 132nd Ave NE',
  ARRAY['ARCH','MFTE'],
  ARRAY['60 AMI','80 AMI'],
  ARRAY['1BR','2BR'],
  24,
  true, true, false, true,
  'BelRed/130th', 0.3, '2 Line',
  3,
  'Ask specifically for ARCH units — not offered upfront.',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80'
),
(
  'Soma Towers',
  'Bellevue',
  '10628 NE 9th Pl',
  ARRAY['MFTE'],
  ARRAY['80 AMI'],
  ARRAY['Studio','1BR','2BR'],
  18,
  true, false, true, false,
  'East Main', 0.4, '2 Line',
  12,
  null,
  'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=400&q=80'
),
(
  'Eastgate Terrace',
  'Bellevue',
  '3850 West Lake Sammamish Pkwy SE',
  ARRAY['ARCH','Section 8'],
  ARRAY['50 AMI','60 AMI'],
  ARRAY['1BR','2BR','3BR'],
  55,
  true, true, false, true,
  'South Bellevue', 1.2, '2 Line',
  5,
  '3BR units rare — call office directly.',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80'
),
(
  'Avalon Esterra Park',
  'Redmond',
  '3700 158th Ave NE',
  ARRAY['ARCH','MFTE'],
  ARRAY['60 AMI','80 AMI'],
  ARRAY['Studio','1BR','2BR'],
  40,
  true, true, false, true,
  'Overlake Village', 0.5, '2 Line',
  7,
  'Families prioritized.',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=80'
),
(
  'Horizon at Together Center',
  'Redmond',
  '16225 NE 87th St',
  ARRAY['ARCH'],
  ARRAY['30 AMI','50 AMI','60 AMI'],
  ARRAY['Studio','1BR','2BR'],
  92,
  true, true, true, true,
  'Overlake Village', 0.8, '2 Line',
  0,
  'Waitlist opens quarterly — call ahead.',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80'
),
(
  'Bell Marymoor Park',
  'Redmond',
  '6030 W Lake Sammamish Pkwy NE',
  ARRAY['MFTE'],
  ARRAY['80 AMI'],
  ARRAY['Studio','1BR','2BR'],
  30,
  true, false, true, false,
  'Marymoor Village', 0.2, '2 Line',
  2,
  'Closest to station — high demand.',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80'
),
(
  'Veloce',
  'Kirkland',
  '10520 NE 68th St',
  ARRAY['MFTE'],
  ARRAY['80 AMI'],
  ARRAY['Studio','1BR'],
  20,
  false, false, true, false,
  'BelRed/130th', 2.1, '2 Line',
  21,
  null,
  'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=400&q=80'
),
(
  'Magnolia at Moss Bay',
  'Kirkland',
  '600 Lake St S',
  ARRAY['ARCH','MFTE'],
  ARRAY['60 AMI','80 AMI'],
  ARRAY['1BR','2BR'],
  28,
  true, true, false, true,
  'BelRed/130th', 3.0, '2 Line',
  18,
  null,
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80'
),
(
  'Cadence at Totem Lake',
  'Kirkland',
  '12245 NE 116th St',
  ARRAY['ARCH'],
  ARRAY['50 AMI','60 AMI'],
  ARRAY['1BR','2BR','3BR'],
  35,
  true, true, true, true,
  'Redmond Technology', 1.5, '2 Line',
  4,
  '3BR units — rare availability.',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80'
),
(
  'Sophia Way Shelter',
  'Bellevue',
  'Confidential',
  ARRAY['Shelter','Transitional'],
  ARRAY['30 AMI'],
  ARRAY['Studio'],
  30,
  true, true, false, false,
  'East Main', 1.1, '2 Line',
  1,
  'Women & families only — call first.',
  'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=400&q=80'
),
(
  'Congregations for the Homeless',
  'Bellevue',
  '10900 NE 1st St',
  ARRAY['Shelter','Transitional'],
  ARRAY['30 AMI'],
  ARRAY['Studio'],
  100,
  true, false, true, false,
  'East Main', 0.5, '2 Line',
  0,
  'Men only — intake required.',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=80'
);
