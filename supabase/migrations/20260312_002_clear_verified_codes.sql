-- Task 2: Clear verification codes for already-verified users
-- No profile should have both phone_verified = true AND a non-null verification_code

UPDATE profiles
SET verification_code = NULL, code_expires_at = NULL
WHERE phone_verified = true AND verification_code IS NOT NULL;

-- Verification query (run after to confirm):
-- SELECT COUNT(*) FROM profiles WHERE phone_verified = true AND verification_code IS NOT NULL;
-- Expected: 0
