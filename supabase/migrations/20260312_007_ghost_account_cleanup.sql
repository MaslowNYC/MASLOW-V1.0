-- Task 7: Ghost Account Cleanup
-- RUN MANUALLY - Do not include in automated migration pipeline
-- Ghost accounts: unverified phone, no bookings, no sessions, inactive 30+ days

-- STEP 1: Preview (dry run) - Review before deleting
SELECT id, email, phone, phone_verified, updated_at
FROM profiles
WHERE phone_verified = false
  AND updated_at < NOW() - INTERVAL '30 days'
  AND NOT EXISTS (
    SELECT 1 FROM bookings WHERE bookings.user_id = profiles.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM sessions WHERE sessions.user_id = profiles.id
  );

-- STEP 2: Delete ghost profiles (run only after reviewing Step 1)
-- UNCOMMENT TO EXECUTE:
-- DELETE FROM profiles
-- WHERE phone_verified = false
--   AND updated_at < NOW() - INTERVAL '30 days'
--   AND NOT EXISTS (
--     SELECT 1 FROM bookings WHERE bookings.user_id = profiles.id
--   )
--   AND NOT EXISTS (
--     SELECT 1 FROM sessions WHERE sessions.user_id = profiles.id
--   );

-- STEP 3: Clean up auth.users (run after Step 2)
-- The deleted profile IDs need to be removed from auth.users separately.
-- Supabase doesn't cascade deletes from profiles to auth.users.
-- Use the Supabase Dashboard > Authentication > Users to manually remove,
-- or run via service role:
-- DELETE FROM auth.users WHERE id IN (
--   SELECT id FROM auth.users
--   WHERE id NOT IN (SELECT id FROM profiles)
-- );

-- NOTE: Do NOT automate this yet. Run manually during pre-launch cleanup.
