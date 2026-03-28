-- Pre-sale purchases for founding pass sales
create table if not exists presale_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  email text not null,
  tier text not null check (tier in ('single', 'five_pack', 'twelve_pack', 'founding')),
  sessions_purchased int not null,
  amount_paid numeric not null,
  stripe_payment_intent_id text,
  status text default 'active' check (status in ('active', 'refunded', 'redeemed')),
  purchased_at timestamptz default now(),
  redeemed_at timestamptz
);

-- Index for user lookups
create index if not exists idx_presale_purchases_user_id on presale_purchases(user_id);
create index if not exists idx_presale_purchases_email on presale_purchases(email);

-- RLS policies
alter table presale_purchases enable row level security;

-- Users can read their own purchases
create policy "Users can view own presale purchases"
  on presale_purchases for select
  using (auth.uid() = user_id);

-- Only service role can insert (edge function)
create policy "Service role can insert presale purchases"
  on presale_purchases for insert
  with check (true);

-- Admins can view all
create policy "Admins can view all presale purchases"
  on presale_purchases for select
  using (
    exists (
      select 1 from profiles where id = auth.uid() and is_admin = true
    )
  );
