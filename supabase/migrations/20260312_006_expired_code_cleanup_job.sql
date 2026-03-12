-- Task 6: Add scheduled cleanup for expired verification codes
-- Requires pg_cron extension (enable in Supabase Dashboard > Database > Extensions)

-- Create the cleanup function
CREATE OR REPLACE FUNCTION clear_expired_verification_codes()
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET verification_code = NULL, code_expires_at = NULL
  WHERE code_expires_at IS NOT NULL
    AND code_expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION clear_expired_verification_codes() TO service_role;

-- Schedule hourly cleanup (requires pg_cron)
-- Uncomment after enabling pg_cron extension:
-- SELECT cron.schedule(
--   'clear-expired-codes',
--   '0 * * * *',
--   'SELECT clear_expired_verification_codes()'
-- );

COMMENT ON FUNCTION clear_expired_verification_codes() IS
'Clears expired verification codes from profiles table. Called hourly via pg_cron.';
