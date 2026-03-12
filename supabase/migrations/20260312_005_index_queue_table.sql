-- Task 5: Index the queue table for real-time availability features
-- Check columns first with:
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'queue' AND table_schema = 'public';

-- Create indexes (adjust column names if schema differs)
CREATE INDEX IF NOT EXISTS idx_queue_user_id ON queue (user_id);
CREATE INDEX IF NOT EXISTS idx_queue_status ON queue (status);
CREATE INDEX IF NOT EXISTS idx_queue_location_id ON queue (location_id);
CREATE INDEX IF NOT EXISTS idx_queue_position ON queue (position);
CREATE INDEX IF NOT EXISTS idx_queue_created_at ON queue (created_at);

-- Verification:
-- SELECT indexname FROM pg_indexes WHERE tablename = 'queue';
-- Expected: multiple indexes beyond just pkey
