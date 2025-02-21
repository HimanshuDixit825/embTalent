-- Drop policies
DROP POLICY IF EXISTS "Allow operations on temporary records" ON ra_lead_line_item_col;
DROP POLICY IF EXISTS "Users can view their own records" ON ra_lead_line_item_col;
DROP POLICY IF EXISTS "Users can update their own records" ON ra_lead_line_item_col;

-- Disable RLS
ALTER TABLE ra_lead_line_item_col DISABLE ROW LEVEL SECURITY;
