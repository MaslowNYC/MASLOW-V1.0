-- Founder Notification Triggers
-- Sends notifications to patrick@maslow.nyc when key events occur
-- Uses pg_net to call the notify-founder Edge Function

-- Enable pg_net extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Helper function to call the notify-founder Edge Function
-- Note: Requires SUPABASE_URL and SERVICE_ROLE_KEY to be set via vault or app settings
CREATE OR REPLACE FUNCTION public.notify_founder_on_event()
RETURNS TRIGGER AS $$
DECLARE
  payload JSONB;
  edge_function_url TEXT;
  service_key TEXT;
BEGIN
  -- Get the Edge Function URL from environment
  -- In production, this should be set via Supabase project settings
  edge_function_url := COALESCE(
    current_setting('app.supabase_url', true),
    'https://xyzcompany.supabase.co'  -- Replace with actual project URL after deployment
  ) || '/functions/v1/notify-founder';

  -- Get service role key for auth
  service_key := current_setting('app.service_role_key', true);

  -- Build the payload
  payload := jsonb_build_object(
    'type', TG_OP,
    'table', TG_TABLE_NAME,
    'record', CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE row_to_json(NEW) END,
    'old_record', CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END
  );

  -- Make async HTTP POST to Edge Function
  -- Using pg_net for non-blocking HTTP calls
  PERFORM net.http_post(
    url := edge_function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || COALESCE(service_key, '')
    )::JSONB,
    body := payload::TEXT
  );

  -- Always return the appropriate record
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;

EXCEPTION WHEN OTHERS THEN
  -- Log error but don't block the original operation
  RAISE WARNING 'notify_founder_on_event failed: %', SQLERRM;
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.notify_founder_on_event() TO service_role;

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Trigger: New user signup (profile insert)
DROP TRIGGER IF EXISTS on_new_profile_notify_founder ON public.profiles;
CREATE TRIGGER on_new_profile_notify_founder
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_founder_on_event();

-- Trigger: Profile updates (phone verification, membership tier changes)
DROP TRIGGER IF EXISTS on_profile_update_notify_founder ON public.profiles;
CREATE TRIGGER on_profile_update_notify_founder
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  WHEN (
    -- Phone just got verified
    (OLD.phone_verified IS DISTINCT FROM NEW.phone_verified AND NEW.phone_verified = true)
    OR
    -- Membership tier changed
    (OLD.membership_tier IS DISTINCT FROM NEW.membership_tier AND NEW.membership_tier IS NOT NULL)
  )
  EXECUTE FUNCTION public.notify_founder_on_event();

-- Trigger: New membership record
-- Only create if memberships table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'memberships') THEN
    DROP TRIGGER IF EXISTS on_new_membership_notify_founder ON public.memberships;
    CREATE TRIGGER on_new_membership_notify_founder
      AFTER INSERT ON public.memberships
      FOR EACH ROW
      EXECUTE FUNCTION public.notify_founder_on_event();
  END IF;
END $$;

-- Trigger: Event registration
-- Only create if event_attendees table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'event_attendees') THEN
    DROP TRIGGER IF EXISTS on_event_registration_notify_founder ON public.event_attendees;
    CREATE TRIGGER on_event_registration_notify_founder
      AFTER INSERT ON public.event_attendees
      FOR EACH ROW
      EXECUTE FUNCTION public.notify_founder_on_event();
  END IF;
END $$;

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON FUNCTION public.notify_founder_on_event() IS
'Sends notification to founder via Edge Function when key database events occur.
Used for operational awareness during early launch phase.';

-- =============================================================================
-- NOTE: Tables that don''t exist yet (add triggers when created):
-- - credit_transfers (for credit transfers between members)
-- - usage_logs (for suite check-ins)
-- - password_resets (Supabase handles internally)
-- =============================================================================
