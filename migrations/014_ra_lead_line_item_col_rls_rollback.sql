-- Drop policies
DROP POLICY IF EXISTS "Anyone can insert with temporary token" ON ra_lead_line_item_col;
DROP POLICY IF EXISTS "Allow operations on own temporary records" ON ra_lead_line_item_col;

-- Disable RLS
ALTER TABLE ra_lead_line_item_col DISABLE ROW LEVEL SECURITY;
