-- Drop existing policies first
DROP POLICY IF EXISTS "Anyone can insert with temporary token" ON ra_lead_line_item_col;
DROP POLICY IF EXISTS "Allow operations on own records" ON ra_lead_line_item_col;
DROP POLICY IF EXISTS "Allow read operations" ON ra_lead_line_item_col;
DROP POLICY IF EXISTS "Allow read operations on own records" ON ra_lead_line_item_col;
DROP POLICY IF EXISTS "Allow update operations" ON ra_lead_line_item_col;

-- Enable RLS
ALTER TABLE ra_lead_line_item_col ENABLE ROW LEVEL SECURITY;

-- Allow insert operations for anyone (pre-signup)
CREATE POLICY "Anyone can insert with temporary token"
ON ra_lead_line_item_col
FOR INSERT
WITH CHECK (temporary_token IS NOT NULL);

-- Allow read/update operations for records with matching temporary token
CREATE POLICY "Allow operations on own records"
ON ra_lead_line_item_col
FOR ALL
USING (
    -- For pre-signup records, check temporary token
    (temporary_token IS NOT NULL AND temporary_token::text = current_setting('app.temporary_token', TRUE))
    OR
    -- For post-signup records, check user_id
    (user_id IS NOT NULL AND user_id::text = auth.uid()::text)
)
WITH CHECK (
    -- For pre-signup records, check temporary token
    (temporary_token IS NOT NULL AND temporary_token::text = current_setting('app.temporary_token', TRUE))
    OR
    -- For post-signup records, check user_id
    (user_id IS NOT NULL AND user_id::text = auth.uid()::text)
);
