# HULL RESERVATION & QUEUE SYSTEM
Date: March 14, 2026
Repo: MASLOW-V1.0 (website) + MASLOW-App (mobile)
Supabase: hrfmphkjeqcwhsfvzfvw

## WHAT WE'RE BUILDING

The Hull is a free communal space with a capacity limit (~20 people).
Guests can:
1. Reserve a time slot in advance ("Meet me at Maslow at 4:45 - I grabbed a spot")
2. Join a virtual walk-up queue if Hull is at capacity
3. Skip the walk-up queue with a reservation - exactly like a restaurant

---

## STEP 1 - DATABASE MIGRATIONS

Run in Supabase SQL editor:

1a. Extend existing queue table:

ALTER TABLE public.queue
  ADD COLUMN IF NOT EXISTS location_id uuid REFERENCES public.locations(id),
  ADD COLUMN IF NOT EXISTS queue_type text DEFAULT 'walk_up' CHECK (queue_type IN ('walk_up', 'reservation')),
  ADD COLUMN IF NOT EXISTS reserved_for timestamptz,
  ADD COLUMN IF NOT EXISTS expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS checked_in_at timestamptz,
  ADD COLUMN IF NOT EXISTS checked_out_at timestamptz,
  ADD COLUMN IF NOT EXISTS position integer,
  ADD COLUMN IF NOT EXISTS notified_at timestamptz;

1b. Create hull_capacity config table:

CREATE TABLE IF NOT EXISTS public.hull_capacity (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id uuid REFERENCES public.locations(id) UNIQUE,
  max_capacity integer DEFAULT 20,
  reservation_hold_minutes integer DEFAULT 10,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

INSERT INTO public.hull_capacity (location_id, max_capacity, reservation_hold_minutes)
SELECT id, 20, 10 FROM public.locations WHERE name ILIKE '%soho%' LIMIT 1
ON CONFLICT (location_id) DO NOTHING;

ALTER TABLE public.hull_capacity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hull_capacity_public_read" ON public.hull_capacity FOR SELECT USING (true);
CREATE POLICY "hull_capacity_admin_write" ON public.hull_capacity FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE is_admin = true));

---

## STEP 2 - SUPABASE EDGE FUNCTION

Create: supabase/functions/hull-queue/index.ts

Actions via ?action= query param:
- status (GET, no auth) - current occupancy + queue length
- join (POST, auth) - join walk-up queue or make reservation
- checkin (POST, auth) - arrive and check in
- checkout (POST, auth) - leave the Hull
- cancel (POST, auth) - cancel reservation or leave queue

See full function code in Claude chat history from March 14, 2026.

Deploy with: supabase functions deploy hull-queue

---

## STEP 3 - WEBSITE: src/pages/HullPage.tsx

Add "Reserve Your Spot" section with three components:

A. Hull Status Bar (always visible, no auth)
- Shows "14 of 20 spots taken" with fill bar
- Green if available, amber if >75%, red if full
- Polls every 30 seconds

B. Reserve a Spot (tabbed: Now vs Later)
- Now tab: "Get in Line" button - immediate walk-up queue
- Later tab: time picker, 30-min slots, 7AM-10PM
  - Greyed out slots at capacity
- After joining: shows position + estimated wait
- If reservation exists: "Confirmed for 4:30 PM" + cancel link

C. Confirmation card (post-booking)
- "You're in" + reserved time
- "When you arrive, tap Check In or scan QR at Hull entrance"
- Gold border, navy/cream styling

Implementation:
- Use customSupabaseClient from @/lib/customSupabaseClient
- Call hull-queue edge function for all operations
- Get location_id from locations table (SoHo)
- Status bar visible to all; queue actions require auth

---

## STEP 4 - APP: Hull Queue in Book Tab

Add to mobile app Book tab or dedicated Hull section:
- Current Hull occupancy
- "Reserve a Hull spot" button with time picker
- "Join walk-up queue" button (immediate)
- Active reservation/queue status card

---

## STEP 5 - REALTIME (after basics work)

ALTER TABLE public.queue REPLICA IDENTITY FULL;

Subscribe in frontend:
supabase.channel('hull-queue')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'queue' }, handleUpdate)
  .subscribe()

---

## BUILD ORDER
1. SQL migrations (Step 1) - verify in Supabase dashboard
2. Deploy edge function (Step 2)
3. Hull UI on HullPage.tsx (Step 3)
4. Test: join, check in, check out
5. Mobile app (Step 4)
6. Realtime (Step 5)

---

## KEY RULE: RESERVATIONS SKIP WALK-UPS

When Hull is full with a walk-up queue:
- Reservation for current window = straight to check-in, no waiting
- Walk-ups served in order only after reservation holders are accommodated
- Restaurant model: reservation holders never wait behind walk-ins

Check-in logic:
- queue_type = 'reservation' AND reserved_for within 15 min of now = allow immediately
- queue_type = 'walk_up' = only allow when status = 'called'
