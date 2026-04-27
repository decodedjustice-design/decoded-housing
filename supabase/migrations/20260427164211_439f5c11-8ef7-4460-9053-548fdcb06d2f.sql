CREATE TABLE public.properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text,
  city text,
  zip text,
  types text[] NOT NULL DEFAULT '{}',
  ami text[] NOT NULL DEFAULT '{}',
  units text[] NOT NULL DEFAULT '{}',
  total_units integer,
  affordable_units integer,
  status text,
  year integer,
  program_type text,
  source text,
  voucher boolean NOT NULL DEFAULT false,
  verified boolean NOT NULL DEFAULT false,
  transit_distance numeric,
  updated_days integer,
  image_url text,
  insider text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Properties are viewable by everyone"
ON public.properties FOR SELECT
USING (true);

CREATE INDEX idx_properties_city ON public.properties(city);
CREATE INDEX idx_properties_verified ON public.properties(verified);