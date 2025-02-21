-- Drop all policies that might depend on user_id
DROP POLICY IF EXISTS "Users can view their own records" ON ra_lead_line_item_col;
DROP POLICY IF EXISTS "Users can update their own records" ON ra_lead_line_item_col;
DROP POLICY IF EXISTS "Allow operations on own records" ON ra_lead_line_item_col;
DROP POLICY IF EXISTS "Anyone can insert with temporary token" ON ra_lead_line_item_col;
DROP POLICY IF EXISTS "Allow linking records with temporary token" ON ra_lead_line_item_col;

-- Disable RLS temporarily
ALTER TABLE ra_lead_line_item_col DISABLE ROW LEVEL SECURITY;

-- Drop the foreign key constraint
ALTER TABLE ra_lead_line_item_col DROP CONSTRAINT ra_lead_line_item_col_user_id_fkey;

-- Change user_id column type to text
ALTER TABLE ra_lead_line_item_col ALTER COLUMN user_id TYPE text;

-- Add back the foreign key constraint
ALTER TABLE ra_lead_line_item_col 
    ADD CONSTRAINT ra_lead_line_item_col_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES ra_users_duplicate(userid);

-- Re-enable RLS
ALTER TABLE ra_lead_line_item_col ENABLE ROW LEVEL SECURITY;

-- Recreate insert policy
CREATE POLICY "Anyone can insert with temporary token"
ON ra_lead_line_item_col
FOR INSERT
WITH CHECK (temporary_token IS NOT NULL);

-- Create policy for read operations
CREATE POLICY "Allow read operations on own records"
ON ra_lead_line_item_col
FOR SELECT
USING (
    -- For pre-signup records, check temporary token
    (temporary_token IS NOT NULL)
    OR
    -- For post-signup records, check user_id
    (user_id IS NOT NULL AND auth.uid()::text = user_id)
);

-- Create policy for update operations
CREATE POLICY "Allow update operations"
ON ra_lead_line_item_col
FOR UPDATE
USING (
    -- Allow if record has temporary token
    temporary_token IS NOT NULL
    OR
    -- Or if user owns the record
    (user_id IS NOT NULL AND auth.uid()::text = user_id)
)
WITH CHECK (
    -- Allow any updates when record has temporary token
    temporary_token IS NOT NULL
    OR
    -- Or when user owns the record
    (user_id IS NOT NULL AND auth.uid()::text = user_id)
);
