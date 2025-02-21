-- Enable RLS
ALTER TABLE ra_lead_line_item_col ENABLE ROW LEVEL SECURITY;

-- Allow all operations for records with temporary token (pre-signup)
CREATE POLICY "Allow operations on temporary records"
ON ra_lead_line_item_col
FOR ALL
USING (temporary_token IS NOT NULL)
WITH CHECK (temporary_token IS NOT NULL);

-- Allow users to see their own records after signup
CREATE POLICY "Users can view their own records"
ON ra_lead_line_item_col
FOR SELECT
USING (
    user_id IS NOT NULL AND
    EXISTS (
        SELECT 1 FROM ra_users_duplicate
        WHERE ra_users_duplicate.id = ra_lead_line_item_col.user_id
    )
);

-- Allow users to update their own records
CREATE POLICY "Users can update their own records"
ON ra_lead_line_item_col
FOR UPDATE
USING (
    user_id IS NOT NULL AND
    EXISTS (
        SELECT 1 FROM ra_users_duplicate
        WHERE ra_users_duplicate.id = ra_lead_line_item_col.user_id
    )
);
