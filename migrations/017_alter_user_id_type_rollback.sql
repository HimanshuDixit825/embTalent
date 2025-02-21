-- Disable RLS temporarily
ALTER TABLE ra_lead_line_item_col DISABLE ROW LEVEL SECURITY;

-- Drop all policies
DROP POLICY IF EXISTS "Anyone can insert with temporary token" ON ra_lead_line_item_col;
DROP POLICY IF EXISTS "Allow operations on own records" ON ra_lead_line_item_col;
DROP POLICY IF EXISTS "Allow read operations" ON ra_lead_line_item_col;
DROP POLICY IF EXISTS "Allow read operations on own records" ON ra_lead_line_item_col;
DROP POLICY IF EXISTS "Allow update operations" ON ra_lead_line_item_col;

-- Drop the foreign key constraint
ALTER TABLE ra_lead_line_item_col DROP CONSTRAINT IF EXISTS ra_lead_line_item_col_user_id_fkey;

-- Change user_id column type back to bigint
ALTER TABLE ra_lead_line_item_col ALTER COLUMN user_id TYPE bigint USING (user_id::bigint);

-- Add back the original foreign key constraint
ALTER TABLE ra_lead_line_item_col 
    ADD CONSTRAINT ra_lead_line_item_col_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES ra_users_duplicate(id);

-- Re-enable RLS
ALTER TABLE ra_lead_line_item_col ENABLE ROW LEVEL SECURITY;
