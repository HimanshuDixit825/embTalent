-- Create function to link record to user
CREATE OR REPLACE FUNCTION link_record_to_user(
    p_temporary_token UUID,
    p_user_id TEXT
)
RETURNS SETOF ra_lead_line_item_col AS $$
BEGIN
    -- Update record and return the updated row
    RETURN QUERY
    UPDATE ra_lead_line_item_col
    SET 
        user_id = p_user_id,
        temporary_token = NULL,
        token_expiry = NULL
    WHERE temporary_token = p_temporary_token
    RETURNING *;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
