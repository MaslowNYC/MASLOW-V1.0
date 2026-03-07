-- Create admin_config table for storing admin dashboard settings
-- This stores JSON configuration data keyed by config_key

CREATE TABLE IF NOT EXISTS admin_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  config_key TEXT UNIQUE NOT NULL,
  config_value JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for fast lookups by config_key
CREATE INDEX IF NOT EXISTS idx_admin_config_key ON admin_config(config_key);

-- Enable RLS
ALTER TABLE admin_config ENABLE ROW LEVEL SECURITY;

-- Only admins can read/write admin_config
DROP POLICY IF EXISTS "Admins can read admin_config" ON admin_config;
CREATE POLICY "Admins can read admin_config" ON admin_config
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Admins can insert admin_config" ON admin_config;
CREATE POLICY "Admins can insert admin_config" ON admin_config
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Admins can update admin_config" ON admin_config;
CREATE POLICY "Admins can update admin_config" ON admin_config
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Grant basic table access (RLS will control actual access)
GRANT SELECT, INSERT, UPDATE ON admin_config TO authenticated;

COMMENT ON TABLE admin_config IS 'Stores admin dashboard configuration data like build-out planner settings';
