-- Function to get the next member number
-- Uses SECURITY DEFINER to bypass RLS for anonymous users
CREATE OR REPLACE FUNCTION public.get_next_member_number()
RETURNS INTEGER AS $$
  SELECT COALESCE(MAX(member_number), 0) + 1 FROM profiles;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Allow anonymous users to call this function
GRANT EXECUTE ON FUNCTION public.get_next_member_number() TO anon;
GRANT EXECUTE ON FUNCTION public.get_next_member_number() TO authenticated;

COMMENT ON FUNCTION public.get_next_member_number() IS
'Returns the next available member number for signup teaser display';
