-- First disable RLS to avoid policy conflicts
ALTER TABLE ra_lead_line_item_col DISABLE ROW LEVEL SECURITY;

-- Drop existing policies that might reference the user_id column
DROP POLICY IF EXISTS "Allow operations on own records" ON ra_lead_line_item_col;
DROP POLICY IF EXISTS "Users can view their own records" ON ra_lead_line_item_col;
DROP POLICY IF EXISTS "Users can update their own records" ON ra_lead_line_item_col;
DROP POLICY IF EXISTS "Allow operations on temporary records" ON ra_lead_line_item_col;

-- Drop the foreign key constraint
ALTER TABLE ra_lead_line_item_col DROP CONSTRAINT IF EXISTS ra_lead_line_item_col_user_id_fkey;

-- Change the column type back to INTEGER
ALTER TABLE ra_lead_line_item_col ALTER COLUMN user_id TYPE INTEGER USING user_id::INTEGER;

-- Recreate the foreign key constraint
ALTER TABLE ra_lead_line_item_col
    ADD CONSTRAINT ra_lead_line_item_col_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES ra_users_duplicate(id);

-- Re-enable RLS
ALTER TABLE ra_lead_line_item_col ENABLE ROW LEVEL SECURITY;

-- Recreate the policies
CREATE POLICY "Allow operations on temporary records" ON ra_lead_line_item_col
    FOR ALL
    USING (temporary_token IS NOT NULL AND user_id IS NULL);

CREATE POLICY "Users can view their own records" ON ra_lead_line_item_col
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM ra_users_duplicate
        WHERE ra_users_duplicate.id = ra_lead_line_item_col.user_id
    ));

CREATE POLICY "Users can update their own records" ON ra_lead_line_item_col
    FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM ra_users_duplicate
        WHERE ra_users_duplicate.id = ra_lead_line_item_col.user_id
    ));
