CREATE TABLE public.shelters (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id text UNIQUE,
  name text NOT NULL,
  organization text,
  type text NOT NULL DEFAULT 'emergency_shelter',
  population text[] NOT NULL DEFAULT '{}',
  intake text,
  phone text,
  address text,
  city text,
  barrier_level text,
  access_speed text,
  realistic_availability text,
  access_notes text,
  backup_option text,
  source text[] NOT NULL DEFAULT '{}',
  verified boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_shelters_city ON public.shelters(city);
CREATE INDEX idx_shelters_type ON public.shelters(type);
CREATE INDEX idx_shelters_barrier ON public.shelters(barrier_level);

ALTER TABLE public.shelters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Shelters are viewable by everyone"
ON public.shelters FOR SELECT
USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_shelters_updated_at
BEFORE UPDATE ON public.shelters
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();