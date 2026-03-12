-- Task 1: Remove dev bypass code
-- CRITICAL: Must be run before any real users exist
-- Removes the '999999' verification code backdoor

UPDATE profiles
SET verification_code = NULL
WHERE verification_code = '999999';

-- Verification query (run after to confirm):
-- SELECT email, verification_code FROM profiles WHERE verification_code = '999999';
-- Expected: 0 rows
