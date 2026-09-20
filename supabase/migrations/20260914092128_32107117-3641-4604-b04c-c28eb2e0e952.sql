CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  company text NOT NULL,
  request_type text NOT NULL,
  qualification text NOT NULL,
  consent boolean NOT NULL DEFAULT false,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  referrer text,
  cta_source text NOT NULL,
  landing_page text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.leads TO anon, authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors can submit consented leads"
ON public.leads
FOR INSERT
TO anon, authenticated
WITH CHECK (
  consent = true
  AND length(trim(first_name)) BETWEEN 1 AND 100
  AND length(trim(last_name)) BETWEEN 1 AND 100
  AND length(trim(email)) BETWEEN 3 AND 320
  AND length(trim(phone)) BETWEEN 7 AND 40
  AND length(trim(company)) BETWEEN 1 AND 200
  AND length(trim(request_type)) BETWEEN 1 AND 100
  AND length(trim(qualification)) BETWEEN 1 AND 500
  AND length(trim(cta_source)) BETWEEN 1 AND 120
  AND length(trim(landing_page)) BETWEEN 1 AND 1000
);
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER set_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();