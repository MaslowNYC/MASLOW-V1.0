-- Task 3 & 4: Clean phone data before adding constraints
-- Run this BEFORE 20260312_004_enforce_phone_format.sql

-- Step 1: Preview bad phone data (run this SELECT first to review)
-- SELECT id, email, phone FROM profiles
-- WHERE phone IS NOT NULL AND phone != '' AND phone !~ '^\+[1-9]\d{7,14}$';

-- Step 2: Fix email-in-phone-field (adamstoves case)
UPDATE profiles
SET phone = NULL
WHERE phone IS NOT NULL AND phone LIKE '%@%';

-- Step 3: Normalize 10-digit US numbers to E.164 (+1XXXXXXXXXX)
UPDATE profiles
SET phone = '+1' || phone
WHERE phone IS NOT NULL
  AND phone != ''
  AND phone ~ '^\d{10}$';

-- Step 4: Normalize 11-digit US numbers starting with 1
UPDATE profiles
SET phone = '+' || phone
WHERE phone IS NOT NULL
  AND phone != ''
  AND phone ~ '^1\d{10}$';

-- Step 5: Review duplicates before adding unique constraint
-- SELECT phone, COUNT(*) FROM profiles WHERE phone IS NOT NULL AND phone != '' GROUP BY phone HAVING COUNT(*) > 1;
-- Manually resolve any duplicates shown above before running the next migration
