-- JOVE Admin: List auth users for admin panel
-- Create a view/function to expose auth.users data safely

CREATE OR REPLACE FUNCTION get_all_users()
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ,
  raw_user_meta_data JSONB
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    id,
    email,
    raw_user_meta_data->>'full_name' as full_name,
    created_at,
    last_sign_in_at,
    raw_user_meta_data
  FROM auth.users
  ORDER BY created_at DESC;
$$;
