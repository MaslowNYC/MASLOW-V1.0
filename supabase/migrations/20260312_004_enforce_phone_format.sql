-- Task 3: Enforce E.164 phone format
-- Run AFTER 20260312_003_clean_phone_data.sql and resolving any duplicates

-- Add check constraint for E.164 format
ALTER TABLE profiles
ADD CONSTRAINT phone_format_check
CHECK (
  phone IS NULL
  OR phone = ''
  OR phone ~ '^\+[1-9]\d{7,14}$'
);

-- Task 4: Enforce phone uniqueness (partial index allows NULL)
CREATE UNIQUE INDEX idx_profiles_phone_unique
ON profiles (phone)
WHERE phone IS NOT NULL AND phone != '';

-- Verification:
-- SELECT phone, COUNT(*) FROM profiles WHERE phone IS NOT NULL AND phone != '' GROUP BY phone HAVING COUNT(*) > 1;
-- Expected: 0 rows
