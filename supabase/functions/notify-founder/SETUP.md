# Founder Notifications — Setup Guide

Sends real-time email notifications to patrick@maslow.nyc when key events occur in production.

## Quick Deploy

```bash
# 1. Deploy the Edge Function
supabase functions deploy notify-founder

# 2. Apply the migration (if not auto-applied)
supabase db push
```

## What Triggers Notifications

| Event | Table | Trigger |
|-------|-------|---------|
| New signup | `profiles` INSERT | Email with member number |
| Phone verification | `profiles` UPDATE (phone_verified) | Email confirmation |
| Membership purchase | `profiles` UPDATE (membership_tier) | Email with tier info |
| Membership record | `memberships` INSERT | Email with membership details |
| Event registration | `event_attendees` INSERT | Email with event info |

## Required Secrets

The `RESEND_API_KEY` must be set as a Supabase secret:

```bash
supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxxx
```

## Required Database Settings

For the database triggers to call the Edge Function, set these in your Supabase project:

**Option 1: Via SQL (recommended for production)**
```sql
-- Set in Supabase SQL Editor or via migration
ALTER DATABASE postgres SET app.supabase_url = 'https://YOUR_PROJECT_REF.supabase.co';
ALTER DATABASE postgres SET app.service_role_key = 'YOUR_SERVICE_ROLE_KEY';
```

**Option 2: Via Supabase Dashboard Webhook**
Instead of database triggers, you can configure webhooks in the Supabase Dashboard:
1. Go to Database → Webhooks
2. Create webhooks for the relevant tables
3. Point them to: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/notify-founder`

## Testing the Function

```bash
# Test locally
supabase functions serve notify-founder --env-file .env.local

# Send test payload
curl -X POST http://localhost:54321/functions/v1/notify-founder \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "type": "INSERT",
    "table": "profiles",
    "record": {
      "id": "test-123",
      "first_name": "Test",
      "email": "test@example.com",
      "member_number": 12345
    },
    "old_record": null
  }'
```

## Disabling Notifications

To stop notifications, drop the triggers:

```sql
-- Drop all founder notification triggers
DROP TRIGGER IF EXISTS on_new_profile_notify_founder ON public.profiles;
DROP TRIGGER IF EXISTS on_profile_update_notify_founder ON public.profiles;
DROP TRIGGER IF EXISTS on_new_membership_notify_founder ON public.memberships;
DROP TRIGGER IF EXISTS on_event_registration_notify_founder ON public.event_attendees;

-- Optionally drop the function
DROP FUNCTION IF EXISTS public.notify_founder_on_event();
```

## Tables NOT Yet Triggering

These tables don't exist yet. Add triggers when they're created:

- `credit_transfers` — for credit transfers between members
- `usage_logs` — for suite check-ins
- `password_resets` — Supabase handles password resets internally

### Adding Future Triggers

When `credit_transfers` table is created:
```sql
CREATE TRIGGER on_credit_transfer_notify_founder
  AFTER INSERT ON public.credit_transfers
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_founder_on_event();
```

When `usage_logs` table is created:
```sql
CREATE TRIGGER on_suite_checkin_notify_founder
  AFTER INSERT ON public.usage_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_founder_on_event();
```

## Troubleshooting

**Emails not sending?**
1. Check `RESEND_API_KEY` is set: `supabase secrets list`
2. Verify the sending domain `maslow.nyc` is configured in Resend
3. Check function logs: `supabase functions logs notify-founder`

**Triggers not firing?**
1. Verify pg_net extension is enabled: `SELECT * FROM pg_extension WHERE extname = 'pg_net';`
2. Check app settings are configured: `SHOW app.supabase_url;`
3. Check trigger exists: `SELECT * FROM pg_trigger WHERE tgname LIKE '%notify_founder%';`

## Architecture

```
[Database Event]
    → [Postgres Trigger]
    → [pg_net HTTP POST]
    → [notify-founder Edge Function]
    → [Resend API]
    → [Email to patrick@maslow.nyc]
```
