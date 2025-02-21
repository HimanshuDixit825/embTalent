-- Disable RLS for ra_users_duplicate since it's just for storing data
ALTER TABLE ra_users_duplicate DISABLE ROW LEVEL SECURITY;

-- Or alternatively, create a policy to allow inserts
CREATE POLICY "Allow all inserts to ra_users_duplicate"
ON ra_users_duplicate FOR INSERT
WITH CHECK (true);