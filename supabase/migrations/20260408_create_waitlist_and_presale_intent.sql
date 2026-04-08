-- Waitlist for presale email capture
CREATE TABLE IF NOT EXISTS public.waitlist (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT waitlist_email_unique UNIQUE (email)
);

-- Track which tiers people click before presale goes live
CREATE TABLE IF NOT EXISTS public.presale_intent_clicks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tier_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- RLS: waitlist inserts are public (anonymous), reads are founder-only
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can join waitlist" ON public.waitlist FOR INSERT WITH CHECK (true);
CREATE POLICY "Only founder reads waitlist" ON public.waitlist FOR SELECT USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'patrick@maslow.nyc'));

-- RLS: intent clicks are public insert, founder-only read
ALTER TABLE public.presale_intent_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can log intent" ON public.presale_intent_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "Only founder reads intent" ON public.presale_intent_clicks FOR SELECT USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'patrick@maslow.nyc'));
